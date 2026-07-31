import WelcomeBackdrop from './WelcomeBackdrop.jsx'

function Welcome({ onContinue }) {
  return (
    <WelcomeBackdrop onClick={onContinue}>
      <div className="welcome-top">
        <div className="welcome-logo-wrap">
          <span className="welcome-logo-glow" />
          <img className="welcome-logo-img" src="/logo%20with%20text.png" alt="MonAndo" />
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
