import React, { useState, useEffect } from 'react'
import './URLScanner.css'

interface URLScannerProps {
  onClose: () => void
}

interface ScanResult {
  url: string
  status: 'safe' | 'suspicious' | 'malicious'
  reputation: number
  threats: string[]
  details: {
    domain: string
    ip: string
    country: string
    server: string
    ssl: boolean
    redirects: number
    pageRank: number
    domainAge: number
  }
  scanTime: string
  engines: {
    name: string
    status: 'clean' | 'flagged'
    details?: string
  }[]
}

const URLScanner: React.FC<URLScannerProps> = ({ onClose }) => {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<string[]>([])

  useEffect(() => {
    // Load recent scans from localStorage
    const saved = localStorage.getItem('recentUrlScans')
    if (saved) {
      setRecentScans(JSON.parse(saved))
    }
  }, [])

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`)
      return true
    } catch {
      return false
    }
  }

  const scanUrl = async () => {
    if (!url.trim()) {
      alert('Please enter a URL to scan')
      return
    }

    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
    
    if (!validateUrl(normalizedUrl)) {
      alert('Please enter a valid URL')
      return
    }

    setScanning(true)
    setResult(null)

    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate mock scan results
      const mockResult: ScanResult = generateMockResult(normalizedUrl)
      setResult(mockResult)

      // Update recent scans
      const updated = [normalizedUrl, ...recentScans.filter(u => u !== normalizedUrl)].slice(0, 10)
      setRecentScans(updated)
      localStorage.setItem('recentUrlScans', JSON.stringify(updated))

    } catch (error) {
      console.error('Scan failed:', error)
      alert('Scan failed. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  const generateMockResult = (scanUrl: string): ScanResult => {
    const domain = new URL(scanUrl).hostname
    const suspiciousKeywords = ['phish', 'scam', 'fake', 'malware', 'virus', 'hack', 'steal']
    const isSuspicious = suspiciousKeywords.some(keyword => domain.toLowerCase().includes(keyword))
    
    const reputation = isSuspicious ? Math.random() * 0.4 : Math.random() * 0.3 + 0.7
    let status: 'safe' | 'suspicious' | 'malicious' = 'safe'
    
    if (reputation < 0.3) status = 'malicious'
    else if (reputation < 0.6) status = 'suspicious'

    const threats: string[] = []
    if (status === 'malicious') {
      threats.push('Malware hosting', 'Phishing attempt', 'Data harvesting')
    } else if (status === 'suspicious') {
      threats.push('Suspicious domain registration', 'Unusual traffic patterns')
    }

    return {
      url: scanUrl,
      status,
      reputation,
      threats,
      details: {
        domain,
        ip: generateRandomIP(),
        country: getRandomCountry(),
        server: getRandomServer(),
        ssl: Math.random() > 0.2,
        redirects: Math.floor(Math.random() * 3),
        pageRank: Math.floor(Math.random() * 10) + 1,
        domainAge: Math.floor(Math.random() * 3000) + 30
      },
      scanTime: new Date().toISOString(),
      engines: generateEngineResults(status)
    }
  }

  const generateRandomIP = (): string => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
  }

  const getRandomCountry = (): string => {
    const countries = ['United States', 'Germany', 'United Kingdom', 'France', 'Canada', 'Australia', 'Japan', 'Netherlands']
    return countries[Math.floor(Math.random() * countries.length)]
  }

  const getRandomServer = (): string => {
    const servers = ['nginx/1.18.0', 'Apache/2.4.41', 'cloudflare', 'Microsoft-IIS/10.0', 'LiteSpeed']
    return servers[Math.floor(Math.random() * servers.length)]
  }

  const generateEngineResults = (status: 'safe' | 'suspicious' | 'malicious') => {
    const engines = ['VirusTotal', 'SafeBrowsing', 'PhishTank', 'URLVoid', 'Sucuri', 'Fortinet', 'Kaspersky']
    
    return engines.map(name => {
      let engineStatus: 'clean' | 'flagged' = 'clean'
      let details: string | undefined

      if (status === 'malicious') {
        engineStatus = Math.random() > 0.3 ? 'flagged' : 'clean'
        if (engineStatus === 'flagged') {
          details = 'Malicious content detected'
        }
      } else if (status === 'suspicious') {
        engineStatus = Math.random() > 0.7 ? 'flagged' : 'clean'
        if (engineStatus === 'flagged') {
          details = 'Potentially unwanted content'
        }
      }

      return { name, status: engineStatus, details }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#10b981'
      case 'suspicious': return '#fbbf24'
      case 'malicious': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return '✅'
      case 'suspicious': return '⚠️'
      case 'malicious': return '🚨'
      default: return '❓'
    }
  }

  const handleQuickScan = (quickUrl: string) => {
    setUrl(quickUrl)
    scanUrl()
  }

  return (
    <div className="url-scanner-overlay">
      <div className="url-scanner">
        <div className="scanner-header">
          <div className="header-info">
            <h2>🌍 URL Security Scanner</h2>
            <p>Analyze URLs for phishing, malware, and reputation threats</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="scanner-content">
          {/* URL Input Section */}
          <div className="url-input-section">
            <div className="input-group">
              <div className="url-input-container">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL to scan (e.g., example.com or https://example.com)"
                  className="url-input"
                  onKeyPress={(e) => e.key === 'Enter' && scanUrl()}
                />
                <button 
                  className="scan-btn" 
                  onClick={scanUrl}
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <div className="scan-spinner"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Scan URL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            {recentScans.length > 0 && !scanning && !result && (
              <div className="recent-scans">
                <h4>Recent Scans</h4>
                <div className="recent-list">
                  {recentScans.slice(0, 5).map((recentUrl, index) => (
                    <button
                      key={index}
                      className="recent-item"
                      onClick={() => handleQuickScan(recentUrl)}
                    >
                      <span className="recent-icon">🔗</span>
                      <span className="recent-url">{recentUrl}</span>
                      <span className="rescan-icon">↻</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scanning Animation */}
          {scanning && (
            <div className="scanning-state">
              <div className="scanning-animation">
                <div className="scanning-wave"></div>
                <div className="scanning-wave"></div>
                <div className="scanning-wave"></div>
              </div>
              <h3>Analyzing URL Security...</h3>
              <div className="scanning-steps">
                <div className="step active">Resolving domain</div>
                <div className="step active">Checking reputation</div>
                <div className="step">Scanning for threats</div>
                <div className="step">Generating report</div>
              </div>
            </div>
          )}

          {/* Scan Results */}
          {result && !scanning && (
            <div className="scan-results">
              <div className="results-header">
                <div className="url-info">
                  <h3>{result.url}</h3>
                  <p className="scan-timestamp">Scanned: {new Date(result.scanTime).toLocaleString()}</p>
                </div>
                <div 
                  className={`status-badge ${result.status}`}
                  style={{ borderColor: getStatusColor(result.status) }}
                >
                  <span className="status-icon">{getStatusIcon(result.status)}</span>
                  <span className="status-text">{result.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Reputation Score */}
              <div className="reputation-section">
                <div className="reputation-card">
                  <h4>Reputation Score</h4>
                  <div className="reputation-circle">
                    <svg className="circle-progress" width="120" height="120">
                      <circle
                        className="circle-bg"
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="rgba(55, 65, 81, 0.5)"
                        strokeWidth="8"
                      />
                      <circle
                        className="circle-fill"
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke={getStatusColor(result.status)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${result.reputation * 314} 314`}
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="reputation-value">
                      <span className="score">{Math.round(result.reputation * 100)}</span>
                      <span className="score-label">/100</span>
                    </div>
                  </div>
                </div>

                {/* Threat Summary */}
                <div className="threat-summary">
                  <h4>Detected Threats</h4>
                  {result.threats.length === 0 ? (
                    <div className="no-threats">
                      <span className="clean-icon">✅</span>
                      <p>No threats detected</p>
                    </div>
                  ) : (
                    <div className="threat-list">
                      {result.threats.map((threat, index) => (
                        <div key={index} className="threat-item">
                          <span className="threat-icon">⚠️</span>
                          <span>{threat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div className="details-grid">
                <div className="detail-card">
                  <h4>🌐 Domain Information</h4>
                  <div className="detail-items">
                    <div className="detail-item">
                      <span>Domain:</span>
                      <span>{result.details.domain}</span>
                    </div>
                    <div className="detail-item">
                      <span>IP Address:</span>
                      <span className="ip-address">{result.details.ip}</span>
                    </div>
                    <div className="detail-item">
                      <span>Country:</span>
                      <span>{result.details.country}</span>
                    </div>
                    <div className="detail-item">
                      <span>Domain Age:</span>
                      <span>{result.details.domainAge} days</span>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <h4>🔒 Security Features</h4>
                  <div className="security-features">
                    <div className={`feature-item ${result.details.ssl ? 'secure' : 'insecure'}`}>
                      <span className="feature-icon">{result.details.ssl ? '🔒' : '🔓'}</span>
                      <span>SSL Certificate</span>
                      <span className={`feature-status ${result.details.ssl ? 'valid' : 'invalid'}`}>
                        {result.details.ssl ? 'Valid' : 'Missing'}
                      </span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">↗️</span>
                      <span>Redirects</span>
                      <span className="feature-value">{result.details.redirects}</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📊</span>
                      <span>PageRank</span>
                      <span className="feature-value">{result.details.pageRank}/10</span>
                    </div>
                  </div>
                </div>

                <div className="detail-card engines-card">
                  <h4>🛡️ Security Engines</h4>
                  <div className="engines-list">
                    {result.engines.map((engine, index) => (
                      <div key={index} className={`engine-item ${engine.status}`}>
                        <div className="engine-info">
                          <span className="engine-name">{engine.name}</span>
                          {engine.details && (
                            <span className="engine-details">{engine.details}</span>
                          )}
                        </div>
                        <div className={`engine-status ${engine.status}`}>
                          {engine.status === 'clean' ? '✅' : '🚨'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="results-actions">
                <button className="action-btn secondary" onClick={() => {setUrl(''); setResult(null)}}>
                  Scan Another URL
                </button>
                <button className="action-btn primary">
                  Export Report
                </button>
                <button className="action-btn primary">
                  Add to Watchlist
                </button>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          {!scanning && !result && (
            <div className="quick-examples">
              <h4>Test Examples</h4>
              <div className="example-buttons">
                <button 
                  className="example-btn safe"
                  onClick={() => handleQuickScan('https://google.com')}
                >
                  <span>✅</span>
                  Safe Site
                </button>
                <button 
                  className="example-btn suspicious"
                  onClick={() => handleQuickScan('https://suspicious-phishing-site.com')}
                >
                  <span>⚠️</span>
                  Suspicious
                </button>
                <button 
                  className="example-btn malicious"
                  onClick={() => handleQuickScan('https://fake-bank-login.scam')}
                >
                  <span>🚨</span>
                  Malicious
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default URLScanner