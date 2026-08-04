// ============================================================
// AI Reflect — closing summary (Vercel Function)
// ============================================================
// Generates the gentle wrap-up shown when a Reflect session ends: an
// overall "presence score" plus three soft sub-scores, a couple of
// theme tags, one warm plain-language sentence, and a gentle
// suggestion pointing at another part of the app — all meant only as
// an encouraging guide (never framed as a grade or clinical
// assessment).
//
// Request body:
//   { "history": [{ "role": "user"|"assistant", "content": "..." }] }
// Response body:
//   {
//     "score": 74,
//     "dimensions": { "openness": 80, "awareness": 65, "reflection": 70 },
//     "themes": ["exams", "sleep"],
//     "summary": "You opened up about a hard week and started
//                  thinking through what might help.",
//     "suggestion": { "category": "music", "text": "A calming track
//                      might help before you next sit down to study." }
//   }
// Always resolves with 200 and *some* safe content, even if Gemini
// fails — this screen should never show broken or missing content.
// ============================================================

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

const MAX_SUMMARY_WORDS = 30
const MAX_SUGGESTION_WORDS = 22
const MAX_THEMES = 4
const MAX_THEME_WORDS = 3
const SUGGESTION_CATEGORIES = ['music', 'vr', 'urbansansa']

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
const FALLBACK_SUGGESTION = {
  category: 'music',
  text: 'A few minutes of calming sound could be a gentle next step.',
}

function buildPrompt(history) {
  const conversation = history.map((m) => `${m.role === 'assistant' ? 'Companion' : 'User'}: ${m.content}`).join('\n')

  return `Read this short guided reflection conversation from a mental well-being app.

${conversation}

Respond with ONLY JSON in exactly this shape, nothing else:
{
  "score": number,
  "dimensions": { "openness": number, "awareness": number, "reflection": number },
  "themes": ["short tag", "short tag"],
  "summary": "one sentence",
  "suggestion": { "category": "music" | "vr" | "urbansansa", "text": "one short sentence" }
}

Field guidance:
- "score" (0-100): a gentle "presence" score for how openly they engaged
  overall. Only ever a soft, encouraging guide — never a grade.
- "dimensions" (each 0-100): "openness" = how freely they shared;
  "awareness" = how clearly they named their own feelings; "reflection"
  = how much they considered their own past experience or ideas.
- "themes": 1-3 short lowercase tags (1-2 words each) naming what the
  conversation was actually about (e.g. "exams", "sleep", "friendship").
  No clinical or diagnostic words.
- "summary": ONE warm, plain-language sentence (max ${MAX_SUMMARY_WORDS}
  words) that gently reflects back what they shared — like a caring
  friend noticing something, not an evaluation.
- "suggestion": pick whichever category (music = calming soundscapes,
  vr = a gentle VR practice scene, urbansansa = a calm ambient city
  space) best fits what they shared, and write one short warm sentence
  (max ${MAX_SUGGESTION_WORDS} words) on why it might help right now.

Rules that apply to every piece of text above:
- No clinical or medical words, ever.
- Do not diagnose, evaluate, or judge.
- Do not use the words "score", "level", "assessment", or "diagnosis"
  inside any sentence.
- Warm and specific to what they actually said, not generic.`
}

function containsBlockedTerm(text) {
  const lower = text.toLowerCase()
  return BLOCKED_TERMS.some((term) => lower.includes(term))
}

function sanitizeSentence(text, maxWords) {
  if (!text || typeof text !== 'string') return null
  if (containsBlockedTerm(text)) return null
  const words = text.trim().split(/\s+/)
  if (words.length > maxWords) return words.slice(0, maxWords).join(' ')
  return text.trim()
}

function clampScore(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : null
}

function sanitizeDimensions(raw) {
  if (!raw || typeof raw !== 'object') return { openness: null, awareness: null, reflection: null }
  return {
    openness: clampScore(raw.openness),
    awareness: clampScore(raw.awareness),
    reflection: clampScore(raw.reflection),
  }
}

function sanitizeThemes(raw) {
  if (!Array.isArray(raw)) return []
  const clean = []
  for (const item of raw) {
    if (typeof item !== 'string' || !item.trim()) continue
    if (containsBlockedTerm(item)) continue
    const words = item.trim().toLowerCase().split(/\s+/).slice(0, MAX_THEME_WORDS)
    clean.push(words.join(' '))
    if (clean.length >= MAX_THEMES) break
  }
  return clean
}

function sanitizeSuggestion(raw) {
  if (!raw || typeof raw !== 'object') return FALLBACK_SUGGESTION
  const category = SUGGESTION_CATEGORIES.includes(raw.category) ? raw.category : FALLBACK_SUGGESTION.category
  const text = sanitizeSentence(raw.text, MAX_SUGGESTION_WORDS) || FALLBACK_SUGGESTION.text
  return { category, text }
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

  const fallbackResponse = {
    score: null,
    dimensions: { openness: null, awareness: null, reflection: null },
    themes: [],
    summary: FALLBACK_SUMMARY,
    suggestion: FALLBACK_SUGGESTION,
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    // Still resolve gracefully — this closing screen should never break.
    res.status(200).json(fallbackResponse)
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
          maxOutputTokens: 350,
          temperature: 0.7,
        },
      }),
    })

    if (!upstream.ok) {
      res.status(200).json(fallbackResponse)
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

    res.status(200).json({
      score: clampScore(parsed.score),
      dimensions: sanitizeDimensions(parsed.dimensions),
      themes: sanitizeThemes(parsed.themes),
      summary: sanitizeSentence(parsed.summary, MAX_SUMMARY_WORDS) || FALLBACK_SUMMARY,
      suggestion: sanitizeSuggestion(parsed.suggestion),
    })
  } catch {
    res.status(200).json(fallbackResponse)
  }
}
