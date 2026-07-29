// ============================================================
// MonAndo VR Scenarios — Configuration File
// ============================================================
//
// This is the ONLY file you need to edit to add, remove, or update
// a VR practice scenario. You do not need to open or touch any
// other file in the project.
//
// HOW TO ADD A NEW SCENARIO:
//   1. Copy one whole scenario block below — everything from the
//      opening "{" to the closing "},".
//   2. Paste the copy just above the closing "]" at the bottom of
//      this file.
//   3. Change the values inside the copy (see the Field Guide below).
//   4. Give it a new, unique "id" (no spaces — use dashes instead,
//      e.g. "airport-security").
//   5. Save the file. It will show up in the app automatically.
//
// HOW TO EDIT AN EXISTING SCENARIO:
//   Just change the text between the quotes for whichever field you
//   want to update, then save the file.
//
// HOW TO REMOVE A SCENARIO:
//   Delete its whole block, from its opening "{" to the "}," that follows it.
//
// ------------------------------------------------------------
// FIELD GUIDE — what each line means:
//
//   id               A short unique code, no spaces (dashes are OK).
//                     Used internally — the user never sees it.
//   title            The name shown to the user, e.g. "Class Presentation"
//   category         Must be exactly one of:
//                       "Social", "Performance", "Phobia", "Medical", "Calm"
//   difficulty       Must be exactly one of: "Easy", "Medium", "Hard"
//   durationMinutes  Length of the video in minutes. Just a number,
//                     no quotes, no "min" — e.g. 10
//   emoji            One emoji used as this scenario's icon, e.g. "🎤"
//   thumbnailUrl     Link to a small preview image, from Cloudinary.
//   videoUrl         Link to the 360° video, from Cloudinary.
//   aiContext        One short sentence describing the situation, written
//                     so the AI companion understands what the user is
//                     about to face.
//   aiFallbackLines  { opening, closing } — one guaranteed line for the
//                     start and one for the end of the session, spoken
//                     ONLY if the live AI call fails (no internet, API
//                     down, etc). Mid-session lines have no fallback —
//                     they're always generated live from aiContext.
//                     Keep the same pattern as the built-in scenarios:
//                     ground the body, normalize the feeling, affirm
//                     the moment.
//
// HOW TO GET A CLOUDINARY LINK:
//   Open the video or image in your Cloudinary dashboard, click it,
//   and copy the "URL" it shows you — it looks like:
//   https://res.cloudinary.com/your-cloud-name/video/upload/v1234567890/classroom.mp4
//   Paste that whole link between the quotes for videoUrl (or thumbnailUrl
//   for an image). Keep the quotes — just replace what's between them.
//
// IMPORTANT — for videoUrl, add "q_auto/" right after "upload/":
//   https://res.cloudinary.com/your-cloud-name/video/upload/q_auto/v1234567890/classroom.mp4
//   Without this, the video can take much longer to start playing (or get
//   stuck) on phones, because Cloudinary otherwise sends the raw, un-
//   optimized file it was originally uploaded as. "q_auto" tells Cloudinary
//   to send a smaller, phone-friendly version that starts playing quickly.
// ============================================================

const scenarios = [
  {
    id: 'class-presentation',
    title: 'Class Presentation',
    category: 'Performance',
    difficulty: 'Medium',
    durationMinutes: 10,
    emoji: '🎤',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784473399/IMG_8609_fcqxuc.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784471349/public_speaking_uwgu6y.mp4',
    aiContext: 'The user is standing at the front and about to give a presentation, classmates watching',
    aiFallbackLines: {
      opening: "You're standing where you meant to stand. That's already something.",
      closing: 'You stayed at the front the whole time. Notice that.',
    },
  },
  {
    id: 'hospital-visit',
    title: 'Hospital Visit',
    category: 'Medical',
    difficulty: 'Hard',
    durationMinutes: 5,
    emoji: '🏥',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784473409/IMG_8608_lrhbd5.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784478254/hospital_compressed_xazkyr.mp4',
    aiContext: 'The user is entering an operating room for the first time for abdominal pain.',
    aiFallbackLines: {
      opening: 'This room is unfamiliar. Your body is allowed to notice that.',
      closing: "You walked into the room you were afraid of. That's real courage.",
    },
  },
  {
    id: 'exam-hall',
    title: 'Exam Hall',
    category: 'Performance',
    difficulty: 'Hard',
    durationMinutes: 10,
    emoji: '📝',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784473384/IMG_8610_y970u2.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784471559/Exam_Practice_ftmwjd.mp4',
    aiContext: 'The user is seated at a desk in a silent exam hall, about to begin a timed exam.',
    aiFallbackLines: {
      opening: 'The quiet before it starts is often the loudest part. Breathe.',
      closing: 'You sat through the silence and the pressure both. Notice that.',
    },
  },
  {
    id: 'flight-anxiety',
    title: 'Flight Anxiety',
    category: 'Travel',
    difficulty: 'Hard',
    durationMinutes: 7,
    emoji: '✈️',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784828862/IMG_8684_cnqtpq.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784833944/Flightcom25.5_rrbgtp.mp4',
    aiContext: 'The user is seated in the economy class of a commercial airplane preparing for takeoff, experiencing engine noises, mild vibrations, and standard cabin announcements.',
    aiFallbackLines: {
      opening: "That vibration is the engine, not a warning. You're okay.",
      closing: 'You stayed in your seat through takeoff. That took something real.',
    },
  },
  {
    id: 'public-bus',
    title: 'Public Bus',
    category: 'Public Transit',
    difficulty: 'Medium',
    durationMinutes: 5,
    emoji: '🚌',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/q_auto/v1784828854/IMG_8682_gugfx8.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1784834220/Bus2com28_rl0zrf.mp4',
    aiContext: 'The user is standing inside a moving, moderately crowded public city bus, holding onto a handrail while passengers board and disembark at various stops.',
    aiFallbackLines: {
      opening: 'Hold the rail. Let the movement be movement, nothing more.',
      closing: "You rode the whole way standing. Notice you're still steady.",
    },
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    category: 'Professional',
    difficulty: 'Hard',
    durationMinutes: 3,
    emoji: '💼',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784828853/IMG_8680_mh3oxl.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784834930/job_fi_eh3wpd.mp4',
    aiContext: 'The user is sitting across a desk from a hiring manager in a quiet corporate office, being asked a series of professional questions in a formal interview setting.',
    aiFallbackLines: {
      opening: "Sit back in the chair. You're allowed a breath before answering.",
      closing: "You sat across from them and stayed. That's the win here.",
    },
  },
  {
    id: 'natural-relaxation',
    title: 'Natural Relaxation',
    category: 'Relaxation',
    difficulty: 'Easy',
    durationMinutes: 4,
    emoji: '🌲',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784828871/IMG_8683_dmbqdy.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784829138/Relax_com25_d4jqg5.mp4',
    aiContext: 'The user is resting in a peaceful, lush green forest clearing near a gentle stream, surrounded by calming nature sounds, birdsong, and soft sunlight.',
    aiFallbackLines: {
      opening: 'Nothing is asked of you here. Just let your shoulders drop.',
      closing: 'This calm is yours to return to, whenever you need it.',
    },
  },
  {
    id: 'crowded-street',
    title: 'Crowded Street',
    category: 'Public Spaces',
    difficulty: 'Medium',
    durationMinutes: 5,
    emoji: '🏙️',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784899110/IMG_8689_t4jntg.png',
    videoUrl: '',
    aiContext: 'The user is navigating through a bustling downtown pedestrian street during rush hour, surrounded by people walking quickly in all directions and ambient city noise.',
    aiFallbackLines: {
      opening: "The crowd has its own current. You don't have to fight it.",
      closing: 'You moved through it at your own pace. That matters.',
    },
  },
]

export default scenarios
