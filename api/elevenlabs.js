// ============================================================
// Server-side ElevenLabs proxy (Vercel Serverless Function)
// ============================================================
// This file runs only on Vercel's servers, never in the browser — so
// ELEVENLABS_API_KEY (set in Vercel → Settings → Environment Variables,
// no "VITE_" prefix) stays private. The frontend calls this endpoint
// at POST /api/elevenlabs instead of ever talking to ElevenLabs directly.
//
// Request body:  { "text": "some text to speak", "voiceId": "optional" }
// Response:       raw MP3 audio (Content-Type: audio/mpeg)
// ============================================================

// "Sarah" — one of this account's premade voices, used unless a specific
// voiceId is passed in the request body. (The old "Rachel" default,
// 21m00Tcm4TlvDq8ikWAM, is no longer in this account's available voice
// list and returns a 402 if used.)
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST' })
    return
  }

  const { text, voiceId } = req.body || {}
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Request body must include a "text" string' })
    return
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ELEVENLABS_API_KEY' })
    return
  }

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || DEFAULT_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
        }),
      },
    )

    if (!upstream.ok) {
      const errText = await upstream.text()
      res.status(upstream.status).json({ error: errText || 'ElevenLabs request failed' })
      return
    }

    const audioBuffer = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', 'audio/mpeg')
    res.status(200).send(audioBuffer)
  } catch {
    res.status(502).json({ error: 'Could not reach ElevenLabs' })
  }
}
