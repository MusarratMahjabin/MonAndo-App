import { useEffect, useState } from 'react'
import { getProfile } from './profileStore.js'

// Fetches the signed-in user's chosen nickname once, for screens that
// greet the user by name. Empty string until loaded or if none is set.
export function useNickname() {
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((profile) => {
        if (!cancelled) setNickname(profile?.nickname || '')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return nickname
}
