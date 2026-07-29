import { useState } from 'react'
import { saveProfile } from './profileStore.js'

const AGE_GROUPS = ['Under 13', '13–17', '18–25', '26+']

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

function ProfileSetup({ onDone }) {
  const [nickname, setNickname] = useState('')
  const [ageGroup, setAgeGroup] = useState('13–17')
  const [consent, setConsent] = useState(false)
  const [saving, setSaving] = useState(false)

  const canSubmit = nickname.trim() !== '' && consent

  const handleCreate = async () => {
    if (!canSubmit) return
    setSaving(true)
    try {
      await saveProfile({ nickname: nickname.trim(), ageGroup })
    } catch (err) {
      console.error('Failed to save profile:', err)
    }
    onDone()
  }

  return (
    <div className="profile-screen">
      {/* Purely visual — this is a required step right now (no skip),
          so there's no real "back" destination to wire this to yet. */}
      <button className="profile-back" type="button" aria-label="Back">
        <BackChevron />
      </button>

      <div className="profile-step">STEP 2 OF 3</div>
      <h1 className="profile-headline">
        Choose a name
        <br />
        that feels <em>safe</em>
      </h1>
      <p className="profile-subtitle">A nickname is enough. No real names. No stigma.</p>

      <label className="profile-label" htmlFor="profile-nickname">
        Nickname
      </label>
      <input
        id="profile-nickname"
        className="profile-input"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="e.g. Quiet Rain, Moonlight"
      />

      <div className="profile-label">Age group</div>
      <div className="profile-age-grid">
        {AGE_GROUPS.map((age) => (
          <button
            key={age}
            type="button"
            className={`profile-age ${ageGroup === age ? 'profile-age-selected' : ''}`}
            onClick={() => setAgeGroup(age)}
          >
            {age}
          </button>
        ))}
      </div>

      <label className="profile-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          I understand MonAndo offers <em>wellness support</em>, not medical advice. In
          crisis I'll seek qualified help.
        </span>
      </label>

      <button
        className="profile-submit"
        type="button"
        disabled={!canSubmit || saving}
        onClick={handleCreate}
      >
        {saving ? 'Saving…' : 'Create my space'}
      </button>
    </div>
  )
}

export default ProfileSetup
