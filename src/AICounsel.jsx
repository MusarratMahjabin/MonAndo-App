import { useEffect, useRef, useState } from 'react'
import { getRecentCounselSessions, saveCounselSession } from './counselStore.js'
import { useNickname } from './useNickname.js'

const FETCH_TIMEOUT_MS = 8_000
const ROUND_LABELS = ['Share', 'Feel', 'Reflect', 'Wrap up']
const TEXTAREA_MAX_HEIGHT = 116

const SUGGESTION_META = {
  music: { label: 'Music & ASMR', icon: '🎵', screen: 'music', color: 'var(--tile-teal)' },
  vr: { label: 'VR Therapy', icon: '🥽', screen: 'list', color: 'var(--tile-terracotta)' },
  urbansansa: { label: 'Urban Sansa', icon: '🏙️', screen: 'urbansansa', color: 'var(--tile-olive)' },
}

const FALLBACK_SUMMARY = {
  score: null,
  dimensions: { openness: null, awareness: null, reflection: null },
  themes: [],
  summary: "Thanks for taking a few minutes for yourself today — that's already something.",
  suggestion: null,
}

function formatDuration(seconds) {
  if (typeof seconds !== 'number') return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function BackChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11.5 3.5L6 9L11.5 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.5 8L14.5 2L9.5 14L7.5 9L1.5 8Z" />
    </svg>
  )
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

// One retry for the same transient 429/502/503 errors the VR companion
// already handles this way, since this hits the same Gemini model.
async function postJson(url, body) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        FETCH_TIMEOUT_MS,
      )
      if (res.ok) return await res.json()
      console.error(`${url} failed:`, res.status)
      if (attempt === 0 && [429, 502, 503].includes(res.status)) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        continue
      }
      return null
    } catch (err) {
      console.error(`${url} failed:`, err)
      return null
    }
  }
  return null
}

function AICounsel({ onBack, onFlagDistress, onNavigate }) {
  const nickname = useNickname()
  const [round, setRound] = useState(0)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(true)
  const [summary, setSummary] = useState(null)
  const [startTime] = useState(() => Date.now())
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, loading])

  // Let the input grow with multi-line messages instead of scrolling
  // its own text sideways.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`
  }, [input])

  // Kick off the opening greeting on mount, generated the same way as
  // every other line — not a hardcoded string — so it goes through the
  // same safety sanitizing as the rest of the conversation.
  useEffect(() => {
    let cancelled = false
    postJson('/api/counsel-chat', { history: [], round: 0 }).then((data) => {
      if (cancelled) return
      const greeting = data?.message || "Hi — what's on your mind today?"
      setHistory([{ role: 'assistant', content: greeting }])
      setRound(data?.round ?? 1)
      setStarting(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const finishSession = async (finalHistory) => {
    const durationSeconds = Math.round((Date.now() - startTime) / 1000)
    const exchangeCount = finalHistory.filter((m) => m.role === 'user').length

    const [result, recentSessions] = await Promise.all([
      postJson('/api/counsel-summary', { history: finalHistory }),
      getRecentCounselSessions(1).catch(() => []),
    ])
    const finalSummary = result || FALLBACK_SUMMARY
    const previousSession = recentSessions[0] || null

    setSummary({ ...finalSummary, previousSession, exchangeCount, durationSeconds })
    saveCounselSession({
      history: finalHistory,
      score: finalSummary.score,
      dimensions: finalSummary.dimensions,
      themes: finalSummary.themes,
      summary: finalSummary.summary,
      suggestion: finalSummary.suggestion,
      durationSeconds,
    }).catch((err) => console.error('Failed to save Reflect session:', err))
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newHistory = [...history, { role: 'user', content: text }]
    setHistory(newHistory)
    setLoading(true)

    const data = await postJson('/api/counsel-chat', { history: newHistory, round })
    setLoading(false)

    if (!data) {
      setHistory((h) => [
        ...h,
        { role: 'assistant', content: "I couldn't quite catch that — could you try again?" },
      ])
      return
    }

    if (data.flagged) {
      onFlagDistress?.()
      return
    }

    const finalHistory = [...newHistory, { role: 'assistant', content: data.message }]
    setHistory(finalHistory)
    setRound(data.round)

    if (data.done) {
      finishSession(finalHistory)
    }
  }

  if (summary) {
    const dims = summary.dimensions || {}
    const prevDims = summary.previousSession?.dimensions || {}
    const dimCards = [
      { key: 'openness', label: 'Openness', value: dims.openness, prev: prevDims.openness },
      { key: 'awareness', label: 'Awareness', value: dims.awareness, prev: prevDims.awareness },
      { key: 'reflection', label: 'Reflection', value: dims.reflection, prev: prevDims.reflection },
    ]
      .filter((d) => typeof d.value === 'number')
      .map((d) => ({ ...d, delta: typeof d.prev === 'number' ? d.value - d.prev : null }))

    const previousScore = typeof summary.previousSession?.score === 'number' ? summary.previousSession.score : null
    const scoreTrend = typeof summary.score === 'number' && previousScore !== null ? summary.score - previousScore : null

    const previousDuration = summary.previousSession?.durationSeconds
    const timeDelta =
      typeof previousDuration === 'number' && previousDuration > 0
        ? Math.round(((summary.durationSeconds - previousDuration) / previousDuration) * 100)
        : null
    const timeDeltaText =
      timeDelta === null
        ? null
        : timeDelta === 0
          ? 'Same length as last time'
          : timeDelta < 0
            ? `${Math.abs(timeDelta)}% quicker than last time`
            : `${timeDelta}% longer than last time`

    const meta = summary.suggestion && SUGGESTION_META[summary.suggestion.category]

    return (
      <div className="counsel-screen">
        <div className="counsel-header">
          <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
            <BackChevron />
          </button>
          <h1 className="counsel-title">Reflect</h1>
        </div>

        <div className="counsel-end">
          <p className="counsel-end-eyebrow">TODAY'S REFLECTION</p>
          <h2 className="counsel-end-done">Done!</h2>

          {summary.score !== null && (
            <div className="counsel-score-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(26,26,26,0.08)" strokeWidth="7" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--tile-periwinkle)"
                  strokeWidth="7"
                  strokeDasharray={`${summary.score * 2.64} 264`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="counsel-score-ring-text">
                <div className="counsel-score-number">{summary.score}%</div>
                <div className="counsel-score-ring-label">Total Score</div>
              </div>
            </div>
          )}
          <p className="counsel-score-caption">Just a gentle guide — not a test.</p>

          {scoreTrend !== null && scoreTrend !== 0 && (
            <div className={`counsel-trend ${scoreTrend > 0 ? 'is-up' : 'is-down'}`}>
              {scoreTrend > 0 ? `▲ ${scoreTrend} vs. last time` : `▼ ${Math.abs(scoreTrend)} vs. last time`}
            </div>
          )}

          <p className="counsel-end-thanks">
            {nickname ? `Thank you, ${nickname}.` : 'Thank you for taking this time.'}
          </p>
          <p className="counsel-end-summary">{summary.summary}</p>

          <div className="counsel-stat-grid">
            <div className="counsel-stat-card grain">
              <div className="counsel-stat-label">Time</div>
              <div className="counsel-stat-value">{formatDuration(summary.durationSeconds)}</div>
              {timeDeltaText && <p className="counsel-stat-caption">{timeDeltaText}</p>}
            </div>
            {dimCards.map((d) => (
              <div className="counsel-stat-card grain" key={d.key}>
                <div className="counsel-stat-label">{d.label}</div>
                <div className="counsel-stat-value">{d.value}%</div>
                {d.delta !== null && d.delta !== 0 && (
                  <p className={`counsel-stat-caption counsel-stat-delta ${d.delta > 0 ? 'is-up' : 'is-down'}`}>
                    {d.delta > 0 ? `▲ ${d.delta} pts` : `▼ ${Math.abs(d.delta)} pts`} vs. last time
                  </p>
                )}
              </div>
            ))}
          </div>

          {summary.themes?.length > 0 && (
            <div className="counsel-themes">
              {summary.themes.map((t) => (
                <span className="counsel-theme-chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="counsel-stats">
            <span>💬 {summary.exchangeCount} {summary.exchangeCount === 1 ? 'exchange' : 'exchanges'}</span>
          </div>

          {meta && (
            <div className="counsel-suggestion">
              <span className="counsel-suggestion-icon" style={{ background: meta.color }}>
                {meta.icon}
              </span>
              <div className="counsel-suggestion-body">
                <div className="counsel-suggestion-label">{meta.label}</div>
                <p className="counsel-suggestion-text">{summary.suggestion.text}</p>
              </div>
              {onNavigate && (
                <button
                  className="counsel-suggestion-btn"
                  type="button"
                  onClick={() => onNavigate(meta.screen)}
                >
                  Try →
                </button>
              )}
            </div>
          )}

          <button className="counsel-done-btn" type="button" onClick={onBack}>
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="counsel-screen">
      <div className="counsel-header">
        <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
          <BackChevron />
        </button>
        <h1 className="counsel-title">Reflect</h1>
      </div>
      <p className="counsel-subtitle">A question, not advice.</p>

      <div className="counsel-progress">
        {ROUND_LABELS.map((label, i) => (
          <div
            key={label}
            className={`counsel-progress-step${i < round ? ' is-done' : ''}${i === round ? ' is-current' : ''}`}
          >
            <span className="counsel-progress-dot" />
            <span className="counsel-progress-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="counsel-chat" ref={scrollRef}>
        {starting && (
          <div className="counsel-bubble counsel-bubble-assistant counsel-bubble-loading">
            <span className="counsel-dot" />
            <span className="counsel-dot" />
            <span className="counsel-dot" />
          </div>
        )}
        {history.map((m, i) => (
          <div key={i} className={`counsel-bubble counsel-bubble-${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="counsel-bubble counsel-bubble-assistant counsel-bubble-loading">
            <span className="counsel-dot" />
            <span className="counsel-dot" />
            <span className="counsel-dot" />
          </div>
        )}
      </div>

      <div className="counsel-input-bar">
        <textarea
          ref={textareaRef}
          className="counsel-input"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Type what's on your mind…"
          disabled={loading || starting}
        />
        <button
          className="counsel-send"
          type="button"
          onClick={sendMessage}
          disabled={loading || starting || !input.trim()}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

export default AICounsel
