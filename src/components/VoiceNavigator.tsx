import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface VoiceNavigatorProps {
  onCommand: (command: string) => void
}

interface VoiceCommand {
  patterns: string[]
  action: string
  description: string
  route?: string
}

const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [lastCommand, setLastCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const recognitionRef = useRef<any>(null)
  const navigate = useNavigate()

  const voiceCommands: VoiceCommand[] = [
    {
      patterns: ['go to dashboard', 'open dashboard', 'show dashboard', 'dashboard'],
      action: 'navigate',
      description: 'Navigate to Dashboard',
      route: '/dashboard'
    },
    {
      patterns: ['start training', 'open training', 'neural training', 'training'],
      action: 'navigate',
      description: 'Navigate to Training',
      route: '/training'
    },
    {
      patterns: ['threat detector', 'detect threats', 'scan for threats', 'detector'],
      action: 'navigate',
      description: 'Navigate to Threat Detector',
      route: '/detector'
    },
    {
      patterns: ['security lab', 'forensics lab', 'open lab', 'lab'],
      action: 'navigate',
      description: 'Navigate to Security Lab',
      route: '/lab'
    },
    {
      patterns: ['cyber awareness', 'awareness training', 'awareness', 'learn'],
      action: 'navigate',
      description: 'Navigate to Awareness Section',
      route: '/awareness'
    },
    {
      patterns: ['go home', 'home page', 'main page', 'home'],
      action: 'navigate',
      description: 'Navigate to Home',
      route: '/'
    },
    {
      patterns: ['start scan', 'scan system', 'begin scan', 'scan'],
      action: 'scan',
      description: 'Start System Scan'
    },
    {
      patterns: ['show status', 'system status', 'status report', 'status'],
      action: 'status',
      description: 'Show System Status'
    },
    {
      patterns: ['help me', 'show help', 'what can you do', 'help'],
      action: 'help',
      description: 'Show Voice Commands'
    },
    {
      patterns: ['stop listening', 'turn off voice', 'disable voice', 'stop'],
      action: 'disable',
      description: 'Disable Voice Navigation'
    }
  ]

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      recognitionRef.current.maxAlternatives = 1

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim()
          const confidence = event.results[i][0].confidence

          if (event.results[i].isFinal) {
            finalTranscript = transcript
            setConfidence(confidence || 0.8)
            processVoiceCommand(transcript)
          } else {
            interimTranscript = transcript
          }
        }

        setRecognizedText(interimTranscript || finalTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsListening(false)
        }
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart recognition to keep it continuous
          try {
            recognitionRef.current.start()
          } catch (error) {
            console.error('Error restarting recognition:', error)
          }
        }
      }

      startListening()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true)
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting voice recognition:', error)
        setIsListening(false)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  const processVoiceCommand = (transcript: string) => {
    const command = transcript.toLowerCase().trim()
    
    // Find matching command
    for (const voiceCmd of voiceCommands) {
      for (const pattern of voiceCmd.patterns) {
        if (command.includes(pattern)) {
          executeCommand(voiceCmd, command)
          setLastCommand(voiceCmd.description)
          setCommandHistory(prev => [...prev.slice(-4), voiceCmd.description])
          return
        }
      }
    }

    // If no command found, pass to parent
    onCommand(command)
    setLastCommand(`Unrecognized: "${command}"`)
  }

  const executeCommand = (voiceCmd: VoiceCommand, originalText: string) => {
    switch (voiceCmd.action) {
      case 'navigate':
        if (voiceCmd.route) {
          navigate(voiceCmd.route)
          speak(`Navigating to ${voiceCmd.description}`)
        }
        break
      
      case 'scan':
        speak('Initiating quantum security scan')
        onCommand('start_scan')
        break
      
      case 'status':
        speak('All systems operational. Nexus Cyber Shield is online and monitoring threats.')
        onCommand('show_status')
        break
      
      case 'help':
        speak('Voice navigation active. You can say commands like: go to dashboard, start training, scan system, or show status.')
        break
      
      case 'disable':
        speak('Voice navigation disabled')
        stopListening()
        break
      
      default:
        onCommand(originalText)
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 0.8
      utterance.volume = 0.7
      
      // Try to use a more robotic/tech voice if available
      const voices = speechSynthesis.getVoices()
      const techVoice = voices.find(voice => 
        voice.name.includes('Microsoft') || 
        voice.name.includes('Google') ||
        voice.name.includes('Alex')
      )
      if (techVoice) {
        utterance.voice = techVoice
      }
      
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          className="voice-navigator"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.95)',
            border: '1px solid #00d4ff',
            borderRadius: '1rem',
            padding: window.innerWidth < 768 ? '1rem' : '1.5rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 50px rgba(0, 212, 255, 0.3)',
            minWidth: window.innerWidth < 768 ? '300px' : '380px',
            maxWidth: window.innerWidth < 768 ? '90vw' : '500px',
            maxHeight: 'calc(100vh - 40px)',
            textAlign: 'center',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Voice Visualizer */}
          <div className="voice-visualizer" style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: '4px',
              height: '60px'
            }}>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '4px',
                    background: 'linear-gradient(to top, #00d4ff, #7c3aed)',
                    borderRadius: '2px',
                    minHeight: '8px'
                  }}
                  animate={{
                    height: recognizedText 
                      ? [8, Math.random() * 40 + 20, 8]
                      : [8, 20, 8]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="voice-status" style={{ marginBottom: '1rem' }}>
            <motion.div
              style={{
                fontSize: '3rem',
                marginBottom: '0.5rem'
              }}
              animate={{ 
                rotate: [0, 360],
                scale: recognizedText ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity },
                scale: { duration: 0.3 }
              }}
            >
              🎤
            </motion.div>
            
            <div style={{ 
              color: '#00d4ff', 
              fontSize: '1.2rem', 
              fontFamily: 'Orbitron, monospace',
              fontWeight: 'bold'
            }}>
              VOICE NAVIGATION ACTIVE
            </div>
            
            <div style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.9rem',
              marginTop: '0.5rem'
            }}>
              Listening for commands...
            </div>
          </div>

          {/* Recognized Text */}
          <AnimatePresence>
            {recognizedText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  margin: '1rem 0',
                  fontSize: '1.1rem',
                  color: '#00d4ff'
                }}
              >
                "{recognizedText}"
                {confidence > 0 && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    opacity: 0.7, 
                    marginTop: '0.5rem' 
                  }}>
                    Confidence: {Math.round(confidence * 100)}%
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Last Command */}
          <AnimatePresence>
            {lastCommand && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  margin: '1rem 0',
                  fontSize: '0.9rem',
                  color: '#10b981'
                }}
              >
                ✅ {lastCommand}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Available Commands */}
          <div className="available-commands" style={{ marginTop: '1.5rem' }}>
            <div style={{ 
              fontSize: '0.9rem', 
              opacity: 0.8, 
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              Available Commands:
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.5rem',
              fontSize: '0.8rem',
              textAlign: 'left',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {voiceCommands.slice(0, 8).map((cmd, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ color: '#7c3aed', fontWeight: 'bold' }}>
                    "{cmd.patterns[0]}"
                  </div>
                  <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                    {cmd.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Command History */}
          {commandHistory.length > 0 && (
            <div className="command-history" style={{ marginTop: '1.5rem' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                opacity: 0.8, 
                marginBottom: '0.5rem' 
              }}>
                Recent Commands:
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {commandHistory.map((cmd, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(124, 58, 237, 0.2)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      borderRadius: '1rem',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      color: '#7c3aed'
                    }}
                  >
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="voice-controls" style={{ 
            marginTop: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={stopListening}
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                border: '1px solid #dc2626',
                color: 'white',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Stop Listening
            </button>
            
            <button
              onClick={() => speak('Voice navigation system online and ready for commands')}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                border: '1px solid #7c3aed',
                color: 'white',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Test Voice
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceNavigator