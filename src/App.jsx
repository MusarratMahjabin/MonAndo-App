import { useEffect, useState } from 'react'
import { getInitialUser } from './firebase.js'
import { migrateLocalDataToFirestore } from './migrateLocalData.js'
import Welcome from './Welcome.jsx'
import AuthOptions from './AuthOptions.jsx'
import ProfileSetup from './ProfileSetup.jsx'
import Home from './Home.jsx'
import VRLibrary from './VRLibrary.jsx'
import HardwareSelect from './HardwareSelect.jsx'
import PreCheck from './PreCheck.jsx'
import VRPractice from './VRPractice.jsx'
import SessionReview from './SessionReview.jsx'
import MusicLibrary from './MusicLibrary.jsx'
import NowPlaying from './NowPlaying.jsx'
import UrbanSansa from './UrbanSansa.jsx'
import SOS from './SOS.jsx'
import CheckIn from './CheckIn.jsx'
import Settings from './Settings.jsx'
import Progress from './Progress.jsx'
import Profile from './Profile.jsx'
import AICounsel from './AICounsel.jsx'
import BottomNav from './BottomNav.jsx'
import { useAudioPlayer } from './useAudioPlayer.js'

function App() {
  const [authChecked, setAuthChecked] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [preAuthScreen, setPreAuthScreen] = useState('welcome')
  const [screen, setScreen] = useState('home')
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [hardwareMode, setHardwareMode] = useState('phone')
  const [sudsBefore, setSudsBefore] = useState(5)
  const [nowPlayingReturn, setNowPlayingReturn] = useState('music')
  const { currentTrack, isPlaying, play, pause, toggle } = useAudioPlayer()

  // Check once whether this device already has a signed-in session (Guest
  // or Google) from a previous visit. Everyone sees the Welcome splash
  // first, regardless — returning users then go straight to the mood
  // check-in (already set below) instead of the sign-in screen; brand new
  // visitors go to sign-in, then profile setup. The first time a session
  // is found, also copy over anything saved in this browser's old
  // localStorage before the app moved to Firestore.
  useEffect(() => {
    getInitialUser()
      .then((user) => {
        setSignedIn(!!user)
        setAuthChecked(true)
        if (user) {
          setScreen('checkin')
          migrateLocalDataToFirestore(user.uid).catch((err) =>
            console.error('Migration failed:', err),
          )
        }
      })
      .catch((err) => {
        console.error('Firebase startup failed:', err)
        setAuthChecked(true)
      })
  }, [])

  const openTrack = (track, returnScreen = 'music') => {
    play(track)
    setNowPlayingReturn(returnScreen)
    setScreen('nowplaying')
  }

  if (!authChecked) {
    return <div className="app-boot" />
  }

  if (preAuthScreen === 'welcome') {
    return <Welcome onContinue={() => setPreAuthScreen('done')} />
  }

  if (!signedIn) {
    return (
      <AuthOptions
        onSignedIn={() => {
          setSignedIn(true)
          setScreen('profile')
        }}
      />
    )
  }

  if (screen === 'profile') {
    return <ProfileSetup onDone={() => setScreen('checkin')} />
  }

  if (screen === 'profileview') {
    return <Profile onBack={() => setScreen('settings')} onOpenProgress={() => setScreen('progress')} />
  }

  if (screen === 'settings') {
    return (
      <>
        <Settings
          onBack={() => setScreen('home')}
          onOpenProfile={() => setScreen('profileview')}
          onLoggedOut={() => {
            setSignedIn(false)
            setScreen('home')
          }}
        />
        <BottomNav current="settings" onNavigate={setScreen} />
      </>
    )
  }

  if (screen === 'nowplaying' && currentTrack) {
    return (
      <NowPlaying
        track={currentTrack}
        isPlaying={isPlaying}
        onToggleAudio={() => toggle(currentTrack)}
        onStopAudio={pause}
        onCollapse={() => setScreen(nowPlayingReturn)}
      />
    )
  }

  if (screen === 'sos') {
    return (
      <>
        <SOS onBack={() => setScreen('home')} />
        <BottomNav current="sos" onNavigate={setScreen} />
      </>
    )
  }

  if (screen === 'checkin') {
    return (
      <CheckIn
        onClose={() => setScreen('home')}
        onContinue={(mood) => setScreen(mood === 'crisis' ? 'sos' : 'home')}
      />
    )
  }

  if (screen === 'reflect') {
    return (
      <AICounsel
        onBack={() => setScreen('home')}
        onFlagDistress={() => setScreen('sos')}
        onNavigate={setScreen}
      />
    )
  }

  if (screen === 'urbansansa') {
    return (
      <UrbanSansa
        onBack={() => setScreen('home')}
        onOpenFeature={(feature) => openTrack(feature, 'urbansansa')}
      />
    )
  }

  if (screen === 'music') {
    return (
      <MusicLibrary
        onBack={() => setScreen('home')}
        onOpenTrack={openTrack}
        onToggleTrack={toggle}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
      />
    )
  }

  if (screen === 'review' && selectedScenario) {
    return (
      <SessionReview
        scenario={selectedScenario}
        sudsBefore={sudsBefore}
        onBack={() => setScreen('home')}
        onDone={() => setScreen('progress')}
      />
    )
  }

  if (screen === 'progress') {
    return (
      <>
        <Progress onBack={() => setScreen('home')} />
        <BottomNav current="progress" onNavigate={setScreen} />
      </>
    )
  }

  if (screen === 'vr' && selectedScenario) {
    return (
      <VRPractice
        key={selectedScenario.id}
        scenario={selectedScenario}
        mode={hardwareMode}
        onExit={() => setScreen('review')}
        onFlagDistress={() => setScreen('sos')}
      />
    )
  }

  if (screen === 'precheck' && selectedScenario) {
    return (
      <PreCheck
        scenario={selectedScenario}
        onBack={() => setScreen('hardware')}
        onBegin={(suds) => {
          setSudsBefore(suds)
          setScreen('vr')
        }}
      />
    )
  }

  if (screen === 'hardware' && selectedScenario) {
    return (
      <HardwareSelect
        onBack={() => setScreen('list')}
        onEnterScene={(mode) => {
          setHardwareMode(mode)
          setScreen('precheck')
        }}
      />
    )
  }

  if (screen === 'list') {
    return (
      <VRLibrary
        onBack={() => setScreen('home')}
        onSelect={(scenario) => {
          setSelectedScenario(scenario)
          setScreen('hardware')
        }}
      />
    )
  }

  return (
    <>
      <Home
        onEnterVR={() => setScreen('list')}
        onOpenMusic={() => setScreen('music')}
        onOpenUrbanSansa={() => setScreen('urbansansa')}
        onOpenCheckIn={() => setScreen('checkin')}
        onOpenSettings={() => setScreen('settings')}
        onOpenReflect={() => setScreen('reflect')}
        onSelectScenario={(scenario) => {
          setSelectedScenario(scenario)
          setScreen('hardware')
        }}
        onOpenTrack={(track) => openTrack(track, 'home')}
      />
      <BottomNav current="home" onNavigate={setScreen} />
    </>
  )
}

export default App
