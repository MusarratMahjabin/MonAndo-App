function ComingSoon({ scenario, onBack }) {
  return (
    <div className="comingsoon-screen">
      <button className="vr-exit" type="button" onClick={onBack} aria-label="Back">
        ✕
      </button>

      <div
        className="comingsoon-hero"
        style={scenario.thumbnailUrl ? { backgroundImage: `url(${scenario.thumbnailUrl})` } : undefined}
      >
        <div className="comingsoon-hero-overlay" />
        <span className="comingsoon-badge">Coming Soon</span>
        <div className="comingsoon-hero-content">
          <span className="comingsoon-emoji">{scenario.emoji}</span>
          <h1 className="comingsoon-title">{scenario.title}</h1>
        </div>
      </div>

      <div className="comingsoon-body">
        <p className="comingsoon-message">
          This practice scene is still being prepared — no video or AI voice yet. Check back soon.
        </p>
      </div>
    </div>
  )
}

export default ComingSoon
