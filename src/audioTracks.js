// ============================================================
// MonAndo Audio Tracks — Configuration File
// ============================================================
//

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
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830940/10_Minutes_Rain_on_Tin_Roof_Sound_for_Sleeping_No_Ads_Fall_Asleep_Fast_with_Rain_Sounds_-_Quran_iab3qn.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832432/8c93835e-dba7-4b70-9429-560570d17e53_lljvz5.jpg', // <-- PASTE the background image's URL here
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
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830395/Sunset_River_Ambience_Relaxing_Nature_Sounds_15_Minutes_-_stillAwake_Rain_Sounds_yvdg4p.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832432/42752628-1f26-4fc6-b5e1-f1631c7a7dbd_p75sco.jpg', // <-- PASTE the background image's URL here
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
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830437/Short_10_Min_Nature_Sounds_Meditation_-_Relaxing_Forest_Morning_Birds_Chirping_-_Calm_Sleeping_Sound_-_johnnielawson_emz4fq.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832432/05cbd234-fbfa-4ae5-a111-8d04d32fa00b_zxcgim.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#2F4032',
  },
  
  {
    id: 'singing-bowl-meditation',
    title: 'Singing Bowl Meditation',
    artist: 'MonAndo Sound Library',
    category: 'Meditation Hub',
    durationSeconds: 1800,
    moodTags: ['meditation', 'relax', 'healing'],
    coverColor: '#D4AF37',
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830797/528_Hz_Singing_bowl_13_minute_sound_meditation_with_an_antique_Himalayan_Mani_bowl_-_Sound-and-Silence_l0jgpl.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832432/26cb03df-741d-4a6a-b826-efd794724cab_jtsvhg.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#4B3E2F',
  },
  {
    id: 'stream-flowing-rocks',
    title: 'Stream Flowing Over Rocks',
    artist: 'MonAndo Sound Library',
    category: 'Nature Sounds',
    durationSeconds: 1800,
    moodTags: ['relax', 'focus', 'nature'],
    coverColor: '#4A6B5C',
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830516/Natural_Forest_Stream_Flowing_Over_Rocks_Gentle_Flowing_Water_Sounds_10_Minutes_-_StreamWindFlow_bkv6w9.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832432/e0e97f7b-a010-4e0c-bf20-a01b244b6dec_bzuzz5.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#2E3D35',
  },
  {
    id: 'flipping-old-book-pages-asmr',
    title: 'Flipping Old Book Pages ASMR',
    artist: 'MonAndo Sound Library',
    category: 'ASMR',
    durationSeconds: 1800,
    moodTags: ['focus', 'study', 'tingles'],
    coverColor: '#8C7053',
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830589/ASMR_Flipping_through_Children_s_Book_-_Tracing_-_No_Talk_-_Petit_Sucre_Blau_ua3vqe.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832431/a1e0460b-f1f9-49e7-8982-df5e56d3f25c_yzawgi.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#4A3B2C',
  },
  {
    id: 'fireflies-and-crickets',
    title: 'Fireflies and Crickets',
    artist: 'MonAndo Sound Library',
    category: 'Sleep Hub',
    durationSeconds: 1800,
    moodTags: ['sleep', 'relax', 'night'],
    coverColor: '#1A2421',
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830568/Cricket_ASMR_Sound_15_mins_Relaxing_sound_Sound_for_sleeping_-_Trend_Seeker_b4rrgn.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832431/8f95a8dc-979f-43f5-bb04-a6697c3efc4c_sbybhg.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#0F1412',
  },
  {
    id: 'binaural-beats',
    title: 'Binaural Beats',
    artist: 'MonAndo Sound Library',
    category: 'Focus Hub',
    durationSeconds: 1800,
    moodTags: ['focus', 'study', 'deep-work'],
    coverColor: '#483D8B',
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785832742/Binaural_Beats_-_Jody_Hatton_s_Videos_1_t1trlr.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785833055/05a8e6f5-1372-4c6e-af1a-5af5244df7e6_neeg74.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#2C2559',
  },
  
  {
    id: 'soft-wind-chimes',
    title: 'Soft Wind Chimes',
    artist: 'MonAndo Sound Library',
    category: 'ASMR',
    durationSeconds: 900,
    moodTags: ['calm', 'sleep'],
    coverColor: '#D9C6E0',
    audioUrl: 'https://res.cloudinary.com/lszcugmx/video/upload/v1785830473/Relaxing_Wind_Chime_Sounds_-_CHRIS10077_pwnu0p.mp3', // <-- PASTE the audio file's URL here
    backgroundImage: 'https://res.cloudinary.com/lszcugmx/image/upload/v1785832432/e94742f9-e4a4-4103-8a3b-c1167cc95ab8_vcsejm.jpg', // <-- PASTE the background image's URL here
    overlayTint: '#4A4238',
  },
]

export default audioTracks
