function Home({ onEnterVR }) {
  return (
    <div className="home2-screen">
      <div className="home2-greeting">Good morning, Rima</div>

      <h1 className="home2-headline">
        Gentleness, not pressure
        <br />
        <em>one step.</em>
      </h1>

      <button className="home2-pick-card" type="button" onClick={onEnterVR}>
        <div className="home2-pick-label">✦ TODAY'S PICK FOR YOU</div>
        <div className="home2-pick-title">Classroom Talk</div>
        <p className="home2-pick-desc">
          Practice answering when called on. Gentle, kind, judgement-free.
        </p>
        <div className="home2-pick-pills">
          <span className="home2-pill">VR · Easy</span>
          <span className="home2-pill">8 min</span>
          <span className="home2-pill home2-pill-solid">Begin →</span>
        </div>
      </button>

      <div className="home2-grid">
        <button className="home2-tile home2-tile-coral" type="button" onClick={onEnterVR}>
          <span className="home2-tile-circle" />
          <span className="home2-tile-icon">🥽</span>
          <div className="home2-tile-title">VR Therapy</div>
          <div className="home2-tile-sub">Face it, gently</div>
        </button>

        <div className="home2-tile home2-tile-teal">
          <span className="home2-tile-circle" />
          <span className="home2-tile-icon">🎵</span>
          <div className="home2-tile-title">Music &amp; ASMR</div>
          <div className="home2-tile-sub">Calming soundscapes</div>
        </div>

        <div className="home2-tile home2-tile-sage">
          <span className="home2-tile-circle" />
          <span className="home2-tile-icon">🏙️</span>
          <div className="home2-tile-title">Urban Sansa</div>
          <div className="home2-tile-sub">Your daily routine</div>
        </div>

        <div className="home2-tile home2-tile-lavender">
          <span className="home2-tile-circle" />
          <span className="home2-tile-icon">💬</span>
          <div className="home2-tile-title">Reflect</div>
          <div className="home2-tile-sub">A question, not advice</div>
        </div>
      </div>
    </div>
  )
}

export default Home
