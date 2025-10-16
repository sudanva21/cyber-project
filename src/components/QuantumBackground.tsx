import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface QuantumBackgroundProps {
  theme?: 'quantum' | 'neural' | 'holographic'
}

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  alpha: number
  pulse: number
  color: string
}

interface Connection {
  start: Particle
  end: Particle
  strength: number
  pulseOffset: number
}

const QuantumBackground: React.FC<QuantumBackgroundProps> = ({ theme = 'quantum' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)

  const themeColors = {
    quantum: ['#00d4ff', '#7c3aed', '#10b981'],
    neural: ['#8b5cf6', '#ec4899', '#06b6d4'],
    holographic: ['#06b6d4', '#3b82f6', '#8b5cf6']
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const colors = themeColors[theme]
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 15000))

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          vz: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.8 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }

      particlesRef.current = particles
      createConnections(particles)
    }

    const createConnections = (particles: Particle[]) => {
      const connections: Connection[] = []
      const maxDistance = 120

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            connections.push({
              start: particles[i],
              end: particles[j],
              strength: 1 - (distance / maxDistance),
              pulseOffset: Math.random() * Math.PI * 2
            })
          }
        }
      }

      connectionsRef.current = connections.slice(0, 200) // Limit connections for performance
    }

    const updateParticles = (time: number) => {
      const particles = particlesRef.current
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Boundary wrapping
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50
        if (particle.z < -500) particle.z = 1000
        if (particle.z > 1000) particle.z = -500

        // Update pulse
        particle.pulse += 0.02
        if (particle.pulse > Math.PI * 2) particle.pulse = 0

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }

        // Apply damping
        particle.vx *= 0.99
        particle.vy *= 0.99
        particle.vz *= 0.99
      })

      // Update connections
      connectionsRef.current.forEach(connection => {
        connection.pulseOffset += 0.03
        if (connection.pulseOffset > Math.PI * 2) connection.pulseOffset = 0
      })
    }

    const drawParticles = (ctx: CanvasRenderingContext2D, time: number) => {
      const particles = particlesRef.current

      particles.forEach(particle => {
        const scale = 1 + (particle.z / 1000) * 0.5
        const size = particle.size * scale
        const alpha = particle.alpha * (0.7 + Math.sin(particle.pulse) * 0.3)

        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 2
        )
        gradient.addColorStop(0, `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${particle.color}00`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect for larger particles
        if (size > 2) {
          ctx.shadowColor = particle.color
          ctx.shadowBlur = size * 2
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })
    }

    const drawConnections = (ctx: CanvasRenderingContext2D, time: number) => {
      const connections = connectionsRef.current

      connections.forEach(connection => {
        const alpha = connection.strength * (0.3 + Math.sin(connection.pulseOffset) * 0.2)
        
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(
          connection.start.x, connection.start.y,
          connection.end.x, connection.end.y
        )
        gradient.addColorStop(0, `${connection.start.color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(0.5, `${connection.end.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, `${connection.end.color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = connection.strength * 2
        ctx.lineCap = 'round'
        
        ctx.beginPath()
        ctx.moveTo(connection.start.x, connection.start.y)
        ctx.lineTo(connection.end.x, connection.end.y)
        ctx.stroke()
      })
    }

    const drawQuantumField = (ctx: CanvasRenderingContext2D, time: number) => {
      // Create quantum field effect
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.max(canvas.width, canvas.height) * 0.8
      
      const fieldGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )
      
      const colors = themeColors[theme]
      fieldGradient.addColorStop(0, `${colors[0]}03`)
      fieldGradient.addColorStop(0.3, `${colors[1]}02`)
      fieldGradient.addColorStop(0.6, `${colors[2]}01`)
      fieldGradient.addColorStop(1, 'transparent')

      ctx.fillStyle = fieldGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawQuantumGrid = (ctx: CanvasRenderingContext2D, time: number) => {
      // Draw subtle grid pattern
      const gridSize = 60
      const offset = (time * 0.01) % gridSize
      
      ctx.strokeStyle = `${themeColors[theme][0]}10`
      ctx.lineWidth = 0.5
      
      // Vertical lines
      for (let x = -offset; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Horizontal lines
      for (let y = -offset; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const animate = (time: number) => {
      if (!ctx || !isVisible) return

      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw quantum field
      drawQuantumField(ctx, time)

      // Draw quantum grid
      drawQuantumGrid(ctx, time)

      // Update and draw particles
      updateParticles(time)
      drawConnections(ctx, time)
      drawParticles(ctx, time)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    // Initialize
    resizeCanvas()
    createParticles()
    
    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [theme, isVisible])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="quantum-background-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          pointerEvents: 'none'
        }}
      />
      
      {/* Additional decorative elements */}
      <div className="quantum-background-overlay">
        {/* Quantum Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="quantum-orb"
            style={{
              position: 'absolute',
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${themeColors[theme][i % 3]}20 0%, transparent 70%)`,
              border: `1px solid ${themeColors[theme][i % 3]}30`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
              zIndex: -1,
              pointerEvents: 'none'
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -25, 35, 0],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.3, 0.6, 0.4, 0.3]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Quantum Waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="quantum-wave"
            style={{
              position: 'absolute',
              width: '100%',
              height: '200%',
              background: `conic-gradient(from ${i * 120}deg, transparent 0%, ${themeColors[theme][i]}15 20%, transparent 40%)`,
              top: '-50%',
              left: '0',
              zIndex: -1,
              pointerEvents: 'none',
              transformOrigin: 'center center'
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 30 + i * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </>
  )
}

export default QuantumBackground