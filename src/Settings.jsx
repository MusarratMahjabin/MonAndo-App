import { useState } from 'react'
import { isGuestAccount, signOutUser } from './firebase.js'

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

// A row whose control isn't wired up to anything real yet. Shown as plain
// text (not a button) with a muted "Soon" label instead of a working
// control, so it doesn't look like a dead/broken button.
function SettingsRow({ icon, iconBg, title, subtitle, trailing }) {
  return (
    <div className="settings-row">
      <span className="settings-row-icon" style={{ background: iconBg }}>
        {icon}
      </span>
      <div className="settings-row-text">
        <div className="settings-row-title">{title}</div>
        <div className="settings-row-subtitle">{subtitle}</div>
      </div>
      <div className="settings-row-trailing">{trailing}</div>
    </div>
  )
}

function Settings({ onBack, onLoggedOut }) {
  const [confirmingLogOut, setConfirmingLogOut] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const isGuest = isGuestAccount()

  const handleLogOutTap = () => {
    setError('')
    setConfirmingLogOut(true)
  }

  const handleConfirmLogOut = async () => {
    setLoggingOut(true)
    setError('')
    try {
      await signOutUser()
      onLoggedOut()
    } catch {
      setError("Couldn't log out — please try again.")
      setLoggingOut(false)
      setConfirmingLogOut(false)
    }
  }

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
          <BackChevron />
        </button>
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-section-label">Personalization</div>
      <div className="settings-card">
        <SettingsRow
          icon="🌐"
          iconBg="#dbe9fb"
          title="Language"
          subtitle="English · বাংলা · 한국어"
          trailing={<span className="settings-soon">Soon</span>}
        />
        <SettingsRow
          icon="📍"
          iconBg="#f3ddf5"
          title="Region"
          subtitle="Localized content & emergencies"
          trailing={<span className="settings-soon">Soon</span>}
        />
        <SettingsRow
          icon="🗣️"
          iconBg="#efdcf7"
          title="AI voice"
          subtitle="Soft · Female · Bangla accent"
          trailing={<span className="settings-soon">Soon</span>}
        />
      </div>

      <div className="settings-section-label">Therapy</div>
      <div className="settings-card">
        <SettingsRow
          icon="🌬️"
          iconBg="#dcf3ea"
          title="Breathing technique"
          subtitle="Box · 4-4-4-4"
          trailing={<span className="settings-soon">Soon</span>}
        />
        <SettingsRow
          icon="🥽"
          iconBg="#fbe7d4"
          title="VR mode"
          subtitle="Phone gyroscope"
          trailing={<span className="settings-soon">Soon</span>}
        />
      </div>

      <div className="settings-section-label">Notifications &amp; Safety</div>
      <div className="settings-card">
        <SettingsRow
          icon="🔔"
          iconBg="#fbe3d4"
          title="Daily check-in"
          subtitle="8:30 AM · gentle nudge"
          trailing={<span className="settings-toggle settings-toggle-disabled" aria-hidden="true" />}
        />
        <SettingsRow
          icon="🆘"
          iconBg="#fbd7d7"
          title="Emergency contact"
          subtitle="Set from the SOS screen"
          trailing={<span className="settings-soon">Soon</span>}
        />
      </div>

      <div className="settings-section-label">Account</div>
      <div className="settings-card">
        {!confirmingLogOut ? (
          <button className="settings-logout-row" type="button" onClick={handleLogOutTap}>
            <span className="settings-row-icon" style={{ background: '#fbd7d7' }}>
              🚪
            </span>
            <span className="settings-logout-label">Log out</span>
          </button>
        ) : (
          <div className="settings-logout-confirm">
            <p className="settings-logout-confirm-text">
              {isGuest
                ? "You're on a Guest account — it has no password, so once you log out there's no way back into this same account or its data."
                : 'You can sign back into this account any time.'}
            </p>
            {error && <p className="settings-logout-error">{error}</p>}
            <div className="settings-logout-confirm-actions">
              <button
                className="settings-logout-cancel"
                type="button"
                disabled={loggingOut}
                onClick={() => setConfirmingLogOut(false)}
              >
                Cancel
              </button>
              <button
                className="settings-logout-confirm-btn"
                type="button"
                disabled={loggingOut}
                onClick={handleConfirmLogOut}
              >
                {loggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
