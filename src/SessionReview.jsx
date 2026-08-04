import { useEffect, useState } from 'react'
import { getSessions, saveSession, BADGES } from './sessionStore.js'

const HELPER_OPTIONS = ['AI voice', 'Breathing', "Knowing it's VR", 'Repeating']

function StarRating({ value, onChange }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`review-star ${n <= value ? 'review-star-filled' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function BackChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11.5 3.5L6 9L11.5 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SessionReview({ scenario, sudsBefore, onBack, onDone }) {
  // This session hasn't been saved yet, so an empty history here means
  // it's about to become the user's first. Loaded from Firestore, so it
  // starts false and pops in once we know for sure.
  const [isFirstSession, setIsFirstSession] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSessions()
      .then((sessions) => {
        if (!cancelled) setIsFirstSession(sessions.length === 0)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const [sudsAfter, setSudsAfter] = useState(sudsBefore)
  const [rating, setRating] = useState(0)
  const [helpers, setHelpers] = useState([])

  const toggleHelper = (helper) => {
    setHelpers((prev) =>
      prev.includes(helper) ? prev.filter((h) => h !== helper) : [...prev, helper]
    )
  }

  const improved = sudsAfter < sudsBefore
  const reduction =
    sudsBefore > 0 ? Math.round(((sudsBefore - sudsAfter) / sudsBefore) * 100) : 0

  const handleDone = async () => {
    setSaving(true)
    try {
      await saveSession({
        id: Date.now(),
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        date: new Date().toISOString(),
        sudsBefore,
        sudsAfter,
        rating,
        helpers,
      })
    } catch (err) {
      console.error('Failed to save session:', err)
    }
    onDone()
  }

  return (
    <div className="review-screen">
      <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
        <BackChevron />
      </button>

      <div className="review-eyebrow">SESSION COMPLETE</div>
      <h1 className="review-title">You did it.</h1>
      <h2 className="review-subtitle">How do you feel right now?</h2>

      <div className="review-card">
        <div className="review-card-header">
          <span className="review-card-label">SUDS · ANXIETY LEVEL</span>
          <span className="review-card-value">
            {sudsAfter}
            <span className="review-card-value-sub">/10</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={sudsAfter}
          onChange={(e) => setSudsAfter(Number(e.target.value))}
          className="suds-slider"
        />
        <div className="review-scale-labels">
          <span>Calm</span>
          <span>Manageable</span>
          <span>Intense</span>
        </div>
      </div>

      {sudsAfter !== sudsBefore && (
        <div className="review-insight">
          <div className="review-insight-label">✦ AI INSIGHT</div>
          <p className="review-insight-text">
            "Your anxiety {improved ? 'dropped' : 'rose'} from{' '}
            <span className="review-insight-before">{sudsBefore}</span> to{' '}
            <span className="review-insight-after">{sudsAfter}</span> during this session.
            {improved
              ? ` That's a ${reduction}% reduction — your nervous system is learning.`
              : ' Noticing that shift is part of the practice — be gentle with yourself.'}
            "
          </p>
        </div>
      )}

      <div className="review-section">
        <p className="review-section-label">How was your session?</p>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="review-section">
        <p className="review-section-label">What helped most?</p>
        <div className="review-pills">
          {HELPER_OPTIONS.map((helper) => (
            <button
              key={helper}
              type="button"
              className={`review-pill ${helpers.includes(helper) ? 'review-pill-active' : ''}`}
              onClick={() => toggleHelper(helper)}
            >
              {helper}
            </button>
          ))}
        </div>
      </div>

      {isFirstSession && (
        <div className="review-badge">
          <span className="review-badge-icon">{BADGES['first-step'].emoji}</span>
          <div>
            <div className="review-badge-label">BADGE UNLOCKED</div>
            <div className="review-badge-title">{BADGES['first-step'].title}</div>
            <div className="review-badge-desc">{BADGES['first-step'].desc}</div>
          </div>
        </div>
      )}

      <button
        className="review-done"
        type="button"
        disabled={saving}
        onClick={handleDone}
      >
        {saving ? 'Saving…' : 'See my progress'}
      </button>
    </div>
  )
}

export default SessionReview
