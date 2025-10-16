class AudioManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isInitialized = false
  private volume = 0.5
  private isMuted = false
  private oscillators: Map<string, OscillatorNode> = new Map()
  private audioBuffers: Map<string, AudioBuffer> = new Map()
  private currentTheme: 'quantum' | 'neural' | 'holographic' = 'quantum'

  constructor() {
    this.initializeContext()
  }

  async initializeContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.updateVolume()
      this.isInitialized = true
    } catch (error) {
      console.warn('Audio context initialization failed:', error)
    }
  }

  async initializeQuantumAudio(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initializeContext()
      }
      
      // Resume context if needed (browser security requirements)
      if (this.audioContext?.state === 'suspended') {
        // Note: This will fail without user interaction, which is expected
        await this.audioContext.resume().catch(err => {
          console.warn('AudioContext resume requires user interaction:', err.message)
        })
      }

      // Preload ambient sounds (only if context is running)
      if (this.audioContext?.state === 'running') {
        this.generateAmbientSounds()
      }
    } catch (error) {
      console.warn('Quantum audio initialization failed:', error)
      throw error
    }
  }

  setTheme(theme: 'quantum' | 'neural' | 'holographic') {
    this.currentTheme = theme
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.updateVolume()
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    this.updateVolume()
  }

  private updateVolume() {
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume
    }
  }

  // System Sounds
  playSystemOnline() {
    this.playFrequencySequence([
      { freq: 200, duration: 0.1 },
      { freq: 400, duration: 0.1 },
      { freq: 600, duration: 0.1 },
      { freq: 800, duration: 0.2, volume: 0.3 }
    ])
  }

  playSystemStartup() {
    this.playFrequencySequence([
      { freq: 100, duration: 0.3 },
      { freq: 200, duration: 0.2 },
      { freq: 400, duration: 0.2 },
      { freq: 800, duration: 0.3 },
      { freq: 1200, duration: 0.4, volume: 0.2 }
    ])
  }

  playSystemNotification() {
    this.playFrequencySequence([
      { freq: 800, duration: 0.1, volume: 0.3 },
      { freq: 1200, duration: 0.15, volume: 0.2 }
    ])
  }

  playBiometricSuccess() {
    this.playFrequencySequence([
      { freq: 400, duration: 0.1 },
      { freq: 600, duration: 0.1 },
      { freq: 800, duration: 0.1 },
      { freq: 1000, duration: 0.2, volume: 0.25 }
    ])
  }

  playThemeChange() {
    const themeFrequencies = {
      quantum: [400, 600, 800],
      neural: [300, 500, 700, 900],
      holographic: [200, 400, 600, 800, 1000]
    }

    const frequencies = themeFrequencies[this.currentTheme]
    this.playFrequencySequence(
      frequencies.map(freq => ({ freq, duration: 0.08, volume: 0.15 }))
    )
  }

  // Interactive Sounds
  playClick() {
    this.playTone(800, 0.05, 'square', 0.1)
  }

  playHover() {
    this.playTone(600, 0.03, 'sine', 0.05)
  }

  playKeyPress() {
    this.playTone(400, 0.02, 'square', 0.08)
  }

  playError() {
    this.playFrequencySequence([
      { freq: 200, duration: 0.2, volume: 0.3 },
      { freq: 150, duration: 0.3, volume: 0.25 }
    ])
  }

  playSuccess() {
    this.playFrequencySequence([
      { freq: 600, duration: 0.1, volume: 0.2 },
      { freq: 800, duration: 0.1, volume: 0.2 },
      { freq: 1000, duration: 0.2, volume: 0.15 }
    ])
  }

  playWarning() {
    this.playFrequencySequence([
      { freq: 500, duration: 0.15, volume: 0.25 },
      { freq: 400, duration: 0.15, volume: 0.25 },
      { freq: 500, duration: 0.15, volume: 0.25 }
    ])
  }

  // Threat Detection Sounds
  playThreatDetected() {
    this.playFrequencySequence([
      { freq: 1000, duration: 0.1, volume: 0.3 },
      { freq: 800, duration: 0.1, volume: 0.3 },
      { freq: 1000, duration: 0.1, volume: 0.3 }
    ])
  }

  playScanComplete() {
    this.playFrequencySequence([
      { freq: 300, duration: 0.1 },
      { freq: 400, duration: 0.1 },
      { freq: 500, duration: 0.1 },
      { freq: 600, duration: 0.2, volume: 0.2 }
    ])
  }

  playAlert(severity: 'low' | 'medium' | 'high' | 'critical') {
    const alertPatterns = {
      low: [{ freq: 400, duration: 0.2, volume: 0.15 }],
      medium: [
        { freq: 500, duration: 0.1, volume: 0.2 },
        { freq: 600, duration: 0.1, volume: 0.2 }
      ],
      high: [
        { freq: 700, duration: 0.1, volume: 0.25 },
        { freq: 800, duration: 0.1, volume: 0.25 },
        { freq: 700, duration: 0.1, volume: 0.25 }
      ],
      critical: [
        { freq: 1000, duration: 0.05, volume: 0.35 },
        { freq: 900, duration: 0.05, volume: 0.35 },
        { freq: 1000, duration: 0.05, volume: 0.35 },
        { freq: 900, duration: 0.05, volume: 0.35 },
        { freq: 1000, duration: 0.1, volume: 0.35 }
      ]
    }

    this.playFrequencySequence(alertPatterns[severity])
  }

  // Training & Simulation Sounds
  playTrainingStart() {
    this.playFrequencySequence([
      { freq: 250, duration: 0.2 },
      { freq: 350, duration: 0.2 },
      { freq: 450, duration: 0.3, volume: 0.2 }
    ])
  }

  playSimulationComplete() {
    this.playFrequencySequence([
      { freq: 400, duration: 0.1 },
      { freq: 500, duration: 0.1 },
      { freq: 600, duration: 0.1 },
      { freq: 700, duration: 0.1 },
      { freq: 800, duration: 0.3, volume: 0.2 }
    ])
  }

  playAchievementUnlocked() {
    this.playFrequencySequence([
      { freq: 523, duration: 0.1 }, // C
      { freq: 659, duration: 0.1 }, // E
      { freq: 784, duration: 0.1 }, // G
      { freq: 1047, duration: 0.3, volume: 0.2 } // C octave
    ])
  }

  // Ambient Sounds
  generateAmbientSounds() {
    this.startAmbientHum()
  }

  startAmbientHum() {
    if (!this.audioContext || this.oscillators.has('ambient')) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime)
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain!)
    
    oscillator.start()
    this.oscillators.set('ambient', oscillator)

    // Add subtle frequency modulation
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()
    
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime)
    lfoGain.gain.setValueAtTime(5, this.audioContext.currentTime)
    
    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)
    lfo.start()
  }

  stopAmbientSounds() {
    const ambient = this.oscillators.get('ambient')
    if (ambient) {
      ambient.stop()
      this.oscillators.delete('ambient')
    }
  }

  // Core Audio Methods
  private playTone(
    frequency: number, 
    duration: number, 
    type: OscillatorType = 'sine', 
    volume: number = 0.1
  ) {
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
    
    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  private playFrequencySequence(sequence: Array<{freq: number, duration: number, volume?: number}>) {
    let currentTime = 0
    sequence.forEach(({ freq, duration, volume = 0.2 }) => {
      setTimeout(() => {
        this.playTone(freq, duration, 'sine', volume)
      }, currentTime * 1000)
      currentTime += duration + 0.05 // Small gap between tones
    })
  }

  // Advanced Audio Effects
  createSpatialAudio(x: number, y: number, z: number = 0) {
    if (!this.audioContext) return null

    const panner = this.audioContext.createPanner()
    panner.panningModel = 'HRTF'
    panner.distanceModel = 'inverse'
    panner.refDistance = 1
    panner.maxDistance = 10000
    panner.rolloffFactor = 1
    panner.coneInnerAngle = 360
    panner.coneOuterAngle = 0
    panner.coneOuterGain = 0

    panner.setPosition(x, y, z)
    panner.connect(this.masterGain!)

    return panner
  }

  playQuantumGlitch() {
    if (!this.audioContext) return

    const bufferSize = this.audioContext.sampleRate * 0.1 // 0.1 seconds
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate glitch noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = buffer
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1)
    
    source.connect(gainNode)
    gainNode.connect(this.masterGain!)
    source.start()
  }

  createReverbEffect() {
    if (!this.audioContext) return null

    const convolver = this.audioContext.createConvolver()
    const bufferSize = this.audioContext.sampleRate * 2 // 2 seconds
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate)
    
    const leftChannel = buffer.getChannelData(0)
    const rightChannel = buffer.getChannelData(1)
    
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.pow(1 - (i / bufferSize), 2)
      leftChannel[i] = (Math.random() * 2 - 1) * decay * 0.1
      rightChannel[i] = (Math.random() * 2 - 1) * decay * 0.1
    }
    
    convolver.buffer = buffer
    convolver.connect(this.masterGain!)
    
    return convolver
  }

  // Cleanup
  cleanup() {
    // Stop all oscillators
    this.oscillators.forEach(oscillator => {
      try {
        oscillator.stop()
      } catch (e) {
        // Oscillator might already be stopped
      }
    })
    this.oscillators.clear()

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
    }
  }

  // Getters
  get isAudioEnabled(): boolean {
    return this.isInitialized && this.audioContext?.state === 'running'
  }

  get currentVolume(): number {
    return this.volume
  }

  get muted(): boolean {
    return this.isMuted
  }

  // Additional methods needed by the application
  initialize() {
    return this.initializeQuantumAudio()
  }

  playPageTransition() {
    this.playThemeChange()
  }

  playTyping() {
    this.playKeyPress()
  }

  playSystemInitialize() {
    this.playSystemStartup()
  }

  startLoadingAmbient() {
    this.startAmbientHum()
  }

  stopLoadingAmbient() {
    this.stopAmbientSounds()
  }

  playLoadingBeep() {
    this.playClick()
  }

  playLoadingProgress() {
    this.playHover()
  }

  playDataTransfer() {
    this.playKeyPress()
  }

  playLoadingComplete() {
    this.playScanComplete()
  }

  get context(): AudioContext | null {
    return this.audioContext
  }
}

export default AudioManager