import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AudioManager from '../utils/AudioManager'

// Custom hook for responsive breakpoints
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480)
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsSmallMobile(window.innerWidth <= 480)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return { isMobile, isSmallMobile }
}

interface AIAssistantProps {
  onCommand: (command: string) => void
  audioManager: AudioManager
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  typing?: boolean
}

interface AIPersonality {
  name: string
  avatar: string
  voice: string
  color: string
  description: string
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onCommand, audioManager }) => {
  const { isMobile, isSmallMobile } = useResponsive()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentPersonality, setCurrentPersonality] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const personalities: AIPersonality[] = [
    {
      name: 'SRI',
      avatar: '🤖',
      voice: 'Neural Command Interface',
      color: '#00d4ff',
      description: 'Primary AI Assistant - Cybersecurity Expert'
    },
    {
      name: 'SAGE',
      avatar: '🧠',
      voice: 'Quantum Analysis Core',
      color: '#7c3aed',
      description: 'Advanced Threat Analysis Specialist'
    },
    {
      name: 'NOVA',
      avatar: '✨',
      voice: 'Holographic Defense Matrix',
      color: '#10b981',
      description: 'Defense Systems Coordinator'
    }
  ]

  const currentAI = personalities[currentPersonality]

  // Initialize AI Assistant
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      addMessage('assistant', `${currentAI.name} AI Assistant online. I'm here to help you navigate the Nexus Cyber Shield platform. How can I assist you today?`)
      audioManager.playSystemNotification()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setRecognizedText(interimTranscript)

        if (finalTranscript) {
          setInputValue(finalTranscript)
          setIsListening(false)
          setRecognizedText('')
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setRecognizedText('')
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle personality change
  useEffect(() => {
    if (messages.length > 0) {
      addMessage('assistant', `${currentAI.name} AI now active. Switching to ${currentAI.description} mode.`)
      audioManager.playThemeChange()
    }
  }, [currentPersonality])

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, message])
    
    if (type === 'assistant') {
      simulateTyping(message.id)
    }
  }

  const simulateTyping = (messageId: string) => {
    setIsTyping(true)
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, typing: false } : msg
        )
      )
      setIsTyping(false)
    }, Math.random() * 2000 + 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage('user', userMessage)
    setInputValue('')
    
    // Process command
    onCommand(userMessage)
    audioManager.playClick()
    
    // Generate AI response
    setTimeout(() => {
      const response = generateAIResponse(userMessage)
      addMessage('assistant', response)
    }, 1000 + Math.random() * 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Command patterns
    if (input.includes('scan') || input.includes('detect')) {
      return `Initiating quantum threat scan. ${currentAI.name} is analyzing all network vectors and potential vulnerabilities. Scan progress will be displayed on your dashboard.`
    }
    
    if (input.includes('threat') || input.includes('attack')) {
      return `${currentAI.name} threat analysis indicates current DEFCON level is 3. I'm monitoring 847,521 active connections and have blocked 2,847,291 threats in the last 24 hours. Would you like a detailed threat report?`
    }
    
    if (input.includes('help') || input.includes('assist')) {
      return `I can help you with: 🔍 Threat Detection, 📊 Dashboard Navigation, 🛡️ Security Analysis, 🧠 Training Modules, 🔬 Security Tools. What would you like to explore?`
    }
    
    if (input.includes('status') || input.includes('system')) {
      return `All Nexus systems are operational. Quantum encryption: ✅ Online, Neural networks: ✅ Active, Threat detection: ✅ 99.97% uptime, Response time: ⚡ 0.12s average.`
    }
    
    if (input.includes('training') || input.includes('learn')) {
      return `${currentAI.name} recommends starting with our Neural Training modules. I can guide you through phishing detection, malware analysis, or advanced threat hunting scenarios. Which interests you most?`
    }
    
    if (input.includes('dashboard') || input.includes('navigate')) {
      return `The Quantum Dashboard provides real-time security metrics, threat intelligence feeds, and system controls. I can highlight specific features or walk you through the interface. What would you like to see first?`
    }
    
    if (input.includes('security') || input.includes('protection')) {
      return `Current security posture: 98.4% efficiency rating. All quantum firewalls active, AI behavioral analysis running, predictive threat modeling operational. Your network is under ${currentAI.name}'s protection.`
    }
    
    // Default responses
    const responses = [
      `Interesting query. ${currentAI.name} is processing your request through our quantum neural networks. How can I provide more specific assistance?`,
      `${currentAI.name} acknowledges your input. Our AI systems are designed to adapt to your cybersecurity needs. Please provide more details about what you'd like to accomplish.`,
      `I understand you're looking for information. ${currentAI.name} has access to comprehensive cybersecurity databases. Could you be more specific about your requirements?`,
      `${currentAI.name} is here to optimize your security experience. I can assist with threat analysis, system navigation, or training recommendations. What's your priority?`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setRecognizedText('')
      recognitionRef.current.start()
      audioManager.playSystemNotification()
    }
  }

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setRecognizedText('')
    }
  }

  const switchPersonality = () => {
    setCurrentPersonality(prev => (prev + 1) % personalities.length)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="ai-assistant"
        initial={{ opacity: 0, x: 400, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          scale: 1
        }}
        exit={{ opacity: 0, x: 400, scale: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          left: isMobile ? '1rem' : 'auto',
          width: isMobile 
            ? `${Math.min(windowSize.width - 32, 350)}px`
            : isMinimized 
              ? `${Math.min(windowSize.width - 64, 280)}px` 
              : `${Math.min(windowSize.width - 64, 360)}px`,
          height: isMinimized 
            ? '64px' 
            : isMobile 
              ? `${Math.min(windowSize.height - 64, 400)}px`
              : `${Math.min(windowSize.height - 64, 500)}px`,
          maxHeight: isMinimized 
            ? '64px'
            : `${windowSize.height - 64}px`,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.95)',
          border: `1px solid ${currentAI.color}`,
          borderRadius: '1rem',
          boxShadow: `0 0 30px ${currentAI.color}40`,
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div 
          className="ai-header"
          style={{
            padding: '1rem',
            background: `linear-gradient(135deg, ${currentAI.color}20, transparent)`,
            borderBottom: isMinimized ? 'none' : `1px solid ${currentAI.color}30`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="ai-info" style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}
              animate={{ rotate: isTyping ? [0, 360] : 0 }}
              transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
            >
              {currentAI.avatar}
            </motion.div>
            
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                color: currentAI.color,
                fontFamily: 'Orbitron, monospace',
                fontSize: '1.1rem'
              }}>
                {currentAI.name}
              </div>
              {!isMinimized && (
                <div style={{ 
                  fontSize: '0.8rem', 
                  opacity: 0.7,
                  color: 'white'
                }}>
                  {currentAI.voice}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Status indicator */}
            <motion.div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentAI.color,
                boxShadow: `0 0 10px ${currentAI.color}`
              }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Minimize/Maximize button */}
            <div style={{ color: currentAI.color, fontSize: '1.2rem' }}>
              {isMinimized ? '▲' : '▼'}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              className="chat-area"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: isMobile 
                  ? 'calc(100% - 80px)' 
                  : 'calc(100% - 80px)',
                minHeight: isMobile ? '250px' : '300px',
                maxHeight: isMobile 
                  ? 'calc(100vh - 8rem)' 
                  : 'calc(100vh - 8rem)'
              }}
            >
              {/* Messages */}
              <div 
                className="messages"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxHeight: 'calc(100% - 140px)',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                      background: message.type === 'user' 
                        ? 'rgba(0, 212, 255, 0.2)' 
                        : `rgba(${currentAI.color.substring(1)}, 0.1)`,
                      border: `1px solid ${message.type === 'user' ? '#00d4ff' : currentAI.color}30`,
                      borderRadius: '1rem',
                      padding: '0.75rem 1rem',
                      maxWidth: '85%',
                      fontSize: '0.9rem'
                    }}
                  >
                    {message.content}
                    {isTyping && message.type === 'assistant' && message.id === messages[messages.length - 1]?.id && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        ⚡
                      </motion.span>
                    )}
                    <div style={{ 
                      fontSize: '0.7rem', 
                      opacity: 0.5, 
                      marginTop: '0.25rem' 
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
                
                {recognizedText && (
                  <motion.div
                    className="voice-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      alignSelf: 'flex-end',
                      background: 'rgba(124, 58, 237, 0.2)',
                      border: '1px solid #7c3aed30',
                      borderRadius: '1rem',
                      padding: '0.75rem 1rem',
                      maxWidth: '85%',
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      opacity: 0.7
                    }}
                  >
                    🎤 {recognizedText}
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Controls */}
              <div style={{ 
                padding: '1rem',
                borderTop: `1px solid ${currentAI.color}30`,
                display: 'flex',
                gap: '0.5rem'
              }}>
                {/* Personality Switcher */}
                <button
                  onClick={switchPersonality}
                  className="holographic-btn"
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    minWidth: 'auto',
                    background: `rgba(${currentAI.color.substring(1)}, 0.2)`
                  }}
                  title={`Switch AI Personality (Current: ${currentAI.name})`}
                >
                  {currentAI.avatar}
                </button>

                {/* Voice Recognition */}
                <button
                  onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                  className="holographic-btn"
                  style={{
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    minWidth: 'auto',
                    background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                    border: `1px solid ${isListening ? '#ef4444' : '#7c3aed'}50`
                  }}
                  title={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
                >
                  🎤
                </button>

                {/* Input Form */}
                <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex' }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Ask ${currentAI.name} anything...`}
                    className="holographic-input"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.9rem',
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: `1px solid ${currentAI.color}30`,
                      borderRadius: '0.5rem'
                    }}
                    disabled={isTyping}
                  />
                  
                  <button
                    type="submit"
                    className="holographic-btn"
                    disabled={!inputValue.trim() || isTyping}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      background: `rgba(${currentAI.color.substring(1)}, 0.2)`
                    }}
                  >
                    Send
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default AIAssistant