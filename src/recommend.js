// ============================================================
// MonAndo Home Recommendation Engine
// ============================================================
// Picks the single "recommended for you" card shown at the top of
// Home, based on real signals instead of a hardcoded scenario:
//
//   1. A same-session Reflect suggestion (from api/counsel-summary.js)
//      is the freshest, most personalized signal — it was generated
//      from the person's own words minutes or hours ago.
//   2. Otherwise, the most recent mood check-in picks a matching VR
//      scenario, Urban Sansa, or a calming track.
//   3. Otherwise (new user, no data yet), a gentle Easy-difficulty
//      default welcomes them in.
//
// Everything here is plain data-driven matching — no AI call, no
// clinical framing, just "here's something that fits how you said
// you're feeling."
// ============================================================

import { useEffect, useState } from 'react'
import scenarios from './scenarios.js'
import audioTracks from './audioTracks.js'
import { getRecentCheckIns } from './checkinStore.js'
import { getRecentCounselSessions } from './counselStore.js'
import { getSessions } from './sessionStore.js'

const RECENT_MS = 48 * 60 * 60 * 1000 // how long a Reflect suggestion stays "fresh"

const MOOD_LABELS = {
  happy: 'feeling happy',
  calm: 'feeling calm',
  stressed: 'feeling stressed',
  anxious: 'feeling anxious',
  sad: 'feeling low',
}

// audioTracks.js uses its own tag vocabulary (calm/sleep/focus/...),
// separate from CheckIn's mood ids — this bridges the two.
const MOOD_MUSIC_TAGS = {
  stressed: ['calm', 'relax'],
  anxious: ['calm', 'relax'],
  sad: ['calm', 'relax', 'healing'],
  happy: ['focus', 'nature'],
  calm: ['focus', 'meditation'],
}

const DEFAULT_RECOMMENDATION = buildScenarioRecommendation(
  scenarios.find((s) => s.id === 'natural-relaxation') || scenarios[0],
  '✦ A GOOD PLACE TO START',
  'A gentle, easy scene to get a feel for how Reflect and VR Therapy work together.',
)

function toDate(timestamp) {
  return typeof timestamp?.toDate === 'function' ? timestamp.toDate() : null
}

function isRecent(timestamp) {
  const date = toDate(timestamp)
  return !!date && Date.now() - date.getTime() < RECENT_MS
}

function buildScenarioRecommendation(scenario, label, desc) {
  return {
    type: 'vr',
    scenario,
    label,
    title: scenario.title,
    desc,
    pills: ['VR', scenario.difficulty, `${scenario.durationMinutes} min`],
  }
}

function buildTrackRecommendation(track, label, desc) {
  return {
    type: 'music',
    track,
    label,
    title: track.title,
    desc,
    pills: ['Music', track.category, `${Math.round(track.durationSeconds / 60)} min`],
  }
}

function buildUrbanSansaRecommendation(label, desc) {
  return {
    type: 'urbansansa',
    label,
    title: 'Urban Sansa',
    desc,
    pills: ['Ambient Space'],
  }
}

function pickScenarioForMood(mood, completedIds) {
  const tagged = scenarios.filter((s) => s.moodTags?.includes(mood))
  const pool = tagged.length > 0 ? tagged : scenarios
  const fresh = pool.filter((s) => !completedIds.has(s.id))
  return (fresh.length > 0 ? fresh : pool)[0]
}

const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 }

// For a steady/good mood: the next not-yet-completed scenario, easiest
// first — so the recommendation naturally climbs in difficulty over
// time as earlier ones get completed, rather than always repeating
// the one Easy scenario.
function pickProgressionScenario(completedIds) {
  const uncompleted = scenarios.filter((s) => !completedIds.has(s.id))
  const pool = uncompleted.length > 0 ? uncompleted : scenarios
  return [...pool].sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty])[0]
}

function pickTrackForMood(mood) {
  const tags = MOOD_MUSIC_TAGS[mood] || ['calm']
  return audioTracks.find((t) => t.moodTags.some((tag) => tags.includes(tag))) || audioTracks[0]
}

function recommendationFromSuggestion(suggestion, mood, completedIds) {
  const label = '✦ FROM YOUR LAST REFLECTION'
  if (suggestion.category === 'music') {
    return buildTrackRecommendation(pickTrackForMood(mood), label, suggestion.text)
  }
  if (suggestion.category === 'urbansansa') {
    return buildUrbanSansaRecommendation(label, suggestion.text)
  }
  if (suggestion.category === 'vr') {
    return buildScenarioRecommendation(pickScenarioForMood(mood, completedIds), label, suggestion.text)
  }
  return null
}

function recommendationFromMood(mood, completedIds) {
  const moodLabel = MOOD_LABELS[mood]
  if (!moodLabel) return null

  if (mood === 'stressed' || mood === 'anxious') {
    const scenario = pickScenarioForMood(mood, completedIds)
    return buildScenarioRecommendation(
      scenario,
      `✦ SINCE YOU'RE ${moodLabel.toUpperCase()}`,
      'A gentle, scaffolded practice scene — a small, steady step, nothing more.',
    )
  }
  if (mood === 'sad') {
    return buildUrbanSansaRecommendation(
      `✦ SINCE YOU'RE ${moodLabel.toUpperCase()}`,
      'A quiet ambient space to just be for a few minutes — nothing to do here but breathe.',
    )
  }
  // happy / calm — a good state to build on, so nudge toward progress.
  const scenario = pickProgressionScenario(completedIds)
  return buildScenarioRecommendation(
    scenario,
    '✦ KEEP THE MOMENTUM',
    "You're in a steady place today — a good time to try what's next.",
  )
}

export async function getHomeRecommendation() {
  const [checkins, reflectSessions, vrSessions] = await Promise.all([
    getRecentCheckIns(1).catch(() => []),
    getRecentCounselSessions(1).catch(() => []),
    getSessions().catch(() => []),
  ])

  const latestCheckin = checkins[0] || null
  const latestReflect = reflectSessions[0] || null
  const mood = latestCheckin?.mood
  const completedIds = new Set(vrSessions.map((s) => s.scenarioId))

  if (latestReflect?.suggestion && isRecent(latestReflect.createdAt)) {
    const fromReflect = recommendationFromSuggestion(latestReflect.suggestion, mood, completedIds)
    if (fromReflect) return fromReflect
  }

  if (mood && mood !== 'crisis') {
    const fromMood = recommendationFromMood(mood, completedIds)
    if (fromMood) return fromMood
  }

  return DEFAULT_RECOMMENDATION
}

// Starts with the same gentle default shown to brand-new users, then
// swaps in the real, data-driven pick once Firestore resolves — no
// loading skeleton needed since the default is a legitimate pick too.
export function useHomeRecommendation() {
  const [recommendation, setRecommendation] = useState(DEFAULT_RECOMMENDATION)

  useEffect(() => {
    let cancelled = false
    getHomeRecommendation()
      .then((rec) => {
        if (!cancelled) setRecommendation(rec)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return recommendation
}
