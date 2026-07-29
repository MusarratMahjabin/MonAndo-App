// ============================================================
// MonAndo Profile (Firestore)
// ============================================================
// Persists the user's chosen nickname and age group to Firestore,
// scoped to their signed-in account — collected once, during the
// profile-setup step right after Welcome.
// ============================================================

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export async function getProfile() {
  const uid = await ensureAuth()
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data().profile || null : null
}

export async function saveProfile(profile) {
  const uid = await ensureAuth()
  await setDoc(doc(db, 'users', uid), { profile }, { merge: true })
}
