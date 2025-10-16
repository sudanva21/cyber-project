import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HolographicLoaderProps {
  stage: 'initializing' | 'biometric_scan' | 'ai_initialization' | 'quantum_sync'
  progress: number
  onComplete?: () => void
}

interface LoadingMessage {
  message: string
  type: 'system' | 'warning' | 'success' | 'scanning'
  delay: number
}

const HolographicLoader: React.FC<HolographicLoaderProps> = ({
  stage,
  progress,
  onComplete
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [showBiometric, setShowBiometric] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [systemsOnline, setSystemsOnline] = useState<string[]>([])

  const loadingMessages: Record<string, LoadingMessage[]> = {
    initializing: [
      { message: '> Initializing Nexus Cyber Shield...', type: 'system', delay: 0 },
      { message: '> Loading quantum encryption protocols...', type: 'system', delay: 1000 },
      { message: '> Establishing secure connection...', type: 'system', delay: 2000 },
      { message: '> Verifying system integrity...', type: 'success', delay: 3000 }
    ],
    biometric_scan: [
      { message: '> Initiating biometric authentication...', type: 'scanning', delay: 0 },
      { message: '> Scanning retinal pattern...', type: 'scanning', delay: 1500 },
      { message: '> Analyzing fingerprint data...', type: 'scanning', delay: 3000 },
      { message: '> Biometric verification complete', type: 'success', delay: 4500 }
    ],
    ai_initialization: [
      { message: '> Activating AI neural networks...', type: 'system', delay: 0 },
      { message: '> Loading machine learning models...', type: 'system', delay: 1200 },
      { message: '> Calibrating threat detection algorithms...', type: 'system', delay: 2400 },
      { message: '> AI Assistant online', type: 'success', delay: 3600 }
    ],
    quantum_sync: [
      { message: '> Synchronizing quantum processors...', type: 'system', delay: 0 },
      { message: '> Establishing quantum entanglement...', type: 'system', delay: 1000 },
      { message: '> Quantum systems operational', type: 'success', delay: 2000 }
    ]
  }

  const systems = [
    'Quantum Encryption',
    'Neural Networks',
    'Threat Detection',
    'Biometric Scanner',
    'AI Assistant',
    'Real-time Monitoring',
    'Quantum Firewall',
    'Data Analytics'
  ]

  useEffect(() => {
    const messages = loadingMessages[stage] || loadingMessages.initializing
    const message = messages[currentMessageIndex]
    
    if (!message) return

    const timer = setTimeout(() => {
      typeMessage(message.message)
    }, message.delay)

    return () => clearTimeout(timer)
  }, [currentMessageIndex, stage])

  useEffect(() => {
    if (stage === 'biometric_scan') {
      setShowBiometric(true)
      const scanTimer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(scanTimer)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(scanTimer)
    }
  }, [stage])

  useEffect(() => {
    // Simulate systems coming online
    const systemTimer = setInterval(() => {
      setSystemsOnline(prev => {
        if (prev.length < systems.length) {
          return [...prev, systems[prev.length]]
        }
        clearInterval(systemTimer)
        return prev
      })
    }, 600)

    return () => clearInterval(systemTimer)
  }, [])

  const typeMessage = (message: string) => {
    setTypedText('')
    let i = 0
    const typeTimer = setInterval(() => {
      if (i < message.length) {
        setTypedText(message.substring(0, i + 1))
        i++
      } else {
        clearInterval(typeTimer)
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
        }, 800)
      }
    }, 50)
  }

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'system': return '#00d4ff'
      case 'warning': return '#f59e0b'
      case 'success': return '#10b981'
      case 'scanning': return '#7c3aed'
      default: return '#ffffff'
    }
  }

  return (
    <div className="holographic-loader-container">
      {/* Main Holographic Panel */}
      <motion.div
        className="holographic-panel holographic-loader"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '3rem',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Nexus Logo */}
        <motion.div
          className="nexus-logo"
          initial={{ rotateY: 180, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            fontSize: '3rem',
            background: 'linear-gradient(45deg, #00d4ff, #7c3aed, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 'bold',
            marginBottom: '2rem'
          }}
        >
          NEXUS
        </motion.div>

        {/* Loading Progress */}
        <div className="loading-progress" style={{ marginBottom: '2rem' }}>
          <div className="holographic-progress" style={{ marginBottom: '1rem' }}>
            <motion.div 
              className="holographic-progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <motion.div
            className="progress-text"
            style={{ 
              color: '#00d4ff',
              fontFamily: 'Orbitron, monospace',
              fontSize: '1.2rem'
            }}
          >
            {progress}% Complete
          </motion.div>
        </div>

        {/* Biometric Scanner */}
        <AnimatePresence>
          {showBiometric && (
            <motion.div
              className="biometric-scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                margin: '2rem 0',
                position: 'relative'
              }}
            >
              <div 
                className="scanner-display"
                style={{
                  width: '200px',
                  height: '200px',
                  margin: '0 auto',
                  border: '2px solid #00d4ff',
                  borderRadius: '50%',
                  position: 'relative',
                  background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Scanning Animation */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
                    top: '50%',
                    left: 0
                  }}
                  animate={{
                    y: [-90, 90, -90]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Biometric Icon */}
                <motion.div
                  style={{
                    fontSize: '4rem',
                    color: '#00d4ff'
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                >
                  👁️
                </motion.div>

                {/* Scan Progress */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#7c3aed',
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '1rem'
                  }}
                >
                  Scan: {scanProgress}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Output */}
        <div 
          className="terminal-output"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            margin: '2rem 0',
            textAlign: 'left',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.9rem',
            minHeight: '100px'
          }}
        >
          <motion.div
            style={{ color: getMessageColor(loadingMessages[stage]?.[currentMessageIndex]?.type || 'system') }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {typedText}
            <span className="cursor" style={{ animation: 'blink 1s infinite' }}>█</span>
          </motion.div>
        </div>

        {/* Systems Status */}
        <div 
          className="systems-status"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}
        >
          {systems.map((system, index) => (
            <motion.div
              key={system}
              className="system-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: systemsOnline.includes(system) ? 1 : 0.3,
                x: 0
              }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                background: 'rgba(0, 212, 255, 0.05)',
                border: `1px solid ${systemsOnline.includes(system) ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
            >
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: systemsOnline.includes(system) ? '#10b981' : '#6b7280',
                  marginRight: '0.5rem',
                  boxShadow: systemsOnline.includes(system) ? '0 0 10px #10b981' : 'none'
                }}
              />
              {system}
              {systemsOnline.includes(system) && (
                <motion.span
                  style={{ marginLeft: 'auto', color: '#10b981' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  ONLINE
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quantum Particles */}
        <div className="quantum-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: '#00d4ff',
                borderRadius: '50%',
                boxShadow: '0 0 10px #00d4ff'
              }}
              animate={{
                x: [0, Math.random() * 200, Math.random() * 200, 0],
                y: [0, Math.random() * 200, Math.random() * 200, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .holographic-loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(10px);
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  )
}

export default HolographicLoader