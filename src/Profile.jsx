import { useEffect, useState } from 'react'
import { useNickname } from './useNickname.js'
import { getSessions, getUnlockedBadges, BADGES } from './sessionStore.js'

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

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + diffToMonday)
  return d
}

function Profile({ onBack, onOpenProgress }) {
  const [loading, setLoading] = useState(true)
  const nickname = useNickname()
  const [totalSessions, setTotalSessions] = useState(0)
  const [sessionsThisWeek, setSessionsThisWeek] = useState(0)
  const [unlockedBadges, setUnlockedBadges] = useState([])

  useEffect(() => {
    let cancelled = false

    Promise.all([getSessions(), getUnlockedBadges()])
      .then(([sessions, badges]) => {
        if (cancelled) return

        const thisMonday = startOfWeek(new Date())
        const thisWeek = sessions.filter((s) => new Date(s.date) >= thisMonday)

        setTotalSessions(sessions.length)
        setSessionsThisWeek(thisWeek.length)
        setUnlockedBadges(badges)
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="profile-view-screen">
      <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
        <BackChevron />
      </button>

      <div className="profile-view-avatar">🌙</div>
      <h1 className="profile-view-name">{nickname || 'Anonymous'}</h1>

      <div className="profile-view-stats">
        <div className="profile-view-stat">
          <div className="profile-view-stat-value">{loading ? '—' : totalSessions}</div>
          <div className="profile-view-stat-label">Sessions</div>
        </div>
        <div className="profile-view-stat">
          <div className="profile-view-stat-value">{loading ? '—' : sessionsThisWeek}</div>
          <div className="profile-view-stat-label">This week</div>
        </div>
        <div className="profile-view-stat">
          <div className="profile-view-stat-value">{loading ? '—' : unlockedBadges.length}</div>
          <div className="profile-view-stat-label">Badges</div>
        </div>
      </div>

      <h2 className="profile-view-section-label">Badges</h2>
      {!loading && unlockedBadges.length === 0 ? (
        <p className="profile-view-empty">Complete your first VR session to earn a badge.</p>
      ) : (
        <div className="profile-view-badges">
          {unlockedBadges.map((id) => {
            const badge = BADGES[id]
            if (!badge) return null
            return (
              <div className="profile-view-badge" key={id}>
                <span className="profile-view-badge-emoji">{badge.emoji}</span>
                <div className="profile-view-badge-title">{badge.title}</div>
              </div>
            )
          })}
        </div>
      )}

      <button className="profile-view-link" type="button" onClick={onOpenProgress}>
        <span className="profile-view-link-icon">📈</span>
        <span className="profile-view-link-text">My progress</span>
        <ChevronRight />
      </button>
    </div>
  )
}

export default Profile
