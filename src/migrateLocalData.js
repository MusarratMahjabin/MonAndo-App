// ============================================================
// One-time migration: old browser-only data → Firestore
// ============================================================
// This app used to store sessions, badges, and the trusted contact only
// in this browser's localStorage. This copies anything found there into
// Firestore once, so nothing is lost when moving to Firestore. Safe to
// run every time the app starts — it only copies data the first time,
// then remembers (via a flag in localStorage) not to do it again.
// ============================================================

import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase.js'

const MIGRATION_FLAG_KEY = 'monando_migrated_to_firestore'
const OLD_SESSIONS_KEY = 'monando_sessions'
const OLD_BADGES_KEY = 'monando_badges'
const OLD_TRUSTED_CONTACT_KEY = 'monando_trusted_contact'

function readOldJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export async function migrateLocalDataToFirestore(uid) {
  if (localStorage.getItem(MIGRATION_FLAG_KEY) === 'true') return

  try {
    const oldSessions = readOldJSON(OLD_SESSIONS_KEY, [])
    const oldBadges = readOldJSON(OLD_BADGES_KEY, [])
    const oldTrustedContact = readOldJSON(OLD_TRUSTED_CONTACT_KEY, null)

    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    const existing = userSnap.exists() ? userSnap.data() : {}

    const batch = writeBatch(db)

    batch.set(
      userRef,
      {
        badges: existing.badges || oldBadges,
        trustedContact: existing.trustedContact ?? oldTrustedContact,
      },
      { merge: true },
    )

    for (const session of oldSessions) {
      const sessionRef = doc(collection(db, 'users', uid, 'sessions'), String(session.id))
      batch.set(sessionRef, session, { merge: true })
    }

    await batch.commit()
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true')
  } catch (err) {
    // Leave the flag unset so migration is retried next time the app
    // loads (e.g. if this failed because the device was offline).
    console.error('Local data migration to Firestore failed:', err)
  }
}
