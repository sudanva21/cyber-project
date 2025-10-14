export default class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Generate cyber sounds programmatically
      await this.generateSounds()
      this.isInitialized = true
    } catch (error) {
      console.warn('Audio initialization failed:', error)
    }
  }

  private async generateSounds() {
    if (!this.audioContext) return

    // Generate startup sound
    this.sounds.set('startup', this.generateStartupSound())
    
    // Generate button click sound
    this.sounds.set('click', this.generateClickSound())
    
    // Generate alert sound
    this.sounds.set('alert', this.generateAlertSound())
    
    // Generate typing sound
    this.sounds.set('typing', this.generateTypingSound())
    
    // Generate success sound
    this.sounds.set('success', this.generateSuccessSound())
    
    // Generate error sound
    this.sounds.set('error', this.generateErrorSound())
    
    // Generate loading screen specific sounds
    this.sounds.set('loading_ambient', this.generateLoadingAmbientSound())
    this.sounds.set('loading_beep', this.generateLoadingBeepSound())
    this.sounds.set('loading_progress', this.generateLoadingProgressSound())
    this.sounds.set('loading_complete', this.generateLoadingCompleteSound())
    this.sounds.set('system_initialize', this.generateSystemInitializeSound())
    this.sounds.set('data_transfer', this.generateDataTransferSound())
  }

  private generateStartupSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 2
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Create a sci-fi startup sound with multiple frequencies
        const freq1 = 200 + (t * 300) // Rising frequency
        const freq2 = 400 + (t * 200)
        const freq3 = 100 + (t * 150)
        
        const wave1 = Math.sin(2 * Math.PI * freq1 * t)
        const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.5
        const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.3
        
        // Envelope for fade in/out
        const envelope = Math.sin(Math.PI * t / duration)
        
        channelData[i] = (wave1 + wave2 + wave3) * envelope * 0.1
      }
    }

    return buffer
  }

  private generateClickSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.1
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Sharp click sound
        const frequency = 800
        const wave = Math.sin(2 * Math.PI * frequency * t)
        const envelope = Math.exp(-t * 50) // Quick decay
        
        channelData[i] = wave * envelope * 0.2
      }
    }

    return buffer
  }

  private generateAlertSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 1
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Alternating high-low alarm sound
        const frequency = t % 0.5 < 0.25 ? 800 : 400
        const wave = Math.sin(2 * Math.PI * frequency * t)
        const envelope = 0.5
        
        channelData[i] = wave * envelope * 0.15
      }
    }

    return buffer
  }

  private generateTypingSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.05
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Quick typing sound
        const noise = (Math.random() - 0.5) * 2
        const envelope = Math.exp(-t * 100)
        
        channelData[i] = noise * envelope * 0.1
      }
    }

    return buffer
  }

  private generateSuccessSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.5
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Success chord progression
        const freq1 = 523.25 // C5
        const freq2 = 659.25 // E5
        const freq3 = 783.99 // G5
        
        const wave1 = Math.sin(2 * Math.PI * freq1 * t)
        const wave2 = Math.sin(2 * Math.PI * freq2 * t)
        const wave3 = Math.sin(2 * Math.PI * freq3 * t)
        
        const envelope = Math.exp(-t * 3)
        
        channelData[i] = (wave1 + wave2 + wave3) * envelope * 0.05
      }
    }

    return buffer
  }

  private generateErrorSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.3
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Harsh error sound
        const frequency = 150 // Low frequency
        const wave = Math.sin(2 * Math.PI * frequency * t)
        const distortion = Math.sign(wave) // Square wave distortion
        const envelope = Math.exp(-t * 5)
        
        channelData[i] = distortion * envelope * 0.1
      }
    }

    return buffer
  }

  private generateLoadingAmbientSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 3
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Low-frequency cyberpunk ambient hum
        const freq1 = 60 + Math.sin(t * 0.5) * 20 // Slow oscillating bass
        const freq2 = 120 + Math.sin(t * 0.7) * 30
        const freq3 = 40 + Math.sin(t * 0.3) * 15
        
        const wave1 = Math.sin(2 * Math.PI * freq1 * t)
        const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.6
        const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.4
        
        // Add subtle digital noise
        const noise = (Math.random() - 0.5) * 0.05
        
        // Subtle envelope to prevent clicking
        const envelope = Math.min(1, Math.min(t * 2, (duration - t) * 2))
        
        channelData[i] = (wave1 + wave2 + wave3 + noise) * envelope * 0.08
      }
    }

    return buffer
  }

  private generateLoadingBeepSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.15
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // High-pitched system beep
        const frequency = 1200
        const wave = Math.sin(2 * Math.PI * frequency * t)
        const envelope = Math.exp(-t * 15) // Quick decay
        
        channelData[i] = wave * envelope * 0.15
      }
    }

    return buffer
  }

  private generateLoadingProgressSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.08
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Subtle progress tick sound
        const frequency = 800 + (t * 200) // Rising frequency
        const wave = Math.sin(2 * Math.PI * frequency * t)
        const envelope = Math.exp(-t * 25)
        
        channelData[i] = wave * envelope * 0.08
      }
    }

    return buffer
  }

  private generateLoadingCompleteSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 1.5
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Triumphant completion sound with cyber elements
        const freq1 = 440 + (t * 100) // Rising fundamental
        const freq2 = 880 + (t * 200) // Higher harmonic
        const freq3 = 1320 + (t * 150) // Even higher harmonic
        
        const wave1 = Math.sin(2 * Math.PI * freq1 * t)
        const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.7
        const wave3 = Math.sin(2 * Math.PI * freq3 * t) * 0.5
        
        // Add some digital modulation
        const modulation = Math.sin(2 * Math.PI * 10 * t) * 0.1 + 1
        
        const envelope = Math.exp(-t * 1.5) * Math.sin(Math.PI * t / duration)
        
        channelData[i] = (wave1 + wave2 + wave3) * modulation * envelope * 0.12
      }
    }

    return buffer
  }

  private generateSystemInitializeSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.5
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // System boot-up sound
        const freq1 = 100 + (t * 400) // Rising sweep
        const freq2 = 200 + (t * 300)
        
        const wave1 = Math.sin(2 * Math.PI * freq1 * t)
        const wave2 = Math.sin(2 * Math.PI * freq2 * t) * 0.6
        
        // Add digital artifacts
        const digitalNoise = Math.sin(2 * Math.PI * 50 * t) * 0.1
        
        const envelope = t < 0.1 ? t * 10 : Math.exp(-(t - 0.1) * 3)
        
        channelData[i] = (wave1 + wave2 + digitalNoise) * envelope * 0.1
      }
    }

    return buffer
  }

  private generateDataTransferSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')
    
    const duration = 0.3
    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate
        
        // Data transmission sound with digital modulation
        const carrierFreq = 600
        const modulationFreq = 15
        
        const carrier = Math.sin(2 * Math.PI * carrierFreq * t)
        const modulation = Math.sin(2 * Math.PI * modulationFreq * t) * 0.5 + 0.5
        
        // Add some noise for digital feel
        const noise = (Math.random() - 0.5) * 0.2
        
        const envelope = Math.exp(-t * 5)
        
        channelData[i] = (carrier * modulation + noise) * envelope * 0.06
      }
    }

    return buffer
  }

  play(soundName: string, volume: number = 1) {
    if (!this.isInitialized || !this.audioContext || !this.sounds.has(soundName)) {
      return
    }

    try {
      const buffer = this.sounds.get(soundName)!
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = Math.max(0, Math.min(1, volume))
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start()
    } catch (error) {
      console.warn('Failed to play sound:', soundName, error)
    }
  }

  // Convenient methods
  playSystemStartup() { this.play('startup', 0.3) }
  playClick() { this.play('click', 0.5) }
  playAlert() { this.play('alert', 0.4) }
  playTyping() { this.play('typing', 0.3) }
  playSuccess() { this.play('success', 0.6) }
  playError() { this.play('error', 0.5) }
  
  // Loading screen specific methods
  playLoadingAmbient() { this.play('loading_ambient', 0.2) }
  playLoadingBeep() { this.play('loading_beep', 0.3) }
  playLoadingProgress() { this.play('loading_progress', 0.25) }
  playLoadingComplete() { this.play('loading_complete', 0.4) }
  playSystemInitialize() { this.play('system_initialize', 0.35) }
  playDataTransfer() { this.play('data_transfer', 0.3) }

  // Advanced loading audio management
  private loadingAmbientSource: AudioBufferSourceNode | null = null
  
  startLoadingAmbient() {
    if (!this.isInitialized || !this.audioContext || !this.sounds.has('loading_ambient')) {
      return
    }

    try {
      // Stop any existing ambient sound
      this.stopLoadingAmbient()
      
      const buffer = this.sounds.get('loading_ambient')!
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      source.loop = true // Loop the ambient sound
      gainNode.gain.value = 0.15
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      this.loadingAmbientSource = source
      source.start()
    } catch (error) {
      console.warn('Failed to start loading ambient sound:', error)
    }
  }
  
  stopLoadingAmbient() {
    if (this.loadingAmbientSource) {
      try {
        this.loadingAmbientSource.stop()
      } catch (error) {
        // Sound might already be stopped
      }
      this.loadingAmbientSource = null
    }
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.sounds.clear()
    this.isInitialized = false
  }
}