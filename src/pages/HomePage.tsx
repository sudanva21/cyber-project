import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import './HomePage.css'

interface HomePageProps {
  audioManager: AudioManager
  onAuthRequired: () => void
}

const HomePage: React.FC<HomePageProps> = ({ audioManager, onAuthRequired }) => {
  const { user } = useSupabase()
  const [typedText, setTypedText] = useState('')

  const heroText = "CYBERSEC PORTAL"
  
  useEffect(() => {
    // Simple typing effect
    let typeIndex = 0
    const typeInterval = setInterval(() => {
      if (typeIndex < heroText.length) {
        setTypedText(heroText.substring(0, typeIndex + 1))
        typeIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 120)

    return () => clearInterval(typeInterval)
  }, [])

  const handleFeatureClick = (path: string, e?: React.MouseEvent) => {
    audioManager.playClick()
    
    if (!user && path !== '/') {
      e?.preventDefault()
      onAuthRequired()
    }
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-text">{typedText}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-subtitle">
            Advanced Cybersecurity Training Platform
          </p>
          <p className="hero-description">
            Learn cybersecurity through hands-on simulations, interactive training,
            and real-world scenarios designed for modern digital threats.
          </p>
          
          <div className="hero-actions">
            <Link 
              to="/dashboard" 
              className="cta-btn primary"
              onClick={(e) => handleFeatureClick('/dashboard', e)}
            >
              <span className="btn-icon">🚀</span>
              <span className="btn-text">GET STARTED</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">UPTIME</div>
          </div>
          <div className="stat">
            <div className="stat-value">24/7</div>
            <div className="stat-label">MONITORING</div>
          </div>
          <div className="stat">
            <div className="stat-value">500K+</div>
            <div className="stat-label">PROTECTED</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Security Training Modules</h2>
        </div>

        <div className="features-grid">
          <Link 
            to="/simulator" 
            className="feature-card"
            onClick={(e) => handleFeatureClick('/simulator', e)}
          >
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Attack Simulator</h3>
            <p className="feature-description">
              Practice defending against real-world cyber attacks in a safe environment.
            </p>
          </Link>

          <Link 
            to="/detector" 
            className="feature-card"
            onClick={(e) => handleFeatureClick('/detector', e)}
          >
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Threat Detection</h3>
            <p className="feature-description">
              Learn to identify and analyze security threats using AI-powered tools.
            </p>
          </Link>

          <Link 
            to="/awareness" 
            className="feature-card"
            onClick={(e) => handleFeatureClick('/awareness', e)}
          >
            <div className="feature-icon">🎓</div>
            <h3 className="feature-title">Security Training</h3>
            <p className="feature-description">
              Interactive courses covering essential cybersecurity concepts and best practices.
            </p>
          </Link>

          <Link 
            to="/dashboard" 
            className="feature-card featured"
            onClick={(e) => handleFeatureClick('/dashboard', e)}
          >
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Dashboard</h3>
            <p className="feature-description">
              Monitor your progress and access comprehensive security analytics.
            </p>
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="cta-content">
          <h3 className="cta-title">Ready to enhance your cybersecurity skills?</h3>
          <p className="cta-description">
            Join thousands of security professionals advancing their expertise.
          </p>
          <Link 
            to="/dashboard" 
            className="cta-btn secondary"
            onClick={(e) => handleFeatureClick('/dashboard', e)}
          >
            <span className="btn-text">START LEARNING</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage