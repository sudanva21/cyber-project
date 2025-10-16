import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'

interface HolographicLandingProps {
  onThemeChange: (theme: 'quantum' | 'neural' | 'holographic') => void
  onVoiceToggle: () => void
  audioManager: AudioManager
}

interface ThreatData {
  location: { lat: number; lng: number }
  type: 'malware' | 'phishing' | 'ddos' | 'ransomware'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
}

interface SystemMetrics {
  threatsBlocked: number
  systemUptime: number
  activeUsers: number
  responseTime: number
  securityScore: number
}

const HolographicLanding: React.FC<HolographicLandingProps> = ({
  onThemeChange,
  onVoiceToggle,
  audioManager
}) => {
  const { user, signOut } = useSupabase()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [typedTitle, setTypedTitle] = useState('')
  const [showHologram, setShowHologram] = useState(false)
  const [globalThreats, setGlobalThreats] = useState<ThreatData[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    threatsBlocked: 2847291,
    systemUptime: 99.97,
    activeUsers: 847521,
    responseTime: 0.12,
    securityScore: 98.4
  })
  const [scanningProgress, setScanningProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const hologramRef = useRef<HTMLDivElement>(null)

  const titleText = "NEXUS CYBER SHIELD"
  const tagline = "The Future of Cybersecurity is Here"

  // Initialize effects
  useEffect(() => {
    // Type animation for title
    let typeIndex = 0
    const typeTimer = setInterval(() => {
      if (typeIndex < titleText.length) {
        setTypedTitle(titleText.substring(0, typeIndex + 1))
        typeIndex++
        audioManager.playKeyPress()
      } else {
        clearInterval(typeTimer)
        setTimeout(() => setShowHologram(true), 500)
      }
    }, 100)

    // Real-time clock
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate global threat data
    generateGlobalThreats()

    // Update metrics periodically
    const metricsTimer = setInterval(() => {
      updateSystemMetrics()
    }, 3000)

    return () => {
      clearInterval(typeTimer)
      clearInterval(clockTimer)
      clearInterval(metricsTimer)
    }
  }, [])

  // Hologram effect
  useEffect(() => {
    if (showHologram && hologramRef.current) {
      const element = hologramRef.current
      let frame = 0
      
      const hologramAnimation = setInterval(() => {
        frame++
        const opacity = 0.7 + Math.sin(frame * 0.1) * 0.3
        const translateY = Math.sin(frame * 0.05) * 5
        const blur = 2 + Math.sin(frame * 0.08) * 1
        
        element.style.opacity = opacity.toString()
        element.style.transform = `translateY(${translateY}px)`
        element.style.filter = `blur(${blur}px) drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))`
      }, 50)

      return () => clearInterval(hologramAnimation)
    }
  }, [showHologram])

  // Scanning animation
  useEffect(() => {
    const scanTimer = setInterval(() => {
      setIsScanning(prev => !prev)
      if (!isScanning) {
        setScanningProgress(0)
        const progressTimer = setInterval(() => {
          setScanningProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressTimer)
              return 100
            }
            return prev + Math.random() * 15
          })
        }, 100)
      }
    }, 8000)

    return () => clearInterval(scanTimer)
  }, [isScanning])

  const generateGlobalThreats = () => {
    const threats: ThreatData[] = []
    const threatTypes: ThreatData['type'][] = ['malware', 'phishing', 'ddos', 'ransomware']
    const severities: ThreatData['severity'][] = ['low', 'medium', 'high', 'critical']
    
    // Major cities coordinates
    const cities = [
      { lat: 40.7128, lng: -74.0060, name: 'New York' },
      { lat: 51.5074, lng: -0.1278, name: 'London' },
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
      { lat: 55.7558, lng: 37.6173, name: 'Moscow' },
      { lat: 31.2304, lng: 121.4737, name: 'Shanghai' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
      { lat: 52.5200, lng: 13.4050, name: 'Berlin' }
    ]

    for (let i = 0; i < 25; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)]
      threats.push({
        location: {
          lat: city.lat + (Math.random() - 0.5) * 10,
          lng: city.lng + (Math.random() - 0.5) * 10
        },
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: new Date(Date.now() - Math.random() * 3600000) // Last hour
      })
    }
    
    setGlobalThreats(threats)
  }

  const updateSystemMetrics = () => {
    setSystemMetrics(prev => ({
      threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 100),
      systemUptime: Math.min(99.99, prev.systemUptime + (Math.random() * 0.01)),
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
      responseTime: Math.max(0.05, prev.responseTime + (Math.random() * 0.02 - 0.01)),
      securityScore: Math.max(95, Math.min(100, prev.securityScore + (Math.random() * 0.2 - 0.1)))
    }))
  }

  const handleFeatureClick = (path: string) => {
    audioManager.playClick()
    // Additional click handling logic
  }

  const getThreatColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'medium': return '#eab308'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="holographic-landing" style={{
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Quantum Header */}
      <motion.header 
        className="quantum-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
          padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 2rem)',
          pointerEvents: 'auto'
        }}
      >
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem', marginLeft: '120px' }}>
          <div className="holographic-text" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontFamily: 'Orbitron, monospace' }}>
            NEXUS
          </div>
          
          <div className="system-status flex items-center" style={{ gap: 'clamp(0.5rem, 3vw, 1.5rem)', flexWrap: 'wrap' }}>
            <div className="defcon-level">
              <span style={{ color: '#10b981', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>DEFCON 3</span>
            </div>
            
            <div className="system-time" style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              color: '#00d4ff',
              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)'
            }}>
              {currentTime.toLocaleTimeString()} UTC
            </div>
            
            <div className="threat-level">
              <span style={{ color: '#f59e0b', fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>⚠️ ELEVATED</span>
            </div>

            {/* Authentication Section */}
            <div className="auth-section flex items-center" style={{ gap: '0.75rem' }}>
              {user ? (
                <div className="user-info flex items-center" style={{ gap: '0.5rem' }}>
                  <div className="user-status">
                    <span style={{ 
                      color: '#10b981', 
                      fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      🔐 {user.user_metadata?.username || user.email?.split('@')[0] || 'USER'}
                    </span>
                  </div>
                  <motion.button
                    onClick={async () => {
                      audioManager.playClick()
                      await signOut()
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8), rgba(239, 68, 68, 0.8))',
                      border: '1px solid rgba(220, 38, 38, 0.6)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                      padding: '0.4rem 0.8rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    LOGOUT
                  </motion.button>
                </div>
              ) : (
                <Link to="/auth">
                  <motion.button
                    onClick={() => audioManager.playClick()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.8), rgba(124, 58, 237, 0.8))',
                      border: '1px solid rgba(0, 212, 255, 0.6)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                      padding: '0.4rem 0.8rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    🔑 LOGIN
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        minHeight: 'clamp(100vh, 120vh, 130vh)', 
        paddingTop: 'clamp(70px, 10vw, 80px)', 
        paddingBottom: 'clamp(2rem, 5vw, 4rem)',
        position: 'relative' 
      }}>
        <div className="container mx-auto px-4">
          {/* Main Title with Holographic Effect */}
          <motion.div
            className="hero-content text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            style={{ marginTop: '8rem' }}
          >
            <div className="holographic-title" style={{ marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #00d4ff, #7c3aed, #10b981, #00d4ff)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'holographic-text-flow 3s ease-in-out infinite'
              }}>
                {typedTitle}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ color: '#00d4ff' }}
                >
                  |
                </motion.span>
              </h1>
            </div>

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              style={{
                fontSize: '1.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '3rem',
                fontWeight: 300
              }}
            >
              {tagline}
            </motion.p>

            {/* Holographic Shield */}
            <AnimatePresence>
              {showHologram && (
                <motion.div
                  ref={hologramRef}
                  className="holographic-shield"
                  initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  style={{
                    position: 'relative',
                    width: '300px',
                    height: '300px',
                    margin: '2rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8rem',
                    color: '#00d4ff',
                    filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.6))'
                  }}
                >
                  🛡️
                  
                  {/* Orbiting Elements */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${['#00d4ff', '#7c3aed', '#10b981'][i % 3]}, transparent)`,
                        border: `1px solid ${['#00d4ff', '#7c3aed', '#10b981'][i % 3]}`,
                        top: '50%',
                        left: '50%',
                        transformOrigin: '-150px 0'
                      }}
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 8 + i,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 1 }}
              style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link 
                to="/dashboard"
                className="holographic-btn"
                onClick={() => handleFeatureClick('/dashboard')}
                style={{ 
                  fontSize: '1.2rem',
                  padding: '1rem 2rem',
                  minWidth: '200px'
                }}
              >
                ENTER NEXUS
              </Link>
              
              <button 
                className="holographic-btn secondary"
                onClick={() => setIsScanning(!isScanning)}
                style={{ 
                  fontSize: '1.2rem',
                  padding: '1rem 2rem',
                  minWidth: '200px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.5)'
                }}
              >
                START SCAN
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scanning Interface */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              className="scanning-interface"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '1rem',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                minWidth: 'clamp(300px, 80vw, 400px)',
                maxWidth: '90vw',
                textAlign: 'center'
              }}
            >
              <div style={{ marginBottom: '1rem', color: '#00d4ff' }}>
                🔍 QUANTUM SCAN IN PROGRESS
              </div>
              
              <div className="holographic-progress" style={{ marginBottom: '1rem' }}>
                <motion.div 
                  className="holographic-progress-bar"
                  animate={{ width: `${scanningProgress}%` }}
                />
              </div>
              
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {scanningProgress.toFixed(0)}% Complete - Analyzing {Math.floor(scanningProgress * 100)} Threat Vectors
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Global Threat Map */}
      <section className="threat-map-section" style={{ padding: '4rem 0', background: 'rgba(0, 0, 0, 0.3)' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            className="holographic-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
              fontFamily: 'Orbitron, monospace'
            }}
          >
            GLOBAL THREAT INTELLIGENCE
          </motion.h2>

          <div className="threat-stats" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {[
              { label: 'Threats Blocked', value: systemMetrics.threatsBlocked.toLocaleString(), icon: '🛡️' },
              { label: 'System Uptime', value: `${systemMetrics.systemUptime.toFixed(2)}%`, icon: '⚡' },
              { label: 'Active Users', value: systemMetrics.activeUsers.toLocaleString(), icon: '👥' },
              { label: 'Response Time', value: `${systemMetrics.responseTime.toFixed(2)}s`, icon: '🚀' },
              { label: 'Security Score', value: `${systemMetrics.securityScore.toFixed(1)}%`, icon: '🎯' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className="holographic-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ textAlign: 'center', padding: '1.5rem' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{metric.icon}</div>
                <div className="holographic-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {metric.value}
                </div>
                <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Threat Feed */}
          <motion.div
            className="threat-feed holographic-panel"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ maxHeight: '300px', overflow: 'auto', padding: '1.5rem' }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#00d4ff' }}>LIVE THREAT FEED</h3>
            <div className="space-y-2">
              {globalThreats.slice(0, 10).map((threat, index) => (
                <motion.div
                  key={index}
                  className="threat-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span 
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: getThreatColor(threat.severity),
                        marginRight: '0.75rem',
                        boxShadow: `0 0 10px ${getThreatColor(threat.severity)}`
                      }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{threat.type}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                      color: getThreatColor(threat.severity),
                      textTransform: 'uppercase',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {threat.severity}
                    </span>
                    <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                      {threat.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-showcase" style={{ padding: '4rem 0' }}>
        <div className="container mx-auto px-4">
          <motion.h2
            className="holographic-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              marginBottom: '3rem',
              fontFamily: 'Orbitron, monospace'
            }}
          >
            QUANTUM SECURITY MODULES
          </motion.h2>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'QUANTUM DASHBOARD',
                description: 'Real-time threat monitoring with AI-powered analytics',
                icon: '📊',
                path: '/dashboard',
                color: '#00d4ff'
              },
              {
                title: 'NEURAL TRAINING',
                description: 'Advanced cybersecurity training simulations',
                icon: '🧠',
                path: '/training',
                color: '#7c3aed'
              },
              {
                title: 'THREAT DETECTOR',
                description: 'Multi-dimensional threat analysis engine',
                icon: '🔍',
                path: '/detector',
                color: '#10b981'
              },
              {
                title: 'HOLOGRAPHIC LAB',
                description: 'Advanced security tools and forensics',
                icon: '🔬',
                path: '/lab',
                color: '#f59e0b'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="holographic-card"
                initial={{ opacity: 0, y: 50, rotateY: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                
                <h3 
                  className="holographic-text" 
                  style={{ 
                    fontSize: '1.3rem',
                    marginBottom: '1rem',
                    color: feature.color
                  }}
                >
                  {feature.title}
                </h3>
                
                <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
                  {feature.description}
                </p>
                
                <Link 
                  to={feature.path}
                  className="holographic-btn"
                  onClick={() => handleFeatureClick(feature.path)}
                  style={{ fontSize: '0.9rem' }}
                >
                  EXPLORE MODULE
                </Link>

                {/* Hover effect overlay */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${feature.color}10, transparent)`,
                    borderRadius: 'inherit',
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'rgba(0, 0, 0, 0.9)',
        borderTop: '1px solid rgba(0, 212, 255, 0.3)',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div className="container mx-auto px-4">
          <div className="holographic-text" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            NEXUS CYBER SHIELD
          </div>
          <p style={{ opacity: 0.7 }}>
            © 2024 Nexus Cyber Shield. Quantum-secured. AI-powered. Future-ready.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HolographicLanding