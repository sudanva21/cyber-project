import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AudioManager from '../utils/AudioManager'
import BackButton from '../components/BackButton'

interface QuantumDetectorProps {
  audioManager: AudioManager
  onThreatDetected: (threat: string) => void
}

interface ThreatData {
  id: string
  type: 'malware' | 'phishing' | 'ddos' | 'ransomware' | 'breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  target: string
  timestamp: Date
  blocked: boolean
}

const QuantumDetector: React.FC<QuantumDetectorProps> = ({ audioManager, onThreatDetected }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [threats, setThreats] = useState<ThreatData[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const [quantumState, setQuantumState] = useState<'idle' | 'scanning' | 'analyzing' | 'complete'>('idle')
  const radarRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    audioManager?.playPageTransition?.()
    initializeQuantumDetector()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [audioManager])

  const initializeQuantumDetector = () => {
    // Generate some sample threat data
    const sampleThreats: ThreatData[] = [
      {
        id: '001',
        type: 'malware',
        severity: 'high',
        source: '192.168.1.45',
        target: 'Server-01',
        timestamp: new Date(),
        blocked: true
      },
      {
        id: '002',
        type: 'phishing',
        severity: 'medium',
        source: 'external.malicious.com',
        target: 'User-Email',
        timestamp: new Date(Date.now() - 300000),
        blocked: false
      }
    ]
    
    setThreats(sampleThreats)
  }

  const startQuantumScan = async () => {
    setIsScanning(true)
    setQuantumState('scanning')
    setScanProgress(0)
    
    audioManager?.playClick?.()
    
    // Simulate scanning process
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 5
        if (newProgress >= 100) {
          clearInterval(scanInterval)
          setQuantumState('analyzing')
          setTimeout(() => {
            completeScan()
          }, 2000)
          return 100
        }
        return newProgress
      })
    }, 200)
    
    // Start radar animation
    animateQuantumRadar()
  }

  const completeScan = () => {
    setQuantumState('complete')
    setIsScanning(false)
    
    // Generate new threats
    const newThreat: ThreatData = {
      id: Date.now().toString(),
      type: ['malware', 'phishing', 'ddos', 'ransomware'][Math.floor(Math.random() * 4)] as any,
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      target: 'System-' + Math.floor(Math.random() * 10),
      timestamp: new Date(),
      blocked: Math.random() > 0.3
    }
    
    setThreats(prev => [newThreat, ...prev].slice(0, 10))
    onThreatDetected(`${newThreat.type} attack detected`)
    
    setTimeout(() => {
      setQuantumState('idle')
      setScanProgress(0)
    }, 3000)
  }

  const animateQuantumRadar = () => {
    const canvas = radarRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20
    let angle = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw radar circles
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)'
      ctx.lineWidth = 1
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, (maxRadius / 4) * i, 0, 2 * Math.PI)
        ctx.stroke()
      }
      
      // Draw sweep line
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + Math.cos(angle) * maxRadius,
        centerY + Math.sin(angle) * maxRadius
      )
      ctx.stroke()
      
      // Draw sweep gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
      gradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)')
      gradient.addColorStop(1, 'transparent')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, maxRadius, angle - 0.5, angle)
      ctx.lineTo(centerX, centerY)
      ctx.fill()
      
      // Draw threat dots
      threats.forEach((threat, index) => {
        const threatAngle = (index / threats.length) * 2 * Math.PI
        const threatRadius = (maxRadius / 4) * (1 + Math.random() * 3)
        const x = centerX + Math.cos(threatAngle) * threatRadius
        const y = centerY + Math.sin(threatAngle) * threatRadius
        
        ctx.fillStyle = threat.severity === 'critical' ? '#ff0000' : 
                       threat.severity === 'high' ? '#ff8800' :
                       threat.severity === 'medium' ? '#ffff00' : '#00ff00'
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
        
        // Pulse effect
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.arc(x, y, 4 + Math.sin(Date.now() / 200) * 3, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.globalAlpha = 1
      })
      
      angle += 0.02
      if (isScanning) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff0000'
      case 'high': return '#ff8800'
      case 'medium': return '#ffff00'
      case 'low': return '#00ff00'
      default: return '#00aaff'
    }
  }

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware': return '🦠'
      case 'phishing': return '🎣'
      case 'ddos': return '🌊'
      case 'ransomware': return '🔒'
      case 'breach': return '🔓'
      default: return '⚠️'
    }
  }

  return (
    <motion.div 
      className="quantum-detector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Back Button */}
      <BackButton audioManager={audioManager} />
      
      <div className="quantum-container">
        <motion.div 
          className="quantum-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="holographic-title">Quantum Threat Detector</h1>
          <p className="quantum-subtitle">Real-time AI-Powered Security Monitoring</p>
        </motion.div>

        <div className="detector-layout">
          <div className="radar-section">
            <div className="radar-container">
              <canvas 
                ref={radarRef} 
                width={400} 
                height={400}
                className="quantum-radar"
              />
              <div className="radar-overlay">
                <div className={`quantum-state state-${quantumState}`}>
                  {quantumState === 'idle' && '🛡️ READY'}
                  {quantumState === 'scanning' && '🔍 SCANNING'}
                  {quantumState === 'analyzing' && '🧠 ANALYZING'}
                  {quantumState === 'complete' && '✅ COMPLETE'}
                </div>
              </div>
            </div>
            
            <motion.button
              className="quantum-scan-btn"
              onClick={startQuantumScan}
              disabled={isScanning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isScanning ? 'SCANNING...' : 'INITIATE QUANTUM SCAN'}
            </motion.button>

            {scanProgress > 0 && (
              <div className="scan-progress">
                <div className="progress-label">Scan Progress: {Math.round(scanProgress)}%</div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    style={{ width: `${scanProgress}%` }}
                    animate={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="threats-section">
            <h2>Detected Threats</h2>
            <div className="threats-list">
              <AnimatePresence>
                {threats.map((threat, index) => (
                  <motion.div
                    key={threat.id}
                    className="threat-item"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="threat-header">
                      <span className="threat-icon">{getThreatIcon(threat.type)}</span>
                      <span className="threat-type">{threat.type.toUpperCase()}</span>
                      <span 
                        className="threat-severity"
                        style={{ color: getSeverityColor(threat.severity) }}
                      >
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className={`threat-status ${threat.blocked ? 'blocked' : 'active'}`}>
                        {threat.blocked ? '🛡️ BLOCKED' : '⚠️ ACTIVE'}
                      </span>
                    </div>
                    
                    <div className="threat-details">
                      <div className="threat-source">Source: {threat.source}</div>
                      <div className="threat-target">Target: {threat.target}</div>
                      <div className="threat-time">
                        {threat.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .quantum-detector {
          min-height: 100vh;
          padding: 2rem;
          background: radial-gradient(circle at 30% 70%, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
        }

        .detector-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 2rem;
        }

        .radar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .radar-container {
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(138, 43, 226, 0.5);
          border-radius: 50%;
          padding: 2rem;
        }

        .quantum-radar {
          border-radius: 50%;
          background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
        }

        .radar-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }

        .quantum-state {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(138, 43, 226, 0.6);
          border-radius: 20px;
          padding: 0.5rem 1rem;
          color: #fff;
          font-weight: bold;
          text-transform: uppercase;
        }

        .quantum-scan-btn {
          background: linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(65, 105, 225, 0.8));
          border: none;
          border-radius: 25px;
          padding: 1rem 2rem;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .quantum-scan-btn:hover:not(:disabled) {
          box-shadow: 0 0 20px rgba(138, 43, 226, 0.8);
        }

        .quantum-scan-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .scan-progress {
          width: 100%;
          max-width: 300px;
        }

        .progress-label {
          color: #fff;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8a2be2, #4169e1);
          border-radius: 4px;
        }

        .threats-section h2 {
          color: #fff;
          margin-bottom: 1rem;
        }

        .threats-list {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 1rem;
        }

        .threat-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .threat-item:hover {
          background: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.6);
        }

        .threat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .threat-icon {
          font-size: 1.5rem;
        }

        .threat-type {
          color: #fff;
          font-weight: bold;
        }

        .threat-severity {
          font-weight: bold;
          text-transform: uppercase;
        }

        .threat-status {
          margin-left: auto;
          font-size: 0.9rem;
        }

        .threat-status.blocked {
          color: #00ff88;
        }

        .threat-status.active {
          color: #ff4444;
        }

        .threat-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .detector-layout {
            grid-template-columns: 1fr;
          }
          
          .threat-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default QuantumDetector