function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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

function NowPlaying({ track, onCollapse }) {
  const tint = track.overlayTint || '#2C3E4A'
  const gradient = `linear-gradient(to bottom, ${hexToRgba(tint, 0.88)} 0%, ${hexToRgba(
    tint,
    0.18,
  )} 35%, ${hexToRgba(tint, 0.18)} 65%, ${hexToRgba(tint, 0.9)} 100%)`

  return (
    <div
      className="nowplaying-screen"
      style={{
        backgroundImage: track.backgroundImage ? `url(${track.backgroundImage})` : 'none',
        backgroundColor: tint,
      }}
    >
      <div className="nowplaying-gradient" style={{ background: gradient }} />
      <div className="nowplaying-grain" />

      <div className="nowplaying-topbar">
        <button
          className="nowplaying-collapse"
          type="button"
          onClick={onCollapse}
          aria-label="Collapse"
        >
          <DownChevron />
        </button>
        <span className="nowplaying-category">{track.category}</span>
      </div>
    </div>
  )
}

export default NowPlaying
