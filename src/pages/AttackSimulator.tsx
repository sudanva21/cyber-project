import React, { useState, useEffect } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import './AttackSimulator.css'

interface AttackSimulatorProps {
  audioManager: AudioManager
}

interface SimulationScenario {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  icon: string
  estimatedTime: string
  attackVectors: string[]
  unlocked: boolean
  completionBadge?: string
}

const AttackSimulator: React.FC<AttackSimulatorProps> = ({ audioManager }) => {
  const { user, supabase } = useSupabase()
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  const [userStats, setUserStats] = useState({
    completedSimulations: 0,
    averageScore: 0,
    bestDifficulty: 'beginner',
    totalXP: 0,
    currentStreak: 3,
    highestScore: 0
  })

  const scenarios: SimulationScenario[] = [
    {
      id: 'phishing',
      name: 'Phishing Attack',
      description: 'Master the art of identifying and defending against sophisticated phishing campaigns targeting user credentials and sensitive data',
      difficulty: 'beginner',
      icon: '🎣',
      estimatedTime: '5 min',
      attackVectors: ['Email Spoofing', 'Credential Harvesting', 'Social Engineering'],
      unlocked: true,
      completionBadge: '🛡️'
    },
    {
      id: 'sql_injection',
      name: 'SQL Injection',
      description: 'Learn advanced techniques for detecting, analyzing, and mitigating SQL injection attacks on web applications and databases',
      difficulty: 'intermediate',
      icon: '💉',
      estimatedTime: '10 min',
      attackVectors: ['Input Validation', 'Database Queries', 'Parameterized Statements'],
      unlocked: userStats.completedSimulations >= 1,
      completionBadge: '⚡'
    },
    {
      id: 'ddos',
      name: 'DDoS Attack',
      description: 'Simulate distributed denial-of-service attacks and master enterprise-grade mitigation strategies and traffic analysis',
      difficulty: 'advanced',
      icon: '🌊',
      estimatedTime: '15 min',
      attackVectors: ['Traffic Analysis', 'Rate Limiting', 'Load Balancing'],
      unlocked: userStats.completedSimulations >= 2,
      completionBadge: '🚀'
    },
    {
      id: 'ransomware',
      name: 'Ransomware Attack',
      description: 'Experience realistic ransomware scenarios and practice advanced incident response, backup recovery, and system hardening',
      difficulty: 'advanced',
      icon: '🔒',
      estimatedTime: '20 min',
      attackVectors: ['File Encryption', 'Network Propagation', 'Backup Recovery'],
      unlocked: userStats.completedSimulations >= 3,
      completionBadge: '🔐'
    },
    {
      id: 'mitm',
      name: 'Man-in-the-Middle',
      description: 'Master detection and prevention of MITM attacks on network communications with advanced cryptographic analysis',
      difficulty: 'intermediate',
      icon: '🕵️',
      estimatedTime: '12 min',
      attackVectors: ['Certificate Validation', 'Encryption', 'Network Monitoring'],
      unlocked: userStats.completedSimulations >= 2,
      completionBadge: '🔍'
    },
    {
      id: 'apt',
      name: 'Advanced Persistent Threat',
      description: 'Navigate complex multi-stage APT campaigns with lateral movement, privilege escalation, and sophisticated data exfiltration techniques',
      difficulty: 'expert',
      icon: '🕷️',
      estimatedTime: '25 min',
      attackVectors: ['Reconnaissance', 'Privilege Escalation', 'Data Exfiltration', 'Persistence'],
      unlocked: userStats.completedSimulations >= 5,
      completionBadge: '👑'
    }
  ]

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user])

  const loadUserStats = async () => {
    if (!supabase || !user) return

    try {
      const { data, error } = await supabase
        .from('attack_simulations')
        .select('*')
        .eq('user_id', user.id)

      if (!error && data) {
        const completed = data.length
        const avgScore = data.length > 0 
          ? data.reduce((sum, sim) => sum + sim.score, 0) / data.length 
          : 0
        
        const difficulties = data.map(sim => sim.difficulty)
        const bestDiff = difficulties.includes('expert') ? 'expert' :
                        difficulties.includes('advanced') ? 'advanced' :
                        difficulties.includes('intermediate') ? 'intermediate' : 'beginner'

        const highestScore = data.length > 0 ? Math.max(...data.map(sim => sim.score)) : 0
        const totalXP = data.reduce((sum, sim) => {
          const xpMultiplier = {
            beginner: 100,
            intermediate: 200,
            advanced: 400,
            expert: 800
          }
          return sum + (sim.score * xpMultiplier[sim.difficulty as keyof typeof xpMultiplier] / 100)
        }, 0)

        setUserStats({
          completedSimulations: completed,
          averageScore: Math.round(avgScore),
          bestDifficulty: bestDiff,
          totalXP: Math.round(totalXP),
          currentStreak: 3,
          highestScore
        })
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const startSimulation = async (scenario: SimulationScenario) => {
    if (!user || !scenario.unlocked) {
      audioManager.playError()
      return
    }

    setSelectedScenario(scenario)
    setSimulationRunning(true)
    setSimulationProgress(0)
    setSimulationLog([])
    audioManager.playAlert('high')

    // Enhanced simulation with realistic log messages
    const logMessages = [
      `[INIT] 🚀 Initializing ${scenario.name} simulation environment...`,
      `[SETUP] 📋 Loading attack vectors: ${scenario.attackVectors.join(', ')}`,
      `[TARGET] 🎯 Establishing target environment and baseline security posture`,
      `[RECON] 👁️ Beginning reconnaissance phase - gathering intelligence`,
      `[ATTACK] ⚡ Attack sequence initiated - monitoring defensive responses`,
      `[DETECT] 🔍 Intrusion detection systems activated - analyzing patterns`,
      `[DEFEND] 🛡️ Implementing security countermeasures and protocols`,
      `[ANALYZE] 📊 Evaluating response effectiveness and system resilience`,
      `[REPORT] 📝 Generating comprehensive attack simulation report`,
      `[COMPLETE] ✅ Simulation completed successfully - calculating final score`
    ]

    // Progressive simulation with enhanced timing
    for (let i = 0; i < logMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1800))
      
      setSimulationLog(prev => [...prev, logMessages[i]])
      setSimulationProgress(((i + 1) / logMessages.length) * 100)
      
      // Enhanced sound effects during simulation
      if (i === 2) audioManager.playClick() // Target established
      if (i === 4) audioManager.playAlert('high') // Attack initiated
      if (i === 6) audioManager.playClick() // Defense activated
    }

    // Enhanced scoring system based on difficulty and performance
    const baseScore = Math.floor(Math.random() * 25) + 75 // 75-100 range
    const difficultyMultiplier = {
      beginner: 1.0,
      intermediate: 1.1,
      advanced: 1.2,
      expert: 1.3
    }
    
    const finalScore = Math.min(100, Math.floor(baseScore * difficultyMultiplier[scenario.difficulty]))
    
    // Save simulation result to database
    if (supabase) {
      await supabase.from('attack_simulations').insert({
        user_id: user.id,
        simulation_type: scenario.id,
        difficulty: scenario.difficulty,
        result: finalScore >= 85 ? 'success' : finalScore >= 70 ? 'partial' : 'failed',
        score: finalScore,
        time_taken: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        details: {
          scenario_name: scenario.name,
          attack_vectors: scenario.attackVectors,
          completion_time: new Date().toISOString(),
          badge_earned: scenario.completionBadge
        }
      })
    }

    // Show enhanced final result
    setTimeout(() => {
      const resultEmoji = finalScore >= 85 ? '🏆' : finalScore >= 70 ? '🎯' : '💪'
      setSimulationLog(prev => [...prev, `[SCORE] ${resultEmoji} Final Score: ${finalScore}/100 ${scenario.completionBadge || ''}`])
      audioManager.playSuccess()
      loadUserStats() // Refresh stats
    }, 1000)

    setTimeout(() => {
      setSimulationRunning(false)
    }, 3000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'var(--cyber-success)'
      case 'intermediate': return 'var(--cyber-warning)'
      case 'advanced': return 'var(--cyber-secondary)'
      case 'expert': return 'var(--cyber-danger)'
      default: return 'var(--cyber-primary)'
    }
  }

  const handleScenarioClick = (scenario: SimulationScenario) => {
    audioManager.playClick()
    if (!simulationRunning && scenario.unlocked) {
      startSimulation(scenario)
    }
  }

  return (
    <div className="attack-simulator">
      {/* Enhanced Hero Section */}
      <div className="simulator-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <div className="badge-icon">🛡️</div>
            <span className="badge-text font-code">CYBER DEFENSE TRAINING</span>
          </div>
          
          <h1 className="hero-title">
            ATTACK <span className="title-highlight">SIMULATOR</span>
          </h1>
          
          <p className="hero-description">
            Master cybersecurity defense through realistic attack scenarios. 
            Build expertise, earn achievements, and strengthen your security mindset.
          </p>

          {/* Enhanced Stats Dashboard */}
          <div className="hero-stats">
            <div className="stat-card primary">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.completedSimulations}</div>
                <div className="stat-label font-code">COMPLETED</div>
              </div>
            </div>
            <div className="stat-card secondary">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.averageScore}</div>
                <div className="stat-label font-code">AVG SCORE</div>
              </div>
            </div>
            <div className="stat-card accent">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.totalXP}</div>
                <div className="stat-label font-code">TOTAL XP</div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.currentStreak}</div>
                <div className="stat-label font-code">STREAK</div>
              </div>
            </div>
          </div>

          {/* Learning Progress Visualization */}
          <div className="learning-journey">
            <h3 className="journey-title font-code">YOUR LEARNING JOURNEY</h3>
            <div className="journey-track">
              {scenarios.map((scenario, index) => (
                <div 
                  key={scenario.id} 
                  className={`journey-node ${scenario.unlocked ? 'unlocked' : 'locked'} ${scenario.difficulty}`}
                >
                  <div className="node-icon">{scenario.icon}</div>
                  <div className="node-label font-code">{scenario.name}</div>
                  {!scenario.unlocked && <div className="lock-overlay">🔒</div>}
                  {scenario.completionBadge && <div className="completion-badge">{scenario.completionBadge}</div>}
                  {index < scenarios.length - 1 && <div className="journey-connector"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Simulation Interface */}
      {simulationRunning && selectedScenario && (
        <div className="active-simulation">
          <div className="simulation-header">
            <div className="simulation-info">
              <h3 className="simulation-title">
                <span className="sim-icon">{selectedScenario.icon}</span>
                {selectedScenario.name}
                <span className="sim-difficulty" style={{ color: getDifficultyColor(selectedScenario.difficulty) }}>
                  {selectedScenario.difficulty.toUpperCase()}
                </span>
              </h3>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
              <span className="progress-text font-code">
                {Math.round(simulationProgress)}% Complete
              </span>
            </div>
          </div>

          <div className="simulation-console">
            <div className="console-header">
              <div className="console-controls">
                <span className="console-dot red"></span>
                <span className="console-dot yellow"></span>
                <span className="console-dot green"></span>
              </div>
              <div className="console-title font-code">
                SIMULATION TERMINAL
              </div>
              <div className="console-status">
                <span className="status-indicator active"></span>
                <span className="status-text font-code">ACTIVE</span>
              </div>
            </div>
            
            <div className="console-content">
              {simulationLog.map((log, index) => (
                <div key={index} className="console-line font-code">
                  <span className="line-timestamp">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="line-content">{log}</span>
                </div>
              ))}
              {simulationRunning && (
                <div className="console-cursor font-code">█</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Scenarios Grid */}
      <div className="scenarios-section">
        <div className="section-header">
          <h2 className="section-title">TRAINING SCENARIOS</h2>
          <p className="section-description">
            Progressive cybersecurity training from basic phishing to advanced persistent threats
          </p>
        </div>

        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`scenario-card ${simulationRunning ? 'disabled' : ''} ${scenario.unlocked ? 'unlocked' : 'locked'} ${scenario.difficulty}`}
              onClick={() => handleScenarioClick(scenario)}
            >
              {!scenario.unlocked && <div className="lock-overlay">🔒</div>}
              
              <div className="scenario-header">
                <div className="scenario-icon">{scenario.icon}</div>
                <div className="scenario-meta">
                  <h3 className="scenario-name">{scenario.name}</h3>
                  <div className="scenario-badges">
                    <span 
                      className={`difficulty-badge ${scenario.difficulty}`}
                      style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
                    >
                      {scenario.difficulty.toUpperCase()}
                    </span>
                    <span className="time-badge font-code">
                      ⏱️ {scenario.estimatedTime}
                    </span>
                    {scenario.completionBadge && (
                      <span className="completion-badge-small">
                        {scenario.completionBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="scenario-description">{scenario.description}</p>

              <div className="attack-vectors">
                <h4 className="vectors-title font-code">ATTACK VECTORS:</h4>
                <div className="vectors-list">
                  {scenario.attackVectors.map((vector, index) => (
                    <span key={index} className="vector-tag font-code">
                      {vector}
                    </span>
                  ))}
                </div>
              </div>

              <div className="scenario-actions">
                <button 
                  className={`start-btn ${scenario.unlocked ? 'unlocked' : 'locked'}`}
                  disabled={simulationRunning || !scenario.unlocked}
                >
                  <span className="btn-icon">
                    {scenario.unlocked ? '🚀' : '🔒'}
                  </span>
                  <span className="btn-text font-code">
                    {scenario.unlocked ? 'START SIMULATION' : 'LOCKED'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Training Tips */}
      <div className="training-section">
        <h3 className="training-title">🎯 MASTERY GUIDELINES</h3>
        <div className="training-grid">
          <div className="training-card">
            <div className="training-icon">⚡</div>
            <h4>Speed & Accuracy</h4>
            <p className="font-code">Quick threat identification and precise countermeasures are key to high scores</p>
          </div>
          <div className="training-card">
            <div className="training-icon">🧠</div>
            <h4>Pattern Recognition</h4>
            <p className="font-code">Learn to identify attack signatures and behavioral patterns for better defense</p>
          </div>
          <div className="training-card">
            <div className="training-icon">📊</div>
            <h4>Progress Tracking</h4>
            <p className="font-code">Monitor your improvement across scenarios and difficulty levels for optimal learning</p>
          </div>
          <div className="training-card">
            <div className="training-icon">🛡️</div>
            <h4>Defense Strategy</h4>
            <p className="font-code">Develop comprehensive defense strategies combining prevention, detection, and response</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttackSimulator