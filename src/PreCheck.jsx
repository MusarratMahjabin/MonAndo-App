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

function PreCheck({ scenario, onBack, onBegin }) {
  const [suds, setSuds] = useState(5)

  return (
    <div className="precheck-screen">
      <button className="precheck-back" type="button" onClick={onBack} aria-label="Back">
        <BackChevron />
      </button>

      <div className="precheck-step">CHECK-IN</div>

      <h1 className="precheck-headline">
        Before you begin,
        <br />
        <em>how do you feel?</em>
      </h1>
      <p className="precheck-subtitle">
        Rate your anxiety right now. We'll check back in after {scenario.title}.
      </p>

      <div className="review-card">
        <div className="review-card-header">
          <span className="review-card-label">SUDS · ANXIETY LEVEL</span>
          <span className="review-card-value">
            {suds}
            <span className="review-card-value-sub">/10</span>
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={suds}
          onChange={(e) => setSuds(Number(e.target.value))}
          className="suds-slider"
        />
        <div className="review-scale-labels">
          <span>Calm</span>
          <span>Manageable</span>
          <span>Intense</span>
        </div>
      </div>

      <button className="precheck-begin" type="button" onClick={() => onBegin(suds)}>
        Begin session
      </button>
    </div>
  )
}

export default PreCheck
