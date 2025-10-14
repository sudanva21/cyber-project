import React, { useState, useEffect } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import '../components/Dashboard.css'

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

const Dashboard: React.FC<DashboardProps> = ({ audioManager }) => {
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

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

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

  const getLevelProgress = () => {
    const currentLevelMin = (stats.level - 1) * 1000
    const nextLevelMin = stats.level * 1000
    const progress = ((stats.cyberScore - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'simulation': return '⚡'
      case 'learning': return '🎓'
      case 'threat': return '🛡️'
      default: return '📊'
    }
  }

  const badgeEmojis = ['🏆', '🥇', '🎯', '🔒', '🛡️', '⚡', '🎓', '🚀']

  if (!user) {
    return (
      <div className="dashboard">
        <div className="auth-required">
          <div className="auth-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p className="font-code">Please log in to access your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">📊</span>
            CYBER DASHBOARD
          </h1>
          <p className="page-description font-code">
            Track your cybersecurity training progress and achievements
          </p>
        </div>

        <div className="user-level">
          <div className="level-display">
            <div className="level-number">{stats.level}</div>
            <div className="level-label font-code">LEVEL</div>
          </div>
          <div className="level-progress">
            <div className="progress-label font-code">
              {stats.cyberScore} / {stats.level * 1000} XP
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

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">{stats.cyberScore.toLocaleString()}</div>
            <div className="stat-label font-code">CYBER SCORE</div>
          </div>
          <div className="stat-trend positive">
            <span className="trend-icon">↗️</span>
            <span className="trend-text font-code">+125 this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedSimulations}</div>
            <div className="stat-label font-code">SIMULATIONS</div>
          </div>
          <div className="stat-trend">
            <span className="trend-text font-code">Avg: {stats.averageSimScore}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <div className="stat-number">{stats.learningProgress}%</div>
            <div className="stat-label font-code">LEARNING</div>
          </div>
          <div className="stat-trend">
            <span className="trend-text font-code">Modules completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <div className="stat-number">{stats.threatsDetected}</div>
            <div className="stat-label font-code">THREATS</div>
          </div>
          <div className="stat-trend">
            <span className="trend-text font-code">Detected & resolved</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h3 className="section-title">Recent Activity</h3>
            <span className="activity-count font-code">{recentActivity.length} items</span>
          </div>

          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <div className="no-activity">
                <div className="no-activity-icon">📈</div>
                <div className="no-activity-text font-code">
                  No recent activity. Start a simulation or learning module!
                </div>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-meta font-code">
                      <span className="activity-score">Score: {activity.score}%</span>
                      <span className="activity-time">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <div className="section-header">
            <h3 className="section-title">Achievements</h3>
            <span className="badge-count font-code">{achievements.length} earned</span>
          </div>

          <div className="achievements-grid">
            {achievements.length === 0 ? (
              <div className="no-achievements">
                <div className="no-achievements-icon">🏆</div>
                <div className="no-achievements-text font-code">
                  Complete activities to earn achievements!
                </div>
              </div>
            ) : (
              achievements.map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <div className="badge-icon">
                    {badgeEmojis[index % badgeEmojis.length]}
                  </div>
                  <div className="badge-name font-code">{achievement}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="progress-chart">
        <div className="chart-header">
          <h3 className="section-title">Skills Overview</h3>
          <p className="chart-description font-code">Your cybersecurity competency breakdown</p>
        </div>

        <div className="skills-grid">
          <div className="skill-item">
            <div className="skill-info">
              <span className="skill-name font-code">Attack Simulation</span>
              <span className="skill-percentage">{stats.averageSimScore}%</span>
            </div>
            <div className="skill-bar">
              <div 
                className="skill-fill simulation"
                style={{ width: `${stats.averageSimScore}%` }}
              />
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-info">
              <span className="skill-name font-code">Learning Progress</span>
              <span className="skill-percentage">{stats.learningProgress}%</span>
            </div>
            <div className="skill-bar">
              <div 
                className="skill-fill learning"
                style={{ width: `${stats.learningProgress}%` }}
              />
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-info">
              <span className="skill-name font-code">Threat Detection</span>
              <span className="skill-percentage">
                {Math.min(100, stats.threatsDetected * 10)}%
              </span>
            </div>
            <div className="skill-bar">
              <div 
                className="skill-fill detection"
                style={{ width: `${Math.min(100, stats.threatsDetected * 10)}%` }}
              />
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-info">
              <span className="skill-name font-code">Overall Security</span>
              <span className="skill-percentage">
                {Math.round((stats.averageSimScore + stats.learningProgress) / 2)}%
              </span>
            </div>
            <div className="skill-bar">
              <div 
                className="skill-fill overall"
                style={{ width: `${Math.round((stats.averageSimScore + stats.learningProgress) / 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard