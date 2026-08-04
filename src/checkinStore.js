// ============================================================
// MonAndo Mood Check-Ins (Firestore)
// ============================================================
// Saves each daily mood check-in (mood, concern tags, optional note)
// to Firestore, scoped to this device's signed-in (anonymous) account.
// Read back by the Home screen's mood-based recommendation.
// ============================================================

import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export async function saveCheckIn({ mood, concerns, note }) {
  const uid = await ensureAuth()
  await addDoc(collection(db, 'users', uid, 'checkins'), {
    mood,
    concerns,
    note: note || '',
    createdAt: serverTimestamp(),
  })
}

// Most recent check-ins, newest first.
export async function getRecentCheckIns(count = 5) {
  const uid = await ensureAuth()
  const q = query(
    collection(db, 'users', uid, 'checkins'),
    orderBy('createdAt', 'desc'),
    limit(count),
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => doc.data())
}
