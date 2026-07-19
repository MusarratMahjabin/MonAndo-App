import { useState } from 'react'
import Home from './Home.jsx'
import VRLibrary from './VRLibrary.jsx'
import VRPractice from './VRPractice.jsx'

function App() {
  const [screen, setScreen] = useState('home')
  const [selectedScenario, setSelectedScenario] = useState(null)

  if (screen === 'vr' && selectedScenario) {
    return (
      <VRPractice
        key={selectedScenario.id}
        scenario={selectedScenario}
        onExit={() => setScreen('list')}
      />
    )
  }

  if (screen === 'list') {
    return (
      <VRLibrary
        onBack={() => setScreen('home')}
        onSelect={(scenario) => {
          setSelectedScenario(scenario)
          setScreen('vr')
        }}
      />
    )
  }

  return <Home onEnter={() => setScreen('list')} />
}

export default App
