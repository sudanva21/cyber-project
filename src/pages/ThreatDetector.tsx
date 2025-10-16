import React, { useState, useEffect, useRef } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import './ThreatDetector.css'

interface ThreatDetectorProps {
  audioManager: AudioManager
}

interface ThreatAlert {
  id: string
  alert_type: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  description: string
  source_ip: string | null
  target_ip: string | null
  port: number | null
  ai_confidence: number
  status: 'new' | 'investigating' | 'resolved' | 'false_positive'
  created_at: string
}

interface ScanResult {
  type: string
  status: 'clean' | 'threat' | 'suspicious'
  details: string
  confidence: number
}

interface ThreatMetrics {
  totalThreats: number
  criticalThreats: number
  blockedAttacks: number
  averageResponseTime: number
  systemHealth: number
  networkConnections: number
}

interface NetworkNode {
  id: string
  ip: string
  type: 'server' | 'client' | 'router' | 'threat'
  status: 'safe' | 'warning' | 'danger'
  x: number
  y: number
  connections: string[]
}

interface ThreatIntelligence {
  id: string
  type: string
  description: string
  severity: string
  source: string
  timestamp: string
  indicators: string[]
}

const ThreatDetector: React.FC<ThreatDetectorProps> = ({ audioManager }) => {
  const { supabase } = useSupabase()
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [alerts, setAlerts] = useState<ThreatAlert[]>([])
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [realTimeDetection, setRealTimeDetection] = useState(true)
  const [scanningStatus, setScanningStatus] = useState('')
  
  // Enhanced state for new features
  const [metrics, setMetrics] = useState<ThreatMetrics>({
    totalThreats: 0,
    criticalThreats: 0,
    blockedAttacks: 0,
    averageResponseTime: 0,
    systemHealth: 95,
    networkConnections: 0
  })
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([])
  const [threatIntel, setThreatIntel] = useState<ThreatIntelligence[]>([])
  const [selectedAlertType, setSelectedAlertType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'alerts' | 'network' | 'intelligence'>('alerts')
  const [autoResolveEnabled, setAutoResolveEnabled] = useState(false)
  const networkCanvasRef = useRef<HTMLCanvasElement>(null)

  const scanTypes = [
    'Network Perimeter Scan',
    'Malware Signature Analysis', 
    'Behavioral Pattern Detection',
    'Port Security Assessment',
    'SSL Certificate Validation',
    'Intrusion Detection System',
    'Data Exfiltration Monitoring',
    'AI Anomaly Detection'
  ]

  useEffect(() => {
    loadSystemAlerts()
    initializeMetrics()
    generateNetworkTopology()
    loadThreatIntelligence()
    
    // Set up real-time alert monitoring
    const interval = setInterval(() => {
      if (realTimeDetection) {
        generateRandomAlert()
        updateMetrics()
        updateNetworkTopology()
      }
    }, 10000) // Generate new alert every 10 seconds

    return () => clearInterval(interval)
  }, [realTimeDetection])

  // Initialize network topology visualization
  useEffect(() => {
    if (networkCanvasRef.current && networkNodes.length > 0) {
      drawNetworkMap()
    }
  }, [networkNodes, viewMode])

  const initializeMetrics = () => {
    setMetrics({
      totalThreats: Math.floor(Math.random() * 50) + 10,
      criticalThreats: Math.floor(Math.random() * 5) + 1,
      blockedAttacks: Math.floor(Math.random() * 200) + 50,
      averageResponseTime: Math.random() * 2 + 0.5,
      systemHealth: Math.floor(Math.random() * 15) + 85,
      networkConnections: Math.floor(Math.random() * 100) + 50
    })
  }

  const updateMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      totalThreats: prev.totalThreats + (Math.random() > 0.7 ? 1 : 0),
      criticalThreats: Math.max(0, prev.criticalThreats + (Math.random() > 0.9 ? 1 : -1)),
      blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 3),
      systemHealth: Math.max(70, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
      networkConnections: Math.max(0, prev.networkConnections + Math.floor((Math.random() - 0.5) * 10))
    }))
  }

  const generateNetworkTopology = () => {
    const nodes: NetworkNode[] = []
    const nodeTypes = ['server', 'client', 'router'] as const
    const statuses = ['safe', 'warning', 'danger'] as const
    
    // Generate 15-20 network nodes
    const nodeCount = Math.floor(Math.random() * 6) + 15
    for (let i = 0; i < nodeCount; i++) {
      const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      nodes.push({
        id: `node-${i}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        type: Math.random() > 0.95 ? 'threat' : nodeType,
        status: Math.random() > 0.1 ? 'safe' : status,
        x: Math.random() * 800,
        y: Math.random() * 400,
        connections: []
      })
    }
    
    // Generate connections
    nodes.forEach(node => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < connectionCount; i++) {
        const targetNode = nodes[Math.floor(Math.random() * nodes.length)]
        if (targetNode.id !== node.id && !node.connections.includes(targetNode.id)) {
          node.connections.push(targetNode.id)
        }
      }
    })
    
    setNetworkNodes(nodes)
  }

  const updateNetworkTopology = () => {
    setNetworkNodes(prev => prev.map(node => ({
      ...node,
      status: Math.random() > 0.95 ? 
        (node.status === 'safe' ? 'warning' : node.status === 'warning' ? 'danger' : 'safe') : 
        node.status
    })))
  }

  const drawNetworkMap = () => {
    const canvas = networkCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 400
    
    // Clear canvas
    ctx.fillStyle = 'rgba(17, 24, 39, 0.9)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw connections
    networkNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = networkNodes.find(n => n.id === connectionId)
        if (targetNode) {
          ctx.strokeStyle = node.status === 'danger' || targetNode.status === 'danger' ? 
            '#ef4444' : node.status === 'warning' || targetNode.status === 'warning' ? 
            '#f59e0b' : '#10b981'
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.6
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.stroke()
        }
      })
    })
    
    // Draw nodes
    networkNodes.forEach(node => {
      const colors = {
        safe: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      }
      
      // Icons are now handled directly in the drawing logic
      // const typeIcons = {
      //   server: '🖥️',
      //   client: '💻', 
      //   router: '📡',
      //   threat: '⚠️'
      // }
      
      // Draw node circle
      ctx.globalAlpha = 0.8
      ctx.fillStyle = colors[node.status]
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.type === 'threat' ? 12 : 8, 0, 2 * Math.PI)
      ctx.fill()
      
      // Add glow effect for threats
      if (node.status === 'danger' || node.type === 'threat') {
        ctx.shadowColor = '#ef4444'
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      
      // Draw IP address
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(node.ip, node.x, node.y + 25)
    })
    
    ctx.globalAlpha = 1
  }

  const loadThreatIntelligence = () => {
    const intelligence: ThreatIntelligence[] = [
      {
        id: '1',
        type: 'APT Campaign',
        description: 'Advanced persistent threat targeting financial institutions',
        severity: 'critical',
        source: 'Cyber Threat Intelligence',
        timestamp: new Date().toISOString(),
        indicators: ['malicious-domain.com', '192.168.1.100', 'trojan.exe']
      },
      {
        id: '2',
        type: 'Ransomware Family',
        description: 'New variant of LockBit ransomware detected in the wild',
        severity: 'high',
        source: 'Malware Research Team',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        indicators: ['lockbit.exe', 'C:\\temp\\ransom.txt', 'payment-site.onion']
      },
      {
        id: '3',
        type: 'Phishing Campaign',
        description: 'Large-scale phishing campaign impersonating banking sites',
        severity: 'medium',
        source: 'Anti-Phishing Working Group',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        indicators: ['fake-bank-login.com', 'credential-harvester.php']
      }
    ]
    setThreatIntel(intelligence)
  }

  const loadSystemAlerts = async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setAlerts(data)
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  const generateRandomAlert = async () => {
    if (!supabase) return

    const alertTypes = [
      'intrusion_attempt', 'malware_detected', 'port_scan', 
      'brute_force', 'ddos_attack', 'data_breach', 'suspicious_activity',
      'lateral_movement', 'privilege_escalation', 'data_exfiltration',
      'command_control', 'persistence_mechanism'
    ]
    
    const severities: ('info' | 'warning' | 'error' | 'critical')[] = ['info', 'warning', 'error', 'critical']
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)]

    const alertTitles: { [key: string]: string } = {
      'intrusion_attempt': 'Intrusion Attempt Detected',
      'malware_detected': 'Malware Signature Found',
      'port_scan': 'Port Scanning Activity',
      'brute_force': 'Brute Force Attack',
      'ddos_attack': 'DDoS Traffic Detected',
      'data_breach': 'Potential Data Breach',
      'suspicious_activity': 'Suspicious Network Activity',
      'lateral_movement': 'Lateral Movement Detected',
      'privilege_escalation': 'Privilege Escalation Attempt',
      'data_exfiltration': 'Data Exfiltration Detected',
      'command_control': 'Command & Control Communication',
      'persistence_mechanism': 'Persistence Mechanism Established'
    }

    const newAlert = {
      alert_type: randomType,
      severity: randomSeverity,
      title: alertTitles[randomType],
      description: `Automated detection of ${randomType.replace('_', ' ')} from monitoring systems`,
      source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      target_ip: Math.random() > 0.5 ? `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : null,
      port: Math.random() > 0.3 ? Math.floor(Math.random() * 65535) + 1 : null,
      ai_confidence: 0.7 + (Math.random() * 0.3), // 70-100% confidence
      status: 'new' as const
    }

    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .insert([newAlert])
        .select()

      if (!error && data) {
        setAlerts(prev => [data[0], ...prev.slice(0, 49)]) // Keep latest 50
        
        // Play alert sound for critical threats
        if (randomSeverity === 'critical' || randomSeverity === 'error') {
          audioManager.playAlert('critical')
        }
      }
    } catch (error) {
      console.error('Error creating alert:', error)
    }
  }

  const resolveAlert = async (alertId: string) => {
    if (!supabase) return
    
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ status: 'resolved' })
        .eq('id', alertId)
      
      if (!error) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'resolved' } : alert
        ))
        audioManager.playSuccess()
      }
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

  const bulkResolveAlerts = async (severity?: string) => {
    if (!supabase) return
    
    const alertsToResolve = alerts.filter(alert => 
      alert.status === 'new' && (severity ? alert.severity === severity : true)
    )
    
    try {
      const updates = alertsToResolve.map(alert => 
        supabase.from('system_alerts').update({ status: 'resolved' }).eq('id', alert.id)
      )
      
      await Promise.all(updates)
      
      setAlerts(prev => prev.map(alert => 
        alertsToResolve.some(resolved => resolved.id === alert.id) 
          ? { ...alert, status: 'resolved' } 
          : alert
      ))
      audioManager.playSuccess()
    } catch (error) {
      console.error('Error bulk resolving alerts:', error)
    }
  }

  const exportAlerts = () => {
    const filteredAlerts = getFilteredAlerts()
    const csvContent = [
      ['Timestamp', 'Severity', 'Type', 'Title', 'Description', 'Source IP', 'Target IP', 'Port', 'Confidence', 'Status'],
      ...filteredAlerts.map(alert => [
        formatTimestamp(alert.created_at),
        alert.severity,
        alert.alert_type,
        alert.title,
        alert.description,
        alert.source_ip || '',
        alert.target_ip || '',
        alert.port?.toString() || '',
        `${Math.round(alert.ai_confidence * 100)}%`,
        alert.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `threat-alerts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    audioManager.playClick()
  }

  const getFilteredAlerts = () => {
    return alerts.filter(alert => {
      const matchesType = selectedAlertType === 'all' || alert.severity === selectedAlertType
      const matchesSearch = searchTerm === '' || 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
  }

  const startFullScan = async () => {
    if (scanning) return

    setScanning(true)
    setScanProgress(0)
    setScanResults([])
    setScanningStatus('Initializing scan...')
    audioManager.playAlert('critical')

    // Simulate comprehensive security scan
    for (let i = 0; i < scanTypes.length; i++) {
      const scanType = scanTypes[i]
      setScanningStatus(`Scanning: ${scanType}`)
      
      // Simulate scan duration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate realistic scan result
      const isClean = Math.random() > 0.3 // 70% chance of being clean
      const isThreat = Math.random() < 0.1 // 10% chance of actual threat
      
      const result: ScanResult = {
        type: scanType,
        status: isThreat ? 'threat' : isClean ? 'clean' : 'suspicious',
        details: generateScanDetails(scanType, isThreat ? 'threat' : isClean ? 'clean' : 'suspicious'),
        confidence: 0.8 + (Math.random() * 0.2) // 80-100% confidence
      }
      
      setScanResults(prev => [...prev, result])
      setScanProgress(((i + 1) / scanTypes.length) * 100)
      
      // Play sounds for different results
      if (result.status === 'threat') {
        audioManager.playError()
      } else if (result.status === 'suspicious') {
        audioManager.playAlert('critical')
      }
    }

    setScanningStatus('Scan complete')
    audioManager.playSuccess()
    setTimeout(() => setScanning(false), 1000)
  }

  const generateScanDetails = (scanType: string, status: string): string => {
    const details: { [key: string]: { [status: string]: string } } = {
      'Network Perimeter Scan': {
        'clean': 'All network boundaries secure, no unauthorized access detected',
        'suspicious': 'Unusual traffic patterns detected on port 443',
        'threat': 'Unauthorized access attempt from external IP detected'
      },
      'Malware Signature Analysis': {
        'clean': 'No known malware signatures detected in system files',
        'suspicious': 'Suspicious file behavior detected in temp directory',
        'threat': 'Trojan.Generic.KD.51423 detected in system32'
      },
      'Behavioral Pattern Detection': {
        'clean': 'All user activities within normal parameters',
        'suspicious': 'Anomalous file access patterns detected',
        'threat': 'Data exfiltration behavior detected from user account'
      },
      'Port Security Assessment': {
        'clean': 'All ports properly configured and secured',
        'suspicious': 'Non-standard service running on port 8080',
        'threat': 'Unauthorized service listening on privileged port'
      },
      'SSL Certificate Validation': {
        'clean': 'All SSL certificates valid and properly configured',
        'suspicious': 'Certificate expiring in 7 days',
        'threat': 'Invalid certificate detected - possible MITM attack'
      },
      'Intrusion Detection System': {
        'clean': 'No intrusion attempts detected',
        'suspicious': 'Multiple failed authentication attempts',
        'threat': 'Active intrusion detected from 192.168.1.100'
      },
      'Data Exfiltration Monitoring': {
        'clean': 'No unauthorized data transfers detected',
        'suspicious': 'Large file transfer to unknown external host',
        'threat': 'Confirmed data exfiltration to external server'
      },
      'AI Anomaly Detection': {
        'clean': 'All system behaviors within learned baselines',
        'suspicious': 'Unusual process execution patterns detected',
        'threat': 'High-confidence anomaly suggesting APT activity'
      }
    }

    return details[scanType]?.[status] || `${scanType} completed with ${status} status`
  }

  // These functions are used via CSS classes now, but kept for potential future use
  // const getSeverityColor = (severity: string) => {
  //   switch (severity) {
  //     case 'critical': return 'var(--cyber-danger)'
  //     case 'error': return '#ff6b35'
  //     case 'warning': return 'var(--cyber-warning)'
  //     case 'info': return 'var(--cyber-primary)'
  //     default: return 'var(--cyber-text-muted)'
  //   }
  // }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'threat': return 'var(--cyber-danger)'
  //     case 'suspicious': return 'var(--cyber-warning)'
  //     case 'clean': return 'var(--cyber-success)'
  //     default: return 'var(--cyber-text-muted)'
  //   }
  // }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const filteredAlerts = getFilteredAlerts()

  return (
    <div className="threat-detector">
      {/* Enhanced Header */}
      <div className="detector-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🛡️</span>
            ADVANCED THREAT DETECTOR
          </h1>
          <p className="page-description font-code">
            AI-powered real-time threat detection with advanced analytics and visualization
          </p>
        </div>

        <div className="enhanced-controls">
          <div className="control-group">
            <div className="realtime-toggle">
              <label className="toggle-label font-code">REAL-TIME</label>
              <button
                className={`toggle-btn ${realTimeDetection ? 'active' : ''}`}
                onClick={() => {
                  setRealTimeDetection(!realTimeDetection)
                  audioManager.playClick()
                }}
              >
                <span className="toggle-indicator" />
              </button>
            </div>

            <div className="auto-resolve-toggle">
              <label className="toggle-label font-code">AUTO-RESOLVE</label>
              <button
                className={`toggle-btn ${autoResolveEnabled ? 'active' : ''}`}
                onClick={() => {
                  setAutoResolveEnabled(!autoResolveEnabled)
                  audioManager.playClick()
                }}
              >
                <span className="toggle-indicator" />
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="scan-btn" onClick={startFullScan} disabled={scanning}>
              <span className="btn-icon">🔍</span>
              <span className="btn-text font-code">{scanning ? 'SCANNING...' : 'FULL SCAN'}</span>
            </button>
            
            <button className="export-btn" onClick={exportAlerts}>
              <span className="btn-icon">📊</span>
              <span className="btn-text font-code">EXPORT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="metrics-dashboard">
        <div className="metrics-grid">
          <div className="metric-card threat-metric">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.totalThreats}</div>
              <div className="metric-label font-code">Total Threats</div>
              <div className="metric-trend">
                +{metrics.criticalThreats} critical
              </div>
            </div>
          </div>

          <div className="metric-card health-metric">
            <div className="metric-icon">💚</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.systemHealth}%</div>
              <div className="metric-label font-code">System Health</div>
              <div className="metric-trend">
                {metrics.systemHealth > 90 ? 'Excellent' : metrics.systemHealth > 80 ? 'Good' : 'Warning'}
              </div>
            </div>
          </div>

          <div className="metric-card blocked-metric">
            <div className="metric-icon">🛡️</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.blockedAttacks}</div>
              <div className="metric-label font-code">Blocked Attacks</div>
              <div className="metric-trend">
                Last 24h
              </div>
            </div>
          </div>

          <div className="metric-card response-metric">
            <div className="metric-icon">⚡</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.averageResponseTime.toFixed(1)}s</div>
              <div className="metric-label font-code">Avg Response</div>
              <div className="metric-trend">
                {metrics.averageResponseTime < 1 ? 'Fast' : 'Normal'}
              </div>
            </div>
          </div>

          <div className="metric-card network-metric">
            <div className="metric-icon">🌐</div>
            <div className="metric-content">
              <div className="metric-value">{metrics.networkConnections}</div>
              <div className="metric-label font-code">Network Nodes</div>
              <div className="metric-trend">
                Active connections
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Scan Enhanced */}
      {scanning && (
        <div className="active-scan enhanced">
          <div className="scan-header">
            <h3 className="scan-title">
              <span className="scan-icon animate-spin">⚙️</span>
              COMPREHENSIVE SECURITY SCAN
            </h3>
            
            <div className="scan-progress">
              <div className="progress-info">
                <span className="progress-label font-code">{scanningStatus}</span>
                <span className="progress-percent font-code">{Math.round(scanProgress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="scan-results enhanced">
            {scanResults.map((result, index) => (
              <div key={index} className={`scan-result ${result.status}`}>
                <div className="result-icon">
                  {result.status === 'clean' ? '✅' : result.status === 'suspicious' ? '⚠️' : '🚨'}
                </div>
                <div className="result-content">
                  <div className="result-header">
                    <span className="result-type font-code">{result.type}</span>
                    <span className={`result-status ${result.status}`}>
                      {result.status.toUpperCase()}
                    </span>
                    <span className="result-confidence font-code">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  <div className="result-details font-code">{result.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-View Interface */}
      <div className="view-selector">
        <button 
          className={`view-btn ${viewMode === 'alerts' ? 'active' : ''}`}
          onClick={() => { setViewMode('alerts'); audioManager.playClick() }}
        >
          <span className="view-icon">🚨</span>
          <span className="font-code">ALERTS</span>
        </button>
        <button 
          className={`view-btn ${viewMode === 'network' ? 'active' : ''}`}
          onClick={() => { setViewMode('network'); audioManager.playClick() }}
        >
          <span className="view-icon">🌐</span>
          <span className="font-code">NETWORK</span>
        </button>
        <button 
          className={`view-btn ${viewMode === 'intelligence' ? 'active' : ''}`}
          onClick={() => { setViewMode('intelligence'); audioManager.playClick() }}
        >
          <span className="view-icon">🧠</span>
          <span className="font-code">INTELLIGENCE</span>
        </button>
      </div>

      {/* Alerts View */}
      {viewMode === 'alerts' && (
        <div className="alerts-dashboard enhanced">
          <div className="dashboard-controls">
            <div className="control-section">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="search-input font-code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="severity-filter font-code"
                  value={selectedAlertType}
                  onChange={(e) => setSelectedAlertType(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="error">High</option>
                  <option value="warning">Medium</option>
                  <option value="info">Low</option>
                </select>
              </div>
              
              <div className="bulk-actions">
                <button className="bulk-btn" onClick={() => bulkResolveAlerts()}>
                  <span className="btn-icon">✓</span>
                  <span className="font-code">RESOLVE ALL</span>
                </button>
                <button className="bulk-btn critical" onClick={() => bulkResolveAlerts('critical')}>
                  <span className="btn-icon">🚨</span>
                  <span className="font-code">RESOLVE CRITICAL</span>
                </button>
              </div>
            </div>

            <div className="alert-stats enhanced">
              <div className="stat-card critical">
                <div className="stat-number">{alerts.filter(a => a.severity === 'critical' && a.status === 'new').length}</div>
                <div className="stat-label font-code">CRITICAL</div>
              </div>
              <div className="stat-card high">
                <div className="stat-number">{alerts.filter(a => a.severity === 'error' && a.status === 'new').length}</div>
                <div className="stat-label font-code">HIGH</div>
              </div>
              <div className="stat-card medium">
                <div className="stat-number">{alerts.filter(a => a.severity === 'warning' && a.status === 'new').length}</div>
                <div className="stat-label font-code">MEDIUM</div>
              </div>
              <div className="stat-card low">
                <div className="stat-number">{alerts.filter(a => a.severity === 'info' && a.status === 'new').length}</div>
                <div className="stat-label font-code">LOW</div>
              </div>
            </div>
          </div>

          <div className="alerts-list enhanced">
            {filteredAlerts.length === 0 ? (
              <div className="no-alerts">
                <div className="no-alerts-icon">✅</div>
                <div className="no-alerts-text font-code">
                  {searchTerm || selectedAlertType !== 'all' 
                    ? 'No alerts match your filters' 
                    : 'No active security alerts'}
                </div>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className={`alert-card enhanced ${alert.severity} ${alert.status}`}>
                  <div className="alert-icon">
                    {alert.severity === 'critical' ? '🚨' : 
                     alert.severity === 'error' ? '⚠️' : 
                     alert.severity === 'warning' ? '🟡' : '🔵'}
                  </div>
                  
                  <div className="alert-content">
                    <div className="alert-header">
                      <div className="alert-severity">
                        <span className="severity-badge font-code">{alert.severity.toUpperCase()}</span>
                        <span className="alert-type font-code">{alert.alert_type}</span>
                      </div>
                      <div className="alert-timestamp font-code">
                        {formatTimestamp(alert.created_at)}
                      </div>
                    </div>

                    <h3 className="alert-title">{alert.title}</h3>
                    <p className="alert-description">{alert.description}</p>

                    <div className="alert-details">
                      {alert.source_ip && (
                        <div className="detail-chip">
                          <span className="detail-label font-code">SRC:</span>
                          <span className="detail-value font-code">{alert.source_ip}</span>
                        </div>
                      )}
                      {alert.target_ip && (
                        <div className="detail-chip">
                          <span className="detail-label font-code">DST:</span>
                          <span className="detail-value font-code">{alert.target_ip}</span>
                        </div>
                      )}
                      {alert.port && (
                        <div className="detail-chip">
                          <span className="detail-label font-code">PORT:</span>
                          <span className="detail-value font-code">{alert.port}</span>
                        </div>
                      )}
                      <div className="detail-chip confidence">
                        <span className="detail-label font-code">CONFIDENCE:</span>
                        <span className="detail-value font-code">{Math.round(alert.ai_confidence * 100)}%</span>
                      </div>
                    </div>

                    <div className="alert-actions enhanced">
                      {alert.status === 'new' && (
                        <>
                          <button className="action-btn investigate" onClick={() => audioManager.playClick()}>
                            <span className="btn-icon">🔍</span>
                            <span className="font-code">INVESTIGATE</span>
                          </button>
                          <button 
                            className="action-btn resolve"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <span className="btn-icon">✓</span>
                            <span className="font-code">RESOLVE</span>
                          </button>
                        </>
                      )}
                      {alert.status === 'resolved' && (
                        <span className="resolved-badge font-code">RESOLVED</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Network Topology View */}
      {viewMode === 'network' && (
        <div className="network-view">
          <div className="network-header">
            <h3 className="network-title">
              <span className="network-icon">🌐</span>
              NETWORK TOPOLOGY
            </h3>
            <div className="network-legend">
              <div className="legend-item">
                <div className="legend-dot safe"></div>
                <span className="legend-label font-code">Safe</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot warning"></div>
                <span className="legend-label font-code">Warning</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot danger"></div>
                <span className="legend-label font-code">Threat</span>
              </div>
            </div>
          </div>
          <div className="network-canvas-container">
            <canvas ref={networkCanvasRef} className="network-canvas" />
          </div>
        </div>
      )}

      {/* Threat Intelligence View */}
      {viewMode === 'intelligence' && (
        <div className="intelligence-view">
          <div className="intelligence-header">
            <h3 className="intelligence-title">
              <span className="intelligence-icon">🧠</span>
              THREAT INTELLIGENCE FEED
            </h3>
          </div>
          <div className="intelligence-list">
            {threatIntel.map((intel) => (
              <div key={intel.id} className={`intelligence-card ${intel.severity}`}>
                <div className="intelligence-header">
                  <div className="intelligence-type font-code">{intel.type}</div>
                  <div className="intelligence-severity font-code">{intel.severity.toUpperCase()}</div>
                  <div className="intelligence-source font-code">{intel.source}</div>
                </div>
                <div className="intelligence-description">{intel.description}</div>
                <div className="intelligence-indicators">
                  <div className="indicators-label font-code">IOCs:</div>
                  <div className="indicators-list">
                    {intel.indicators.map((indicator, idx) => (
                      <span key={idx} className="indicator font-code">{indicator}</span>
                    ))}
                  </div>
                </div>
                <div className="intelligence-timestamp font-code">
                  {formatTimestamp(intel.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreatDetector