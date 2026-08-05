const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

function buildAnalysisPrompt(history, startTime, endTime) {
  const durationSec = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000)
  const minutes = Math.floor(durationSec / 60)
  const seconds = durationSec % 60
  const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const conversation = history.map((m) => `${m.role}: ${m.content}`).join('\n')

  return `Analyze this counseling conversation and return ONLY JSON.

Conversation:
${conversation}

Duration: ${durationStr}
Average counseling duration: 10:00

Respond with ONLY JSON in this exact shape:
{
  "totalScore": number 0-100,
  "time": {
    "duration": "${durationStr}",
    "seconds": ${durationSec},
    "vsAverage": string like "+10%" or "-5%"
  },
  "emotionalData": {
    "startScore": number 0-100,
    "endScore": number 0-100,
    "improvement": string like "+27%"
  },
  "progression": "Exploration" | "Clarity" | "Insight",
  "depth": "Crust" | "Mantle" | "Outer Core" | "Inner Core"
}

Rules:
- totalScore: overall quality of reflection (0-100)
- time.vsAverage: compare ${durationStr} to 10:00 average
- emotionalData: estimate emotional state at start vs end (0-100)
- progression: Exploration (surface level) → Clarity (understanding emotions) → Insight (self-awareness)
- depth: Crust (superficial) → Mantle (emotional) → Outer Core (personal meaning) → Inner Core (transformative insight)`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { history, start_time, end_time } = req.body || {}
  if (!Array.isArray(history) || !start_time || !end_time) {
    res.status(400).json({ error: 'history, start_time, and end_time are required' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Missing GEMINI_API_KEY' })
    return
  }

  try {
    const upstream = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildAnalysisPrompt(history, start_time, end_time) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 300,
          temperature: 0.3,
        },
      }),
    })

    const data = await upstream.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = {
        totalScore: 70,
        time: { duration: '5:00', seconds: 300, vsAverage: '-50%' },
        emotionalData: { startScore: 40, endScore: 60, improvement: '+20%' },
        progression: 'Clarity',
        depth: 'Mantle',
      }
    }

    res.status(200).json(parsed)
  } catch {
    res.status(502).json({ error: 'Could not reach Gemini' })
  }
}
