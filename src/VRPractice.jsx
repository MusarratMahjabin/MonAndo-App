import { useEffect, useRef, useState } from 'react'
import LoadingScreen from './LoadingScreen.jsx'

// Lines are spoken this often, with a little natural variance rather than
// a rigid, machine-precise beat.
const COMPANION_MIN_INTERVAL_MS = 50_000
const COMPANION_MAX_INTERVAL_MS = 60_000

// ElevenLabs voice used for the AI companion's spoken lines. "Sarah"
// (Mature, Reassuring, Confident) — one of this account's actual premade
// voices, which works on the free plan. The originally-requested voice
// (aGb0TwKthRLQTPThYRqI, "Nila") is saved to this account but is a
// "professional" category voice, which ElevenLabs blocks from API access
// on free accounts ("Free users cannot use library voices via the API").
// Swap this back to aGb0TwKthRLQTPThYRqI if the ElevenLabs plan gets
// upgraded.
const COMPANION_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'

// How long to wait for the Gemini or ElevenLabs calls before treating them
// as failed, so a hung request can't leave the companion silent for the
// rest of the session.
const COMPANION_FETCH_TIMEOUT_MS = 8_000

// Last-resort lines read by the browser's own built-in speechSynthesis —
// used only once both the live Gemini call AND the ElevenLabs call have
// failed or timed out. Written by hand (not AI-generated), so they're
// guaranteed to already follow the companion's rules: present-moment,
// non-clinical, under 15 words. The companion should never go completely
// silent during a session, even offline.
const BROWSER_TTS_BACKUP_LINES = [
  "Take a slow breath. You're here, and that's enough right now.",
  "Notice your feet on the ground. You're doing just fine.",
  "This moment doesn't ask anything of you. Just breathe.",
  "You're still here, still steady. That counts for something.",
]

function pickBackupLine() {
  return BROWSER_TTS_BACKUP_LINES[Math.floor(Math.random() * BROWSER_TTS_BACKUP_LINES.length)]
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

function VRPractice({ scenario, mode, onExit, onFlagDistress }) {
  const videoRef = useRef(null)
  const sceneRef = useRef(null)
  const exitEntityRef = useRef(null)
  const [needsTap, setNeedsTap] = useState(false)
  const [needsVRTap, setNeedsVRTap] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  // Show our own themed loading screen (instead of A-Frame's default one)
  // until the scene has actually finished initializing. The video element
  // still preloads/buffers in the background this whole time (it just
  // isn't playing yet), so it's ready to go the instant we reveal it.
  useEffect(() => {
    if (!scenario.videoUrl) return

    const scene = sceneRef.current
    if (!scene) return

    const markReady = () => setSceneReady(true)

    if (scene.hasLoaded) {
      markReady()
    } else {
      scene.addEventListener('loaded', markReady, { once: true })
      return () => scene.removeEventListener('loaded', markReady)
    }
  }, [scenario.videoUrl])

  // Start playback (video and audio together) at the same moment the
  // loading screen disappears and the scene becomes visible — not the
  // instant the video element mounts, which is what the "autoplay" HTML
  // attribute would otherwise do, causing audio to start under the
  // loading screen well before the video is actually shown.
  useEffect(() => {
    if (!scenario.videoUrl || !sceneReady) return

    const video = videoRef.current
    if (!video) return

    const hideOverlay = () => setNeedsTap(false)
    video.addEventListener('playing', hideOverlay)

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => setNeedsTap(true))
    }

    return () => video.removeEventListener('playing', hideOverlay)
  }, [scenario.videoUrl, sceneReady])

  // AI voice companion: speaks one short supportive line right away, then
  // again every 50-60s for the rest of the session, tone evolving through
  // the opening/middle/closing phases. While each line is playing, the
  // NEXT line is already being generated in the background (text + audio),
  // so there's no generation delay — no silent gap — when its turn comes.
  // If the model flags the moment instead of returning a line, exit
  // straight to SOS rather than staying in the scene.
  useEffect(() => {
    if (!scenario.videoUrl || !sceneReady) return

    let cancelled = false
    let currentAudio = null
    let timerId = null
    let preparedNext = null // a Promise for the line after the one about to play

    // Only one companion voice should ever be audible at once — stop
    // whichever mechanism (ElevenLabs audio or the browser voice) is
    // currently going before starting the next line.
    const stopAnyPlayback = () => {
      if (currentAudio) {
        currentAudio.pause()
        URL.revokeObjectURL(currentAudio.src)
        currentAudio = null
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }

    // Last resort: the browser's own built-in voice, used once both the
    // live Gemini call and the ElevenLabs call have failed or timed out.
    const speakWithBrowserTTS = (text) => {
      if (cancelled || !('speechSynthesis' in window)) return
      console.log('[AI companion] (browser voice fallback)', text)
      stopAnyPlayback()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }

    // Fetches (but does not play) one line: the live Gemini text if it
    // succeeds, the scenario's opening/closing fallback text if Gemini
    // fails, or a signal to use the browser-voice backup if neither is
    // available — then, for real text, fetches its ElevenLabs audio too.
    // `elapsedSeconds` is the point in the session this line is FOR, which
    // for pre-generated lines is an estimate of when it'll actually play,
    // not the moment it's being generated — so the tone (opening/middle/
    // closing) matches when it's heard, not when it was fetched.
    const prepareLine = async (elapsedSeconds) => {
      const totalSeconds = Math.max(scenario.durationMinutes, 1) * 60
      const phase =
        elapsedSeconds < 60 ? 'opening' : totalSeconds - elapsedSeconds <= 60 ? 'closing' : 'middle'

      let text = null
      let isFallback = false
      let flagged = false

      try {
        const response = await fetchWithTimeout(
          '/api/companion',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scenarioTitle: scenario.title,
              scenarioContext: scenario.aiContext,
              difficulty: scenario.difficulty,
              elapsedSeconds,
              durationMinutes: scenario.durationMinutes,
            }),
          },
          COMPANION_FETCH_TIMEOUT_MS,
        )
        if (response.ok) {
          const data = await response.json()
          if (data.flagged) flagged = true
          else if (data.line) text = data.line
        } else {
          console.error('AI companion request failed:', response.status)
        }
      } catch (err) {
        console.error('AI companion request failed:', err)
      }

      if (flagged) return { type: 'flag' }

      // Guaranteed backup, used whenever the live Gemini call itself fails
      // or times out. Opening/closing get the scenario-specific line;
      // mid-session has no scenario-specific line, so it goes straight to
      // the browser-voice backup. Either way, the companion never goes
      // completely silent.
      if (!text) {
        text = scenario.aiFallbackLines?.[phase]
        isFallback = true
      }
      if (!text) return { type: 'browser', text: pickBackupLine() }

      try {
        const response = await fetchWithTimeout(
          '/api/elevenlabs',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voiceId: COMPANION_VOICE_ID }),
          },
          COMPANION_FETCH_TIMEOUT_MS,
        )
        if (!response.ok) {
          const errBody = await response.text().catch(() => '')
          console.error('ElevenLabs request failed:', response.status, errBody)
          return { type: 'browser', text: pickBackupLine() }
        }
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        return { type: 'audio', url, text, isFallback }
      } catch (err) {
        console.error('ElevenLabs request failed:', err)
        return { type: 'browser', text: pickBackupLine() }
      }
    }

    const playPrepared = (prepared) => {
      if (cancelled || !prepared) return

      if (prepared.type === 'flag') {
        console.log('[AI companion] flagged this moment — routing to SOS instead of a voice line')
        onFlagDistress?.()
        return
      }

      if (prepared.type === 'browser') {
        speakWithBrowserTTS(prepared.text)
        return
      }

      console.log(prepared.isFallback ? '[AI companion] (fallback)' : '[AI companion]', prepared.text)
      stopAnyPlayback()
      const audio = new Audio(prepared.url)
      currentAudio = audio

      // Mobile browsers often block a play() call that happens at the end
      // of an async chain like this one, even though the session itself
      // started from a real tap. If that happens, don't just give up —
      // try again the instant the user next taps anywhere, which mobile
      // browsers do treat as a fresh, valid gesture.
      audio.play().catch((err) => {
        console.error('Could not play companion audio, will retry on next tap:', err)
        const retryPlay = () => {
          if (currentAudio === audio && !cancelled) audio.play().catch(() => {})
        }
        document.addEventListener('pointerdown', retryPlay, { once: true })
      })
    }

    const cycle = async () => {
      if (cancelled) return
      const video = videoRef.current
      const nowElapsed = video ? video.currentTime : 0

      const prepared = preparedNext ? await preparedNext : await prepareLine(nowElapsed)
      preparedNext = null
      if (cancelled) return

      playPrepared(prepared)
      if (prepared?.type === 'flag') return

      // Start generating the FOLLOWING line right away, while this one is
      // still playing, aimed at roughly when it'll actually be needed.
      const delay =
        COMPANION_MIN_INTERVAL_MS + Math.random() * (COMPANION_MAX_INTERVAL_MS - COMPANION_MIN_INTERVAL_MS)
      preparedNext = prepareLine(nowElapsed + delay / 1000)
      timerId = setTimeout(cycle, delay)
    }

    cycle()

    return () => {
      cancelled = true
      if (timerId) clearTimeout(timerId)
      stopAnyPlayback()
    }
  }, [scenario, sceneReady, onFlagDistress])

  // VR Headset mode: automatically switch A-Frame into its stereo/VR
  // rendering (side-by-side left/right eye view) for use in a Cardboard-
  // style viewer. Phone Gyroscope mode needs no setup — A-Frame's default
  // camera already follows the phone's motion via look-controls.
  useEffect(() => {
    if (mode !== 'headset' || !scenario.videoUrl) return

    const scene = sceneRef.current
    if (!scene) return

    const tryEnterVR = () => {
      if (!scene.enterVR) return
      // Browsers only allow entering fullscreen/VR from a direct tap, and
      // this runs after the loading screen, so that window has usually
      // closed. If the browser blocks it, fall back to a clear on-screen
      // prompt so the user can trigger it with one real tap instead.
      scene.enterVR().catch(() => setNeedsVRTap(true))
    }

    if (scene.hasLoaded) {
      tryEnterVR()
    } else {
      scene.addEventListener('loaded', tryEnterVR, { once: true })
      return () => scene.removeEventListener('loaded', tryEnterVR)
    }
  }, [mode, scenario.videoUrl])

  // Once real stereo VR rendering takes over, the browser fullscreens the
  // <canvas> itself — normal DOM buttons outside it (like vr-exit below)
  // become impossible to tap, since a canvas can't have interactive DOM
  // children. So in headset mode we also add a gaze-and-dwell "Exit"
  // control inside the 3D scene, the standard way VR apps handle this.
  useEffect(() => {
    if (mode !== 'headset') return
    const entity = exitEntityRef.current
    if (!entity) return
    entity.addEventListener('click', onExit)
    return () => entity.removeEventListener('click', onExit)
  }, [mode, onExit])

  // Safety net: A-Frame adds a class ("a-fullscreen") to <html> when
  // entering VR mode, whose CSS locks page scrolling. It doesn't reliably
  // remove that class again once VR mode ends, which freezes every screen
  // shown afterward. Force it off whenever this screen goes away, no
  // matter how the user got out (exit button, gaze control, or the
  // browser's own back gesture).
  useEffect(() => {
    return () => {
      const scene = sceneRef.current
      if (scene?.exitVR) scene.exitVR()
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
      document.documentElement.classList.remove('a-fullscreen')
      document.body.classList.remove('a-fullscreen')
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  const handleTap = () => {
    const video = videoRef.current
    if (video) video.play()
    setNeedsTap(false)
  }

  const handleVRTap = () => {
    const scene = sceneRef.current
    if (scene?.enterVR) {
      scene.enterVR().catch(() => {})
    }
    setNeedsVRTap(false)
  }

  if (!scenario.videoUrl) {
    return (
      <div className="vr-screen vr-missing">
        <button className="vr-exit" type="button" onClick={onExit} aria-label="Exit VR Practice">
          ✕
        </button>
        <div className="vr-missing-message">
          <div className="vr-missing-emoji">{scenario.emoji}</div>
          <p className="vr-missing-title">{scenario.title}</p>
          <p>No video link has been added for this scenario yet.</p>
          <p>
            Paste a Cloudinary link into <code>videoUrl</code> for this
            scenario in <code>src/scenarios.js</code>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="vr-screen">
      {!sceneReady && <LoadingScreen />}

      <a-scene ref={sceneRef} loading-screen="enabled: false">
        <a-assets timeout="10000">
          <video
            id="scenario-video"
            ref={videoRef}
            src={scenario.videoUrl}
            preload="auto"
            loop
            playsInline
            webkit-playsinline="true"
            crossOrigin="anonymous"
          />
        </a-assets>
        <a-videosphere src="#scenario-video"></a-videosphere>

        {mode === 'headset' && (
          <a-entity camera look-controls position="0 1.6 0">
            <a-entity
              cursor="fuse: true; fuseTimeout: 800"
              position="0 0 -1"
              geometry="primitive: ring; radiusInner: 0.006; radiusOuter: 0.01"
              material="color: #F5F1E8; shader: flat"
              raycaster="objects: .clickable"
            ></a-entity>
            <a-entity
              ref={exitEntityRef}
              class="clickable"
              geometry="primitive: plane; width: 0.5; height: 0.18"
              material="color: #1A1A1A; opacity: 0.75; transparent: true"
              text="value: Exit; align: center; color: #F5F1E8; width: 1.6"
              position="0 -0.4 -1.2"
            ></a-entity>
          </a-entity>
        )}

        {/* Rendered inside a-scene (not as a sibling) so it stays visible
            and tappable in Phone Gyroscope mode. In VR Headset mode the
            fullscreened canvas covers this — the gaze "Exit" control above
            is the real exit path there; this stays as a backup for the
            brief window before stereo mode actually engages. */}
        <button className="vr-exit" type="button" onClick={onExit} aria-label="Exit VR Practice">
          ✕
        </button>

        {needsTap && (
          <div className="vr-tap-overlay" onClick={handleTap}>
            <span className="vr-tap-text">Tap to start</span>
          </div>
        )}

        {needsVRTap && (
          <div className="vr-tap-overlay" onClick={handleVRTap}>
            <span className="vr-tap-text">Tap to enter VR</span>
          </div>
        )}
      </a-scene>
    </div>
  )
}

export default VRPractice
