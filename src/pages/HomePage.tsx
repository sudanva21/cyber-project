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
  const [stats, setStats] = useState({
    threatsBlocked: 0,
    scansCompleted: 0,
    usersProtected: 0,
    uptime: 99.9
  })

  const [currentThreat, setCurrentThreat] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [typedText, setTypedText] = useState('')
  const [networkActivity, setNetworkActivity] = useState<Array<{
    id: string
    type: 'scan' | 'block' | 'allow'
    source: string
    target: string
    timestamp: Date
  }>>([])

  const threats = [
    'AI THREAT ANALYSIS IN PROGRESS',
    'SCANNING NETWORK PERIMETERS', 
    'MONITORING ANOMALOUS BEHAVIOR',
    'VALIDATING SECURITY PROTOCOLS',
    'ANALYZING TRAFFIC PATTERNS',
    'THREAT INTELLIGENCE UPDATING'
  ]

  const heroText = "ELITE CYBERSECURITY COMMAND CENTER"
  
  const companyStats = [
    { value: "99.97%", label: "THREAT DETECTION RATE", icon: "🛡️" },
    { value: "24/7", label: "CONTINUOUS MONITORING", icon: "👁️" },
    { value: "500K+", label: "THREATS NEUTRALIZED", icon: "⚡" },
    { value: "< 0.2s", label: "RESPONSE TIME", icon: "🚀" }
  ]

  useEffect(() => {
    // Animate stats on load
    const animateStats = () => {
      let threatsCount = 0
      let scansCount = 0
      let usersCount = 0
      
      const interval = setInterval(() => {
        if (threatsCount < 2847) {
          threatsCount += Math.floor(Math.random() * 75) + 15
          setStats(prev => ({ ...prev, threatsBlocked: Math.min(threatsCount, 2847) }))
        }
        
        if (scansCount < 12934) {
          scansCount += Math.floor(Math.random() * 250) + 75
          setStats(prev => ({ ...prev, scansCompleted: Math.min(scansCount, 12934) }))
        }
        
        if (usersCount < 45620) {
          usersCount += Math.floor(Math.random() * 400) + 150
          setStats(prev => ({ ...prev, usersProtected: Math.min(usersCount, 45620) }))
        }
        
        if (threatsCount >= 2847 && scansCount >= 12934 && usersCount >= 45620) {
          clearInterval(interval)
        }
      }, 80)
    }

    // Typing effect for hero text
    let typeIndex = 0
    const typeInterval = setInterval(() => {
      if (typeIndex < heroText.length) {
        setTypedText(heroText.substring(0, typeIndex + 1))
        typeIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)

    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Cycle through threat messages
    const threatInterval = setInterval(() => {
      setCurrentThreat(threats[Math.floor(Math.random() * threats.length)])
    }, 3000)

    // Generate network activity
    const activityInterval = setInterval(() => {
      const activity = {
        id: Math.random().toString(36).substr(2, 9),
        type: ['scan', 'block', 'allow'][Math.floor(Math.random() * 3)] as 'scan' | 'block' | 'allow',
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: `PORT ${Math.floor(Math.random() * 65535)}`,
        timestamp: new Date()
      }
      
      setNetworkActivity(prev => [activity, ...prev.slice(0, 5)])
    }, 2500)

    animateStats()
    setCurrentThreat(threats[0])

    return () => {
      clearInterval(typeInterval)
      clearInterval(timeInterval)
      clearInterval(threatInterval)
      clearInterval(activityInterval)
    }
  }, [])

  const handleFeatureClick = (path: string, e?: React.MouseEvent) => {
    audioManager.playClick()
    
    // If user is not authenticated and trying to access protected features
    if (!user && path !== '/') {
      e?.preventDefault()
      onAuthRequired()
    }
  }

  return (
    <div className="home-page">
      {/* System Status Header */}
      <section className="system-status-bar">
        <div className="status-container">
          <div className="system-info">
            <span className="system-indicator">
              <span className="status-dot online" />
              SYSTEM OPERATIONAL
            </span>
            <span className="system-time font-code">
              {currentTime.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </span>
          </div>
          <div className="threat-level">
            <span className="threat-indicator">
              <span className="status-dot warning" />
              DEFCON 3
            </span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="command-prompt">
              <span className="prompt-symbol">root@cybersec:~$ </span>
              <span className="typed-command">initialize_defense_systems</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line typing-text">{typedText}</span>
              <span className="cursor">|</span>
            </h1>
            <p className="hero-description">
              Next-generation cybersecurity platform powered by artificial intelligence.
              Real-time threat detection, advanced behavioral analysis, and autonomous response capabilities
              designed for enterprise-grade protection in the modern digital landscape.
            </p>
            
            {/* Live Status */}
            <div className="live-status">
              <div className="status-indicator">
                <span className="status-dot pulse" />
                <span className="status-text font-code">{currentThreat}</span>
              </div>
            </div>
          </div>

          {/* Company Performance Stats */}
          <div className="company-stats">
            {companyStats.map((stat, index) => (
              <div key={index} className="company-stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-description font-code">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Performance Metrics */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.threatsBlocked.toLocaleString()}</div>
              <div className="stat-label font-code">THREATS NEUTRALIZED TODAY</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.scansCompleted.toLocaleString()}</div>
              <div className="stat-label font-code">SECURITY SCANS EXECUTED</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.usersProtected.toLocaleString()}</div>
              <div className="stat-label font-code">ENDPOINTS PROTECTED</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.uptime}%</div>
              <div className="stat-label font-code">PLATFORM AVAILABILITY</div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="hero-actions">
          <Link 
            to="/dashboard" 
            className="cta-btn primary-large"
            onClick={(e) => handleFeatureClick('/dashboard', e)}
          >
            <div className="btn-content">
              <span className="btn-icon">🚀</span>
              <div className="btn-text-container">
                <span className="btn-text font-code">ACCESS COMMAND CENTER</span>
                <span className="btn-subtext">Full cybersecurity dashboard</span>
              </div>
            </div>
          </Link>
          <Link 
            to="/simulator" 
            className="cta-btn secondary"
            onClick={(e) => handleFeatureClick('/simulator', e)}
          >
            <span className="btn-icon">⚡</span>
            <span className="btn-text font-code">ATTACK SIMULATOR</span>
          </Link>
          <Link 
            to="/detector" 
            className="cta-btn secondary"
            onClick={(e) => handleFeatureClick('/detector', e)}
          >
            <span className="btn-icon">🛡️</span>
            <span className="btn-text font-code">THREAT DETECTOR</span>
          </Link>
        </div>
      </section>

      {/* Professional Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">ENTERPRISE SECURITY SOLUTIONS</h2>
          <p className="section-description">
            Military-grade cybersecurity tools engineered for maximum protection efficiency.
            Each module utilizes cutting-edge AI algorithms and machine learning capabilities 
            to deliver unparalleled security performance in real-world scenarios.
          </p>
        </div>

        <div className="features-grid">
          <Link 
            to="/dashboard" 
            className="feature-card featured"
            onClick={(e) => handleFeatureClick('/dashboard', e)}
          >
            <div className="feature-badge">FLAGSHIP PRODUCT</div>
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Command Center</h3>
            <p className="feature-description">
              Comprehensive cybersecurity command and control center featuring real-time 
              threat monitoring, security analytics, and complete protection oversight.
            </p>
            <div className="feature-stats">
              <span className="stat premium">360° Protection</span>
              <span className="stat premium">AI-Powered Analytics</span>
              <span className="stat premium">Enterprise Ready</span>
            </div>
            <div className="feature-metrics">
              <div className="metric">
                <span className="metric-value">99.97%</span>
                <span className="metric-label">Detection Rate</span>
              </div>
              <div className="metric">
                <span className="metric-value">&lt;0.2s</span>
                <span className="metric-label">Response Time</span>
              </div>
            </div>
          </Link>

          <Link 
            to="/simulator" 
            className="feature-card"
            onClick={(e) => handleFeatureClick('/simulator', e)}
          >
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Attack Simulator</h3>
            <p className="feature-description">
              Advanced penetration testing environment with realistic attack scenarios.
              Train your defense capabilities against sophisticated cyber threats.
            </p>
            <div className="feature-stats">
              <span className="stat">50+ Attack Vectors</span>
              <span className="stat">Real-time Analysis</span>
              <span className="stat">Progressive Learning</span>
            </div>
          </Link>

          <Link 
            to="/detector" 
            className="feature-card"
            onClick={(e) => handleFeatureClick('/detector', e)}
          >
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Threat Intelligence</h3>
            <p className="feature-description">
              Next-generation threat detection powered by machine learning algorithms.
              Autonomous scanning with predictive threat analysis capabilities.
            </p>
            <div className="feature-stats">
              <span className="stat">99.9% Accuracy</span>
              <span className="stat">Zero-Day Detection</span>
              <span className="stat">Behavioral Analysis</span>
            </div>
          </Link>

          <Link 
            to="/awareness" 
            className="feature-card"
            onClick={(e) => handleFeatureClick('/awareness', e)}
          >
            <div className="feature-icon">🎓</div>
            <h3 className="feature-title">Security Training</h3>
            <p className="feature-description">
              Comprehensive cybersecurity education platform with interactive modules
              and hands-on exercises designed for security professionals.
            </p>
            <div className="feature-stats">
              <span className="stat">Professional Grade</span>
              <span className="stat">Certification Ready</span>
              <span className="stat">Interactive Labs</span>
            </div>
          </Link>

          <div className="feature-card premium coming-soon">
            <div className="feature-badge premium">PREMIUM</div>
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Security Guardian</h3>
            <p className="feature-description">
              Autonomous AI-driven security system with predictive threat modeling,
              behavioral analysis, and proactive defense mechanisms.
            </p>
            <div className="feature-stats">
              <span className="stat premium">Deep Learning</span>
              <span className="stat premium">Predictive AI</span>
              <span className="stat premium">Autonomous Response</span>
            </div>
            <div className="coming-soon-badge premium">Q2 2025</div>
          </div>

          <div className="feature-card enterprise coming-soon">
            <div className="feature-badge enterprise">ENTERPRISE</div>
            <div className="feature-icon">🏢</div>
            <h3 className="feature-title">Enterprise SOC</h3>
            <p className="feature-description">
              Complete Security Operations Center solution with 24/7 monitoring,
              incident response automation, and compliance reporting.
            </p>
            <div className="feature-stats">
              <span className="stat enterprise">24/7 Monitoring</span>
              <span className="stat enterprise">Compliance Ready</span>
              <span className="stat enterprise">Multi-Tenant</span>
            </div>
            <div className="coming-soon-badge enterprise">Q3 2025</div>
          </div>
        </div>
      </section>

      {/* Live Security Operations Center */}
      <section className="activity-section">
        <div className="section-header">
          <h2 className="section-title">REAL-TIME SECURITY OPERATIONS CENTER</h2>
          <div className="soc-controls">
            <div className="monitor-status">
              <span className="status-dot online pulse" />
              <span className="status-text font-code">SOC ACTIVE</span>
            </div>
            <div className="soc-metrics">
              <span className="metric-item">
                <span className="metric-label">Monitored IPs:</span>
                <span className="metric-value text-cyber-primary">8,472</span>
              </span>
              <span className="metric-item">
                <span className="metric-label">Active Sensors:</span>
                <span className="metric-value text-cyber-success">247</span>
              </span>
            </div>
          </div>
        </div>

        <div className="soc-dashboard">
          {/* Quick Security Metrics */}
          <div className="security-metrics">
            <div className="metric-card">
              <div className="metric-icon">🚨</div>
              <div className="metric-info">
                <div className="metric-number text-cyber-danger">34</div>
                <div className="metric-desc">Critical Alerts</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">⚠️</div>
              <div className="metric-info">
                <div className="metric-number text-cyber-warning">127</div>
                <div className="metric-desc">Warnings</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🔍</div>
              <div className="metric-info">
                <div className="metric-number text-cyber-primary">1,849</div>
                <div className="metric-desc">Active Scans</div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-info">
                <div className="metric-number text-cyber-success">12,378</div>
                <div className="metric-desc">Resolved</div>
              </div>
            </div>
          </div>

          {/* Live Activity Monitor */}
          <div className="activity-monitor">
            <div className="monitor-header">
              <h3 className="monitor-title font-code">LIVE THREAT INTELLIGENCE FEED</h3>
              <div className="monitor-controls">
                <span className="control-indicator">
                  <span className="indicator-dot scanning" />
                  SCANNING
                </span>
              </div>
            </div>
            
            <div className="activity-header font-code">
              <span>TIMESTAMP</span>
              <span>EVENT TYPE</span>
              <span>SOURCE IP</span>
              <span>TARGET/PORT</span>
              <span>THREAT LEVEL</span>
            </div>
            
            {networkActivity.map((activity) => (
              <div key={activity.id} className={`activity-row ${activity.type}`}>
                <span className="activity-time font-code">
                  {activity.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span className="activity-action font-code">
                  {activity.type === 'scan' ? 'PORT_SCAN' : 
                   activity.type === 'block' ? 'THREAT_BLOCKED' : 'ACCESS_GRANTED'}
                </span>
                <span className="activity-source font-code">
                  {activity.source}
                </span>
                <span className="activity-target font-code">
                  {activity.target}
                </span>
                <span className={`activity-status ${activity.type} font-code`}>
                  {activity.type === 'block' ? 'HIGH RISK' : 
                   activity.type === 'allow' ? 'SAFE' : 'INVESTIGATING'}
                </span>
              </div>
            ))}
            
            {networkActivity.length === 0 && (
              <div className="activity-placeholder">
                <div className="placeholder-content">
                  <div className="scanning-indicator">
                    <div className="scan-line"></div>
                  </div>
                  <span className="placeholder-text font-code">
                    Initializing security monitoring systems...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="soc-footer">
          <p className="footer-description">
            Experience enterprise-grade security monitoring with our comprehensive SOC platform.
            Advanced threat detection, real-time incident response, and proactive security management.
          </p>
          <Link 
            to="/dashboard" 
            className="footer-cta"
            onClick={(e) => handleFeatureClick('/dashboard', e)}
          >
            <span className="cta-icon">🎯</span>
            <span className="cta-text font-code">EXPLORE FULL SOC CAPABILITIES</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage