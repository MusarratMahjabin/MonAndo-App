import { useCallback, useRef, useState } from 'react'

const FADE_MS = 1000
const FADE_STEPS = 20

export function useAudioPlayer() {
  const audioRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio()
      audio.addEventListener('ended', () => setIsPlaying(false))
      audioRef.current = audio
    }
    return audioRef.current
  }

  const clearFade = () => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
  }

  const fadeIn = (audio) => {
    clearFade()
    audio.volume = 0
    let step = 0
    fadeTimerRef.current = setInterval(() => {
      step += 1
      audio.volume = Math.min(1, step / FADE_STEPS)
      if (step >= FADE_STEPS) clearFade()
    }, FADE_MS / FADE_STEPS)
  }

  const play = useCallback((track) => {
    setCurrentTrack(track)

    if (!track.audioUrl) {
      // No audio file added yet — reflect the selection but play nothing.
      setIsPlaying(false)
      return
    }

    const audio = getAudio()
    if (audio.src !== track.audioUrl) {
      audio.src = track.audioUrl
    }
    fadeIn(audio)
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [])

  const pause = useCallback(() => {
    clearFade()
    if (audioRef.current) audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(
    (track) => {
      if (currentTrack?.id === track.id && isPlaying) {
        pause()
      } else {
        play(track)
      }
    },
    [currentTrack, isPlaying, play, pause],
  )

  return { currentTrack, isPlaying, play, pause, toggle }
}
