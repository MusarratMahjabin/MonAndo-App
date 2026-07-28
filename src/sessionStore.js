// ============================================================
// MonAndo Session Storage (Firestore)
// ============================================================
// Persists completed VR session data (SUDS before/after, rating,
// what helped) and unlocked badges to Firestore, scoped to this
// device's signed-in (anonymous) account — so progress survives
// across devices instead of being stuck in one browser.
// ============================================================

import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export const BADGES = {
  'first-step': {
    emoji: '🌱',
    title: 'First Step',
    desc: 'Complete your first VR session',
  },
}

export async function getSessions() {
  const uid = await ensureAuth()
  const snap = await getDocs(collection(db, 'users', uid, 'sessions'))
  return snap.docs.map((d) => d.data()).sort((a, b) => a.id - b.id)
}

export async function getUnlockedBadges() {
  const uid = await ensureAuth()
  const userSnap = await getDoc(doc(db, 'users', uid))
  return userSnap.exists() ? userSnap.data().badges || [] : []
}

// Saves a completed session and unlocks any badges newly earned by it.
// Returns { newlyUnlocked: string[] } (badge ids from BADGES above).
export async function saveSession(session) {
  const uid = await ensureAuth()

  await setDoc(doc(db, 'users', uid, 'sessions', String(session.id)), session)

  const sessions = await getSessions()
  const unlocked = await getUnlockedBadges()
  const newlyUnlocked = []

  if (sessions.length === 1 && !unlocked.includes('first-step')) {
    unlocked.push('first-step')
    newlyUnlocked.push('first-step')
  }

  if (newlyUnlocked.length > 0) {
    await setDoc(doc(db, 'users', uid), { badges: unlocked }, { merge: true })
  }

  return { newlyUnlocked }
}
