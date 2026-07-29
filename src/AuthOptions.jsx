import { useState } from 'react'
import WelcomeBackdrop from './WelcomeBackdrop.jsx'
import { signInAsGuest, signInWithGoogle } from './firebase.js'

function AuthOptions({ onSignedIn }) {
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
    } catch (err) {
      console.error('Google sign-in failed:', err)
      setError("Couldn't sign in with Google — please try again.")
      setLoading(false)
    }
  }

  return (
    <WelcomeBackdrop>
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
    </WelcomeBackdrop>
  )
}

export default AuthOptions
