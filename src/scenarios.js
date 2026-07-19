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
    aiContext: 'The user is standing at the front of a classroom, about to give a presentation while classmates watch.',
  },
  {
    id: 'hospital-visit',
    title: 'Hospital Visit',
    category: 'Medical',
    difficulty: 'Medium',
    durationMinutes: 5,
    emoji: '🏥',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784473409/IMG_8608_lrhbd5.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784478254/hospital_compressed_xazkyr.mp4',
    aiContext: 'The user is sitting in a hospital waiting room, waiting to be called in for a medical appointment.',
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
  },
]

export default scenarios
