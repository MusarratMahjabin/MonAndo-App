import { useEffect, useState } from 'react'

// Simple, even inhale/exhale rhythm — no audio needed. If a real guided
// recording gets added for this track later, this can be swapped for
// timestamps synced to that audio instead.
const PHASE_SECONDS = 4
const WINDOW = 2 // lines shown above and below the current one

function DownChevron() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 7L10 13L16 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l10-5.5-10-5.5z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
    </svg>
  )
}

function wordAt(index) {
  return index % 2 === 0 ? 'Inhale' : 'Exhale'
}

function BreathingSession({ track, onCollapse, onToggleAudio, onStopAudio }) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setPhaseIndex((i) => i + 1), PHASE_SECONDS * 1000)
    return () => clearInterval(id)
  }, [paused])

  // Pausing here also pauses (or resumes) this track's actual audio via
  // onToggleAudio, so the visual and the sound stay in lockstep.
  const handleTogglePause = () => {
    setPaused((p) => !p)
    onToggleAudio?.()
  }

  const handleCollapse = () => {
    onStopAudio?.()
    onCollapse()
  }

  const offsets = []
  for (let offset = -WINDOW; offset <= WINDOW; offset++) offsets.push(offset)

  const currentWord = wordAt(phaseIndex)
  const isEvening = track.id === 'evening-meditation'

  return (
    <div className={`breathing-screen ${isEvening ? 'breathing-screen-evening' : ''}`}>
      <div className="breathing-topbar">
        <button
          className="nowplaying-collapse"
          type="button"
          onClick={handleCollapse}
          aria-label="Collapse"
        >
          <DownChevron />
        </button>
        <span className="breathing-category">{track.title}</span>
      </div>

      <div className="breathing-lyrics">
        {offsets.map((offset) => {
          const distance = Math.abs(offset)
          const tone = distance === 0 ? 'current' : distance === 1 ? 'near' : 'far'
          return (
            <div key={offset} className={`breathing-line breathing-line-${tone}`}>
              {wordAt(phaseIndex + offset)}
            </div>
          )
        })}
      </div>

      <div className="breathing-track">
        <div
          className={`breathing-thumb breathing-thumb-${currentWord === 'Inhale' ? 'left' : 'right'}`}
        />
      </div>

      <button
        className="breathing-play"
        type="button"
        onClick={handleTogglePause}
        aria-label={paused ? 'Resume' : 'Pause'}
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  )
}

export default BreathingSession
