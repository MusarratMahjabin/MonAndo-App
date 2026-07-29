import { useEffect } from 'react'
import WelcomeBackdrop from './WelcomeBackdrop.jsx'

// How long the splash shows before moving on to the sign-in options —
// long enough to read "It's okay to not be okay.", not long enough to
// feel like a wait.
const CONTINUE_DELAY_MS = 2800

function Welcome({ onContinue }) {
  useEffect(() => {
    const timer = setTimeout(onContinue, CONTINUE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <WelcomeBackdrop>
      <div className="welcome-top">
        <div className="welcome-logo-wrap">
          <span className="welcome-logo-glow" />
          <img className="welcome-logo-img" src="/logo.png" alt="MonAndo" />
        </div>

        <p className="welcome-script">
          It's okay
          <br />
          to not be okay.
        </p>
      </div>
    </WelcomeBackdrop>
  )
}

export default Welcome
