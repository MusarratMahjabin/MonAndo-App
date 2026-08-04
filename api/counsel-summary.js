// ============================================================
// AI Reflect — closing summary (Vercel Function)
// ============================================================
// Generates the gentle wrap-up shown when a Reflect session ends: a
// score meant only as a soft, encouraging guide (never framed as a
// grade or clinical assessment) plus one warm, plain-language sentence
// — deliberately NOT the clinical-sounding "Progression/Depth" category
// system this was adapted from.
//
// Request body:
//   { "history": [{ "role": "user"|"assistant", "content": "..." }] }
// Response body:
//   { "score": 74, "summary": "You opened up about a hard week and
//     started thinking through what might help." }
// Always resolves with 200 and *some* safe summary, even if Gemini
// fails — this screen should never show broken or missing content.
// ============================================================

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

const MAX_SUMMARY_WORDS = 30

const BLOCKED_TERMS = [
  'diagnos',
  'disorder',
  'ptsd',
  'medication',
  'medicine',
  'prescri',
  'treatment',
  'therapist',
  'therapy session',
  'psychiatr',
  'psycholog',
  'doctor',
  'clinical',
  'clinician',
  'symptom',
  'panic attack',
  'mental illness',
  'condition',
  'patient',
  'score',
  'assessment',
  'diagnosis',
  'level',
]

const FALLBACK_SUMMARY = "Thanks for taking a few minutes for yourself today — that's already something."

function buildPrompt(history) {
  const conversation = history.map((m) => `${m.role === 'assistant' ? 'Companion' : 'User'}: ${m.content}`).join('\n')

  return `Read this short guided reflection conversation from a mental well-being app.

${conversation}

Write ONE warm, plain-language sentence (max ${MAX_SUMMARY_WORDS} words) that gently
reflects back what the person shared — like a caring friend noticing
something, not an evaluation. Also estimate a "presence score" from
0-100 for how openly they engaged (this is only a gentle, encouraging
guide for them to glance at, never a grade or clinical measurement).

Rules for the sentence:
- No clinical or medical words, ever.
- Do not diagnose, evaluate, or judge.
- Do not use words like "score", "level", "assessment", or "diagnosis"
  inside the sentence itself.
- Warm and specific to what they actually said, not generic.

Respond with ONLY JSON in exactly this shape:
{"score": number, "summary": "your one sentence"}`
}

function sanitizeSummary(text) {
  if (!text || typeof text !== 'string') return null
  const lower = text.toLowerCase()
  if (BLOCKED_TERMS.some((term) => lower.includes(term))) return null
  const words = text.trim().split(/\s+/)
  if (words.length > MAX_SUMMARY_WORDS) return words.slice(0, MAX_SUMMARY_WORDS).join(' ')
  return text.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST' })
    return
  }

  const { history } = req.body || {}
  if (!Array.isArray(history) || history.length === 0) {
    res.status(400).json({ error: 'Request body must include a non-empty history array' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // Still resolve gracefully — this closing screen should never break.
    res.status(200).json({ score: null, summary: FALLBACK_SUMMARY })
    return
  }

  try {
    const upstream = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(history) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      }),
    })

    if (!upstream.ok) {
      res.status(200).json({ score: null, summary: FALLBACK_SUMMARY })
      return
    }

    const data = await upstream.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = {}
    }

    const score =
      typeof parsed.score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.score))) : null
    const summary = sanitizeSummary(parsed.summary) || FALLBACK_SUMMARY

    res.status(200).json({ score, summary })
  } catch {
    res.status(200).json({ score: null, summary: FALLBACK_SUMMARY })
  }
}
