import React, { useState, useEffect } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import SteganographyDetector from '../components/tools/SteganographyDetector'
import URLScanner from '../components/tools/URLScanner'
import MalwareScanner from '../components/tools/MalwareScanner'
import HashAnalyzer from '../components/tools/HashAnalyzer'
import NetworkForensics from '../components/tools/NetworkForensics'
import '../styles/NewDashboard.css'

interface DashboardProps {
  audioManager: AudioManager
}

interface UserStats {
  cyberScore: number
  level: number
  badges: string[]
  completedSimulations: number
  averageSimScore: number
  learningProgress: number
  threatsDetected: number
}

interface Tool {
  id: string
  name: string
  icon: string
  description: string
  status: 'available' | 'premium' | 'coming_soon'
  category: 'detection' | 'analysis' | 'forensics' | 'prevention'
}

const NewDashboard: React.FC<DashboardProps> = ({ audioManager }) => {
  const { user, supabase } = useSupabase()
  const [stats, setStats] = useState<UserStats>({
    cyberScore: 0,
    level: 1,
    badges: [],
    completedSimulations: 0,
    averageSimScore: 0,
    learningProgress: 0,
    threatsDetected: 0
  })
  
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [achievements, setAchievements] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'analytics' | 'security'>('overview')
  const [, setSelectedTool] = useState<Tool | null>(null)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [threatAlerts, setThreatAlerts] = useState<Array<{
    id: string
    type: string
    severity: string
    title: string
    timestamp: string
  }>>([])
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  // Cybersecurity tools data
  const tools: Tool[] = [
    {
      id: 'steganography-detector',
      name: 'Steganography Detector',
      icon: '🔍',
      description: 'Detect hidden data in images, audio, and video files using advanced AI algorithms',
      status: 'available',
      category: 'detection'
    },
    {
      id: 'malware-scanner',
      name: 'Advanced Malware Scanner',
      icon: '🛡️',
      description: 'Real-time malware detection with behavioral analysis and signature matching',
      status: 'available',
      category: 'detection'
    },
    {
      id: 'network-forensics',
      name: 'Network Forensics Suite',
      icon: '🌐',
      description: 'Deep packet inspection and network traffic analysis tools',
      status: 'available',
      category: 'forensics'
    },
    {
      id: 'hash-analyzer',
      name: 'Hash & Checksum Analyzer',
      icon: '🔐',
      description: 'Verify file integrity and detect tampering using multiple hash algorithms',
      status: 'available',
      category: 'analysis'
    },
    {
      id: 'url-scanner',
      name: 'URL Security Scanner',
      icon: '🌍',
      description: 'Analyze URLs for phishing, malware, and reputation threats',
      status: 'available',
      category: 'prevention'
    },
    {
      id: 'log-analyzer',
      name: 'AI Log Analyzer',
      icon: '📊',
      description: 'Automated security log analysis with anomaly detection',
      status: 'premium',
      category: 'analysis'
    },
    {
      id: 'threat-intel',
      name: 'Threat Intelligence Hub',
      icon: '🎯',
      description: 'Real-time threat feeds and IoC matching from global sources',
      status: 'premium',
      category: 'prevention'
    },
    {
      id: 'honeypot-manager',
      name: 'Honeypot Manager',
      icon: '🍯',
      description: 'Deploy and manage honeypots for advanced threat detection',
      status: 'coming_soon',
      category: 'prevention'
    }
  ]

  useEffect(() => {
    if (user) {
      loadDashboardData()
      loadThreatAlerts()
    }
  }, [user])

  // Auto-refresh threat alerts every 30 seconds
  useEffect(() => {
    if (user && activeTab === 'security') {
      const interval = setInterval(() => {
        loadThreatAlerts()
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [user, activeTab])

  useEffect(() => {
    // Check for new achievements and show notifications
    const previousAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]')
    const newAchievements = achievements.filter(achievement => !previousAchievements.includes(achievement))
    
    if (newAchievements.length > 0) {
      setNewAchievement(newAchievements[0])
      localStorage.setItem('userAchievements', JSON.stringify(achievements))
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNewAchievement(null)
      }, 5000)
    }
  }, [achievements])

  const loadDashboardData = async () => {
    if (!supabase || !user) return

    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Load simulation results
      const { data: simulations } = await supabase
        .from('attack_simulations')
        .select('*')
        .eq('user_id', user.id)

      // Load learning progress
      const { data: learningData } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)

      // Load threat logs
      const { data: threats } = await supabase
        .from('threat_logs')
        .select('*')
        .eq('user_id', user.id)

      // Calculate stats
      const completedSims = simulations?.length || 0
      const avgScore = completedSims > 0 
        ? simulations!.reduce((sum, sim) => sum + sim.score, 0) / completedSims 
        : 0
      
      const completedModules = learningData?.filter(l => l.completed).length || 0
      const totalModules = 6 // Total number of learning modules
      const learningProgressPct = (completedModules / totalModules) * 100

      setStats({
        cyberScore: profile?.cyber_score || 0,
        level: profile?.level || 1,
        badges: profile?.badges || [],
        completedSimulations: completedSims,
        averageSimScore: Math.round(avgScore),
        learningProgress: Math.round(learningProgressPct),
        threatsDetected: threats?.length || 0
      })

      // Generate recent activity
      const activity = [
        ...(simulations?.slice(-5).map(sim => ({
          type: 'simulation',
          title: `Completed ${sim.simulation_type} simulation`,
          score: sim.score,
          timestamp: sim.created_at
        })) || []),
        ...(learningData?.slice(-3).map(learning => ({
          type: 'learning',
          title: `Completed learning module`,
          score: learning.score,
          timestamp: learning.completed_at || learning.updated_at
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

      setRecentActivity(activity)

      // Generate achievements based on progress
      const newAchievements = []
      if (completedSims >= 1) newAchievements.push('First Simulation')
      if (completedSims >= 5) newAchievements.push('Simulation Expert')
      if (completedModules >= 1) newAchievements.push('Learning Beginner')
      if (completedModules >= 3) newAchievements.push('Cyber Scholar')
      if (avgScore >= 80) newAchievements.push('High Achiever')
      if (profile?.cyber_score >= 1000) newAchievements.push('Cyber Defender')

      setAchievements(newAchievements)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const loadThreatAlerts = async () => {
    if (!supabase) return

    try {
      const { data: alerts } = await supabase
        .from('system_alerts')
        .select('id, alert_type, severity, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (alerts) {
        setThreatAlerts(alerts.map(alert => ({
          id: alert.id,
          type: alert.alert_type,
          severity: alert.severity,
          title: alert.title,
          timestamp: alert.created_at
        })))
      }
    } catch (error) {
      console.error('Error loading threat alerts:', error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getToolsByCategory = (category: string) => {
    return tools.filter(tool => tool.category === category)
  }

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool)
    audioManager?.playClick()
  }

  const handleToolLaunch = (toolId: string) => {
    setActiveTool(toolId)
    audioManager?.playClick()
  }

  const handleToolClose = () => {
    setActiveTool(null)
  }

  const getLevelProgress = () => {
    const currentLevelMin = (stats.level - 1) * 1000
    const nextLevelMin = stats.level * 1000
    const progress = ((stats.cyberScore - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  if (!user) {
    return (
      <div className="new-dashboard">
        <div className="auth-required">
          <div className="auth-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p className="font-code">Please log in to access your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="new-dashboard">
      {/* Achievement Notification */}
      {newAchievement && (
        <div className="achievement-notification" onClick={() => setNewAchievement(null)}>
          <div className="achievement-content">
            <span className="achievement-icon">🏆</span>
            <div className="achievement-text">
              <div className="achievement-title">Achievement Unlocked!</div>
              <div className="achievement-name">{newAchievement}</div>
            </div>
            <button className="achievement-close">×</button>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-details">
              <h1 className="user-name">{user.email?.split('@')[0] || 'User'}</h1>
              <p className="user-role font-code">Cyber Security Analyst</p>
            </div>
          </div>
          <div className="user-level-card">
            <div className="level-info">
              <span className="level-number">{stats.level}</span>
              <span className="level-label font-code">LEVEL</span>
            </div>
            <div className="level-progress-info">
              <div className="progress-text font-code">
                {stats.cyberScore.toLocaleString()} / {(stats.level * 1000).toLocaleString()} XP
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getLevelProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">Overview</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <span className="tab-icon">🛠️</span>
          <span className="tab-label">Security Tools</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="tab-icon">📈</span>
          <span className="tab-label">Analytics</span>
        </button>
        <button 
          className={`nav-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <span className="tab-icon">🛡️</span>
          <span className="tab-label">Security Status</span>
        </button>
      </nav>

      {/* Dashboard Content */}
      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats Grid */}
            <section className="quick-stats">
              <div className="stat-card primary">
                <div className="stat-header">
                  <span className="stat-icon">🏆</span>
                  <span className="stat-value">{stats.cyberScore.toLocaleString()}</span>
                </div>
                <div className="stat-label font-code">Cyber Score</div>
                <div className="stat-trend positive">
                  <span className="trend-indicator">▲ 8.5%</span>
                  <span className="trend-period font-code">this week</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-value">{stats.completedSimulations}</span>
                </div>
                <div className="stat-label font-code">Simulations Completed</div>
                <div className="stat-trend">
                  <span className="trend-indicator">Avg: {stats.averageSimScore}%</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">🎓</span>
                  <span className="stat-value">{stats.learningProgress}%</span>
                </div>
                <div className="stat-label font-code">Learning Progress</div>
                <div className="stat-trend">
                  <span className="trend-indicator">6 modules available</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">🛡️</span>
                  <span className="stat-value">{stats.threatsDetected}</span>
                </div>
                <div className="stat-label font-code">Threats Detected</div>
                <div className="stat-trend positive">
                  <span className="trend-indicator">▲ 12</span>
                  <span className="trend-period font-code">today</span>
                </div>
              </div>
            </section>

            {/* Main Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Recent Activity */}
              <section className="activity-panel">
                <div className="panel-header">
                  <h3>Recent Activity</h3>
                  <span className="activity-count font-code">{recentActivity.length} items</span>
                </div>
                <div className="activity-list">
                  {recentActivity.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">📈</span>
                      <p className="font-code">No recent activity</p>
                      <p>Complete simulations or training modules to see activity</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {activity.type === 'simulation' ? '⚡' : '🎓'}
                        </div>
                        <div className="activity-details">
                          <div className="activity-title">{activity.title}</div>
                          <div className="activity-meta font-code">
                            <span>Score: {activity.score}%</span>
                            <span>{formatTimestamp(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Achievements */}
              <section className="achievements-panel">
                <div className="panel-header">
                  <h3>Achievements</h3>
                  <span className="badge-count font-code">{achievements.length} earned</span>
                </div>
                <div className="achievements-grid">
                  {achievements.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">🏆</span>
                      <p className="font-code">No achievements yet</p>
                      <p>Complete activities to earn badges</p>
                    </div>
                  ) : (
                    achievements.map((achievement, index) => (
                      <div key={index} className="achievement-badge">
                        <span className="badge-icon">🏆</span>
                        <span className="badge-name font-code">{achievement}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === 'tools' && (
          <section className="tools-section">
            <div className="tools-header">
              <h2>Cybersecurity Tools Arsenal</h2>
              <p>Advanced security tools powered by AI and machine learning</p>
            </div>
            
            <div className="tools-categories">
              <div className="category-section">
                <h3 className="category-title">
                  <span className="category-icon">🔍</span>
                  Detection & Analysis
                </h3>
                <div className="tools-grid">
                  {getToolsByCategory('detection').concat(getToolsByCategory('analysis')).map(tool => (
                    <div 
                      key={tool.id} 
                      className={`tool-card ${tool.status}`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="tool-header">
                        <span className="tool-icon">{tool.icon}</span>
                        <div className="tool-status">
                          {tool.status === 'available' && <span className="status-dot available"></span>}
                          {tool.status === 'premium' && <span className="status-badge premium">PRO</span>}
                          {tool.status === 'coming_soon' && <span className="status-badge coming-soon">SOON</span>}
                        </div>
                      </div>
                      <h4 className="tool-name">{tool.name}</h4>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-actions">
                        {tool.status === 'available' && (
                          <button 
                            className="tool-launch-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToolLaunch(tool.id);
                            }}
                          >
                            <span>Launch Tool</span>
                            <span>→</span>
                          </button>
                        )}
                        {tool.status === 'premium' && (
                          <button className="tool-upgrade-btn">
                            <span>Upgrade to Pro</span>
                            <span>⭐</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="category-section">
                <h3 className="category-title">
                  <span className="category-icon">🔬</span>
                  Forensics & Investigation
                </h3>
                <div className="tools-grid">
                  {getToolsByCategory('forensics').map(tool => (
                    <div 
                      key={tool.id} 
                      className={`tool-card ${tool.status}`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="tool-header">
                        <span className="tool-icon">{tool.icon}</span>
                        <div className="tool-status">
                          {tool.status === 'available' && <span className="status-dot available"></span>}
                          {tool.status === 'premium' && <span className="status-badge premium">PRO</span>}
                          {tool.status === 'coming_soon' && <span className="status-badge coming-soon">SOON</span>}
                        </div>
                      </div>
                      <h4 className="tool-name">{tool.name}</h4>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-actions">
                        {tool.status === 'available' && (
                          <button 
                            className="tool-launch-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToolLaunch(tool.id);
                            }}
                          >
                            <span>Launch Tool</span>
                            <span>→</span>
                          </button>
                        )}
                        {tool.status === 'premium' && (
                          <button className="tool-upgrade-btn">
                            <span>Upgrade to Pro</span>
                            <span>⭐</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="category-section">
                <h3 className="category-title">
                  <span className="category-icon">🛡️</span>
                  Prevention & Protection
                </h3>
                <div className="tools-grid">
                  {getToolsByCategory('prevention').map(tool => (
                    <div 
                      key={tool.id} 
                      className={`tool-card ${tool.status}`}
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="tool-header">
                        <span className="tool-icon">{tool.icon}</span>
                        <div className="tool-status">
                          {tool.status === 'available' && <span className="status-dot available"></span>}
                          {tool.status === 'premium' && <span className="status-badge premium">PRO</span>}
                          {tool.status === 'coming_soon' && <span className="status-badge coming-soon">SOON</span>}
                        </div>
                      </div>
                      <h4 className="tool-name">{tool.name}</h4>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-actions">
                        {tool.status === 'available' && (
                          <button 
                            className="tool-launch-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToolLaunch(tool.id);
                            }}
                          >
                            <span>Launch Tool</span>
                            <span>→</span>
                          </button>
                        )}
                        {tool.status === 'premium' && (
                          <button className="tool-upgrade-btn">
                            <span>Upgrade to Pro</span>
                            <span>⭐</span>
                          </button>
                        )}
                        {tool.status === 'coming_soon' && (
                          <button className="tool-soon-btn" disabled>
                            <span>Coming Soon</span>
                            <span>⏳</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="analytics-section">
            <h2>Security Analytics</h2>
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>Threat Detection Timeline</h3>
                <div className="chart-placeholder">
                  <span className="chart-icon">📈</span>
                  <p>Interactive charts coming soon</p>
                </div>
              </div>
              <div className="chart-card">
                <h3>Attack Simulation Results</h3>
                <div className="chart-placeholder">
                  <span className="chart-icon">⚡</span>
                  <p>Performance metrics dashboard</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'security' && (
          <section className="security-section">
            <h2>Security Status Dashboard</h2>
            <div className="security-overview">
              <div className="security-card healthy">
                <div className="security-icon">✅</div>
                <h3>System Health</h3>
                <p className="status-text">All systems operational</p>
              </div>
              <div className="security-card warning">
                <div className="security-icon">⚠️</div>
                <h3>Active Alerts</h3>
                <p className="status-text">{threatAlerts.length} active alerts</p>
              </div>
              <div className="security-card info">
                <div className="security-icon">🔒</div>
                <h3>Security Score</h3>
                <p className="status-text">{Math.max(70, 100 - (threatAlerts.length * 5))}/100 - {threatAlerts.length === 0 ? 'Excellent' : threatAlerts.length < 3 ? 'Good' : 'Needs Attention'}</p>
              </div>
            </div>

            <div className="threat-alerts-section">
              <h3>Recent Threat Alerts</h3>
              <div className="alerts-container">
                {threatAlerts.length === 0 ? (
                  <div className="no-alerts">
                    <span className="no-alerts-icon">🛡️</span>
                    <p>No recent threats detected. System is secure.</p>
                  </div>
                ) : (
                  threatAlerts.map(alert => (
                    <div key={alert.id} className={`alert-card ${alert.severity}`}>
                      <div className="alert-header">
                        <div className="alert-info">
                          <span className="alert-icon">
                            {alert.severity === 'critical' && '🚨'}
                            {alert.severity === 'high' && '⚠️'}
                            {alert.severity === 'warning' && '🟡'}
                            {alert.severity === 'info' && 'ℹ️'}
                          </span>
                          <div className="alert-details">
                            <h4 className="alert-title">{alert.title}</h4>
                            <p className="alert-type font-code">{alert.type.replace('_', ' ').toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="alert-meta">
                          <span className={`alert-severity ${alert.severity}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="alert-time font-code">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="alert-actions">
                        <button className="alert-action-btn investigate">
                          <span>Investigate</span>
                          <span>🔍</span>
                        </button>
                        <button className="alert-action-btn resolve">
                          <span>Mark Resolved</span>
                          <span>✓</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="security-stats-grid">
              <div className="stat-item">
                <div className="stat-number">{stats.threatsDetected}</div>
                <div className="stat-label">Total Threats Blocked</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.8%</div>
                <div className="stat-label">System Uptime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoring Active</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.completedSimulations}</div>
                <div className="stat-label">Security Tests Passed</div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Tool Modals */}
      {activeTool === 'steganography-detector' && (
        <SteganographyDetector onClose={handleToolClose} />
      )}
      {activeTool === 'url-scanner' && (
        <URLScanner onClose={handleToolClose} />
      )}
      {activeTool === 'malware-scanner' && (
        <MalwareScanner onClose={handleToolClose} />
      )}
      {activeTool === 'hash-analyzer' && (
        <HashAnalyzer onClose={handleToolClose} />
      )}
      {activeTool === 'network-forensics' && (
        <NetworkForensics onClose={handleToolClose} />
      )}
    </div>
  )
}

export default NewDashboard