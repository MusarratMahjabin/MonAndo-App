// ============================================================
// Emergency (SOS) Contacts — Configuration File
// ============================================================
//



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
