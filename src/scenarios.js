// ============================================================
// MonAndo VR Scenarios — Configuration File
// ============================================================

//
// IMPORTANT — for videoUrl, add "q_auto/" right after "upload/":


const scenarios = [
  {
    id: 'class-presentation',
    title: 'Class Presentation',
    category: 'Performance',
    difficulty: 'Medium',
    durationMinutes: 5,
    moodTags: ['anxious', 'stressed'],
    emoji: '🎤',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785559469/IMG_8786_y2ujni.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1785558826/public_speaking_5_min_bjwus4.mp4',
    aiContext: 'The user is standing at the front and about to give a presentation, classmates watching',
    aiFallbackLines: {
      opening: "You're standing where you meant to stand. That's already something.",
      middle: "Their eyes are on the slides as much as you. Keep going.",
      closing: 'You stayed at the front the whole time. Notice that.',
    },
  },
 
  {
    id: 'exam-hall',
    title: 'Exam Hall',
    category: 'Performance',
    difficulty: 'Hard',
    durationMinutes: 10,
    moodTags: ['anxious', 'stressed'],
    emoji: '📝',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784473384/IMG_8610_y970u2.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784471559/Exam_Practice_ftmwjd.mp4',
    aiContext: 'The user is seated at a desk in a silent exam hall, about to begin a timed exam.',
    aiFallbackLines: {
      opening: 'The quiet before it starts is often the loudest part. Breathe.',
      middle: 'The clock is doing its job. So are you, one question at a time.',
      closing: 'You sat through the silence and the pressure both. Notice that.',
    },
  },
  {
    id: 'flight-anxiety',
    title: 'Flight Anxiety',
    category: 'Travel',
    difficulty: 'Hard',
    durationMinutes: 7,
    moodTags: ['anxious'],
    emoji: '✈️',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784828862/IMG_8684_cnqtpq.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784833944/Flightcom25.5_rrbgtp.mp4',
    aiContext: 'The user is seated in the economy class of a commercial airplane preparing for takeoff, experiencing engine noises, mild vibrations, and standard cabin announcements.',
    aiFallbackLines: {
      opening: "That vibration is the engine, not a warning. You're okay.",
      middle: "You're above it now, steady in your seat. The hum is just noise.",
      closing: 'You stayed in your seat through takeoff. That took something real.',
    },
  },
  {
    id: 'public-bus',
    title: 'Public Bus',
    category: 'Public Transit',
    difficulty: 'Medium',
    durationMinutes: 5,
    moodTags: ['anxious', 'stressed'],
    emoji: '🚌',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784828854/IMG_8682_gugfx8.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784834220/Bus2com28_rl0zrf.mp4',
    aiContext: 'The user is standing inside a moving, moderately crowded public city bus, holding onto a handrail while passengers board and disembark at various stops.',
    aiFallbackLines: {
      opening: 'Hold the rail. Let the movement be movement, nothing more.',
      middle: "People get on and off around you. You don't have to track them all.",
      closing: "You rode the whole way standing. Notice you're still steady.",
    },
  },
  {
    id: 'job-interview',
    title: 'Job Interview',
    category: 'Professional',
    difficulty: 'Hard',
    durationMinutes: 3,
    moodTags: ['anxious', 'stressed'],
    emoji: '💼',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785559429/IMG_8785_pdwbdn.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1785558976/360_VR_Job_Interview_Demo_-_Prototype_-_Socius_XR_1080p_h264_aalotw.mp4',
    aiContext: 'The user is sitting across a desk from a hiring manager in a quiet corporate office, being asked a series of professional questions in a formal interview setting.',
    aiFallbackLines: {
      opening: "Sit back in the chair. You're allowed a breath before answering.",
      middle: "One question at a time. You don't owe them a perfect answer.",
      closing: "You sat across from them and stayed. That's the win here.",
    },
  },
  {
    id: 'natural-relaxation',
    title: 'Natural Relaxation',
    category: 'Relaxation',
    difficulty: 'Easy',
    durationMinutes: 4,
    moodTags: ['calm', 'happy', 'sad', 'stressed'],
    emoji: '🌲',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784828871/IMG_8683_dmbqdy.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1784829138/Relax_com25_d4jqg5.mp4',
    aiContext: 'The user is resting in a peaceful, lush green forest clearing near a gentle stream, surrounded by calming nature sounds, birdsong, and soft sunlight.',
    aiFallbackLines: {
      opening: 'Nothing is asked of you here. Just let your shoulders drop.',
      middle: 'The stream keeps moving so you don\'t have to. Just rest here.',
      closing: 'This calm is yours to return to, whenever you need it.',
    },
  },
  {
    id: 'crowded-street',
    title: 'Crowded Street',
    category: 'Public Spaces',
    difficulty: 'Medium',
    durationMinutes: 3,
    moodTags: ['anxious', 'stressed'],
    emoji: '🏙️',
    thumbnailUrl: 'https://res.cloudinary.com/lszcugmx/image/upload/v1784899110/IMG_8689_t4jntg.png',
    videoUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/q_auto/v1785560453/Strret_3_Min_com26_iavbuv.mp4',
    aiContext: 'The user is navigating through a bustling downtown pedestrian street during rush hour, surrounded by people walking quickly in all directions and ambient city noise.',
    aiFallbackLines: {
      opening: "The crowd has its own current. You don't have to fight it.",
      middle: 'Let the noise stay in the background. Your next step is what matters.',
      closing: 'You moved through it at your own pace. That matters.',
    },
  },
]

export default scenarios
