// ============================================================
// AI Voice Companion — server-side Gemini call (Vercel Function)
// ============================================================
// Generates ONE short spoken line to accompany a VR practice session.
// Runs only on Vercel's servers — GEMINI_API_KEY never reaches the
// browser. The frontend calls POST /api/companion with the current
// scenario + how far into the session the user is; this returns either
// a line to speak, or a "flagged" signal meaning: don't try to help
// with a cheerful line here — route the user to SOS instead.
//
// Request body:
//   { "scenarioTitle": "Exam Hall", "scenarioContext": "The user is seated
//     at a desk in a silent exam hall, about to begin a timed exam.",
//     "difficulty": "Hard", "elapsedSeconds": 42, "durationMinutes": 10 }
//   ("scenarioContext" is optional — falls back to just the title if a
//   scenario doesn't define one.)
// Response body:
//   { "line": "You're here, and that's enough for now.", "flagged": false }
//   or, when the model judges this isn't a moment for a cheerful line:
//   { "line": null, "flagged": true }
// ============================================================

// Using the "flash-lite-latest" alias rather than a pinned version like
// "gemini-2.5-flash" — Google blocks that exact model id for new API
// keys/projects ("no longer available to new users"). The non-lite
// "flash-latest" alias also works, but currently points to a heavier
// model that spends its whole token budget on hidden reasoning before
// answering (with no way to turn that off), which silently truncated
// every single-line response. The "lite" alias produces the same short
// line with zero hidden reasoning tokens — a better fit for this task.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

const MAX_WORDS = 15

// Defense in depth: even with a carefully written prompt, never trust an
// LLM's output blindly in a mental-health-adjacent app. If the model
// slips and uses clinical/medical language anyway, the line is discarded
// server-side rather than ever reaching the user.
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

function sessionPhase(elapsedSeconds, totalSeconds) {
  if (elapsedSeconds < 60) return 'opening'
  if (totalSeconds - elapsedSeconds <= 60) return 'closing'
  return 'middle'
}

function buildPrompt({ scenarioTitle, scenarioContext, difficulty, elapsedSeconds, durationMinutes }) {
  const totalSeconds = Math.max(durationMinutes, 1) * 60
  const phase = sessionPhase(elapsedSeconds, totalSeconds)

  return `You are a calm, supportive companion voice inside a VR exposure-practice app.

You are NOT a therapist, doctor, or counselor. Never claim or imply that role.

Rules — follow all of these exactly, every time:
- Never diagnose anything. Never use clinical or medical words (examples of
  words you must never use: diagnosis, disorder, PTSD, symptom, condition,
  panic attack, medication, treatment, therapy, therapist, doctor, clinical).
- Never give medical or psychiatric advice.
- Speak only to the present moment, plainly — e.g. "you're here, and that's
  enough for now." Do not interpret, analyze, or explain what the person is
  feeling.
- The scenario description below is only so you understand the setting.
  Do not narrate, describe, or list details of the scene back to the user.
- Maximum ${MAX_WORDS} words. Warm, plain, simple, spoken-out-loud language.
- Match the tone to the session phase given below:
  - "opening" (first minute): welcoming, easing them in gently.
  - "middle": steady, quietly encouraging, low-key.
  - "closing" (final minute): gently wrapping up, preparing them to finish.
- If the difficulty is "Hard" and the phase is "closing" — meaning this is a
  long, hard scenario right near the end — treat this as a moment that may
  call for real support rather than a cheerful line. In that case, do not
  write a line at all; instead set "flagged" to true.

Session context:
- Scenario: "${scenarioTitle}"${scenarioContext ? ` — ${scenarioContext}` : ''}
- Difficulty: ${difficulty}
- Session phase: ${phase}
- Elapsed: ${Math.round(elapsedSeconds)} seconds of ${totalSeconds} seconds total

Respond with ONLY JSON, no other text, in exactly this shape:
{"line": "your short spoken line", "flagged": false}
or, if flagging instead of writing a line:
{"line": null, "flagged": true}`
}

export function sanitizeLine(line) {
  if (!line || typeof line !== 'string') return null

  const lower = line.toLowerCase()
  if (BLOCKED_TERMS.some((term) => lower.includes(term))) return null

  const words = line.trim().split(/\s+/)
  if (words.length > MAX_WORDS) return words.slice(0, MAX_WORDS).join(' ')

  return line.trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST' })
    return
  }

  const { scenarioTitle, scenarioContext, difficulty, elapsedSeconds, durationMinutes } = req.body || {}
  if (
    typeof scenarioTitle !== 'string' ||
    typeof difficulty !== 'string' ||
    typeof elapsedSeconds !== 'number' ||
    typeof durationMinutes !== 'number'
  ) {
    res.status(400).json({
      error:
        'Request body must include scenarioTitle (string), difficulty (string), ' +
        'elapsedSeconds (number), and durationMinutes (number)',
    })
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
        contents: [
          {
            parts: [
              {
                text: buildPrompt({
                  scenarioTitle,
                  scenarioContext,
                  difficulty,
                  elapsedSeconds,
                  durationMinutes,
                }),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 150,
          temperature: 0.9,
        },
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || 'Gemini request failed' })
      return
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = { line: null, flagged: false }
    }

    if (parsed.flagged) {
      res.status(200).json({ line: null, flagged: true })
      return
    }

    const safeLine = sanitizeLine(parsed.line)
    res.status(200).json({ line: safeLine, flagged: false })
  } catch {
    res.status(502).json({ error: 'Could not reach Gemini' })
  }
}
