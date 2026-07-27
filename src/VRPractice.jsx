import { useEffect, useRef, useState } from 'react'
import LoadingScreen from './LoadingScreen.jsx'

function VRPractice({ scenario, mode, onExit }) {
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
