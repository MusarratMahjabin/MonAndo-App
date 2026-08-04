// ============================================================
// AI Reflect — chat round (Vercel Function)
// ============================================================
// Powers one exchange of the "Reflect" feature's guided, 4-round
// conversation. Runs only on Vercel's servers — GEMINI_API_KEY never
// reaches the browser.
//
// Request body:
//   { "history": [{ "role": "user"|"assistant", "content": "..." }],
//     "round": 0 }
// Response body:
//   { "message": "...", "round": 1, "done": false, "flagged": false }
//   or, if the user's own message suggests real crisis:
//   { "message": null, "round": 0, "done": false, "flagged": true }
// ============================================================

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

const MAX_WORDS = 30
const TOTAL_ROUNDS = 4
const ROUND_NAMES = ['greeting', 'emotion', 'solution', 'summary']

// Checked directly against what the USER types, before ever calling
// Gemini — deterministic and instant, not dependent on the model
// correctly noticing risk in free-form conversation. Mirrors the same
// crisis keywords the mood check-in already screens for.
const CRISIS_KEYWORDS = [
  'suicid',
  'self-harm',
  'self harm',
  'kill myself',
  'end my life',
  'end it all',
  "don't want to be here",
  'do not want to be here',
  'want to die',
  'not worth living',
  'hurt myself',
  'no reason to live',
]

// Same defense-in-depth principle as the VR companion: even with a
// careful prompt, never trust the model's own reply blindly.
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
]

const SYSTEM_PROMPT = `You are a calm, supportive companion inside a mental well-being app called MonAndo.

You are NOT a therapist, doctor, or counselor. Never claim or imply that role.

Rules — follow all of these exactly, every time:
- Never diagnose anything. Never use clinical or medical words (examples of
  words you must never use: diagnosis, disorder, PTSD, symptom, condition,
  panic attack, medication, treatment, therapy, therapist, doctor, clinical).
- Never give medical or psychiatric advice.
- Use the Socratic method: guide the person to reflect for themselves.
  Never hand them a solution or tell them what to do.
- Maximum ${MAX_WORDS} words. Warm, plain, simple, conversational language.
- Follow this 4-round structure:
  1. Greeting: warmly ask what's on their mind today.
  2. Emotion: acknowledge what they shared, ask what emotions came up.
  3. Solution: ask if they have past experience or their own ideas for
     handling it — never suggest one yourself.
  4. Summary: warmly reflect back what they shared. Do not ask a question
     this round.
- Every round except the Summary round must end with exactly ONE warm,
  open question.`

function sanitizeMessage(text) {
  if (!text || typeof text !== 'string') return null
  const lower = text.toLowerCase()
  if (BLOCKED_TERMS.some((term) => lower.includes(term))) return null
  const words = text.trim().split(/\s+/)
  if (words.length > MAX_WORDS * 2) return words.slice(0, MAX_WORDS * 2).join(' ')
  return text.trim()
}

function buildContents(history, round) {
  const contents = [{ role: 'user', parts: [{ text: SYSTEM_PROMPT }] }]
  for (const msg of history) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })
  }
  const instruction =
    round < TOTAL_ROUNDS - 1
      ? `Continue as round "${ROUND_NAMES[round]}". End with one warm question.`
      : `This is the Summary round. Warmly reflect back what they shared. Do not ask a question.`
  contents.push({ role: 'user', parts: [{ text: instruction }] })
  return contents
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST' })
    return
  }

  const { history, round } = req.body || {}
  if (!Array.isArray(history) || typeof round !== 'number') {
    res.status(400).json({ error: 'Request body must include a history array and round number' })
    return
  }

  const lastUserMessage = [...history].reverse().find((m) => m.role === 'user')?.content || ''
  const lowerLastMessage = lastUserMessage.toLowerCase()
  if (CRISIS_KEYWORDS.some((kw) => lowerLastMessage.includes(kw))) {
    res.status(200).json({ message: null, round, done: false, flagged: true })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' })
    return
  }

  try {
    const upstream = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: buildContents(history, round),
        generationConfig: { maxOutputTokens: 200, temperature: 0.9 },
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || 'Gemini request failed' })
      return
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const safeMessage = sanitizeMessage(raw) || "I'm here. Tell me a little more, whenever you're ready."

    res.status(200).json({
      message: safeMessage,
      round: round + 1,
      done: round >= TOTAL_ROUNDS - 1,
      flagged: false,
    })
  } catch {
    res.status(502).json({ error: 'Could not reach Gemini' })
  }
}
