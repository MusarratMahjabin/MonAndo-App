import { useState } from 'react'
import urbanSansaFeatures from './urbanSansaFeatures.js'

const WEATHER_OPTIONS = [
  { id: 'sunny', emoji: '☀️', label: 'Sunny' },
  { id: 'partly-cloudy', emoji: '⛅', label: 'Partly cloudy' },
  { id: 'cloudy', emoji: '☁️', label: 'Cloudy' },
  { id: 'stormy', emoji: '⛈️', label: 'Stormy' },
  { id: 'calm-night', emoji: '🌙', label: 'Calm night' },
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

function formatDuration(seconds) {
  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  return `${mm}:${String(ss).padStart(2, '0')}`
}

function UrbanSansa({ onBack, onOpenFeature }) {
  const [weather, setWeather] = useState(null)
  const featured = urbanSansaFeatures[0]

  return (
    <div className="us-screen">
      <div className="us-topbar">
        <button className="us-back" type="button" onClick={onBack} aria-label="Back to Home">
          <BackChevron />
        </button>
        <span className="us-topbar-logo">UrbanSansa</span>
      </div>

      <h1 className="us-greeting">
        Good day, <strong>User</strong>
      </h1>
      <p className="us-subtitle">Mental well-being is mental health.</p>

      {featured && (
        <button
          className="us-hero grain"
          type="button"
          onClick={() => onOpenFeature(featured)}
        >
          <div className="us-hero-title">{featured.title}</div>
          <div className="us-hero-duration">{formatDuration(featured.durationSeconds)}</div>
          <span className="us-hero-continue">Continue →</span>
        </button>
      )}

      <h2 className="us-section-label">More Functions</h2>
      <div className="us-carousel">
        {urbanSansaFeatures.map((feature) => (
          <button
            key={feature.id}
            className="us-feature-card"
            type="button"
            onClick={() => onOpenFeature(feature)}
            style={
              feature.backgroundImage
                ? { backgroundImage: `url(${feature.backgroundImage})` }
                : { backgroundColor: feature.overlayTint }
            }
          >
            <span className="us-feature-title">{feature.title}</span>
          </button>
        ))}
      </div>

      <h2 className="us-section-label">Emotion Weather</h2>
      <div className="us-weather grain">
        <p className="us-weather-prompt">How does the breeze feel in your heart today?</p>
        <div className="us-weather-options">
          {WEATHER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`us-weather-emoji ${
                weather === option.id ? 'us-weather-emoji-selected' : ''
              }`}
              aria-label={option.label}
              onClick={() => setWeather(option.id)}
            >
              {option.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UrbanSansa
