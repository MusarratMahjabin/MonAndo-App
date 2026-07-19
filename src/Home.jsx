function Home({ onEnter }) {
  return (
    <div className="home">
      <div className="home-top">
        <h1 className="home-title">MonAndo</h1>
        <p className="home-tagline">It's okay to not be okay.</p>
      </div>

      <button className="cta-button" type="button" onClick={onEnter}>
        Enter VR Practice
      </button>
    </div>
  )
}

export default Home
