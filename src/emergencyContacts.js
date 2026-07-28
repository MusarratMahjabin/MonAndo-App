// ============================================================
// Emergency (SOS) Contacts — Configuration File
// ============================================================
//
// This is the ONLY file you need to edit to add, remove, or update
// the helplines and services shown on the SOS screen. The numbers
// below are PLACEHOLDERS — replace them with real ones before this
// screen goes live. You do not need to open or touch any other file
// in the project.
//
// HOW TO ADD A NEW CONTACT:
//   1. Copy one whole contact block below — everything from the
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
//   id            A short unique code, no spaces (dashes are OK).
//   countryCode   A short code shown next to the country name,
//                  e.g. "BD", "KR", or "INTL" for international.
//   countryLabel  The country/region name shown in small caps,
//                  e.g. "Bangladesh", "South Korea", "International"
//   name          The service's name, e.g. "Kaan Pete Roi"
//   detail        A short line under the name, e.g. the number and
//                  hours: "9612 119911 · 24/7 confidential"
//   icon          Must be exactly "phone" or "globe" — phone for a
//                  number you can call, globe for a directory/website.
//   accentColor   A hex colour for this contact's icon and button,
//                  e.g. "#F2705C". Pick any colour you like.
//   actionType    Must be exactly "call" or "link".
//                  "call" shows a "Call" button and dials `phone`.
//                  "link" shows an "Open" button and opens `url`.
//   phone         Only used when actionType is "call". The number to
//                  dial, e.g. "+8809612119911" (include the country's
//                  "+" code so it dials correctly from any phone).
//   url           Only used when actionType is "link". The website to
//                  open, e.g. "https://www.iasp.info/resources/Crisis_Centres/"
//
// ============================================================

const emergencyContacts = [
  {
    id: 'kaan-pete-roi',
    countryCode: 'BD',
    countryLabel: 'Bangladesh',
    name: 'Kaan Pete Roi',
    detail: '09612 119911 · 24/7 confidential',
    icon: 'phone',
    accentColor: '#F2705C',
    actionType: 'call',
    phone: '+8809612119911', // <-- placeholder, not a real number yet
    url: '',
  },
  {
    id: 'talk-hope-bd',
    countryCode: 'BD',
    countryLabel: 'Bangladesh',
    name: 'Talk Hope',
    detail: '+880 9638 881 888 · 24/7 Support',
    icon: 'phone',
    accentColor: '#2A9D8F',
    actionType: 'call',
    phone: '+8809638881888',
    url: '',
  },
  {
    id: 'child-helpline-bd',
    countryCode: 'BD',
    countryLabel: 'Bangladesh',
    name: 'Child Helpline',
    detail: '1098 · 24/7 Support for Youth',
    icon: 'phone',
    accentColor: '#F2B705',
    actionType: 'call',
    phone: '1098',
    url: '',
  },
  {
    id: 'crisis-counseling-center',
    countryCode: 'KR',
    countryLabel: 'South Korea',
    name: 'Crisis Counseling Center',
    detail: '1577-0199 · 24/7',
    icon: 'phone',
    accentColor: '#8B85D6',
    actionType: 'call',
    phone: '+8215770199', // <-- placeholder, not a real number yet
    url: '',
  },
  {
    id: 'lifeline-korea',
    countryCode: 'KR',
    countryLabel: 'South Korea',
    name: 'Lifeline Korea',
    detail: '1588-9191 · 24/7 Counseling',
    icon: 'phone',
    accentColor: '#F2705C',
    actionType: 'call',
    phone: '+8215889191',
    url: '',
  },
  {
    id: 'youth-hotline-kr',
    countryCode: 'KR',
    countryLabel: 'South Korea',
    name: 'Youth Hotline 1388',
    detail: '1388 · 24/7 Youth & Teen Support',
    icon: 'phone',
    accentColor: '#F2B705', // Matching the yellow accent of BD's child helpline
    actionType: 'call',
    phone: '1388',
    url: 'https://www.1388.go.kr',
  },
  {
    id: 'iasp-directory',
    countryCode: 'INTL',
    countryLabel: 'International',
    name: 'IASP Directory',
    detail: 'Find help in your country',
    icon: 'globe',
    accentColor: '#4FA891',
    actionType: 'link',
    phone: '',
    url: 'https://www.iasp.info/resources/Crisis_Centres/', // <-- placeholder, check this is correct
  },
  {
    id: 'find-a-helpline',
    countryCode: 'INTL',
    countryLabel: 'International',
    name: 'Find A Helpline',
    detail: 'Search for local crisis centers',
    icon: 'globe',
    accentColor: '#8B85D6',
    actionType: 'link',
    phone: '',
    url: 'https://findahelpline.com/',
  }
]

export default emergencyContacts
