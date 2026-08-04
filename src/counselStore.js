// ============================================================
// MonAndo Reflect Sessions (Firestore)
// ============================================================
// Persists completed Reflect (AI counsel) sessions — the conversation
// and its closing summary — to Firestore, scoped to this device's
// signed-in account, same private per-user pattern as VR sessions and
// mood check-ins.
// ============================================================

import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export async function saveCounselSession({ history, score, dimensions, themes, summary, suggestion, durationSeconds }) {
  const uid = await ensureAuth()
  await addDoc(collection(db, 'users', uid, 'counselSessions'), {
    history,
    score: score ?? null,
    dimensions: dimensions ?? null,
    themes: themes ?? [],
    summary,
    suggestion: suggestion ?? null,
    durationSeconds,
    createdAt: serverTimestamp(),
  })
}

// Most recent completed sessions, newest first — used to show how a
// just-finished session's score compares to earlier ones.
export async function getRecentCounselSessions(count = 5) {
  const uid = await ensureAuth()
  const q = query(
    collection(db, 'users', uid, 'counselSessions'),
    orderBy('createdAt', 'desc'),
    limit(count),
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => doc.data())
}
