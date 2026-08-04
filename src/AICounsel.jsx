import { useEffect, useRef, useState } from 'react'
import { saveCounselSession } from './counselStore.js'
import { useNickname } from './useNickname.js'

const FETCH_TIMEOUT_MS = 8_000

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

function AICounsel({ onBack, onFlagDistress }) {
  const nickname = useNickname()
  const [round, setRound] = useState(0)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(true)
  const [summary, setSummary] = useState(null)
  const [startTime] = useState(() => Date.now())
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, loading])

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
    const result = await postJson('/api/counsel-summary', { history: finalHistory })
    const finalSummary = result || {
      score: null,
      summary: "Thanks for taking a few minutes for yourself today — that's already something.",
    }
    setSummary(finalSummary)
    saveCounselSession({
      history: finalHistory,
      score: finalSummary.score,
      summary: finalSummary.summary,
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
    return (
      <div className="counsel-screen">
        <button className="profile-back" type="button" aria-label="Back" onClick={onBack}>
          <BackChevron />
        </button>

        <div className="counsel-end">
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
              <div className="counsel-score-number">{summary.score}</div>
            </div>
          )}
          <p className="counsel-score-caption">Just a gentle guide — not a test.</p>

          <h1 className="counsel-end-title">
            Thank you for reflecting today{nickname ? `, ${nickname}` : ''}.
          </h1>
          <p className="counsel-end-summary">{summary.summary}</p>

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

      <div className="counsel-chat" ref={scrollRef}>
        {starting && <div className="counsel-bubble counsel-bubble-assistant counsel-bubble-loading">…</div>}
        {history.map((m, i) => (
          <div key={i} className={`counsel-bubble counsel-bubble-${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="counsel-bubble counsel-bubble-assistant counsel-bubble-loading">…</div>}
      </div>

      <div className="counsel-input-bar">
        <input
          className="counsel-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
