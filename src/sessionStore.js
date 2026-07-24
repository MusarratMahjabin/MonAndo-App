// ============================================================
// MonAndo Session Storage
// ============================================================
// Persists completed VR session data (SUDS before/after, rating,
// what helped) and unlocked badges to the browser's localStorage,
// so progress survives a refresh/relaunch without needing a backend.
// ============================================================

const SESSIONS_KEY = 'monando_sessions'
const BADGES_KEY = 'monando_badges'

export const BADGES = {
  'first-step': {
    emoji: '🌱',
    title: 'First Step',
    desc: 'Complete your first VR session',
  },
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || []
  } catch {
    return []
  }
}

export function getUnlockedBadges() {
  try {
    return JSON.parse(localStorage.getItem(BADGES_KEY)) || []
  } catch {
    return []
  }
}

// Saves a completed session and unlocks any badges newly earned by it.
// Returns { newlyUnlocked: string[] } (badge ids from BADGES above).
export function saveSession(session) {
  const sessions = getSessions()
  sessions.push(session)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))

  const unlocked = getUnlockedBadges()
  const newlyUnlocked = []

  if (sessions.length === 1 && !unlocked.includes('first-step')) {
    unlocked.push('first-step')
    newlyUnlocked.push('first-step')
  }

  if (newlyUnlocked.length > 0) {
    localStorage.setItem(BADGES_KEY, JSON.stringify(unlocked))
  }

  return { newlyUnlocked }
}
