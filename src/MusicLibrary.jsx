import { useState } from 'react'
import audioTracks from './audioTracks.js'

const FILTERS = ['Calm', 'Sleep', 'Focus', 'ASMR']

const CATEGORY_ICON = {
  'Calm Restore': '🕊️',
  'Focus Zone': '🎯',
  'Sleep Hub': '🌙',
  ASMR: '🎧',
  Meditation: '🧘',
  Nature: '🌿',
}

function formatDuration(seconds) {
  return `${Math.round(seconds / 60)} min`
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

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
      <path d="M3 2L12 7L3 12V2Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
      <rect x="3" y="2" width="3" height="10" />
      <rect x="8" y="2" width="3" height="10" />
    </svg>
  )
}

function MusicLibrary({ onBack, onOpenTrack, onToggleTrack, currentTrack, isPlaying }) {
  const [filter, setFilter] = useState('Calm')

  const visible = audioTracks.filter((track) => {
    const tag = filter.toLowerCase()
    return track.moodTags.includes(tag) || track.category.toLowerCase() === tag
  })

  return (
    <div className="music-screen">
      <div className="music-header">
        <button className="music-back" type="button" onClick={onBack} aria-label="Back to Home">
          <BackChevron />
        </button>
        <h2 className="music-header-title">Music &amp; ASMR</h2>
      </div>

      <h1 className="music-headline">
        Sounds
        <br />
        <em>from home.</em>
      </h1>
      <p className="music-subtitle">
        Auto-matched to your mood. Rain from a tin roof — not a Spotify mix.
      </p>

      <div className="music-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`music-tab ${filter === f ? 'music-tab-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="music-list">
        {visible.map((track) => {
          const isCurrent = currentTrack?.id === track.id
          const active = isCurrent && isPlaying
          return (
            <div key={track.id} className="music-card">
              <button className="music-card-main" type="button" onClick={() => onOpenTrack(track)}>
                <span className="music-card-icon" style={{ background: track.coverColor }}>
                  {CATEGORY_ICON[track.category] ?? '🎵'}
                </span>
                <span className="music-card-info">
                  <span className="music-card-title">{track.title}</span>
                  <span className="music-card-meta">
                    {track.category} · {formatDuration(track.durationSeconds)}
                  </span>
                </span>
              </button>
              <button
                className={`music-card-toggle ${active ? 'music-card-toggle-active' : ''}`}
                type="button"
                aria-label={active ? 'Pause' : 'Play'}
                onClick={() => (isCurrent ? onToggleTrack(track) : onOpenTrack(track))}
              >
                {active ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          )
        })}
      </div>

      {currentTrack && (
        <div className="music-mini-player">
          <button className="music-mini-main" type="button" onClick={() => onOpenTrack(currentTrack)}>
            <span className="music-mini-swatch" style={{ background: currentTrack.coverColor }} />
            <span className="music-mini-info">
              <span className="music-mini-label">Now playing</span>
              <span className="music-mini-title">{currentTrack.title}</span>
            </span>
          </button>
          <button
            className="music-mini-toggle"
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={() => onToggleTrack(currentTrack)}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      )}
    </div>
  )
}

export default MusicLibrary
