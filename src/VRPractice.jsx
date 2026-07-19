import { useEffect, useRef, useState } from 'react'

function VRPractice({ scenario, onExit }) {
  const videoRef = useRef(null)
  const [needsTap, setNeedsTap] = useState(false)

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

  const handleTap = () => {
    const video = videoRef.current
    if (video) video.play()
    setNeedsTap(false)
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
      <button className="vr-exit" type="button" onClick={onExit} aria-label="Exit VR Practice">
        ✕
      </button>

      <a-scene>
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
      </a-scene>

      {needsTap && (
        <div className="vr-tap-overlay" onClick={handleTap}>
          <span className="vr-tap-text">Tap to start</span>
        </div>
      )}
    </div>
  )
}

export default VRPractice
