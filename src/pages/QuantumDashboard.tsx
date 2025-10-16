import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import BackButton from '../components/BackButton'

interface QuantumDashboardProps {
  theme: 'quantum' | 'neural' | 'holographic'
  audioManager: AudioManager
  onNotification: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void
}

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  networkActivity: number
  securityScore: number
  activeThreats: number
  blockedAttacks: number
  systemUptime: number
  responseTime: number
}

interface ThreatAlert {
  id: string
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  description: string
  timestamp: Date
  status: 'active' | 'investigating' | 'resolved'
  confidence: number
}

interface SecurityTool {
  id: string
  name: string
  description: string
  icon: string
  status: 'active' | 'standby' | 'offline'
  lastScan: Date
  threatsFound: number
}

const QuantumDashboard: React.FC<QuantumDashboardProps> = ({
  theme,
  audioManager,
  onNotification
}) => {
  const { user, supabase } = useSupabase()
  const [activeView, setActiveView] = useState<'overview' | 'threats' | 'tools' | 'analytics'>('overview')
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 67,
    networkActivity: 23,
    securityScore: 98.4,
    activeThreats: 0,
    blockedAttacks: 847291,
    systemUptime: 99.97,
    responseTime: 0.12
  })
  
  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([])
  const [securityTools, setSecurityTools] = useState<SecurityTool[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [commandInput, setCommandInput] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const metricsIntervalRef = useRef<NodeJS.Timeout>()

  // Initialize dashboard
  useEffect(() => {
    initializeDashboard()
    startMetricsUpdater()
    loadThreatAlerts()
    initializeSecurityTools()

    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current)
      }
    }
  }, [])

  // Initialize 3D visualization
  useEffect(() => {
    if (canvasRef.current) {
      initializeNetworkVisualization()
    }
  }, [activeView])

  const initializeDashboard = () => {
    audioManager.playSystemOnline()
    onNotification('Quantum Dashboard Initialized', 'success')
  }

  const startMetricsUpdater = () => {
    metricsIntervalRef.current = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(95, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.max(20, Math.min(90, prev.memoryUsage + (Math.random() * 6 - 3))),
        networkActivity: Math.max(0, Math.min(100, prev.networkActivity + (Math.random() * 20 - 10))),
        activeThreats: Math.max(0, prev.activeThreats + (Math.random() > 0.95 ? 1 : 0)),
        responseTime: Math.max(0.05, prev.responseTime + (Math.random() * 0.02 - 0.01))
      }))
    }, 2000)
  }

  const loadThreatAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      const alerts: ThreatAlert[] = data.map(alert => ({
        id: alert.id,
        type: mapAlertType(alert.alert_type),
        severity: alert.severity,
        source: alert.source || 'Unknown',
        description: alert.title,
        timestamp: new Date(alert.created_at),
        status: mapAlertStatus(alert.status),
        confidence: alert.ai_confidence || 0.8
      }))

      setThreatAlerts(alerts)
    } catch (error) {
      console.error('Failed to load threat alerts:', error)
      generateMockThreatAlerts()
    }
  }

  const generateMockThreatAlerts = () => {
    const mockAlerts: ThreatAlert[] = [
      {
        id: '1',
        type: 'malware',
        severity: 'high',
        source: '192.168.1.45',
        description: 'Trojan.Gen.NPE detected in network traffic',
        timestamp: new Date(),
        status: 'investigating',
        confidence: 0.94
      },
      {
        id: '2',
        type: 'phishing',
        severity: 'medium',
        source: 'email.suspicious.com',
        description: 'Phishing attempt detected via email gateway',
        timestamp: new Date(Date.now() - 300000),
        status: 'resolved',
        confidence: 0.87
      },
      {
        id: '3',
        type: 'anomaly',
        severity: 'low',
        source: '10.0.0.123',
        description: 'Unusual outbound traffic pattern detected',
        timestamp: new Date(Date.now() - 600000),
        status: 'active',
        confidence: 0.65
      }
    ]
    setThreatAlerts(mockAlerts)
  }

  const initializeSecurityTools = () => {
    const tools: SecurityTool[] = [
      {
        id: 'quantum-scanner',
        name: 'Quantum Threat Scanner',
        description: 'AI-powered multi-vector threat detection',
        icon: '🔍',
        status: 'active',
        lastScan: new Date(Date.now() - 1800000),
        threatsFound: 12
      },
      {
        id: 'neural-firewall',
        name: 'Neural Firewall',
        description: 'Adaptive network protection system',
        icon: '🛡️',
        status: 'active',
        lastScan: new Date(),
        threatsFound: 847291
      },
      {
        id: 'behavioral-analyzer',
        name: 'Behavioral Analyzer',
        description: 'Real-time anomaly detection engine',
        icon: '🧠',
        status: 'standby',
        lastScan: new Date(Date.now() - 3600000),
        threatsFound: 45
      },
      {
        id: 'quantum-encrypt',
        name: 'Quantum Encryption',
        description: 'Unbreakable quantum key distribution',
        icon: '🔐',
        status: 'active',
        lastScan: new Date(Date.now() - 900000),
        threatsFound: 0
      }
    ]
    setSecurityTools(tools)
  }

  const mapAlertType = (type: string): ThreatAlert['type'] => {
    const typeMap: Record<string, ThreatAlert['type']> = {
      'network_intrusion': 'intrusion',
      'malware_detected': 'malware',
      'suspicious_activity': 'anomaly',
      'phishing_attempt': 'phishing',
      'ddos_attack': 'ddos'
    }
    return typeMap[type] || 'anomaly'
  }

  const mapAlertStatus = (status: string): ThreatAlert['status'] => {
    const statusMap: Record<string, ThreatAlert['status']> = {
      'new': 'active',
      'acknowledged': 'investigating',
      'resolved': 'resolved'
    }
    return statusMap[status] || 'active'
  }

  const initializeNetworkVisualization = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Create network nodes
    const nodes = [
      { x: canvas.width * 0.5, y: canvas.height * 0.5, size: 20, type: 'core', label: 'Core' },
      { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 15, type: 'server', label: 'DB' },
      { x: canvas.width * 0.8, y: canvas.height * 0.3, size: 15, type: 'server', label: 'Web' },
      { x: canvas.width * 0.3, y: canvas.height * 0.7, size: 12, type: 'client', label: 'User1' },
      { x: canvas.width * 0.7, y: canvas.height * 0.7, size: 12, type: 'client', label: 'User2' }
    ]

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 300) {
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 * (1 - distance / 300)})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        const colors = {
          core: '#00d4ff',
          server: '#7c3aed',
          client: '#10b981'
        }

        ctx.fillStyle = colors[node.type as keyof typeof colors]
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.stroke()

        // Label
        ctx.fillStyle = 'white'
        ctx.font = '12px Orbitron'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + node.size + 15)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrame)
  }

  const startSystemScan = async () => {
    setIsScanning(true)
    setScanProgress(0)
    audioManager.playTrainingStart()

    const scanTimer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanTimer)
          setIsScanning(false)
          audioManager.playScanComplete()
          onNotification('System scan completed successfully', 'success')
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 200)
  }

  const executeCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    
    if (cmd.includes('scan')) {
      startSystemScan()
    } else if (cmd.includes('status')) {
      onNotification(`System Status: ${systemMetrics.securityScore}% secure`, 'info')
    } else if (cmd.includes('clear')) {
      setThreatAlerts([])
      onNotification('Alerts cleared', 'success')
    } else {
      onNotification(`Command not recognized: ${command}`, 'warning')
    }
    
    setCommandInput('')
    audioManager.playClick()
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    }
    return colors[severity as keyof typeof colors] || '#6b7280'
  }

  return (
    <div className="quantum-dashboard" style={{ 
      minHeight: 'calc(100vh + 200px)', // Ensure content is taller than viewport
      height: 'auto',
      padding: 'clamp(1rem, 5vw, 2rem)',
      paddingBottom: 'clamp(12rem, 20vw, 16rem)', // Increased padding for fixed terminal
      background: 'rgba(0, 0, 0, 0.5)',
      overflowX: 'hidden',
      overflowY: 'auto',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Back Button */}
      <BackButton audioManager={audioManager} />
      
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          marginBottom: 'clamp(1rem, 5vw, 2rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 className="holographic-text" style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontFamily: 'Orbitron, monospace',
            marginBottom: '0.5rem'
          }}>
            QUANTUM DASHBOARD
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Real-time Cybersecurity Command Center
          </p>
        </div>

        <div className="system-status" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', color: '#10b981', marginBottom: '0.25rem' }}>
            SYSTEM ONLINE
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Uptime: {systemMetrics.systemUptime.toFixed(2)}%
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'threats', label: 'Threats', icon: '🔥' },
          { id: 'tools', label: 'Tools', icon: '🛠️' },
          { id: 'analytics', label: 'Analytics', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveView(tab.id as typeof activeView)
              audioManager.playClick()
            }}
            className={`holographic-btn ${activeView === tab.id ? 'primary' : 'secondary'}`}
            style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </motion.nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && (
            <div className="overview-section">
              {/* System Metrics */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {[
                  { label: 'Security Score', value: `${systemMetrics.securityScore}%`, color: '#10b981', icon: '🛡️' },
                  { label: 'Active Threats', value: systemMetrics.activeThreats.toString(), color: '#ef4444', icon: '⚠️' },
                  { label: 'Blocked Attacks', value: systemMetrics.blockedAttacks.toLocaleString(), color: '#00d4ff', icon: '🚫' },
                  { label: 'Response Time', value: `${systemMetrics.responseTime.toFixed(2)}s`, color: '#7c3aed', icon: '⚡' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="holographic-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ padding: '1.5rem', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{metric.icon}</div>
                    <div className="holographic-text" style={{ 
                      fontSize: '2rem',
                      color: metric.color,
                      marginBottom: '0.5rem'
                    }}>
                      {metric.value}
                    </div>
                    <div style={{ opacity: 0.8 }}>{metric.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* System Resources */}
              <div className="holographic-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#00d4ff' }}>SYSTEM RESOURCES</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'CPU Usage', value: systemMetrics.cpuUsage, color: '#00d4ff' },
                    { label: 'Memory', value: systemMetrics.memoryUsage, color: '#7c3aed' },
                    { label: 'Network', value: systemMetrics.networkActivity, color: '#10b981' }
                  ].map(resource => (
                    <div key={resource.label} style={{ marginBottom: '1rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                      }}>
                        <span>{resource.label}</span>
                        <span style={{ color: resource.color }}>{resource.value.toFixed(0)}%</span>
                      </div>
                      <div className="holographic-progress">
                        <motion.div
                          className="holographic-progress-bar"
                          animate={{ width: `${resource.value}%` }}
                          style={{ background: resource.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Network Visualization */}
              <div className="holographic-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#00d4ff' }}>NETWORK TOPOLOGY</h3>
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '100%',
                    height: '300px',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>
            </div>
          )}

          {activeView === 'threats' && (
            <div className="threats-section">
              {/* Threat Alerts */}
              <div className="holographic-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ color: '#00d4ff' }}>ACTIVE THREATS</h3>
                  <button
                    onClick={() => loadThreatAlerts()}
                    className="holographic-btn secondary"
                    style={{ fontSize: '0.9rem' }}
                  >
                    🔄 Refresh
                  </button>
                </div>

                <div className="threats-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {threatAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="threat-item"
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${getSeverityColor(alert.severity)}`,
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            background: getSeverityColor(alert.severity),
                            color: 'white',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            marginRight: '0.75rem'
                          }}>
                            {alert.severity}
                          </span>
                          <span style={{ 
                            color: '#00d4ff',
                            textTransform: 'capitalize',
                            fontWeight: 'bold'
                          }}>
                            {alert.type}
                          </span>
                        </div>
                        
                        <div style={{ marginBottom: '0.5rem' }}>
                          {alert.description}
                        </div>
                        
                        <div style={{ 
                          fontSize: '0.8rem',
                          opacity: 0.7,
                          display: 'flex',
                          gap: '1rem'
                        }}>
                          <span>Source: {alert.source}</span>
                          <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                          <span>{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          className="holographic-btn"
                          style={{ 
                            fontSize: '0.8rem',
                            padding: '0.5rem 1rem',
                            background: getSeverityColor(alert.severity)
                          }}
                          onClick={() => {
                            audioManager.playClick()
                            onNotification(`Investigating threat: ${alert.id}`, 'info')
                          }}
                        >
                          Investigate
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'tools' && (
            <div className="tools-section">
              {/* Security Tools Grid */}
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {securityTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    className="holographic-card"
                    initial={{ opacity: 0, y: 30, rotateY: 45 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, rotateY: 5 }}
                    style={{ padding: '1.5rem', cursor: 'pointer' }}
                  >
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{tool.icon}</div>
                      <div>
                        <h4 style={{ color: '#00d4ff', marginBottom: '0.25rem' }}>{tool.name}</h4>
                        <span style={{
                          background: tool.status === 'active' ? '#10b981' : tool.status === 'standby' ? '#f59e0b' : '#ef4444',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase'
                        }}>
                          {tool.status}
                        </span>
                      </div>
                    </div>

                    <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
                      {tool.description}
                    </p>

                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      opacity: 0.7,
                      marginBottom: '1rem'
                    }}>
                      <span>Last Scan: {tool.lastScan.toLocaleTimeString()}</span>
                      <span>Threats: {tool.threatsFound}</span>
                    </div>

                    <button
                      className="holographic-btn"
                      style={{ width: '100%' }}
                      onClick={() => {
                        audioManager.playClick()
                        onNotification(`Launching ${tool.name}`, 'info')
                      }}
                    >
                      LAUNCH TOOL
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="analytics-section">
              <div className="holographic-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#00d4ff' }}>SECURITY ANALYTICS</h3>
                
                {/* Placeholder for charts */}
                <div style={{
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(0, 212, 255, 0.3)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <div style={{ color: '#00d4ff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                      Advanced Analytics Coming Soon
                    </div>
                    <div style={{ opacity: 0.7 }}>
                      Real-time threat intelligence visualizations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Command Terminal */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="command-terminal"
        style={{
          position: 'fixed',
          bottom: 'clamp(0.5rem, 2vw, 1.5rem)',
          left: 'clamp(0.5rem, 2vw, 1.5rem)',
          right: 'clamp(0.5rem, 2vw, 1.5rem)',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '0.5rem',
          padding: 'clamp(0.5rem, 2vw, 1rem)',
          backdropFilter: 'blur(20px)',
          zIndex: 50,
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ color: '#10b981', marginRight: '0.5rem' }}>quantum@nexus:~$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && executeCommand(commandInput)}
            placeholder="Enter command (scan, status, clear)..."
            className="holographic-input"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          />
        </div>

        {/* Scanning Progress */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: '0.5rem' }}
            >
              <div style={{ marginBottom: '0.5rem', color: '#00d4ff' }}>
                🔍 Quantum scan in progress...
              </div>
              <div className="holographic-progress">
                <motion.div
                  className="holographic-progress-bar"
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>
                {scanProgress.toFixed(0)}% - Analyzing {Math.floor(scanProgress * 50)} components
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default QuantumDashboard