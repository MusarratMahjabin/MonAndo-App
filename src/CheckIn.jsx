import { useState } from 'react'
import { saveCheckIn } from './checkinStore.js'
import { useNickname } from './useNickname.js'

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'stressed', emoji: '😖', label: 'Stressed' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'sad', emoji: '😔', label: 'Sad' },
  { id: 'crisis', emoji: '😱', label: 'Crisis' },
]

const CONCERNS = [
  'Anxiety',
  'Depression',
  'Social Fear',
  'Tension',
  'PTSD',
  'Phobia',
  'Panic',
  'Overwhelm',
]

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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3L13 13M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function todayLabel() {
  return new Date()
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    .toUpperCase()
}

function CheckIn({ onClose, onContinue }) {
  const nickname = useNickname()
  const [mood, setMood] = useState(null)
  const [concerns, setConcerns] = useState([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleConcern = (concern) => {
    setConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    )
  }

  const handleContinue = async () => {
    setSaving(true)
    try {
      await saveCheckIn({ mood, concerns, note })
    } catch (err) {
      console.error('Failed to save check-in:', err)
    }
    onContinue(mood)
  }

  return (
    <div className="checkin-screen">
      <div className="checkin-header">
        <button className="checkin-back" type="button" onClick={onClose} aria-label="Back">
          <BackChevron />
        </button>
        <div className="checkin-header-title">
          <div className="checkin-date">TODAY, {todayLabel()}</div>
          <div className="checkin-title">Check-In</div>
        </div>
        <button className="checkin-close" type="button" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      {nickname && <p className="checkin-greeting">Hi, {nickname}</p>}

      <h1 className="checkin-headline">
        How are you
        <br />
        feeling <em>today?</em>
      </h1>
      <p className="checkin-subtitle">
        One honest answer is enough. Your body already knows.
      </p>

      <div className="checkin-mood-grid">
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`checkin-mood ${mood === m.id ? 'checkin-mood-selected' : ''}`}
            onClick={() => setMood(m.id)}
          >
            <span className="checkin-mood-emoji">{m.emoji}</span>
            <span className="checkin-mood-label">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="checkin-section-label">Anything specific on your mind? (optional)</div>
      <div className="checkin-concerns">
        {CONCERNS.map((concern) => (
          <button
            key={concern}
            type="button"
            className={`checkin-concern ${
              concerns.includes(concern) ? 'checkin-concern-selected' : ''
            }`}
            onClick={() => toggleConcern(concern)}
          >
            {concern}
          </button>
        ))}
      </div>

      <div className="checkin-section-label">What's on your mind? (optional)</div>
      <textarea
        className="checkin-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="A short sentence is enough..."
        rows={2}
      />

      <button
        className="checkin-continue"
        type="button"
        disabled={!mood || saving}
        onClick={handleContinue}
      >
        {saving ? 'Saving…' : 'Continue'}
      </button>
    </div>
  )
}

export default CheckIn
