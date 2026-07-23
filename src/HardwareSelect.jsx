import { useState } from 'react'

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

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="6" y="2" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15 4.5C16.5 5.5 17.5 7 17.5 8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M17.5 8.5L17.5 6M17.5 8.5L15 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeadsetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="6" width="17" height="9" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6.5" cy="10.5" r="1.8" fill="currentColor" />
      <circle cx="13.5" cy="10.5" r="1.8" fill="currentColor" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5L6.2 11.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MODES = [
  {
    id: 'phone',
    icon: PhoneIcon,
    title: 'Phone Gyroscope',
    desc: 'Tilt your phone to look around. No headset needed.',
  },
  {
    id: 'headset',
    icon: HeadsetIcon,
    title: 'VR Headset',
    desc: 'Google Cardboard, Meta Quest, or compatible.',
  },
]

function HardwareSelect({ onBack, onEnterScene }) {
  const [mode, setMode] = useState('headset')

  return (
    <div className="hw-screen">
      <button className="hw-back" type="button" onClick={onBack} aria-label="Back">
        <BackChevron />
      </button>

      <div className="hw-step">SETUP · STEP 3 OF 3</div>

      <h1 className="hw-headline">
        How will you
        <br />
        <em>experience</em>
        <br />
        this scene?
      </h1>

      <div className="hw-options">
        {MODES.map(({ id, icon: Icon, title, desc }) => {
          const selected = mode === id
          return (
            <button
              key={id}
              type="button"
              className={`hw-option ${selected ? 'hw-option-selected' : ''}`}
              onClick={() => setMode(id)}
            >
              <span className="hw-option-icon">
                <Icon />
              </span>
              <span className="hw-option-text">
                <span className="hw-option-title">{title}</span>
                <span className="hw-option-desc">{desc}</span>
              </span>
              {selected && (
                <span className="hw-option-check">
                  <CheckIcon />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button className="hw-enter" type="button" onClick={() => onEnterScene(mode)}>
        Enter scene
      </button>
    </div>
  )
}

export default HardwareSelect
