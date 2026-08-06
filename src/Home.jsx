import { useNickname } from './useNickname.js'
import { useHomeRecommendation } from './recommend.js'

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5H17M3 10H17M3 15H17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function timeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Home({
  onEnterVR,
  onOpenMusic,
  onOpenUrbanSansa,
  onOpenCheckIn,
  onOpenSettings,
  onOpenReflect,
  onSelectScenario,
  onOpenTrack,
}) {
  const nickname = useNickname()
  const recommendation = useHomeRecommendation()

  const openRecommendation = () => {
    if (recommendation.type === 'vr') onSelectScenario(recommendation.scenario)
    else if (recommendation.type === 'music') onOpenTrack(recommendation.track)
    else if (recommendation.type === 'urbansansa') onOpenUrbanSansa()
  }

  return (
    <div className="home2-screen">
      <div className="home2-topbar">
        <div className="home2-topbar-brand">
          <img className="home2-topbar-logo" src="/logo%20transparent.png" alt="" />
          <img className="home2-topbar-wordmark" src="/monando-wordmark.png" alt="MonAndo" />
        </div>
        <button className="home2-topbar-menu" type="button" aria-label="Settings" onClick={onOpenSettings}>
          <HamburgerIcon />
        </button>
      </div>

      {nickname && <p className="home2-greeting">{timeOfDayGreeting()}, {nickname}</p>}

      <h1 className="home2-headline">
        Let's begin
        <br />
        with <span className="home2-headline-accent">One step</span>
      </h1>
      <p className="home2-subtitle">Well begun is half done.</p>

      <button className="home2-checkin-link" type="button" onClick={onOpenCheckIn}>
        How are you feeling today? →
      </button>

      <button className="home2-pick-card grain" type="button" onClick={openRecommendation}>
        <div className="home2-pick-label">{recommendation.label}</div>
        <div className="home2-pick-title">{recommendation.title}</div>
        <p className="home2-pick-desc">{recommendation.desc}</p>
        <div className="home2-pick-pills">
          {recommendation.pills.map((pill) => (
            <span className="home2-pill" key={pill}>
              {pill}
            </span>
          ))}
          <span className="home2-pill home2-pill-arrow">→</span>
        </div>
      </button>

      <div className="home2-grid">
        <button
          className="home2-tile grain home2-tile-terracotta"
          type="button"
          onClick={onEnterVR}
        >
          <span className="home2-tile-icon">🥽</span>
          <div className="home2-tile-title">VR Therapy</div>
          <div className="home2-tile-sub">Face it, gently</div>
        </button>

        <button
          className="home2-tile grain home2-tile-teal"
          type="button"
          onClick={onOpenMusic}
        >
          <span className="home2-tile-icon">🎵</span>
          <div className="home2-tile-title">Music &amp; ASMR</div>
          <div className="home2-tile-sub">Calming soundscapes</div>
        </button>

        <button
          className="home2-tile grain home2-tile-olive"
          type="button"
          onClick={onOpenUrbanSansa}
        >
          <span className="home2-tile-icon">🏙️</span>
          <div className="home2-tile-title">Urban Sansa</div>
          <div className="home2-tile-sub">Your own temple in the city</div>
        </button>

        <button
          className="home2-tile grain home2-tile-periwinkle"
          type="button"
          onClick={onOpenReflect}
        >
          <span className="home2-tile-icon">💬</span>
          <div className="home2-tile-title">Reflect</div>
          <div className="home2-tile-sub">A question, not advice</div>
        </button>
      </div>
    </div>
  )
}

export default Home
