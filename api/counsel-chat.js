// ============================================================
// AI Reflect — chat round (Vercel Function)
// ============================================================
// Powers one exchange of the "Reflect" feature's guided, 4-round
// Socratic conversation. Runs only on Vercel's servers -- GEMINI_API_KEY
// never reaches the browser.
//
// Request body:
//   { "history": [{ "role": "user"|"assistant", "content": "..." }],
//     "round": 0 }
// Response body:
//   { "ai_message": "...", "round": 1, "done": false, "flagged": false }
//   or, if the user's own message suggests real crisis:
//   { "ai_message": null, "round": 0, "done": false, "flagged": true }
// ============================================================

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

const SYSTEM_PROMPT = `You are a calm, supportive wellness companion for MonAndo.
You are NOT a therapist, doctor, or counselor. Never claim that role.
Rules:
- Never diagnose. Never use clinical or medical words.
- Never give medical or psychiatric advice.
- Speak to the present moment, plainly and warmly.
- Maximum 30 words per response. Simple, spoken-like language.
- Always end with exactly ONE warm, probing question.
- Use the Socratic method: guide the user to reflect, do not give answers.

Round structure:
1. Greeting: Warmly greet and ask what happened today.
2. Emotion: Acknowledge their situation, ask what emotions they felt.
3. Solution: Ask if they have past experience or late-coming ideas to handle it.
4. Summary: After round 3 user response, summarize their insights and close warmly. NO question.`

const ROUND_NAMES = ['greeting', 'emotion', 'solution', 'summary']

// Checked directly against what the USER types, before ever calling
// Gemini -- deterministic and instant, not dependent on the model
// correctly noticing risk in free-form conversation. Mirrors the same
// crisis keywords the mood check-in and VR companion already screen for.
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

// Defense in depth: even with a careful prompt, never trust the model's
// own reply blindly.
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

const MAX_WORDS = 30

function sanitizeMessage(text) {
  if (!text || typeof text !== 'string') return null
  const lower = text.toLowerCase()
  if (BLOCKED_TERMS.some((term) => lower.includes(term))) return null
  const words = text.trim().split(/\s+/)
  if (words.length > MAX_WORDS * 2) return words.slice(0, MAX_WORDS * 2).join(' ')
  return text.trim()
}

function buildMessages(history, round) {
  const messages = [{ role: 'user', parts: [{ text: SYSTEM_PROMPT }] }]
  for (const msg of history) {
    messages.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })
  }
  if (round < 3) {
    messages.push({
      role: 'user',
      parts: [{ text: `Continue as round ${ROUND_NAMES[round]}. End with one question.` }],
    })
  } else {
    messages.push({
      role: 'user',
      parts: [{ text: `Provide a warm summary of their insights. Close without a question.` }],
    })
  }
  return messages
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { history, round } = req.body || {}
  if (!Array.isArray(history) || typeof round !== 'number') {
    res.status(400).json({ error: 'history array and round number are required' })
    return
  }

  const lastUserMessage = [...history].reverse().find((m) => m.role === 'user')?.content || ''
  const lowerLastMessage = lastUserMessage.toLowerCase()
  if (CRISIS_KEYWORDS.some((kw) => lowerLastMessage.includes(kw))) {
    res.status(200).json({ ai_message: null, round, done: false, flagged: true })
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
        contents: buildMessages(history, round),
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.9,
        },
      }),
    })

    const data = await upstream.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const safeMessage = sanitizeMessage(raw) || "I'm here. Tell me a little more, whenever you're ready."

    res.status(200).json({
      ai_message: safeMessage,
      round: round + 1,
      done: round >= 3,
      flagged: false,
    })
  } catch {
    res.status(502).json({ error: 'Could not reach Gemini' })
  }
}
