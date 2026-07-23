import { useState } from 'react'
import Home from './Home.jsx'
import VRLibrary from './VRLibrary.jsx'
import HardwareSelect from './HardwareSelect.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import VRPractice from './VRPractice.jsx'
import MusicLibrary from './MusicLibrary.jsx'
import NowPlaying from './NowPlaying.jsx'
import { useAudioPlayer } from './useAudioPlayer.js'

function App() {
  const [screen, setScreen] = useState('home')
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [hardwareMode, setHardwareMode] = useState('phone')
  const { currentTrack, isPlaying, play } = useAudioPlayer()

  const openTrack = (track) => {
    play(track)
    setScreen('nowplaying')
  }

  if (screen === 'nowplaying' && currentTrack) {
    return <NowPlaying track={currentTrack} onCollapse={() => setScreen('music')} />
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

  if (screen === 'vr' && selectedScenario) {
    return (
      <VRPractice
        key={selectedScenario.id}
        scenario={selectedScenario}
        mode={hardwareMode}
        onExit={() => setScreen('list')}
      />
    )
  }

  if (screen === 'loading' && selectedScenario) {
    return <LoadingScreen onLoaded={() => setScreen('vr')} />
  }

  if (screen === 'hardware' && selectedScenario) {
    return (
      <HardwareSelect
        onBack={() => setScreen('list')}
        onEnterScene={(mode) => {
          setHardwareMode(mode)
          setScreen('loading')
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
    <Home onEnterVR={() => setScreen('list')} onOpenMusic={() => setScreen('music')} />
  )
}

export default App
