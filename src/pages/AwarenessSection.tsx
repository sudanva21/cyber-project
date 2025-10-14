import React, { useState, useEffect } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import './AwarenessSection.css'

interface AwarenessSectionProps {
  audioManager: AudioManager
}

interface LearningModule {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  icon: string
  topics: string[]
  completed?: boolean
  score?: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const AwarenessSection: React.FC<AwarenessSectionProps> = ({ audioManager }) => {
  const { user, supabase } = useSupabase()
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userProgress, setUserProgress] = useState<{ [key: string]: any }>({})
  const [streakCount, setStreakCount] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const learningModules: LearningModule[] = [
    {
      id: 'phishing-basics',
      title: 'Phishing Awareness',
      description: 'Learn to identify and avoid phishing attacks that steal personal information',
      difficulty: 'beginner',
      estimatedTime: '15 min',
      icon: '🎣',
      topics: ['Email spoofing', 'Suspicious links', 'Social engineering', 'Verification methods']
    },
    {
      id: 'password-security',
      title: 'Password Security',
      description: 'Best practices for creating and managing strong, secure passwords',
      difficulty: 'beginner',
      estimatedTime: '12 min',
      icon: '🔐',
      topics: ['Password strength', 'Multi-factor auth', 'Password managers', 'Common mistakes']
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering Defense',
      description: 'Understand psychological manipulation techniques used by cybercriminals',
      difficulty: 'intermediate',
      estimatedTime: '20 min',
      icon: '🎭',
      topics: ['Pretexting', 'Baiting', 'Tailgating', 'Authority exploitation']
    },
    {
      id: 'network-security',
      title: 'Network Security Fundamentals',
      description: 'Secure your network connections and understand common vulnerabilities',
      difficulty: 'intermediate',
      estimatedTime: '25 min',
      icon: '🌐',
      topics: ['WiFi security', 'VPN usage', 'Firewall basics', 'Port scanning']
    },
    {
      id: 'malware-detection',
      title: 'Malware Detection & Removal',
      description: 'Identify different types of malware and learn removal techniques',
      difficulty: 'advanced',
      estimatedTime: '30 min',
      icon: '🦠',
      topics: ['Malware types', 'Detection methods', 'Quarantine procedures', 'System recovery']
    },
    {
      id: 'incident-response',
      title: 'Incident Response Planning',
      description: 'Develop skills to respond effectively to cybersecurity incidents',
      difficulty: 'advanced',
      estimatedTime: '35 min',
      icon: '🚨',
      topics: ['Response planning', 'Containment strategies', 'Evidence collection', 'Recovery procedures']
    }
  ]

  // Sample quiz questions for different modules
  const quizQuestions: { [key: string]: QuizQuestion[] } = {
    'phishing-basics': [
      {
        id: 'q1',
        question: 'What is the most common sign of a phishing email?',
        options: [
          'Professional company logo',
          'Urgent language requesting immediate action',
          'Personalized greeting with your name',
          'Links to legitimate websites'
        ],
        correctAnswer: 1,
        explanation: 'Phishing emails often use urgent language to pressure victims into acting quickly without thinking critically.'
      },
      {
        id: 'q2',
        question: 'Before clicking a link in an email, you should:',
        options: [
          'Check if the sender is in your contacts',
          'Hover over the link to see the actual URL',
          'Forward it to friends for verification',
          'Click it quickly before it expires'
        ],
        correctAnswer: 1,
        explanation: 'Hovering over links reveals the actual destination URL, which often differs from the displayed text in phishing emails.'
      },
      {
        id: 'q3',
        question: 'Which of these is NOT a common phishing technique?',
        options: [
          'Fake urgent security alerts',
          'Requests for password verification',
          'Encrypted communication channels',
          'Lookalike domain names'
        ],
        correctAnswer: 2,
        explanation: 'Legitimate encrypted communication is actually a security feature, not a phishing technique.'
      }
    ],
    'password-security': [
      {
        id: 'q1',
        question: 'What makes a password strong?',
        options: [
          'Using personal information like birthdate',
          'Length of at least 12 characters with mixed case, numbers, and symbols',
          'Common dictionary words',
          'Simple patterns like "123456"'
        ],
        correctAnswer: 1,
        explanation: 'Strong passwords are long, complex, and avoid predictable patterns or personal information.'
      },
      {
        id: 'q2',
        question: 'How often should you change your passwords?',
        options: [
          'Every day',
          'Every week',
          'When there\'s a security breach or suspicious activity',
          'Never, once set they\'re permanent'
        ],
        correctAnswer: 2,
        explanation: 'Modern security experts recommend changing passwords only when necessary, as frequent changes can lead to weaker passwords.'
      },
      {
        id: 'q3',
        question: 'What is the best way to store your passwords?',
        options: [
          'Write them down on paper',
          'Use the same password for all accounts',
          'Use a reputable password manager',
          'Save them in a browser without encryption'
        ],
        correctAnswer: 2,
        explanation: 'Password managers provide secure, encrypted storage and can generate strong, unique passwords for each account.'
      }
    ],
    'social-engineering': [
      {
        id: 'q1',
        question: 'What is pretexting in social engineering?',
        options: [
          'Creating a false scenario to engage victims',
          'Sending malicious email attachments',
          'Installing malware on systems',
          'Breaking into buildings physically'
        ],
        correctAnswer: 0,
        explanation: 'Pretexting involves creating a fabricated scenario or false identity to engage victims and trick them into divulging information or performing actions.'
      },
      {
        id: 'q2',
        question: 'How should you respond to unexpected requests for sensitive information?',
        options: [
          'Provide the information immediately to be helpful',
          'Ignore the request completely',
          'Verify the requester\'s identity through official channels',
          'Forward the request to all colleagues'
        ],
        correctAnswer: 2,
        explanation: 'Always verify the identity of anyone requesting sensitive information through official channels, even if they claim to be from your organization.'
      },
      {
        id: 'q3',
        question: 'What is tailgating in cybersecurity context?',
        options: [
          'Following someone\'s car too closely',
          'Monitoring network traffic patterns',
          'Following authorized personnel into secure areas',
          'Creating fake social media profiles'
        ],
        correctAnswer: 2,
        explanation: 'Tailgating involves following authorized personnel into restricted areas without proper authorization, exploiting human courtesy.'
      }
    ],
    'network-security': [
      {
        id: 'q1',
        question: 'What is the main purpose of a firewall?',
        options: [
          'To encrypt data transmission',
          'To control network traffic based on security rules',
          'To speed up internet connection',
          'To backup important files'
        ],
        correctAnswer: 1,
        explanation: 'Firewalls monitor and control incoming and outgoing network traffic based on predetermined security rules.'
      },
      {
        id: 'q2',
        question: 'Why should you avoid public WiFi for sensitive activities?',
        options: [
          'It\'s always slower than private networks',
          'Public networks are often unencrypted and easily monitored',
          'It costs too much money to use',
          'Public WiFi doesn\'t work with most devices'
        ],
        correctAnswer: 1,
        explanation: 'Public WiFi networks are often unencrypted, making it easy for attackers to intercept and monitor your data transmission.'
      },
      {
        id: 'q3',
        question: 'What does VPN stand for and what does it do?',
        options: [
          'Virtual Private Network - encrypts internet connection',
          'Very Private Network - hides your computer',
          'Verified Protection Network - scans for viruses',
          'Visual Privacy Network - blocks advertisements'
        ],
        correctAnswer: 0,
        explanation: 'VPN (Virtual Private Network) creates an encrypted tunnel for your internet connection, protecting your data and privacy.'
      }
    ],
    'malware-detection': [
      {
        id: 'q1',
        question: 'What is ransomware?',
        options: [
          'Software that speeds up your computer',
          'Malware that encrypts files and demands payment',
          'A tool for backing up important data',
          'Software for managing passwords'
        ],
        correctAnswer: 1,
        explanation: 'Ransomware encrypts victims\' files and demands payment (ransom) for the decryption key, often causing significant business disruption.'
      },
      {
        id: 'q2',
        question: 'Which is the best practice when dealing with suspicious email attachments?',
        options: [
          'Open them immediately to see what they contain',
          'Forward them to colleagues for their opinion',
          'Never open suspicious attachments and report them',
          'Save them to desktop for later analysis'
        ],
        correctAnswer: 2,
        explanation: 'Never open suspicious attachments as they may contain malware. Report them to your IT security team instead.'
      },
      {
        id: 'q3',
        question: 'What is a trojan horse in cybersecurity?',
        options: [
          'A physical security device',
          'Malware disguised as legitimate software',
          'A network monitoring tool',
          'A type of firewall configuration'
        ],
        correctAnswer: 1,
        explanation: 'Trojan horses are malicious programs that disguise themselves as legitimate software to trick users into installing them.'
      }
    ],
    'incident-response': [
      {
        id: 'q1',
        question: 'What should be your first step when you discover a security incident?',
        options: [
          'Try to fix it yourself immediately',
          'Ignore it if it seems minor',
          'Document the incident and alert the security team',
          'Restart all computers in the office'
        ],
        correctAnswer: 2,
        explanation: 'Proper incident response starts with documentation and alerting the security team to ensure proper handling and evidence preservation.'
      },
      {
        id: 'q2',
        question: 'Why is it important to preserve evidence during a security incident?',
        options: [
          'It\'s not important, just fix the problem quickly',
          'Evidence helps understand the attack and prevent future incidents',
          'Evidence is only needed for insurance claims',
          'Preserving evidence always takes too much time'
        ],
        correctAnswer: 1,
        explanation: 'Preserving evidence helps investigate the incident, understand attack vectors, and implement better security measures for the future.'
      },
      {
        id: 'q3',
        question: 'What does "containment" mean in incident response?',
        options: [
          'Hiding the incident from management',
          'Isolating affected systems to prevent spread',
          'Backing up all company data',
          'Upgrading all security software'
        ],
        correctAnswer: 1,
        explanation: 'Containment involves isolating affected systems to prevent the security incident from spreading to other parts of the network.'
      }
    ]
  }

  useEffect(() => {
    if (user) {
      loadUserProgress()
    }
  }, [user])

  const loadUserProgress = async () => {
    if (!supabase || !user) return

    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id)

      if (!error && data) {
        const progressMap = data.reduce((acc, progress) => {
          acc[progress.module_id] = progress
          return acc
        }, {})
        setUserProgress(progressMap)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const startModule = (module: LearningModule) => {
    setSelectedModule(module)
    setCurrentQuiz(quizQuestions[module.id] || [])
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizScore(0)
    setQuizCompleted(false)
    setStartTime(new Date())
    setTimeSpent(0)
    audioManager.playClick()
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    audioManager.playClick()
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const currentQuestion = currentQuiz[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setQuizScore(prev => prev + 1)
      audioManager.playSuccess()
    } else {
      audioManager.playError()
    }

    setShowExplanation(true)
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)

    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      audioManager.playClick()
    } else {
      completeModule()
    }
  }

  const completeModule = async () => {
    if (!selectedModule || !user || !supabase) return

    const finalScore = Math.round((quizScore / currentQuiz.length) * 100)
    const finalTimeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0
    
    setQuizCompleted(true)
    setTimeSpent(finalTimeSpent)
    audioManager.playSuccess()

    // Update streak count for perfect scores
    if (finalScore === 100) {
      setStreakCount(prev => prev + 1)
    } else {
      setStreakCount(0)
    }

    // Save progress to database
    try {
      const { error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          module_id: selectedModule.id,
          completed: true,
          score: finalScore,
          time_spent: finalTimeSpent,
          completed_at: new Date().toISOString()
        })

      if (!error) {
        loadUserProgress() // Refresh progress
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'var(--cyber-success)'
      case 'intermediate': return 'var(--cyber-warning)'
      case 'advanced': return 'var(--cyber-danger)'
      default: return 'var(--cyber-primary)'
    }
  }

  const getProgressStats = () => {
    const completed = Object.values(userProgress).filter(p => p.completed).length
    const total = learningModules.length
    const averageScore = Object.values(userProgress).reduce((sum: number, p: any) => sum + (p.score || 0), 0) / (completed || 1)

    return { completed, total, averageScore: Math.round(averageScore) }
  }

  const stats = getProgressStats()

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let score = 0
    let feedback = []

    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return { level: 'weak', text: 'Weak - Too simple!' }
    if (score <= 4) return { level: 'medium', text: 'Medium - Getting better' }
    if (score <= 5) return { level: 'strong', text: 'Strong - Well done!' }
    return { level: 'very-strong', text: 'Very Strong - Excellent!' }
  }

  return (
    <div className="awareness-section">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🛡️</span>
            <span className="badge-text font-code">CYBERSECURITY LEARNING PLATFORM</span>
          </div>
          <h1 className="hero-title">
            Master Cybersecurity
            <span className="hero-highlight"> Step by Step</span>
          </h1>
          <p className="hero-description">
            Transform your security knowledge through interactive modules, real-world scenarios, 
            and hands-on exercises designed by cybersecurity experts.
          </p>
          
          {user && (
            <>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <span className="stat-number">{stats.completed}</span>
                    <span className="stat-label">Modules Completed</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <span className="stat-number">{stats.averageScore}%</span>
                    <span className="stat-label">Average Score</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <span className="stat-number">{streakCount}</span>
                    <span className="stat-label">Current Streak</span>
                  </div>
                </div>
              </div>

              <div className="learning-progress-overview">
                <h3 className="progress-title">Your Learning Journey</h3>
                <div className="progress-track">
                  {learningModules.map((module, index) => {
                    const progress = userProgress[module.id]
                    const isCompleted = progress?.completed || false
                    const isAccessible = index === 0 || userProgress[learningModules[index - 1]?.id]?.completed
                    
                    return (
                      <div key={module.id} className={`track-node ${isCompleted ? 'completed' : isAccessible ? 'accessible' : 'locked'}`}>
                        <div className="node-icon">{isCompleted ? '✓' : module.icon}</div>
                        <div className="node-info">
                          <span className="node-title">{module.title}</span>
                          <span className="node-progress">{isCompleted ? `${progress.score}%` : module.difficulty}</span>
                        </div>
                        {index < learningModules.length - 1 && <div className="node-connector"></div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Module Quiz Interface */}
      {selectedModule && !quizCompleted && (
        <div className="quiz-interface">
          <div className="quiz-header">
            <h2 className="quiz-title">
              <span className="quiz-icon">{selectedModule.icon}</span>
              {selectedModule.title}
            </h2>
            <div className="quiz-progress">
              <span className="progress-text font-code">
                Question {currentQuestionIndex + 1} of {currentQuiz.length}
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {currentQuiz.length > 0 && (
            <div className="question-card">
              <h3 className="question-text">
                {currentQuiz[currentQuestionIndex].question}
              </h3>

              <div className="answer-options">
                {currentQuiz[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${
                      selectedAnswer === index ? 'selected' : ''
                    } ${
                      showExplanation && index === currentQuiz[currentQuestionIndex].correctAnswer 
                        ? 'correct' 
                        : showExplanation && selectedAnswer === index && index !== currentQuiz[currentQuestionIndex].correctAnswer
                        ? 'incorrect'
                        : ''
                    }`}
                    onClick={() => selectAnswer(index)}
                    disabled={showExplanation}
                  >
                    <span className="option-letter font-code">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="explanation">
                  <h4 className="explanation-title">Explanation:</h4>
                  <p className="explanation-text">
                    {currentQuiz[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              <div className="question-actions">
                {!showExplanation ? (
                  <button
                    className="submit-btn"
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    <span className="btn-text font-code">SUBMIT ANSWER</span>
                  </button>
                ) : (
                  <button
                    className="next-btn"
                    onClick={nextQuestion}
                  >
                    <span className="btn-text font-code">
                      {currentQuestionIndex < currentQuiz.length - 1 ? 'NEXT QUESTION' : 'COMPLETE MODULE'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Completion */}
      {quizCompleted && selectedModule && (
        <div className="completion-screen">
          <div className="completion-content">
            <div className="completion-icon">🏆</div>
            <h2 className="completion-title">Module Completed!</h2>
            <p className="completion-subtitle">{selectedModule.title}</p>
            
            <div className="completion-score">
              <div className="score-circle">
                <span className="score-number">{Math.round((quizScore / currentQuiz.length) * 100)}%</span>
                <span className="score-label font-code">SCORE</span>
              </div>
            </div>

            <div className="completion-stats">
              <div className="completion-stat">
                <span className="stat-value">{quizScore}</span>
                <span className="stat-label font-code">Correct Answers</span>
              </div>
              <div className="completion-stat">
                <span className="stat-value">{currentQuiz.length}</span>
                <span className="stat-label font-code">Total Questions</span>
              </div>
              <div className="completion-stat">
                <span className="stat-value">{Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}</span>
                <span className="stat-label font-code">Time Spent</span>
              </div>
              {streakCount > 0 && (
                <div className="completion-stat streak-stat">
                  <span className="stat-value">🔥 {streakCount}</span>
                  <span className="stat-label font-code">Perfect Streak</span>
                </div>
              )}
            </div>

            {/* Performance Feedback */}
            <div className="performance-feedback">
              {Math.round((quizScore / currentQuiz.length) * 100) === 100 && (
                <div className="feedback perfect">
                  <span className="feedback-icon">🌟</span>
                  <span className="feedback-text">Perfect Score! Outstanding work!</span>
                </div>
              )}
              {Math.round((quizScore / currentQuiz.length) * 100) >= 80 && Math.round((quizScore / currentQuiz.length) * 100) < 100 && (
                <div className="feedback excellent">
                  <span className="feedback-icon">⭐</span>
                  <span className="feedback-text">Excellent performance! Keep it up!</span>
                </div>
              )}
              {Math.round((quizScore / currentQuiz.length) * 100) >= 60 && Math.round((quizScore / currentQuiz.length) * 100) < 80 && (
                <div className="feedback good">
                  <span className="feedback-icon">👍</span>
                  <span className="feedback-text">Good job! Consider reviewing missed topics.</span>
                </div>
              )}
              {Math.round((quizScore / currentQuiz.length) * 100) < 60 && (
                <div className="feedback needs-improvement">
                  <span className="feedback-icon">📚</span>
                  <span className="feedback-text">More practice needed. Review the material and try again!</span>
                </div>
              )}
            </div>

            <button
              className="back-btn"
              onClick={() => {
                setSelectedModule(null)
                setQuizCompleted(false)
                audioManager.playClick()
              }}
            >
              <span className="btn-text font-code">BACK TO MODULES</span>
            </button>
          </div>
        </div>
      )}

      {/* Learning Modules Grid */}
      {!selectedModule && (
        <div className="modules-section">
          <div className="section-header">
            <h2 className="section-title">📚 Learning Modules</h2>
            <p className="section-description">
              Master cybersecurity fundamentals through structured learning paths
            </p>
            <div className="difficulty-legend">
              <div className="legend-item">
                <span className="legend-dot beginner"></span>
                <span>Beginner</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot intermediate"></span>
                <span>Intermediate</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot advanced"></span>
                <span>Advanced</span>
              </div>
            </div>
          </div>

          <div className="modules-container">
            {learningModules.map((module, index) => {
              const progress = userProgress[module.id]
              const isCompleted = progress?.completed || false
              const isAccessible = index === 0 || userProgress[learningModules[index - 1]?.id]?.completed

              return (
                <div key={module.id} className="module-wrapper">
                  <div
                    className={`module-card ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'locked' : ''} difficulty-${module.difficulty}`}
                    onClick={() => isAccessible && startModule(module)}
                  >
                    <div className="card-gradient"></div>
                    
                    {!isAccessible && (
                      <div className="lock-overlay">
                        <div className="lock-icon">🔒</div>
                        <span className="lock-text">Complete previous modules to unlock</span>
                      </div>
                    )}

                    <div className="module-header">
                      <div className="module-icon-wrapper">
                        <div className="module-icon">{module.icon}</div>
                        {isCompleted && <div className="completion-check">✓</div>}
                      </div>
                      
                      <div className="module-meta">
                        <div className="module-number">Module {index + 1}</div>
                        <h3 className="module-title">{module.title}</h3>
                        <div className="module-stats">
                          <span className={`difficulty-pill ${module.difficulty}`}>
                            {module.difficulty}
                          </span>
                          <span className="time-pill">
                            <span className="time-icon">⏱</span>
                            {module.estimatedTime}
                          </span>
                          {isCompleted && (
                            <span className="score-pill">
                              <span className="score-icon">📊</span>
                              {progress.score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="module-content">
                      <p className="module-description">{module.description}</p>
                      
                      <div className="module-topics">
                        <div className="topics-header">
                          <span className="topics-label">What you'll learn:</span>
                        </div>
                        <ul className="topics-list">
                          {module.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="topic-item">
                              <span className="topic-bullet">•</span>
                              <span className="topic-text">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="module-footer">
                        <div className="progress-indicator">
                          {isCompleted ? (
                            <div className="completion-status">
                              <span className="status-icon">🏆</span>
                              <span className="status-text">Completed with {progress.score}%</span>
                            </div>
                          ) : (
                            <div className="progress-status">
                              <span className="status-text">Ready to start</span>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          className={`module-cta ${!isAccessible ? 'disabled' : ''}`}
                          disabled={!isAccessible}
                        >
                          <span className="cta-icon">
                            {!isAccessible ? '🔒' : isCompleted ? '🔄' : '▶'}
                          </span>
                          <span className="cta-text">
                            {!isAccessible ? 'Locked' : isCompleted ? 'Retake' : 'Start Learning'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Interactive Learning Section */}
      {!selectedModule && (
        <div className="interactive-section">
          <div className="section-header">
            <h2 className="section-title">🎮 INTERACTIVE LEARNING</h2>
            <p className="section-description font-code">
              Engaging activities to reinforce your cybersecurity knowledge
            </p>
          </div>

          <div className="interactive-grid">
            <div className="interactive-card password-strength">
              <div className="card-header">
                <div className="card-icon">🔐</div>
                <h3>Password Strength Checker</h3>
              </div>
              <div className="card-content">
                <input 
                  type="password" 
                  placeholder="Test your password strength..." 
                  className="password-input"
                  onChange={(e) => {
                    // Simple password strength indicator
                    const strength = calculatePasswordStrength(e.target.value)
                    const indicator = e.target.nextElementSibling as HTMLElement
                    if (indicator) {
                      indicator.className = `strength-indicator ${strength.level}`
                      indicator.textContent = strength.text
                    }
                  }}
                />
                <div className="strength-indicator weak">Enter a password to test</div>
                <div className="password-tips">
                  <div className="tip">✓ Use at least 12 characters</div>
                  <div className="tip">✓ Mix uppercase and lowercase</div>
                  <div className="tip">✓ Include numbers and symbols</div>
                  <div className="tip">✓ Avoid personal information</div>
                </div>
              </div>
            </div>

            <div className="interactive-card phishing-demo">
              <div className="card-header">
                <div className="card-icon">🎣</div>
                <h3>Spot the Phishing Email</h3>
              </div>
              <div className="card-content">
                <div className="email-example">
                  <div className="email-header">
                    <strong>From:</strong> security@amazone.com<br />
                    <strong>Subject:</strong> URGENT: Verify Your Account Now!
                  </div>
                  <div className="email-body">
                    Your account will be suspended in 24 hours unless you verify immediately.
                    <button 
                      className="suspicious-link"
                      onClick={() => {
                        alert('🚨 Good catch! This is a phishing email. Red flags:\n\n• Misspelled domain (amazone.com)\n• Urgent language\n• Suspicious link\n• No personal greeting')
                        audioManager.playSuccess()
                      }}
                    >
                      Click Here to Verify
                    </button>
                  </div>
                </div>
                <p className="demo-instruction">Can you spot what's wrong with this email?</p>
              </div>
            </div>

            <div className="interactive-card security-quiz">
              <div className="card-header">
                <div className="card-icon">⚡</div>
                <h3>Quick Security Quiz</h3>
              </div>
              <div className="card-content">
                <div className="quick-question">
                  <p><strong>Q:</strong> What should you do before clicking a link in an email?</p>
                  <div className="quick-options">
                    <button 
                      className="quick-option"
                      onClick={() => {
                        alert('❌ Not quite! Always verify first.')
                        audioManager.playError()
                      }}
                    >
                      Click immediately
                    </button>
                    <button 
                      className="quick-option correct"
                      onClick={() => {
                        alert('✅ Correct! Always hover to see the actual URL and verify the sender.')
                        audioManager.playSuccess()
                      }}
                    >
                      Hover to check URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="tips-section">
        <h3 className="tips-title">💡 LEARNING TIPS & BEST PRACTICES</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">📚</div>
            <h4>Take Your Time</h4>
            <p className="font-code">Read each question carefully and consider all options before answering</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Apply Knowledge</h4>
            <p className="font-code">Think about real-world scenarios when answering questions</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>Review & Repeat</h4>
            <p className="font-code">Retake modules to reinforce your understanding and improve scores</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🏆</div>
            <h4>Track Progress</h4>
            <p className="font-code">Monitor your scores and completion rates to identify areas for improvement</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🛡️</div>
            <h4>Stay Updated</h4>
            <p className="font-code">Cybersecurity threats evolve constantly - keep learning new techniques</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🤝</div>
            <h4>Share Knowledge</h4>
            <p className="font-code">Discuss what you learn with colleagues to reinforce concepts</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AwarenessSection