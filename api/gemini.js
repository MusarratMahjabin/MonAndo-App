// ============================================================
// Server-side Gemini proxy (Vercel Serverless Function)
// ============================================================
// This file runs only on Vercel's servers, never in the browser — so
// GEMINI_API_KEY (set in Vercel → Settings → Environment Variables,
// no "VITE_" prefix) stays private. The frontend calls this endpoint
// at POST /api/gemini instead of ever talking to Google directly.
//
// Request body:  { "prompt": "some text" }
// Response body: { "text": "Gemini's reply" }
// ============================================================

// Using the "flash-lite-latest" alias rather than a pinned version like
// "gemini-2.5-flash" — Google blocks that exact model id for new API
// keys/projects ("no longer available to new users"). The non-lite
// "flash-latest" alias also works, but currently points to a model that
// spends its token budget on hidden reasoning before answering, which
// can silently truncate short responses. "flash-lite-latest" doesn't
// have that problem — swap this if a future use of this endpoint
// specifically needs deeper reasoning.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST' })
    return
  }

  const { prompt } = req.body || {}
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Request body must include a "prompt" string' })
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
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    const data = await upstream.json()

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.error?.message || 'Gemini request failed' })
      return
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    res.status(200).json({ text })
  } catch {
    res.status(502).json({ error: 'Could not reach Gemini' })
  }
}
