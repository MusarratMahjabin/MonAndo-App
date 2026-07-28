// ============================================================
// MonAndo Trusted Contact (Firestore)
// ============================================================
// Persists the user's personal trusted contact (name + phone number)
// to Firestore, scoped to this device's signed-in (anonymous) account —
// so it's remembered across devices instead of being stuck in one
// browser.
// ============================================================

import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, ensureAuth } from './firebase.js'

export async function getTrustedContact() {
  const uid = await ensureAuth()
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data().trustedContact || null : null
}

export async function saveTrustedContact(contact) {
  const uid = await ensureAuth()
  await setDoc(doc(db, 'users', uid), { trustedContact: contact }, { merge: true })
}
