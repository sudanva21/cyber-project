import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import AudioManager from '../utils/AudioManager'
import { useSupabase } from '../providers/SupabaseProvider'
import './Navigation.css'

interface NavigationProps {
  audioManager: AudioManager
  onAuthClick: () => void
  user: User | null
}

const Navigation: React.FC<NavigationProps> = ({ audioManager, onAuthClick, user }) => {
  const { signOut } = useSupabase()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleNavClick = () => {
    audioManager.playClick()
  }

  const handleLogout = async () => {
    audioManager.playClick()
    try {
      await signOut()
      // User will be automatically redirected due to auth state change
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { path: '/', label: 'HOME', icon: '◉' },
    { path: '/simulator', label: 'ATTACK SIM', icon: '⚡' },
    { path: '/detector', label: 'THREAT SCAN', icon: '🛡️' },
    { path: '/awareness', label: 'TRAINING', icon: '🎓' },
  ]

  if (user) {
    navItems.push({ path: '/dashboard', label: 'DASHBOARD', icon: '📊' })
  }

  return (
    <nav className="cyber-nav">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <div className="logo-icon">⬢</div>
          <div className="logo-text">
            <span className="logo-main">CYBERSEC</span>
            <span className="logo-sub">PORTAL</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {navItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label font-code">{label}</span>
              <div className="nav-underline" />
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          {/* Authentication */}
          <div className="auth-section">
            {user ? (
              <div className="user-info">
                <div className="user-status">
                  <span className="status-dot online" />
                  <span className="user-name font-code">
                    {user.email?.split('@')[0]?.toUpperCase() || 'USER'}
                  </span>
                </div>
                <button 
                  className="logout-btn" 
                  onClick={handleLogout}
                  title="Logout"
                >
                  <span className="logout-icon">🚪</span>
                  <span className="logout-text font-code">LOGOUT</span>
                </button>
              </div>
            ) : (
              <button 
                className="auth-btn" 
                onClick={() => {
                  handleNavClick()
                  onAuthClick()
                }}
              >
                <span className="auth-text font-code">ACCESS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="nav-status-bar">
        <div className="status-items">
          <div className="status-item">
            <span className="status-dot secure" />
            <span className="status-text font-code">SECURE CONNECTION</span>
          </div>
          <div className="status-item">
            <span className="status-dot online" />
            <span className="status-text font-code">AI DETECTION: ACTIVE</span>
          </div>
          <div className="status-item">
            <span className="status-dot warning" />
            <span className="status-text font-code">FIREWALL: ENABLED</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation