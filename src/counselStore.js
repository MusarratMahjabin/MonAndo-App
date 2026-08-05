// ============================================================
// MonAndo Reflect Sessions (Firestore)
// ============================================================
// Persists completed Reflect (AI counseling) sessions -- the
// conversation and its analysis -- to Firestore, scoped to this
// device's signed-in (anonymous) account.
// ============================================================

import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export async function saveCounselingSession({ history, analysis, startTime, endTime }) {
  const uid = await ensureAuth()
  await addDoc(collection(db, 'users', uid, 'counselSessions'), {
    history,
    analysis,
    startTime,
    endTime,
    createdAt: serverTimestamp(),
  })
}
