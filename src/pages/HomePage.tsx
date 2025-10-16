import React, { useState, useEffect, useRef } from 'react'
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
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [liveMetrics, setLiveMetrics] = useState({
    threats: 157293,
    blocked: 99.97,
    responseTime: 0.14,
    users: 847521
  })
  const [activeTerminalLine, setActiveTerminalLine] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const heroText = "◢ NEXUS CYBER DEFENSE MATRIX ◣"
  const terminalLines = [
    "> Initializing quantum encryption protocols...",
    "> Neural network threat analysis: ACTIVE",
    "> AI-powered defensive systems: ONLINE",
    "> Real-time vulnerability assessment: RUNNING",
    "> Predictive threat modeling: OPERATIONAL"
  ]

  // Advanced typing effect with glitch simulation
  useEffect(() => {
    let typeIndex = 0
    const typeInterval = setInterval(() => {
      if (typeIndex < heroText.length) {
        setTypedText(heroText.substring(0, typeIndex + 1))
        typeIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => setIsScanning(true), 500)
      }
    }, 80)

    return () => clearInterval(typeInterval)
  }, [])

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Scanning animation
  useEffect(() => {
    if (!isScanning) return

    let progress = 0
    const scanInterval = setInterval(() => {
      progress += Math.random() * 15
      setScanProgress(Math.min(progress, 100))
      
      if (progress >= 100) {
        clearInterval(scanInterval)
        setTimeout(() => {
          setScanProgress(0)
          setIsScanning(false)
          setTimeout(() => setIsScanning(true), 2000)
        }, 1000)
      }
    }, 200)

    return () => clearInterval(scanInterval)
  }, [isScanning])

  // Live metrics animation
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setLiveMetrics(prev => ({
        threats: prev.threats + Math.floor(Math.random() * 50),
        blocked: Math.min(99.99, prev.blocked + (Math.random() * 0.01)),
        responseTime: Math.max(0.05, prev.responseTime + (Math.random() * 0.1 - 0.05)),
        users: prev.users + Math.floor(Math.random() * 10)
      }))
    }, 3000)

    return () => clearInterval(metricsInterval)
  }, [])

  // Terminal animation
  useEffect(() => {
    const terminalInterval = setInterval(() => {
      setActiveTerminalLine(prev => (prev + 1) % terminalLines.length)
    }, 2500)

    return () => clearInterval(terminalInterval)
  }, [])

  // Neural network canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const nodes = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      pulse: Math.random() * Math.PI * 2
    }))

    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.1
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
        
        const alpha = 0.3 + Math.sin(node.pulse) * 0.2
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw connections
        nodes.slice(i + 1).forEach(otherNode => {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          )
          
          if (distance < 150) {
            ctx.strokeStyle = `rgba(255, 0, 110, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })
      })
      
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()
    return () => cancelAnimationFrame(animationFrame)
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
      {/* Quantum Header */}
      <div className="quantum-header">
        <div className="system-status">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>QUANTUM SECURED</span>
          </div>
          <div className="timestamp">
            {currentTime.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Neural Network Background */}
      <canvas ref={canvasRef} className="neural-canvas" />

      {/* Hero Matrix Section */}
      <section className="hero-matrix">
        <div className="matrix-grid">
          <div className="hero-content">
            <div className="command-prompt">
              <div className="prompt-header">
                <div className="window-controls">
                  <span></span><span></span><span></span>
                </div>
                <span className="terminal-title">NEXUS_CORE_v3.7.1</span>
              </div>
              <div className="prompt-body">
                <div className="command-line">
                  <span className="prompt">root@nexus:~$</span>
                  <span className="command">initialize --quantum-defense</span>
                </div>
                {terminalLines.map((line, index) => (
                  <div
                    key={index}
                    className={`terminal-line ${index === activeTerminalLine ? 'active' : ''}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <h1 className="hero-title">
              <span className="title-text">{typedText}</span>
              <span className="quantum-cursor">█</span>
            </h1>
            
            <p className="hero-subtitle">
              Next-Generation AI-Powered Cybersecurity Ecosystem
            </p>
            
            <div className="scanning-display">
              {isScanning && (
                <div className="scan-container">
                  <div className="scan-text">◤ QUANTUM SCAN IN PROGRESS ◥</div>
                  <div className="scan-progress">
                    <div 
                      className="scan-bar" 
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <div className="scan-percentage">{Math.floor(scanProgress)}%</div>
                </div>
              )}
            </div>

            <div className="hero-actions">
              <Link 
                to="/dashboard" 
                className="quantum-btn primary"
                onClick={(e) => handleFeatureClick('/dashboard', e)}
              >
                <div className="btn-core">
                  <span className="btn-icon">⟨⟩</span>
                  <span className="btn-text">ENTER NEXUS</span>
                  <span className="btn-pulse"></span>
                </div>
              </Link>
            </div>
          </div>

          <div className="metrics-hologram">
            <div className="hologram-header">
              <h3>◆ LIVE DEFENSE METRICS ◆</h3>
            </div>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">🔥</div>
                <div className="metric-value">{liveMetrics.threats.toLocaleString()}</div>
                <div className="metric-label">THREATS ANALYZED</div>
                <div className="metric-trend">+{Math.floor(Math.random() * 200)}/hr</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">🛡️</div>
                <div className="metric-value">{liveMetrics.blocked.toFixed(2)}%</div>
                <div className="metric-label">BLOCK RATE</div>
                <div className="metric-trend">↗ +0.01%</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⚡</div>
                <div className="metric-value">{liveMetrics.responseTime.toFixed(2)}s</div>
                <div className="metric-label">RESPONSE TIME</div>
                <div className="metric-trend">OPTIMAL</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">👥</div>
                <div className="metric-value">{liveMetrics.users.toLocaleString()}</div>
                <div className="metric-label">ACTIVE USERS</div>
                <div className="metric-trend">+{Math.floor(Math.random() * 50)}/min</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Modules */}
      <section className="quantum-modules">
        <div className="modules-header">
          <h2 className="section-title">◈ QUANTUM DEFENSE MODULES ◈</h2>
          <p className="section-subtitle">Experience next-generation cybersecurity training</p>
        </div>

        <div className="modules-constellation">
          <Link 
            to="/simulator" 
            className="module-orb attack"
            onClick={(e) => handleFeatureClick('/simulator', e)}
          >
            <div className="orb-core">
              <div className="orb-icon">⚔️</div>
              <div className="orb-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <div className="orb-info">
              <h3>NEURAL ATTACK SIM</h3>
              <p>AI-powered adversarial training scenarios</p>
              <div className="orb-stats">
                <span>◆ 47 Scenarios</span>
                <span>◆ Real-time Analysis</span>
              </div>
            </div>
          </Link>

          <Link 
            to="/detector" 
            className="module-orb detection"
            onClick={(e) => handleFeatureClick('/detector', e)}
          >
            <div className="orb-core">
              <div className="orb-icon">🔍</div>
              <div className="orb-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <div className="orb-info">
              <h3>QUANTUM DETECTOR</h3>
              <p>Multi-dimensional threat analysis engine</p>
              <div className="orb-stats">
                <span>◆ 99.97% Accuracy</span>
                <span>◆ Sub-millisecond Detection</span>
              </div>
            </div>
          </Link>

          <Link 
            to="/awareness" 
            className="module-orb learning"
            onClick={(e) => handleFeatureClick('/awareness', e)}
          >
            <div className="orb-core">
              <div className="orb-icon">🧠</div>
              <div className="orb-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <div className="orb-info">
              <h3>MIND FORTRESS</h3>
              <p>Cognitive cybersecurity enhancement protocols</p>
              <div className="orb-stats">
                <span>◆ Adaptive Learning</span>
                <span>◆ Neural Pathways</span>
              </div>
            </div>
          </Link>

          <Link 
            to="/dashboard" 
            className="module-orb command featured"
            onClick={(e) => handleFeatureClick('/dashboard', e)}
          >
            <div className="orb-core">
              <div className="orb-icon">⚡</div>
              <div className="orb-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <div className="orb-info">
              <h3>COMMAND NEXUS</h3>
              <p>Central intelligence and control matrix</p>
              <div className="orb-stats">
                <span>◆ Real-time Insights</span>
                <span>◆ Quantum Analytics</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Quantum Portal */}
      <section className="quantum-portal">
        <div className="portal-container">
          <div className="portal-core">
            <div className="portal-rings">
              <div className="portal-ring ring-1"></div>
              <div className="portal-ring ring-2"></div>
              <div className="portal-ring ring-3"></div>
              <div className="portal-ring ring-4"></div>
            </div>
            <div className="portal-center">
              <h3>READY TO ASCEND?</h3>
              <p>Join the quantum revolution in cybersecurity</p>
              <Link 
                to="/dashboard" 
                className="portal-btn"
                onClick={(e) => handleFeatureClick('/dashboard', e)}
              >
                <span>◈ ENTER THE MATRIX ◈</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage