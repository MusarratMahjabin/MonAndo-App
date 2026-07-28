// ============================================================
// Firebase — App, Auth, and Firestore setup
// ============================================================
// Reads your project's config from environment variables (see .env,
// created from .env.example) rather than hardcoding it in source.
//
// Two ways to sign in, both offered on the Welcome screen:
//   - Continue as Guest → anonymous account, data stays tied to this
//     device/browser only.
//   - Sign in with Google → a real account, so the same data follows
//     you across devices.
// Either way, Firestore documents are scoped to the signed-in uid.
// See firestore.rules for the security rules that enforce this.
// ============================================================

import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

// Resolves once Firebase has checked whether this device already has a
// signed-in session saved from a previous visit — resolves to that user,
// or null if nobody has chosen "Guest" or "Google" here yet.
export function getInitialUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject,
    )
  })
}

export function signInAsGuest() {
  return signInAnonymously(auth)
}

export async function signInWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider)
  } catch (err) {
    // Some mobile browsers block or don't support popups — fall back to
    // a full-page redirect flow in those cases only.
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      return signInWithRedirect(auth, googleProvider)
    }
    throw err
  }
}

// Used internally by the data-store modules (sessionStore, trustedContact,
// checkinStore) — waits for whichever sign-in the user already completed
// on the Welcome screen, then returns their uid.
let authReadyPromise = null

export function ensureAuth() {
  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            unsubscribe()
            resolve(user.uid)
          }
        },
        reject,
      )
    })
  }
  return authReadyPromise
}
