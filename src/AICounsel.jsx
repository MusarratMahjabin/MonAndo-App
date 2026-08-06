import { useState } from 'react'
import './AICounsel.css'
import { saveCounselingSession } from './counselStore.js'

function AICounsel({ onBack, onFlagDistress }) {
  const [round, setRound] = useState(0)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [startTime] = useState(new Date().toISOString())

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    setLoading(true)

    const userMsg = { role: 'user', content: input }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setInput('')

    try {
      const res = await fetch('/api/counsel-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newHistory, round }),
      })
      const data = await res.json()

      if (data.flagged) {
        onFlagDistress?.()
        return
      }

      const aiMsg = { role: 'assistant', content: data.ai_message }
      setHistory((h) => [...h, aiMsg])
      setRound(data.round)
      setDone(data.done)

      if (data.done) {
        await analyzeSession([...newHistory, aiMsg])
      }
    } catch (err) {
      console.error('Counsel error:', err)
    } finally {
      setLoading(false)
    }
  }

  const analyzeSession = async (fullHistory) => {
    const endTime = new Date().toISOString()
    try {
      const res = await fetch('/api/counsel-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: fullHistory,
          start_time: startTime,
          end_time: endTime,
        }),
      })
      const data = await res.json()
      setAnalysis(data)

      await saveCounselingSession({
        history: fullHistory,
        analysis: data,
        startTime,
        endTime,
      })
    } catch (err) {
      console.error('Analysis error:', err)
    }
  }

  if (analysis) {
    return (
      <div className="counsel-screen">
        <div className="counsel-header">
          <button className="counsel-back" type="button" onClick={onBack} aria-label="Back">
            ✕
          </button>
          <h2>Reflect</h2>
        </div>

        <div className="counsel-done-card">
          <h3 style={{ color: 'white', textAlign: 'center', fontWeight: 400, fontSize: '20px', marginBottom: '24px' }}>
            Today's Reflect Done!
          </h3>

          <div className="counsel-score-ring">
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#4ecdc4"
                strokeWidth="6"
                strokeDasharray={`${analysis.totalScore * 2.64} 264`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="counsel-score-text">
              <div className="counsel-score-number">{analysis.totalScore}%</div>
              <div className="counsel-score-label">Total Score</div>
            </div>
          </div>

          <div className="counsel-metrics-grid">
            <MetricCard
              label="Time"
              value={analysis.time?.duration}
              change={analysis.time?.vsAverage}
              sub={`${analysis.time?.vsAverage} than average`}
            />
            <MetricCard
              label="Emotional Data"
              value={`${analysis.emotionalData?.endScore}%`}
              change={analysis.emotionalData?.improvement}
              sub={`${analysis.emotionalData?.improvement} from the start`}
            />
            <MetricCard
              label="Progression"
              main={analysis.progression}
              sub={`From Exploration To ${analysis.progression}!`}
            />
            <MetricCard
              label="Depth"
              main={analysis.depth}
              sub={`From Crust To ${analysis.depth}!`}
            />
          </div>

          <button className="counsel-ok-btn" onClick={onBack}>
            OK
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="counsel-screen">
      <div className="counsel-header">
        <button className="counsel-back" type="button" onClick={onBack} aria-label="Back">
          ✕
        </button>
        <h2>Reflect</h2>
      </div>
      <div className="counsel-chat">
        {history.map((msg, i) => (
          <div key={i} className={`counsel-bubble counsel-bubble-${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="counsel-bubble counsel-bubble-ai">...</div>}
      </div>
      {!done && (
        <div className="counsel-input-bar">
          <input
            className="counsel-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="feel free to type your thoughts..."
          />
          <button className="counsel-send-btn" onClick={sendMessage} disabled={loading}>
            send
          </button>
        </div>
      )}
      {done && !analysis && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>Analyzing...</div>
      )}
    </div>
  )
}

function MetricCard({ label, value, main, change, sub }) {
  const changeClass = change && String(change).startsWith('+') ? 'positive' : 'negative'
  return (
    <div className="counsel-metric-card">
      <div className="counsel-metric-label">{label}</div>
      {value && <div className="counsel-metric-value">{value}</div>}
      {main && <div className="counsel-metric-main">{main}</div>}
      {change && <div className={`counsel-metric-change ${changeClass}`}>{change}</div>}
      {sub && <div className="counsel-metric-sub">{sub}</div>}
    </div>
  )
}

export default AICounsel
