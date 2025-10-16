import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AudioManager from '../utils/AudioManager'
import BackButton from '../components/BackButton'

interface NeuralTrainingProps {
  audioManager: AudioManager
  onProgress: (progress: number) => void
}

interface TrainingModule {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  progress: number
  unlocked: boolean
}

const NeuralTraining: React.FC<NeuralTrainingProps> = ({ audioManager, onProgress }) => {
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: 'phishing',
      title: 'Phishing Detection',
      description: 'Learn to identify and prevent phishing attacks',
      difficulty: 'beginner',
      progress: 100,
      unlocked: true
    },
    {
      id: 'malware',
      title: 'Malware Analysis',
      description: 'Advanced malware detection and analysis techniques',
      difficulty: 'intermediate',
      progress: 65,
      unlocked: true
    },
    {
      id: 'network',
      title: 'Network Security',
      description: 'Secure network configuration and monitoring',
      difficulty: 'intermediate',
      progress: 30,
      unlocked: true
    },
    {
      id: 'quantum',
      title: 'Quantum Cryptography',
      description: 'Future-proof encryption methods',
      difficulty: 'advanced',
      progress: 0,
      unlocked: false
    }
  ])

  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)
  const [isTraining, setIsTraining] = useState(false)

  useEffect(() => {
    audioManager?.playPageTransition?.()
  }, [audioManager])

  const startTraining = (module: TrainingModule) => {
    if (!module.unlocked) return
    
    setSelectedModule(module)
    setIsTraining(true)
    audioManager?.playClick?.()
    
    // Simulate training progress
    const interval = setInterval(() => {
      setModules(prev => prev.map(m => 
        m.id === module.id 
          ? { ...m, progress: Math.min(100, m.progress + 5) }
          : m
      ))
      
      onProgress(module.progress + 5)
      
      if (module.progress >= 95) {
        clearInterval(interval)
        setIsTraining(false)
        audioManager?.playSuccess?.()
      }
    }, 1000)
    
    setTimeout(() => {
      clearInterval(interval)
      setIsTraining(false)
    }, 10000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#00ff88'
      case 'intermediate': return '#ffaa00'
      case 'advanced': return '#ff4444'
      default: return '#00aaff'
    }
  }

  return (
    <motion.div 
      className="neural-training"
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
          <h1 className="holographic-title">Neural Training Center</h1>
          <p className="quantum-subtitle">Advanced AI-Powered Cybersecurity Training</p>
        </motion.div>

        <div className="training-grid">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              className={`training-module ${!module.unlocked ? 'locked' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => startTraining(module)}
            >
              <div className="module-header">
                <h3>{module.title}</h3>
                <span 
                  className="difficulty-badge"
                  style={{ color: getDifficultyColor(module.difficulty) }}
                >
                  {module.difficulty}
                </span>
              </div>
              
              <p className="module-description">{module.description}</p>
              
              <div className="progress-section">
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    style={{ width: `${module.progress}%` }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="progress-text">{module.progress}%</span>
              </div>

              {!module.unlocked && (
                <div className="lock-overlay">
                  <div className="lock-icon">🔒</div>
                  <p>Complete previous modules to unlock</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {selectedModule && isTraining && (
          <motion.div
            className="training-session"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="session-content">
              <h2>Training in Progress: {selectedModule.title}</h2>
              <div className="neural-visualization">
                <div className="neural-nodes">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="neural-node"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
                <div className="neural-connections">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="neural-connection"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
              <p>AI is analyzing your responses and adapting the curriculum...</p>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .neural-training {
          min-height: 100vh;
          padding: 2rem;
          background: radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
        }

        .training-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .training-module {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .training-module:hover:not(.locked) {
          background: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.6);
          transform: translateY(-5px);
        }

        .training-module.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .module-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .module-header h3 {
          color: #fff;
          margin: 0;
        }

        .difficulty-badge {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: bold;
        }

        .module-description {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1.5rem;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8a2be2, #4169e1);
          border-radius: 3px;
        }

        .progress-text {
          color: #fff;
          font-weight: bold;
          min-width: 40px;
        }

        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .lock-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .training-session {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid rgba(138, 43, 226, 0.6);
          border-radius: 20px;
          padding: 3rem;
          z-index: 1000;
          text-align: center;
          min-width: 400px;
        }

        .neural-visualization {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 2rem auto;
        }

        .neural-nodes {
          position: absolute;
          inset: 0;
        }

        .neural-node {
          position: absolute;
          width: 12px;
          height: 12px;
          background: linear-gradient(45deg, #8a2be2, #4169e1);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.8);
        }

        .neural-node:nth-child(1) { top: 20%; left: 20%; }
        .neural-node:nth-child(2) { top: 20%; right: 20%; }
        .neural-node:nth-child(3) { top: 50%; left: 10%; }
        .neural-node:nth-child(4) { top: 50%; right: 10%; }
        .neural-node:nth-child(5) { bottom: 20%; left: 20%; }
        .neural-node:nth-child(6) { bottom: 20%; right: 20%; }

        .neural-connections {
          position: absolute;
          inset: 0;
        }

        .neural-connection {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.8), transparent);
        }
      `}</style>
    </motion.div>
  )
}

export default NeuralTraining