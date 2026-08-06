function HomeIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        d="M3 9.5L10.5 3l7.5 6.5M5 8v9h4.5v-5h2v5H16V8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function VRIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <rect x="2" y="7" width="17" height="9" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.5" cy="11.5" r="1.3" fill="currentColor" />
      <circle cx="13.5" cy="11.5" r="1.3" fill="currentColor" />
    </svg>
  )
}

function ProgressIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        d="M4 17V11M10.5 17V4M17 17v-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SosIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 21 21" fill="none">
      <path
        d="M10.5 3L18.5 17H2.5L10.5 3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10.5 8.5v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10.5" cy="14.3" r="1" fill="currentColor" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 17c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

// SOS sits in the middle, on purpose — it's the one tab that should
// never blend in with the rest.
const TABS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'list', label: 'VR', Icon: VRIcon },
  { id: 'sos', label: 'SOS', Icon: SosIcon, isSos: true },
  { id: 'progress', label: 'Progress', Icon: ProgressIcon },
  { id: 'profileview', label: 'Profile', Icon: ProfileIcon },
]

function BottomNav({ current, onNavigate }) {
  return (
    <nav className="bottomnav">
      {TABS.map(({ id, label, Icon, isSos }) => (
        <button
          key={id}
          type="button"
          className={`bottomnav-item ${isSos ? 'bottomnav-item-sos' : ''} ${
            current === id ? 'bottomnav-item-active' : ''
          }`}
          onClick={() => onNavigate(id)}
        >
          <span className="bottomnav-icon">
            <Icon />
          </span>
          <span className="bottomnav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
