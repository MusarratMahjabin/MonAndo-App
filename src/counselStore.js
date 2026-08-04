// ============================================================
// MonAndo Reflect Sessions (Firestore)
// ============================================================
// Persists completed Reflect (AI counsel) sessions — the conversation
// and its closing summary — to Firestore, scoped to this device's
// signed-in account, same private per-user pattern as VR sessions and
// mood check-ins.
// ============================================================

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export async function saveCounselSession({ history, score, summary, durationSeconds }) {
  const uid = await ensureAuth()
  await addDoc(collection(db, 'users', uid, 'counselSessions'), {
    history,
    score: score ?? null,
    summary,
    durationSeconds,
    createdAt: serverTimestamp(),
  })
}
