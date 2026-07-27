import { useState } from 'react'
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
import { useAudioPlayer } from './useAudioPlayer.js'

function App() {
  const [screen, setScreen] = useState('home')
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [hardwareMode, setHardwareMode] = useState('phone')
  const [sudsBefore, setSudsBefore] = useState(5)
  const [nowPlayingReturn, setNowPlayingReturn] = useState('music')
  const { currentTrack, isPlaying, play } = useAudioPlayer()

  const openTrack = (track, returnScreen = 'music') => {
    play(track)
    setNowPlayingReturn(returnScreen)
    setScreen('nowplaying')
  }

  if (screen === 'nowplaying' && currentTrack) {
    return <NowPlaying track={currentTrack} onCollapse={() => setScreen(nowPlayingReturn)} />
  }

  if (screen === 'sos') {
    return <SOS onBack={() => setScreen('home')} />
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
        onDone={() => setScreen('home')}
      />
    )
  }

  if (screen === 'vr' && selectedScenario) {
    return (
      <VRPractice
        key={selectedScenario.id}
        scenario={selectedScenario}
        mode={hardwareMode}
        onExit={() => setScreen('review')}
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
    <Home
      onEnterVR={() => setScreen('list')}
      onOpenMusic={() => setScreen('music')}
      onOpenUrbanSansa={() => setScreen('urbansansa')}
      onOpenSOS={() => setScreen('sos')}
    />
  )
}

export default App
