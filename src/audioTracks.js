// ============================================================
// MonAndo Audio Tracks — Configuration File
// ============================================================
//
// This is the ONLY file you need to edit to add, remove, or update
// an audio track (Music & ASMR, Sleep sounds, Meditation guides,
// Nature sounds, etc). You do not need to open or touch any other
// file in the project.
//
// HOW TO ADD A NEW TRACK:
//   1. Copy one whole track block below — everything from the
//      opening "{" to the closing "},".
//   2. Paste the copy just above the closing "]" at the bottom of
//      this file.
//   3. Change the values inside the copy (see the Field Guide below).
//   4. Give it a new, unique "id" (no spaces — use dashes instead,
//      e.g. "ocean-waves-at-night").
//   5. Save the file. It will show up in the app automatically.
//
// HOW TO EDIT AN EXISTING TRACK:
//   Just change the text between the quotes for whichever field you
//   want to update, then save the file.
//
// HOW TO REMOVE A TRACK:
//   Delete its whole block, from its opening "{" to the "}," that follows it.
//
// ------------------------------------------------------------
// FIELD GUIDE — what each line means:
//
//   id               A short unique code, no spaces (dashes are OK).
//                     Used internally — the user never sees it.
//   title            The track name shown to the user, e.g. "Rain on Tin Roof"
//   artist           Who made it, or where it's from, e.g. "MonAndo Sound Library"
//   category         Must be exactly one of:
//                       "Calm Restore", "Focus Zone", "Sleep Hub",
//                       "ASMR", "Meditation", "Nature"
//   durationSeconds  Length of the track in seconds. Just a number,
//                     no quotes — e.g. 600 for a 10-minute track.
//   moodTags         A list of moods this track fits, in square brackets,
//                     each one in quotes — e.g. ["calm", "sleep"]
//                     Use as many or as few as fit.
//   coverColor       A hex colour used as the tint for this track's cover
//                     art, e.g. "#6E9FB5". Just a placeholder look — pick
//                     any colour you like.
//   audioUrl         Link to the audio file. See below for how to add one.
//   backgroundImage  Link to a full-screen photo shown while this track
//                     plays, e.g. a photo of rain or a forest. See below
//                     for how to add one.
//   overlayTint      A hex colour that matches the mood of the background
//                     image, e.g. "#2C3E4A". It's used to gently tint the
//                     image so text stays readable on top of it.
//
// HOW TO ADD AN AUDIO FILE OR BACKGROUND IMAGE:
//   If your file is hosted on Cloudinary (or another link-based service),
//   copy its URL and paste it between the quotes — it looks like:
//   https://res.cloudinary.com/your-cloud-name/video/upload/v123/rain.mp3
//   (for audioUrl) or .../image/upload/v123/rain-photo.jpg (for
//   backgroundImage). Keep the quotes — just replace what's between them.
// ============================================================

const audioTracks = [
  {
    id: 'rain-on-tin-roof',
    title: 'Rain on Tin Roof',
    artist: 'MonAndo Sound Library',
    category: 'Nature',
    durationSeconds: 1200,
    moodTags: ['calm', 'sleep'],
    coverColor: '#6E9FB5',
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#2C3E4A',
  },
  {
    id: 'river-at-dusk',
    title: 'River at Dusk',
    artist: 'MonAndo Sound Library',
    category: 'Nature',
    durationSeconds: 900,
    moodTags: ['calm'],
    coverColor: '#3E5C76',
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#3D4A3A',
  },
  {
    id: 'forest-morning',
    title: 'Forest Morning',
    artist: 'MonAndo Sound Library',
    category: 'Nature',
    durationSeconds: 720,
    moodTags: ['calm', 'focus'],
    coverColor: '#6B8E5A',
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#2F4032',
  },
  {
    id: 'slow-breath-guide',
    title: 'Slow Breath Guide',
    artist: 'MonAndo Sound Library',
    category: 'Meditation',
    durationSeconds: 600,
    moodTags: ['calm'],
    coverColor: '#A8A5D9',
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#3A3A4A',
  },
  {
    id: 'distant-thunder',
    title: 'Distant Thunder',
    artist: 'MonAndo Sound Library',
    category: 'Sleep Hub',
    durationSeconds: 1800,
    moodTags: ['sleep'],
    coverColor: '#2B2F45',
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#262B33',
  },
  {
    id: 'soft-wind-chimes',
    title: 'Soft Wind Chimes',
    artist: 'MonAndo Sound Library',
    category: 'ASMR',
    durationSeconds: 900,
    moodTags: ['calm', 'sleep'],
    coverColor: '#D9C6E0',
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#4A4238',
  },
]

export default audioTracks
