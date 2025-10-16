import React, { useState, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SupabaseProvider, useSupabase } from './providers/SupabaseProvider'
import HolographicLoader from './components/HolographicLoader'
import QuantumBackground from './components/QuantumBackground'
import AIAssistant from './components/AIAssistant'
import VoiceNavigator from './components/VoiceNavigator'
import NotificationSystem from './components/NotificationSystem'
import OverlappingFloatingElements from './components/OverlappingFloatingElements'
import ProtectedRoute from './components/ProtectedRoute'
import QuantumFloatingNav from './components/QuantumFloatingNav'
import AudioManager from './utils/AudioManager'

// Lazy load components for performance
const HolographicLanding = React.lazy(() => import('./pages/HolographicLanding'))
const QuantumDashboard = React.lazy(() => import('./pages/QuantumDashboard'))
const NeuralTraining = React.lazy(() => import('./pages/NeuralTraining'))
const QuantumDetector = React.lazy(() => import('./pages/QuantumDetector'))
const HolographicLab = React.lazy(() => import('./pages/HolographicLab'))
const CyberAwareness = React.lazy(() => import('./pages/CyberAwareness'))
const AuthPage = React.lazy(() => import('./pages/AuthPage'))
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'))

// Routes wrapper component to handle navigation
const AppRoutes: React.FC<{
  state: AppState,
  audioManager: AudioManager,
  addNotification: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void,
  switchTheme: (theme: 'quantum' | 'neural' | 'holographic') => void,
  toggleVoiceNavigation: () => void
}> = ({ state, audioManager, addNotification, switchTheme, toggleVoiceNavigation }) => {
  const navigate = useNavigate()

  const handleAuthRequired = () => {
    addNotification('Please log in to access this feature', 'warning')
    navigate('/auth')
  }

  return (
    <Suspense fallback={
      <div className="quantum-suspense">
        <motion.div 
          className="loading-quantum"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚡
        </motion.div>
      </div>
    }>
      <Routes>
        <Route path="/" element={
          <HolographicLanding 
            onThemeChange={switchTheme}
            onVoiceToggle={toggleVoiceNavigation}
            audioManager={audioManager}
          />
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute onAuthRequired={handleAuthRequired}>
            <QuantumDashboard 
              theme={state.currentTheme}
              audioManager={audioManager}
              onNotification={addNotification}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/training" element={
          <ProtectedRoute onAuthRequired={handleAuthRequired}>
            <NeuralTraining 
              audioManager={audioManager}
              onProgress={(progress) => console.log('Training Progress:', progress)}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/detector" element={
          <ProtectedRoute onAuthRequired={handleAuthRequired}>
            <QuantumDetector 
              audioManager={audioManager}
              onThreatDetected={(threat) => addNotification(`Threat Detected: ${threat}`, 'warning')}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/lab" element={
          <ProtectedRoute onAuthRequired={handleAuthRequired}>
            <HolographicLab 
              audioManager={audioManager}
              onAnalysis={(result) => console.log('Analysis Result:', result)}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/awareness" element={
          <ProtectedRoute onAuthRequired={handleAuthRequired}>
            <CyberAwareness 
              audioManager={audioManager}
              onLearningProgress={(progress) => console.log('Learning Progress:', progress)}
            />
          </ProtectedRoute>
        } />
        
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Suspense>
  )
}

import './styles/QuantumTheme.css'
import './styles/HolographicEffects.css'
import './styles/NeuralAnimations.css'

interface AppState {
  isInitializing: boolean
  aiAssistantActive: boolean
  voiceNavEnabled: boolean
  currentTheme: 'quantum' | 'neural' | 'holographic'
  biometricAuthenticated: boolean
}

// AppContent component with access to Supabase context
const AppContent: React.FC<{
  state: AppState,
  audioManager: AudioManager,
  notifications: any[],
  addNotification: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void,
  switchTheme: (theme: 'quantum' | 'neural' | 'holographic') => void,
  toggleVoiceNavigation: () => void,
  handleMicrophoneClick: () => void,
  handleReactClick: () => void,
  handleBrainClick: () => void,
  handleCrystalClick: () => void
}> = ({ 
  state, 
  audioManager, 
  notifications, 
  addNotification, 
  switchTheme, 
  toggleVoiceNavigation,
  handleMicrophoneClick,
  handleReactClick,
  handleBrainClick,
  handleCrystalClick
}) => {
  const { user } = useSupabase()

  return (
    <motion.div 
      className={`nexus-app theme-${state.currentTheme}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* Quantum Background System */}
      <QuantumBackground theme={state.currentTheme} />
      
      {/* AI Assistant */}
      <AnimatePresence>
        {state.aiAssistantActive && (
          <AIAssistant 
            onCommand={(command) => console.log('AI Command:', command)}
            audioManager={audioManager}
          />
        )}
      </AnimatePresence>

      {/* Notification System */}
      <NotificationSystem notifications={notifications} />

      {/* Overlapping Floating Elements */}
      <OverlappingFloatingElements
        onMicrophoneClick={handleMicrophoneClick}
        onReactClick={handleReactClick}
        onBrainClick={handleBrainClick}
        onCrystalClick={handleCrystalClick}
      />

      {/* Main Application Router */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* Quantum Floating Navigation - New Revolutionary Navigation System */}
        <QuantumFloatingNav 
          audioManager={audioManager}
          user={user}
        />

        {/* Voice Navigation */}
        {state.voiceNavEnabled && (
          <VoiceNavigator 
            onCommand={(command) => console.log('Voice Command:', command)}
          />
        )}

        <AppRoutes 
          state={state}
          audioManager={audioManager}
          addNotification={addNotification}
          switchTheme={switchTheme}
          toggleVoiceNavigation={toggleVoiceNavigation}
        />
      </Router>
    </motion.div>
  )
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isInitializing: true,
    aiAssistantActive: false,
    voiceNavEnabled: false,
    currentTheme: 'quantum',
    biometricAuthenticated: false
  })

  const [audioManager] = useState(() => new AudioManager())
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    initializeNexusSystem()
    
    // Add click handler to enable audio on first user interaction
    const enableAudioOnInteraction = async () => {
      try {
        if (audioManager.context?.state === 'suspended') {
          await audioManager.context.resume()
          console.log('Audio context enabled after user interaction')
        }
      } catch (err) {
        console.warn('Failed to enable audio:', err)
      }
    }

    // Listen for first user interaction
    const handleUserInteraction = () => {
      enableAudioOnInteraction()
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('keydown', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  const initializeNexusSystem = async () => {
    try {
      // Initialize quantum systems (don't block on audio)
      audioManager.initializeQuantumAudio().catch(err => {
        console.warn('Audio initialization failed, continuing without audio:', err)
      })
      
      // Simulate biometric scan
      await simulateBiometricAuthentication()
      
      // Initialize AI systems
      await initializeAIAssistant()
      
      // System ready
      setTimeout(() => {
        setState(prev => ({ ...prev, isInitializing: false }))
        // Try to play sound, but don't block if it fails
        try {
          audioManager.playSystemOnline()
        } catch (err) {
          console.warn('Audio playback failed:', err)
        }
        addNotification('Nexus Cyber Shield Online', 'success')
      }, 1000)
    } catch (error) {
      console.error('System initialization failed:', error)
      // Continue anyway to avoid infinite loading
      setState(prev => ({ ...prev, isInitializing: false }))
      addNotification('System initialized with limited features', 'warning')
    }
  }

  const simulateBiometricAuthentication = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setState(prev => ({ ...prev, biometricAuthenticated: true }))
        audioManager.playBiometricSuccess()
        resolve()
      }, 1000)
    })
  }

  const initializeAIAssistant = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setState(prev => ({ ...prev, aiAssistantActive: true }))
        resolve()
      }, 1000)
    })
  }

  const addNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    const id = Date.now() + Math.random() * 1000 // Ensure unique IDs
    const notification = { id, message, type, timestamp: new Date() }
    setNotifications(prev => [...prev, notification])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  const toggleVoiceNavigation = () => {
    setState(prev => ({ ...prev, voiceNavEnabled: !prev.voiceNavEnabled }))
    audioManager.playClick()
  }

  const switchTheme = (theme: 'quantum' | 'neural' | 'holographic') => {
    setState(prev => ({ ...prev, currentTheme: theme }))
    audioManager.playThemeChange()
  }

  // Handlers for overlapping floating elements
  const handleMicrophoneClick = () => {
    toggleVoiceNavigation()
    addNotification('Voice navigation toggled', 'info')
  }

  const handleReactClick = () => {
    switchTheme('quantum')
    addNotification('Quantum theme activated', 'success')
  }

  const handleBrainClick = () => {
    switchTheme('neural')
    addNotification('Neural theme activated', 'success')
  }

  const handleCrystalClick = () => {
    switchTheme('holographic')
    addNotification('Holographic theme activated', 'success')
  }



  if (state.isInitializing) {
    return (
      <div className="nexus-initializing">
        <QuantumBackground />
        <HolographicLoader 
          stage={state.biometricAuthenticated ? 'ai_initialization' : 'biometric_scan'}
          progress={state.biometricAuthenticated ? 80 : 40}
        />
      </div>
    )
  }

  return (
    <SupabaseProvider>
      <AppContent 
        state={state}
        audioManager={audioManager}
        notifications={notifications}
        addNotification={addNotification}
        switchTheme={switchTheme}
        toggleVoiceNavigation={toggleVoiceNavigation}
        handleMicrophoneClick={handleMicrophoneClick}
        handleReactClick={handleReactClick}
        handleBrainClick={handleBrainClick}
        handleCrystalClick={handleCrystalClick}
      />
    </SupabaseProvider>
  )
}

export default App