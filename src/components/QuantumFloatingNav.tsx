import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import './QuantumFloatingNav.css'

interface QuantumFloatingNavProps {
  audioManager: AudioManager
  user: User | null
}

interface NavItem {
  path: string
  label: string
  icon: string
  description: string
  gradient: string
  shortcut?: string
}

const QuantumFloatingNav: React.FC<QuantumFloatingNavProps> = ({ 
  audioManager, 
  user 
}) => {
  const { signOut } = useSupabase()
  const location = useLocation()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemStatus, setSystemStatus] = useState({
    threats: Math.floor(Math.random() * 1000000),
    uptime: 99.97,
    activeUsers: Math.floor(Math.random() * 100000),
    securityScore: 98.4 + Math.random() * 1.6
  })
  const navRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Base navigation items - always visible
  const baseNavItems: NavItem[] = [
    { 
      path: '/', 
      label: 'NEXUS', 
      icon: '⬢', 
      description: 'Quantum Hub',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
      shortcut: 'H'
    },
    { 
      path: '/detector', 
      label: 'SCAN', 
      icon: '🛡️', 
      description: 'Threat Detection',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      shortcut: 'S'
    },
    { 
      path: '/training', 
      label: 'NEURAL', 
      icon: '🧠', 
      description: 'AI Training',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      shortcut: 'T'
    },
    { 
      path: '/lab', 
      label: 'LAB', 
      icon: '🔬', 
      description: 'Forensics Lab',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shortcut: 'L'
    },
    { 
      path: '/awareness', 
      label: 'LEARN', 
      icon: '📚', 
      description: 'Cyber Awareness',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      shortcut: 'E'
    }
  ]

  // Additional items for authenticated users
  const authNavItems: NavItem[] = [
    { 
      path: '/dashboard', 
      label: 'COMMAND', 
      icon: '📊', 
      description: 'Control Center',
      gradient: 'linear-gradient(135deg, #00d4ff 0%, #06b6d4 100%)',
      shortcut: 'D'
    }
  ]

  const allNavItems = user ? [...baseNavItems, ...authNavItems] : baseNavItems

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Randomly update system metrics for realism
      if (Math.random() < 0.1) {
        setSystemStatus(prev => ({
          ...prev,
          threats: prev.threats + Math.floor(Math.random() * 10),
          securityScore: Math.min(100, prev.securityScore + (Math.random() - 0.5) * 0.1)
        }))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Mouse tracking for holographic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey) {
        const item = allNavItems.find(item => 
          item.shortcut?.toLowerCase() === e.key.toLowerCase()
        )
        if (item) {
          e.preventDefault()
          navigate(item.path)
          audioManager.playClick()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [allNavItems, navigate, audioManager])

  const handleNavClick = (path: string) => {
    audioManager.playClick()
    setIsExpanded(false)
    navigate(path)
  }

  const handleLogout = async () => {
    try {
      audioManager.playClick()
      await signOut()
      setIsExpanded(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <>
      <div className="quantum-nav-container">
        <motion.div
          ref={navRef}
          className={`quantum-floating-nav ${isExpanded ? 'expanded' : ''}`}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          onMouseEnter={() => {
            setIsHovered(true)
            setIsExpanded(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsExpanded(false)
            setActiveItem(null)
          }}
        >
          {/* Core Hub - Always visible */}
          <motion.div 
            className="nav-core-hub"
            animate={{ 
              rotate: isHovered ? 180 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="hub-icon">⬢</div>
            <div className="quantum-particles">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="particle" 
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    rotate: `${i * 60}deg`
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Navigation Ring */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                className="nav-ring"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                {allNavItems.map((item, index) => {
                  const angle = (index / allNavItems.length) * 360
                  const isActive = location.pathname === item.path
                  
                  return (
                    <motion.div
                      key={item.path}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      style={{
                        transform: `rotate(${angle}deg) translateY(-160px) rotate(-${angle}deg)`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        background: activeItem === item.path ? item.gradient : undefined
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      onClick={() => handleNavClick(item.path)}
                      onMouseEnter={() => {
                        setActiveItem(item.path)
                        audioManager.playHover()
                      }}
                      onMouseLeave={() => setActiveItem(null)}
                    >
                      <div className="nav-item-content">
                        <div className="nav-item-icon">{item.icon}</div>
                        <div className="nav-item-label">{item.label}</div>
                        {item.shortcut && (
                          <div className="nav-shortcut">
                            Ctrl+{item.shortcut}
                          </div>
                        )}
                      </div>
                      
                      {/* Item description tooltip */}
                      {activeItem === item.path && (
                        <motion.div 
                          className="nav-tooltip"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          {item.description}
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}

                {/* User section */}
                <motion.div
                  className="nav-user-section"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: allNavItems.length * 0.1, duration: 0.3 }}
                >
                  {user ? (
                    <div className="user-info">
                      <div className="user-avatar">
                        <div className="avatar-icon">👤</div>
                        <div className="user-status online"></div>
                      </div>
                      <div className="user-details">
                        <div className="user-name">
                          {user.email?.split('@')[0]?.toUpperCase() || 'USER'}
                        </div>
                        <button 
                          className="logout-btn" 
                          onClick={handleLogout}
                          title="Logout"
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to="/auth"
                      className="auth-btn"
                      onClick={() => audioManager.playClick()}
                    >
                      <div className="auth-icon">🔐</div>
                      <div className="auth-text">ACCESS</div>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quantum Status Display */}
          {isExpanded && (
            <motion.div 
              className="quantum-status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="status-time">
                <span className="time-label">QUANTUM TIME</span>
                <span className="time-value">{formatTime(currentTime)}</span>
              </div>
              <div className="status-metrics">
                <div className="metric">
                  <span className="metric-label">THREATS</span>
                  <span className="metric-value">{systemStatus.threats.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">UPTIME</span>
                  <span className="metric-value">{systemStatus.uptime}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">SECURITY</span>
                  <span className="metric-value">{systemStatus.securityScore.toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Holographic Trail Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="holographic-trail"
              style={{
                left: mousePosition.x - 10,
                top: mousePosition.y - 10,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Quantum Background Resonance */}
      {isExpanded && (
        <div className="quantum-background-resonance">
          <div className="resonance-rings">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`ring ring-${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default QuantumFloatingNav