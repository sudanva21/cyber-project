import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AudioManager from '../utils/AudioManager'

interface CyberAwarenessProps {
  audioManager: AudioManager
  onLearningProgress: (progress: number) => void
}

interface LearningModule {
  id: string
  title: string
  description: string
  category: 'phishing' | 'passwords' | 'social' | 'mobile' | 'network'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  progress: number
  completed: boolean
  quiz: QuizQuestion[]
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const CyberAwareness: React.FC<CyberAwarenessProps> = ({ audioManager, onLearningProgress }) => {
  const [modules, setModules] = useState<LearningModule[]>([])
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  useEffect(() => {
    audioManager?.playPageTransition?.()
    initializeLearningModules()
  }, [audioManager])

  const initializeLearningModules = () => {
    const learningModules: LearningModule[] = [
      {
        id: 'phishing-101',
        title: 'Phishing Recognition',
        description: 'Learn to identify and avoid phishing attacks',
        category: 'phishing',
        difficulty: 'beginner',
        duration: '15 min',
        progress: 100,
        completed: true,
        quiz: [
          {
            id: 'q1',
            question: 'Which of the following is a common sign of a phishing email?',
            options: [
              'Urgent requests for personal information',
              'Professional email address',
              'Proper grammar and spelling',
              'Company logo present'
            ],
            correctAnswer: 0,
            explanation: 'Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking.'
          },
          {
            id: 'q2',
            question: 'What should you do if you receive a suspicious email?',
            options: [
              'Click the link to verify',
              'Reply asking for verification',
              'Delete and report it',
              'Forward it to friends'
            ],
            correctAnswer: 2,
            explanation: 'Always delete suspicious emails and report them to your IT security team.'
          }
        ]
      },
      {
        id: 'password-security',
        title: 'Password Security',
        description: 'Master the art of creating secure passwords',
        category: 'passwords',
        difficulty: 'beginner',
        duration: '20 min',
        progress: 75,
        completed: false,
        quiz: [
          {
            id: 'q3',
            question: 'What makes a password strong?',
            options: [
              'Using personal information',
              'Long, complex, and unique',
              'Easy to remember',
              'Common dictionary words'
            ],
            correctAnswer: 1,
            explanation: 'Strong passwords should be long, contain a mix of characters, and be unique for each account.'
          }
        ]
      },
      {
        id: 'social-engineering',
        title: 'Social Engineering Tactics',
        description: 'Understand psychological manipulation techniques',
        category: 'social',
        difficulty: 'intermediate',
        duration: '25 min',
        progress: 0,
        completed: false,
        quiz: [
          {
            id: 'q4',
            question: 'What is social engineering?',
            options: [
              'A type of malware',
              'Psychological manipulation to divulge information',
              'A network security protocol',
              'A programming language'
            ],
            correctAnswer: 1,
            explanation: 'Social engineering exploits human psychology rather than technical vulnerabilities.'
          }
        ]
      }
    ]
    
    setModules(learningModules)
  }

  const startModule = (module: LearningModule) => {
    setSelectedModule(module)
    setCurrentQuiz(null)
    setQuizIndex(0)
    setScore(0)
    setShowResults(false)
    audioManager?.playClick?.()
  }

  const startQuiz = () => {
    if (!selectedModule) return
    
    setCurrentQuiz(selectedModule.quiz[0])
    setQuizIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    audioManager?.playClick?.()
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    audioManager?.playClick?.()
  }

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return
    
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer
    if (isCorrect) {
      setScore(prev => prev + 1)
      audioManager?.playSuccess?.()
    } else {
      audioManager?.playError?.()
    }
    
    // Show explanation briefly, then move to next question
    setTimeout(() => {
      if (selectedModule && quizIndex < selectedModule.quiz.length - 1) {
        const nextIndex = quizIndex + 1
        setQuizIndex(nextIndex)
        setCurrentQuiz(selectedModule.quiz[nextIndex])
        setSelectedAnswer(null)
      } else {
        // Quiz completed
        completeQuiz()
      }
    }, 3000)
  }

  const completeQuiz = () => {
    if (!selectedModule) return
    
    const percentage = (score / selectedModule.quiz.length) * 100
    const newProgress = Math.max(selectedModule.progress, percentage)
    
    setModules(prev => prev.map(m => 
      m.id === selectedModule.id 
        ? { ...m, progress: newProgress, completed: percentage >= 80 }
        : m
    ))
    
    setShowResults(true)
    setCurrentQuiz(null)
    onLearningProgress(newProgress)
    
    if (percentage >= 80) {
      audioManager?.playSuccess?.()
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phishing': return '🎣'
      case 'passwords': return '🔐'
      case 'social': return '🧠'
      case 'mobile': return '📱'
      case 'network': return '🌐'
      default: return '🛡️'
    }
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
      className="cyber-awareness"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="quantum-container">
        <motion.div 
          className="quantum-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="holographic-title">Cyber Awareness Training</h1>
          <p className="quantum-subtitle">Interactive Security Education Platform</p>
        </motion.div>

        {!selectedModule && (
          <div className="modules-grid">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                className="learning-module"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => startModule(module)}
              >
                <div className="module-icon">
                  {getCategoryIcon(module.category)}
                </div>
                
                <div className="module-content">
                  <h3>{module.title}</h3>
                  <p className="module-description">{module.description}</p>
                  
                  <div className="module-meta">
                    <span className="duration">⏱️ {module.duration}</span>
                    <span 
                      className="difficulty"
                      style={{ color: getDifficultyColor(module.difficulty) }}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        style={{ width: `${module.progress}%` }}
                        animate={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{module.progress}%</span>
                  </div>
                  
                  {module.completed && (
                    <div className="completion-badge">✅ Completed</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedModule && !currentQuiz && !showResults && (
            <motion.div
              className="module-detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="module-header">
                <button 
                  className="back-btn"
                  onClick={() => setSelectedModule(null)}
                >
                  ← Back
                </button>
                <h2>{selectedModule.title}</h2>
              </div>
              
              <div className="module-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Category:</span>
                    <span>{getCategoryIcon(selectedModule.category)} {selectedModule.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Difficulty:</span>
                    <span style={{ color: getDifficultyColor(selectedModule.difficulty) }}>
                      {selectedModule.difficulty}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span>{selectedModule.duration}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Progress:</span>
                    <span>{selectedModule.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div className="module-content-detail">
                <p>{selectedModule.description}</p>
                
                <div className="learning-objectives">
                  <h3>Learning Objectives</h3>
                  <ul>
                    <li>Identify common {selectedModule.category} attack vectors</li>
                    <li>Understand prevention techniques and best practices</li>
                    <li>Apply security principles in real-world scenarios</li>
                    <li>Recognize warning signs and red flags</li>
                  </ul>
                </div>
              </div>
              
              <motion.button
                className="start-quiz-btn"
                onClick={startQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Assessment
              </motion.button>
            </motion.div>
          )}

          {currentQuiz && (
            <motion.div
              className="quiz-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="quiz-header">
                <h3>Question {quizIndex + 1} of {selectedModule?.quiz.length}</h3>
                <div className="quiz-progress">
                  <div 
                    className="quiz-progress-fill"
                    style={{ width: `${((quizIndex + 1) / (selectedModule?.quiz.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="question">
                <h4>{currentQuiz.question}</h4>
              </div>
              
              <div className="options">
                {currentQuiz.options.map((option, index) => (
                  <motion.button
                    key={index}
                    className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => selectAnswer(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              
              {selectedAnswer !== null && (
                <div className="answer-section">
                  {selectedAnswer === currentQuiz.correctAnswer ? (
                    <div className="correct-answer">
                      ✅ Correct!
                    </div>
                  ) : (
                    <div className="incorrect-answer">
                      ❌ Incorrect. The correct answer is: {currentQuiz.options[currentQuiz.correctAnswer]}
                    </div>
                  )}
                  
                  <div className="explanation">
                    <p><strong>Explanation:</strong> {currentQuiz.explanation}</p>
                  </div>
                  
                  <motion.button
                    className="next-btn"
                    onClick={submitAnswer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {quizIndex < (selectedModule?.quiz.length || 1) - 1 ? 'Next Question' : 'Complete Quiz'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {showResults && selectedModule && (
            <motion.div
              className="quiz-results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2>Assessment Results</h2>
              
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{Math.round((score / selectedModule.quiz.length) * 100)}%</span>
                  <span className="score-label">Score</span>
                </div>
                
                <div className="score-details">
                  <p>{score} out of {selectedModule.quiz.length} questions correct</p>
                  {score / selectedModule.quiz.length >= 0.8 ? (
                    <p className="pass">🎉 Congratulations! You passed!</p>
                  ) : (
                    <p className="fail">📚 Consider reviewing the material and trying again.</p>
                  )}
                </div>
              </div>
              
              <div className="results-actions">
                <button 
                  className="back-modules-btn"
                  onClick={() => {
                    setSelectedModule(null)
                    setShowResults(false)
                  }}
                >
                  Back to Modules
                </button>
                
                <button 
                  className="retake-btn"
                  onClick={startQuiz}
                >
                  Retake Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .cyber-awareness {
          min-height: 100vh;
          padding: 2rem;
          background: radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .learning-module {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .learning-module:hover {
          background: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.6);
          transform: translateY(-5px);
        }

        .module-icon {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .module-content {
          flex: 1;
        }

        .module-content h3 {
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .module-description {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
        }

        .module-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .duration {
          color: rgba(255, 255, 255, 0.7);
        }

        .difficulty {
          font-weight: bold;
          text-transform: uppercase;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
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

        .completion-badge {
          background: rgba(0, 255, 136, 0.2);
          color: #00ff88;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          display: inline-block;
        }

        .module-detail {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 12px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .module-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .back-btn {
          background: rgba(138, 43, 226, 0.3);
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(138, 43, 226, 0.6);
        }

        .module-header h2 {
          color: #fff;
          margin: 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(138, 43, 226, 0.2);
        }

        .info-label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: bold;
        }

        .learning-objectives {
          margin: 2rem 0;
        }

        .learning-objectives h3 {
          color: rgba(138, 43, 226, 1);
          margin-bottom: 1rem;
        }

        .learning-objectives ul {
          color: rgba(255, 255, 255, 0.8);
        }

        .learning-objectives li {
          margin: 0.5rem 0;
        }

        .start-quiz-btn {
          background: linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(65, 105, 225, 0.8));
          border: none;
          border-radius: 25px;
          padding: 1rem 2rem;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 2rem;
        }

        .quiz-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 12px;
          padding: 2rem;
          margin: 2rem 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .quiz-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .quiz-header h3 {
          color: #fff;
          margin-bottom: 1rem;
        }

        .quiz-progress {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .quiz-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8a2be2, #4169e1);
          transition: width 0.3s ease;
        }

        .question h4 {
          color: #fff;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.2rem;
        }

        .options {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .option {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 8px;
          padding: 1rem;
          color: white;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
        }

        .option:hover {
          background: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.6);
        }

        .option.selected {
          background: rgba(138, 43, 226, 0.3);
          border-color: rgba(138, 43, 226, 1);
        }

        .answer-section {
          text-align: center;
        }

        .correct-answer {
          color: #00ff88;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .incorrect-answer {
          color: #ff4444;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .explanation {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
          color: rgba(255, 255, 255, 0.9);
        }

        .next-btn {
          background: linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(65, 105, 225, 0.8));
          border: none;
          border-radius: 20px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-top: 1rem;
        }

        .quiz-results {
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(138, 43, 226, 0.3);
          border-radius: 12px;
          padding: 3rem;
          margin: 2rem auto;
          max-width: 500px;
        }

        .quiz-results h2 {
          color: #fff;
          margin-bottom: 2rem;
        }

        .score-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .score-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          border: 3px solid rgba(138, 43, 226, 0.6);
          border-radius: 50%;
          background: rgba(138, 43, 226, 0.1);
        }

        .score-number {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }

        .score-label {
          color: rgba(255, 255, 255, 0.6);
        }

        .score-details {
          text-align: left;
          color: #fff;
        }

        .pass {
          color: #00ff88;
          font-weight: bold;
        }

        .fail {
          color: #ff4444;
          font-weight: bold;
        }

        .results-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .back-modules-btn, .retake-btn {
          background: rgba(138, 43, 226, 0.3);
          border: none;
          border-radius: 20px;
          padding: 0.75rem 1.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retake-btn {
          background: linear-gradient(45deg, rgba(138, 43, 226, 0.8), rgba(65, 105, 225, 0.8));
        }

        .back-modules-btn:hover, .retake-btn:hover {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .modules-grid {
            grid-template-columns: 1fr;
          }
          
          .score-display {
            flex-direction: column;
            gap: 1rem;
          }
          
          .results-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default CyberAwareness