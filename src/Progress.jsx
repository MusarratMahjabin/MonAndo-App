import { useEffect, useState } from 'react'
import { getSessions } from './sessionStore.js'
import { useNickname } from './useNickname.js'

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_MS = 24 * 60 * 60 * 1000
const MOOD_DAYS = 30

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

// Monday of the week containing `date`, at local midnight.
function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday, 1 = Monday, ...
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + diffToMonday)
  return d
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

function average(nums) {
  return nums.reduce((sum, n) => sum + n, 0) / nums.length
}

// SUDS 0-10, split the same way the session-review slider already
// labels it: Calm / Manageable / Intense.
function barTone(avg) {
  if (avg === null) return 'empty'
  if (avg <= 3) return 'good'
  if (avg <= 6) return 'mid'
  return 'high'
}

// Same "6 and under is fine" cutoff as the bars above, just collapsed to
// the two states the mood grid actually shows (no middle tone).
function moodTone(avg) {
  if (avg === null) return 'missed'
  return avg <= 6 ? 'good' : 'tough'
}

function Progress({ onBack }) {
  const nickname = useNickname()
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(DAY_LETTERS.map((label) => ({ label, avg: null })))
  const [weekAvg, setWeekAvg] = useState(null)
  const [changePercent, setChangePercent] = useState(null)
  const [moodDays, setMoodDays] = useState(Array.from({ length: MOOD_DAYS }, () => 'missed'))

  useEffect(() => {
    let cancelled = false

    getSessions()
      .then((sessions) => {
        if (cancelled) return

        const thisMonday = startOfWeek(new Date())
        const lastMonday = new Date(thisMonday.getTime() - 7 * DAY_MS)
        const nextMonday = new Date(thisMonday.getTime() + 7 * DAY_MS)

        const weekDates = Array.from({ length: 7 }, (_, i) => new Date(thisMonday.getTime() + i * DAY_MS))

        setDays(
          weekDates.map((date, i) => {
            const daySessions = sessions.filter((s) => sameDay(new Date(s.date), date))
            return {
              label: DAY_LETTERS[i],
              avg: daySessions.length > 0 ? average(daySessions.map((s) => s.sudsAfter)) : null,
            }
          }),
        )

        const thisWeekSessions = sessions.filter((s) => {
          const d = new Date(s.date)
          return d >= thisMonday && d < nextMonday
        })
        const lastWeekSessions = sessions.filter((s) => {
          const d = new Date(s.date)
          return d >= lastMonday && d < thisMonday
        })

        const thisAvg =
          thisWeekSessions.length > 0 ? average(thisWeekSessions.map((s) => s.sudsAfter)) : null
        const lastAvg =
          lastWeekSessions.length > 0 ? average(lastWeekSessions.map((s) => s.sudsAfter)) : null

        setWeekAvg(thisAvg)
        setChangePercent(
          thisAvg !== null && lastAvg !== null && lastAvg > 0
            ? Math.round(((lastAvg - thisAvg) / lastAvg) * 100)
            : null,
        )

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const monthDates = Array.from(
          { length: MOOD_DAYS },
          (_, i) => new Date(today.getTime() - (MOOD_DAYS - 1 - i) * DAY_MS),
        )
        setMoodDays(
          monthDates.map((date) => {
            const daySessions = sessions.filter((s) => sameDay(new Date(s.date), date))
            return moodTone(daySessions.length > 0 ? average(daySessions.map((s) => s.sudsAfter)) : null)
          }),
        )
      })
      .catch((err) => console.error('Failed to load progress:', err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="progress-screen">
      <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
        <BackChevron />
      </button>

      {nickname && <p className="progress-greeting">Hi, {nickname}</p>}

      <h1 className="progress-headline">
        You are <em>becoming</em>.
      </h1>
      {/* Placeholder — swap for something more specific once there's real
          copy for this screen. */}
      <p className="progress-subtitle">Every session is a small act of courage.</p>

      <div className="progress-card">
        <div className="progress-card-row">
          <span className="progress-card-label">This week · SUDS avg</span>
          <span className="progress-card-goal">Goal: ↓</span>
        </div>

        <div className="progress-card-value-row">
          <span className="progress-card-value">
            {loading ? '—' : weekAvg !== null ? weekAvg.toFixed(1) : '—'}
          </span>
          {!loading && changePercent !== null && (
            <span
              className={`progress-card-change ${
                changePercent >= 0 ? 'progress-card-change-good' : 'progress-card-change-bad'
              }`}
            >
              {changePercent >= 0 ? '↓' : '↑'}
              {Math.abs(changePercent)}%
            </span>
          )}
        </div>

        <div className="progress-bars">
          {days.map((day, i) => (
            <div className="progress-bar-col" key={i}>
              <div className="progress-bar-track">
                <div
                  className={`progress-bar-fill progress-bar-${barTone(day.avg)}`}
                  style={{ height: day.avg !== null ? `${Math.max((day.avg / 10) * 100, 6)}%` : '8%' }}
                />
              </div>
              <span className="progress-bar-label">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-section-header">
        <h2 className="progress-section-title">30-day mood</h2>
        <span className="progress-section-date">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="progress-mood-grid">
        {moodDays.map((tone, i) => (
          <div key={i} className={`progress-mood-cell progress-mood-${tone}`} />
        ))}
      </div>

      <div className="progress-legend">
        <span className="progress-legend-item">
          <span className="progress-legend-dot progress-legend-good" />
          Good
        </span>
        <span className="progress-legend-item">
          <span className="progress-legend-dot progress-legend-tough" />
          Tough
        </span>
        <span className="progress-legend-item">
          <span className="progress-legend-dot progress-legend-missed" />
          Missed
        </span>
      </div>
    </div>
  )
}

export default Progress
