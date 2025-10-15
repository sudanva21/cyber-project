import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import BackgroundAnimation from './components/BackgroundAnimation'
import MainContent from './components/MainContent'
import AudioManager from './utils/AudioManager'
import { SupabaseProvider } from './providers/SupabaseProvider'
import './utils/BackendTest' // Load backend testing utilities

function App() {
  const [loading, setLoading] = useState(true)
  const [audioManager] = useState(() => new AudioManager())

  useEffect(() => {
    // Initialize audio system
    audioManager.initialize()
    
    // Simulate loading time for hacker effect
    const timer = setTimeout(() => {
      setLoading(false)
      audioManager.playSystemStartup()
    }, 4000)

    return () => {
      clearTimeout(timer)
      audioManager.cleanup()
    }
  }, [audioManager])

  return (
    <SupabaseProvider>
      <div className="App" style={{ minHeight: '100vh', position: 'relative' }}>
        {/* 3D Background Animation */}
        <BackgroundAnimation />
        
        {/* Loading Screen */}
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
        
        {/* Main Application */}
        {!loading && (
          <Router>
            <MainContent audioManager={audioManager} />
          </Router>
        )}
      </div>
    </SupabaseProvider>
  )
}

export default App