import React, { useState, useEffect, useRef } from 'react'
import './LoadingScreen.css'
import AudioManager from '../utils/AudioManager'

interface LoadingScreenProps {
  onComplete: () => void
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState<'initializing' | 'loading' | 'complete'>('initializing')
  const [loadingText, setLoadingText] = useState('INITIALIZING CYBERSEC PORTAL')
  const audioManagerRef = useRef<AudioManager | null>(null)
  const lastProgressSoundRef = useRef(0)
  const hasPlayedInitialSound = useRef(false)

  const loadingMessages = [
    'INITIALIZING CYBERSEC PORTAL',
    'SCANNING NETWORK PERIMETER',
    'LOADING DEFENSE PROTOCOLS',
    'ESTABLISHING SECURE CONNECTION',
    'ACTIVATING THREAT DETECTION',
    'CALIBRATING AI SYSTEMS',
    'FINALIZING SECURITY MATRIX',
    'ACCESS GRANTED'
  ]

  // Initialize audio manager
  useEffect(() => {
    const initAudio = async () => {
      if (!audioManagerRef.current) {
        audioManagerRef.current = new AudioManager()
        await audioManagerRef.current.initialize()
      }
    }
    
    initAudio()
    
    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.stopLoadingAmbient()
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let messageIndex = 0

    if (phase === 'initializing') {
      // Play initial system sound and start ambient
      if (!hasPlayedInitialSound.current && audioManagerRef.current) {
        audioManagerRef.current.playSystemInitialize()
        setTimeout(() => {
          audioManagerRef.current?.startLoadingAmbient()
        }, 300)
        hasPlayedInitialSound.current = true
      }
      
      // Initial delay then start counting
      const timer = setTimeout(() => {
        setPhase('loading')
        // Play loading start beep
        audioManagerRef.current?.playLoadingBeep()
      }, 500)

      return () => clearTimeout(timer)
    }

    if (phase === 'loading') {
      interval = setInterval(() => {
        setCount(prev => {
          const next = prev + Math.floor(Math.random() * 15) + 5 // Random increment 5-20
          
          // Play progress sounds at certain intervals
          const progressTick = Math.floor(next / 10)
          if (progressTick > lastProgressSoundRef.current && progressTick % 2 === 0) {
            audioManagerRef.current?.playLoadingProgress()
            lastProgressSoundRef.current = progressTick
          }
          
          // Change loading message every 12.5% progress and play data transfer sound
          const progress = next / 100
          const newMessageIndex = Math.min(Math.floor(progress * loadingMessages.length), loadingMessages.length - 1)
          
          if (newMessageIndex !== messageIndex) {
            messageIndex = newMessageIndex
            setLoadingText(loadingMessages[newMessageIndex])
            
            // Play data transfer sound when message changes
            audioManagerRef.current?.playDataTransfer()
            
            // Special beep for important milestones
            if (newMessageIndex === 3 || newMessageIndex === 5) { // Secure connection & AI systems
              setTimeout(() => {
                audioManagerRef.current?.playLoadingBeep()
              }, 200)
            }
          }

          if (next >= 100) {
            setPhase('complete')
            // Stop ambient and play completion sound
            audioManagerRef.current?.stopLoadingAmbient()
            setTimeout(() => {
              audioManagerRef.current?.playLoadingComplete()
            }, 100)
            setTimeout(onComplete, 800)
            return 100
          }

          return next
        })
      }, 120) // Fast counting for hacker effect
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [phase, onComplete])

  return (
    <div className="loading-screen">
      {/* Matrix-style background effect */}
      <div className="matrix-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="matrix-column"
            style={{
              left: `${(i * 2)}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <span key={j} className="matrix-char">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Loading Content */}
      <div className="loading-content">
        {/* Main Counter */}
        <div className="counter-container">
          <div className="counter-display">
            <span className="counter-number cyber-glow">{count.toString().padStart(3, '0')}</span>
            <span className="counter-percent">%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${count}%` }}
              />
              <div className="progress-glow" style={{ left: `${count}%` }} />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text-container">
          <div className="loading-text">
            <span className="loading-bracket">[</span>
            <span className="loading-message font-code">{loadingText}</span>
            <span className="loading-bracket">]</span>
          </div>
          
          {/* Typing cursor effect */}
          <span className="typing-cursor">_</span>
        </div>

        {/* Status Indicators */}
        <div className="status-indicators">
          <div className="status-item">
            <span className="status-dot"></span>
            <span className="status-text font-code">FIREWALL</span>
          </div>
          <div className="status-item">
            <span className="status-dot"></span>
            <span className="status-text font-code">ENCRYPTION</span>
          </div>
          <div className="status-item">
            <span className="status-dot"></span>
            <span className="status-text font-code">AI DETECTION</span>
          </div>
        </div>

        {/* System Info */}
        <div className="system-info">
          <div className="info-line font-code">
            <span className="info-label">SYSTEM:</span>
            <span className="info-value">CYBERSEC-PORTAL-V2.1</span>
          </div>
          <div className="info-line font-code">
            <span className="info-label">STATUS:</span>
            <span className="info-value text-cyber-success">SECURE</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen