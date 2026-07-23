import { useEffect, useRef, useState } from 'react'

function VRPractice({ scenario, mode, onExit }) {
  const videoRef = useRef(null)
  const sceneRef = useRef(null)
  const exitEntityRef = useRef(null)
  const [needsTap, setNeedsTap] = useState(false)
  const [needsVRTap, setNeedsVRTap] = useState(false)

  useEffect(() => {
    if (!scenario.videoUrl) return

    const video = videoRef.current
    if (!video) return

    const hideOverlay = () => setNeedsTap(false)
    video.addEventListener('playing', hideOverlay)

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => setNeedsTap(true))
    }

    return () => video.removeEventListener('playing', hideOverlay)
  }, [scenario.videoUrl])

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
      <a-scene ref={sceneRef}>
        <a-assets timeout="10000">
          <video
            id="scenario-video"
            ref={videoRef}
            src={scenario.videoUrl}
            autoPlay
            loop
            muted
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
