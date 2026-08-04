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

function SettingsIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="10.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10.5 3.5v2M10.5 15v2M17.5 10.5h-2M6 10.5H4M15.4 5.6l-1.4 1.4M7.5 13.4L6 15M15.4 15.4l-1.4-1.4M7.5 7.5L6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
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
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path
        d="M10.5 3L18.5 17H2.5L10.5 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10.5 8.5v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10.5" cy="14.3" r="0.9" fill="currentColor" />
    </svg>
  )
}

const TABS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
  { id: 'progress', label: 'Progress', Icon: ProgressIcon },
  { id: 'sos', label: 'SOS', Icon: SosIcon, isSos: true },
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
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
