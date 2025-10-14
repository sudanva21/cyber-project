import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './Navigation'
import HomePage from '../pages/HomePage'
import AttackSimulator from '../pages/AttackSimulator'
import ThreatDetector from '../pages/ThreatDetector'
import AwarenessSection from '../pages/AwarenessSection'
import NewDashboard from '../pages/NewDashboard'
import AuthModal from './AuthModal'
import ProtectedRoute from './ProtectedRoute'
import FloatingSystemTime from './FloatingSystemTime'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'

interface MainContentProps {
  audioManager: AudioManager
}

const MainContent: React.FC<MainContentProps> = ({ audioManager }) => {
  const { user } = useSupabase()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="main-content">
      <Navigation 
        audioManager={audioManager} 
        onAuthClick={() => setShowAuth(true)}
        user={user}
      />
      
      <main className="content-area">
        <Routes>
          <Route path="/" element={<HomePage audioManager={audioManager} onAuthRequired={() => setShowAuth(true)} />} />
          <Route path="/simulator" element={
            <ProtectedRoute onAuthRequired={() => setShowAuth(true)}>
              <AttackSimulator audioManager={audioManager} />
            </ProtectedRoute>
          } />
          <Route path="/detector" element={
            <ProtectedRoute onAuthRequired={() => setShowAuth(true)}>
              <ThreatDetector audioManager={audioManager} />
            </ProtectedRoute>
          } />
          <Route path="/awareness" element={
            <ProtectedRoute onAuthRequired={() => setShowAuth(true)}>
              <AwarenessSection audioManager={audioManager} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute onAuthRequired={() => setShowAuth(true)}>
              <NewDashboard audioManager={audioManager} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Floating System Time */}
      <FloatingSystemTime />

      {/* Authentication Modal */}
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          audioManager={audioManager}
        />
      )}
    </div>
  )
}

export default MainContent