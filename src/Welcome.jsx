import { useState } from 'react'
import { signInAsGuest, signInWithGoogle } from './firebase.js'

// Scattered decorative dots, roughly matching the reference design.
// Each is [top%, left%, size px, opacity].
const DOTS = [
  [8, 60, 3, 0.7],
  [14, 45, 2, 0.6],
  [18, 88, 3, 0.8],
  [24, 37, 2, 0.5],
  [47, 93, 3, 0.7],
  [58, 12, 2, 0.5],
  [62, 8, 3, 0.6],
  [74, 95, 2, 0.6],
  [84, 47, 3, 0.5],
  [91, 68, 2, 0.6],
]

function Welcome({ onSignedIn }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGuest = async () => {
    setLoading(true)
    setError('')
    try {
      await signInAsGuest()
      onSignedIn()
    } catch {
      setError("Couldn't continue as guest — please try again.")
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      onSignedIn()
    } catch {
      setError("Couldn't sign in with Google — please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="welcome-screen">
      {DOTS.map(([top, left, size, opacity], i) => (
        <span
          key={i}
          className="welcome-dot"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: size,
            height: size,
            '--dot-opacity': opacity,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="welcome-top">
        <div className="welcome-logo-wrap">
          <span className="welcome-logo-glow" />
          <img className="welcome-logo-img" src="/logo.png" alt="MonAndo" />
        </div>

        <div className="welcome-tagline">A SAFE SPACE, NOT A CLINIC</div>

        <p className="welcome-script">
          It's okay
          <br />
          to not be okay.
        </p>
      </div>

      <div className="welcome-actions">
        <button className="welcome-primary" type="button" disabled={loading} onClick={handleGoogle}>
          Begin your journey
        </button>
        <button className="welcome-link" type="button" disabled={loading} onClick={handleGuest}>
          Continue as Guest
        </button>
        <button className="welcome-link" type="button" disabled={loading} onClick={handleGoogle}>
          I already have an account
        </button>

        {error && <p className="welcome-error">{error}</p>}
      </div>
    </div>
  )
}

export default Welcome
