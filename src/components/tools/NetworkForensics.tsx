import React, { useState, useEffect } from 'react'
import './NetworkForensics.css'

interface NetworkForensicsProps {
  onClose: () => void
}

interface PacketData {
  id: number
  timestamp: string
  source: string
  destination: string
  protocol: string
  size: number
  flags: string[]
  suspicious: boolean
}

interface NetworkStats {
  totalPackets: number
  suspiciousPackets: number
  protocols: { [key: string]: number }
  topSources: { [key: string]: number }
  topDestinations: { [key: string]: number }
}

const NetworkForensics: React.FC<NetworkForensicsProps> = ({ onClose }) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const [packets, setPackets] = useState<PacketData[]>([])
  const [stats, setStats] = useState<NetworkStats>({
    totalPackets: 0,
    suspiciousPackets: 0,
    protocols: {},
    topSources: {},
    topDestinations: {}
  })
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null)
  const [filter, setFilter] = useState('')
  const [activeTab, setActiveTab] = useState<'capture' | 'analysis' | 'threats'>('capture')

  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'FTP', 'SSH', 'ICMP']
  const suspiciousIndicators = ['Port Scan', 'DDoS Pattern', 'Malformed', 'Unusual Size', 'Suspicious Port']

  const generateMockPacket = (id: number): PacketData => {
    const protocol = protocols[Math.floor(Math.random() * protocols.length)]
    const sourceIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    const destIP = Math.random() > 0.7 ? 
      `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` :
      `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    
    const flags = []
    if (Math.random() > 0.7) flags.push('SYN')
    if (Math.random() > 0.8) flags.push('ACK')
    if (Math.random() > 0.9) flags.push('RST')
    
    const suspicious = Math.random() > 0.85 // 15% suspicious packets
    
    return {
      id,
      timestamp: new Date(Date.now() - Math.random() * 60000).toISOString(),
      source: sourceIP,
      destination: destIP,
      protocol,
      size: Math.floor(Math.random() * 1500) + 64,
      flags,
      suspicious
    }
  }

  const startCapture = () => {
    setIsCapturing(true)
    setPackets([])
    
    const interval = setInterval(() => {
      setPackets(prev => {
        const newPackets = [...prev, generateMockPacket(prev.length + 1)]
        if (newPackets.length > 100) {
          newPackets.splice(0, newPackets.length - 100) // Keep only last 100 packets
        }
        return newPackets
      })
    }, 200) // Add packet every 200ms

    // Stop after 30 seconds for demo
    setTimeout(() => {
      clearInterval(interval)
      setIsCapturing(false)
    }, 30000)
  }

  const stopCapture = () => {
    setIsCapturing(false)
  }

  useEffect(() => {
    // Calculate stats whenever packets change
    const protocolCount: { [key: string]: number } = {}
    const sourceCount: { [key: string]: number } = {}
    const destCount: { [key: string]: number } = {}
    let suspiciousCount = 0

    packets.forEach(packet => {
      protocolCount[packet.protocol] = (protocolCount[packet.protocol] || 0) + 1
      sourceCount[packet.source] = (sourceCount[packet.source] || 0) + 1
      destCount[packet.destination] = (destCount[packet.destination] || 0) + 1
      if (packet.suspicious) suspiciousCount++
    })

    setStats({
      totalPackets: packets.length,
      suspiciousPackets: suspiciousCount,
      protocols: protocolCount,
      topSources: sourceCount,
      topDestinations: destCount
    })
  }, [packets])

  const filteredPackets = packets.filter(packet => {
    if (!filter) return true
    return packet.source.includes(filter) || 
           packet.destination.includes(filter) || 
           packet.protocol.toLowerCase().includes(filter.toLowerCase())
  })

  const exportPackets = () => {
    const data = packets.map(p => 
      `${p.timestamp},${p.source},${p.destination},${p.protocol},${p.size},${p.suspicious ? 'SUSPICIOUS' : 'NORMAL'}`
    ).join('\n')
    
    const blob = new Blob([`Timestamp,Source,Destination,Protocol,Size,Status\n${data}`], 
      { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'network_capture.csv'
    a.click()
  }

  return (
    <div className="network-forensics-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🌐 Network Forensics Suite</h2>
          <p>Deep packet inspection and traffic analysis</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="forensics-tabs">
          <button 
            className={`tab-btn ${activeTab === 'capture' ? 'active' : ''}`}
            onClick={() => setActiveTab('capture')}
          >
            📡 Live Capture
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            📊 Traffic Analysis
          </button>
          <button 
            className={`tab-btn ${activeTab === 'threats' ? 'active' : ''}`}
            onClick={() => setActiveTab('threats')}
          >
            ⚠️ Threat Detection
          </button>
        </div>

        {activeTab === 'capture' && (
          <div className="capture-section">
            <div className="capture-controls">
              <div className="control-group">
                <button 
                  className={`capture-btn ${isCapturing ? 'stop' : 'start'}`}
                  onClick={isCapturing ? stopCapture : startCapture}
                >
                  {isCapturing ? '⏹️ Stop Capture' : '▶️ Start Capture'}
                </button>
                
                {packets.length > 0 && (
                  <button className="export-btn" onClick={exportPackets}>
                    💾 Export CSV
                  </button>
                )}
              </div>

              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Filter by IP or protocol..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="capture-stats">
              <div className="stat-item">
                <span className="stat-label">Total Packets:</span>
                <span className="stat-value">{stats.totalPackets}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Suspicious:</span>
                <span className="stat-value suspicious">{stats.suspiciousPackets}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Capture Status:</span>
                <span className={`stat-value ${isCapturing ? 'active' : 'inactive'}`}>
                  {isCapturing ? '🔴 Live' : '⚫ Stopped'}
                </span>
              </div>
            </div>

            <div className="packet-table">
              <div className="table-header">
                <div className="col-time">Time</div>
                <div className="col-source">Source</div>
                <div className="col-dest">Destination</div>
                <div className="col-protocol">Protocol</div>
                <div className="col-size">Size</div>
                <div className="col-status">Status</div>
              </div>
              <div className="table-body">
                {filteredPackets.slice(-20).reverse().map(packet => (
                  <div 
                    key={packet.id} 
                    className={`table-row ${packet.suspicious ? 'suspicious' : ''}`}
                    onClick={() => setSelectedPacket(packet)}
                  >
                    <div className="col-time">
                      {new Date(packet.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="col-source">{packet.source}</div>
                    <div className="col-dest">{packet.destination}</div>
                    <div className="col-protocol">{packet.protocol}</div>
                    <div className="col-size">{packet.size}B</div>
                    <div className="col-status">
                      {packet.suspicious ? '⚠️ Suspicious' : '✅ Normal'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-section">
            <div className="analysis-grid">
              <div className="chart-card">
                <h3>Protocol Distribution</h3>
                <div className="protocol-chart">
                  {Object.entries(stats.protocols).map(([protocol, count]) => (
                    <div key={protocol} className="protocol-bar">
                      <div className="protocol-label">{protocol}</div>
                      <div className="protocol-bar-container">
                        <div 
                          className="protocol-bar-fill"
                          style={{ 
                            width: `${(count / stats.totalPackets) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="protocol-count">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Top Source IPs</h3>
                <div className="ip-list">
                  {Object.entries(stats.topSources)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8)
                    .map(([ip, count]) => (
                      <div key={ip} className="ip-item">
                        <span className="ip-address">{ip}</span>
                        <span className="ip-count">{count} packets</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Traffic Timeline</h3>
                <div className="timeline-placeholder">
                  <span className="timeline-icon">📈</span>
                  <p>Real-time traffic visualization</p>
                  <p className="timeline-subtitle">
                    {stats.totalPackets} packets captured
                  </p>
                </div>
              </div>

              <div className="chart-card">
                <h3>Network Summary</h3>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="summary-label">Avg Packet Size:</span>
                    <span className="summary-value">
                      {packets.length > 0 
                        ? Math.round(packets.reduce((sum, p) => sum + p.size, 0) / packets.length)
                        : 0
                      }B
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Unique Sources:</span>
                    <span className="summary-value">{Object.keys(stats.topSources).length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Unique Destinations:</span>
                    <span className="summary-value">{Object.keys(stats.topDestinations).length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Threat Level:</span>
                    <span className={`summary-value ${stats.suspiciousPackets > 5 ? 'high' : stats.suspiciousPackets > 0 ? 'medium' : 'low'}`}>
                      {stats.suspiciousPackets > 5 ? 'High' : stats.suspiciousPackets > 0 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="threats-section">
            <div className="threats-header">
              <h3>🛡️ Threat Detection Results</h3>
              <div className="threat-summary">
                <span className="threat-count">
                  {stats.suspiciousPackets} potential threats detected
                </span>
              </div>
            </div>

            <div className="threat-list">
              {packets
                .filter(p => p.suspicious)
                .slice(-10)
                .map(packet => {
                  const indicator = suspiciousIndicators[Math.floor(Math.random() * suspiciousIndicators.length)]
                  return (
                    <div key={packet.id} className="threat-item">
                      <div className="threat-icon">⚠️</div>
                      <div className="threat-details">
                        <div className="threat-title">{indicator}</div>
                        <div className="threat-info">
                          <span>Source: {packet.source}</span>
                          <span>Destination: {packet.destination}</span>
                          <span>Protocol: {packet.protocol}</span>
                        </div>
                        <div className="threat-time">
                          {new Date(packet.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="threat-severity">
                        <span className="severity-badge medium">Medium</span>
                      </div>
                    </div>
                  )
                })}

              {stats.suspiciousPackets === 0 && (
                <div className="no-threats">
                  <span className="no-threats-icon">✅</span>
                  <h4>No threats detected</h4>
                  <p>Your network traffic appears to be clean</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedPacket && (
          <div className="packet-detail-modal" onClick={() => setSelectedPacket(null)}>
            <div className="packet-detail-content" onClick={(e) => e.stopPropagation()}>
              <div className="detail-header">
                <h4>Packet Details #{selectedPacket.id}</h4>
                <button onClick={() => setSelectedPacket(null)}>✕</button>
              </div>
              <div className="detail-body">
                <div className="detail-item">
                  <strong>Timestamp:</strong> {new Date(selectedPacket.timestamp).toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>Source IP:</strong> {selectedPacket.source}
                </div>
                <div className="detail-item">
                  <strong>Destination IP:</strong> {selectedPacket.destination}
                </div>
                <div className="detail-item">
                  <strong>Protocol:</strong> {selectedPacket.protocol}
                </div>
                <div className="detail-item">
                  <strong>Size:</strong> {selectedPacket.size} bytes
                </div>
                <div className="detail-item">
                  <strong>Flags:</strong> {selectedPacket.flags.join(', ') || 'None'}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> 
                  <span className={selectedPacket.suspicious ? 'suspicious' : 'normal'}>
                    {selectedPacket.suspicious ? ' ⚠️ Suspicious' : ' ✅ Normal'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkForensics