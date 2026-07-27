// ============================================================
// Urban Sansa Features — Configuration File
// ============================================================
//
// This is the ONLY file you need to edit to add, remove, or update
// a feature shown on the Urban Sansa home page (the horizontally
// scrolling "More Functions" row, and the featured card at the top).
// You do not need to open or touch any other file in the project.
//
// HOW TO ADD A NEW FEATURE:
//   1. Copy one whole feature block below — everything from the
//      opening "{" to the closing "},".
//   2. Paste the copy just above the closing "]" at the bottom of
//      this file.
//   3. Change the values inside the copy (see the Field Guide below).
//   4. Give it a new, unique "id" (no spaces — use dashes instead).
//   5. Save the file. It will show up in the app automatically.
//
// ------------------------------------------------------------
// FIELD GUIDE — what each line means:
//
//   id               A short unique code, no spaces (dashes are OK).
//   title            The name shown to the user, e.g. "Morning Meditation"
//   category         A short label shown during the session, e.g. "Meditation"
//   durationSeconds  Length of the session in seconds. Just a number,
//                     no quotes — e.g. 220 for 3 minutes 40 seconds.
//   audioUrl         Link to the guided audio for this session. See
//                     below for how to add one.
//   backgroundImage  Link to a full-screen photo shown while this
//                     session plays.
//   overlayTint      A hex colour matching the mood of the background
//                     image — used to gently tint it so text stays
//                     readable, same as the Music & ASMR player.
//
// HOW TO ADD AN AUDIO FILE OR BACKGROUND IMAGE:
//   If it's hosted on Cloudinary (or another link-based service), copy
//   its URL and paste it between the quotes for audioUrl (or
//   backgroundImage for a photo). Keep the quotes — just replace
//   what's between them.
// ============================================================

const urbanSansaFeatures = [
  {
    id: 'morning-meditation',
    title: 'Morning Meditation',
    category: 'Meditation',
    durationSeconds: 220,
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#33402a',
  },
  {
    id: 'evening-meditation',
    title: 'Evening Meditation',
    category: 'Meditation',
    durationSeconds: 300,
    audioUrl: '', // <-- PASTE the audio file's URL here
    backgroundImage: '', // <-- PASTE the background image's URL here
    overlayTint: '#242b24',
  },
]

export default urbanSansaFeatures
