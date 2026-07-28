// ============================================================
// MonAndo Mood Check-Ins (Firestore)
// ============================================================
// Saves each daily mood check-in (mood, concern tags, optional note)
// to Firestore, scoped to this device's signed-in (anonymous) account.
// This is the history the future mood-analysis feature will read from.
// ============================================================

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
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
