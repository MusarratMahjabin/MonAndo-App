import { useState } from 'react'
import scenarios from './scenarios.js'

const FILTERS = ['All', 'Easy', 'Medium', 'Hard']

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

function ScenarioCard({ scenario, onSelect }) {
  const { title, category, difficulty, durationMinutes, emoji, thumbnailUrl } = scenario

  return (
    <button className="vrlib-card" type="button" onClick={() => onSelect(scenario)}>
      <div className="vrlib-thumb">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" />
        ) : (
          <div className="vrlib-thumb-fallback">{emoji}</div>
        )}

        <span className={`vrlib-difficulty vrlib-difficulty-${difficulty.toLowerCase()}`}>
          {difficulty.toUpperCase()}
        </span>
        <span className="vrlib-duration">{durationMinutes} min</span>

        <div className="vrlib-thumb-caption">
          <span className="vrlib-thumb-emoji">{emoji}</span>
          <span className="vrlib-thumb-title">{title}</span>
        </div>
      </div>

      <div className="vrlib-footer">
        <span className="vrlib-category">{category}</span>
        <span className="vrlib-status vrlib-status-start">→ Start</span>
      </div>
    </button>
  )
}

function VRLibrary({ onBack, onSelect }) {
  const [filter, setFilter] = useState('All')

  const visible =
    filter === 'All' ? scenarios : scenarios.filter((s) => s.difficulty === filter)

  return (
    <div className="vrlib-screen">
      <div className="vrlib-header">
        <button className="vrlib-back" type="button" onClick={onBack} aria-label="Back to Home">
          <BackChevron />
        </button>
        <div>
          <div className="vrlib-count">{scenarios.length} SCENARIOS</div>
          <div className="vrlib-header-title">VR Therapy</div>
        </div>
      </div>

      <h1 className="vrlib-headline">
        Practice the moment.
        <br />
        <em>Live the day.</em>
      </h1>

      <p className="vrlib-subtitle">
        Exposure therapy, gently scaffolded. Begin Easy, build confidence, unlock Hard.
      </p>

      <div className="vrlib-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`vrlib-tab ${filter === f ? 'vrlib-tab-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="vrlib-cards" key={filter}>
        {visible.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

export default VRLibrary
