import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import './BackgroundAnimation.css'

const BackgroundAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0a0b0f, 20, 80)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 35)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0b0f, 1)
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Create 3D Numbers (Binary/Hex/Decimal)
    const createFloatingNumbers = () => {
      const numbers = new THREE.Group()
      const numberTexts = ['0', '1', 'FF', 'A7', '42', '0x', '101', 'C4', '8B', 'E3', '00', 'FF', '1337', 'BEEF', 'DEAD', 'CAFE']
      
      for (let i = 0; i < 40; i++) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = 128
        canvas.height = 128
        
        context.font = `bold ${Math.random() * 30 + 20}px 'Courier New', monospace`
        context.fillStyle = i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#ff006e' : '#39ff14'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(numberTexts[Math.floor(Math.random() * numberTexts.length)], 64, 64)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        })
        
        const geometry = new THREE.PlaneGeometry(4, 4)
        const numberMesh = new THREE.Mesh(geometry, material)
        
        numberMesh.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 80
        )
        
        // Add movement properties
        ;(numberMesh as any).velocity = {
          x: (Math.random() - 0.5) * 0.05,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.04
        }
        ;(numberMesh as any).rotationSpeed = (Math.random() - 0.5) * 0.02
        
        numbers.add(numberMesh)
      }
      
      scene.add(numbers)
      return numbers
    }

    // Create Lock/Shield Icons
    const createSecurityIcons = () => {
      const icons = new THREE.Group()
      const iconShapes = ['🔒', '🛡️', '⚠️', '🔐', '🔑', '⚡', '💀', '🔥']
      
      for (let i = 0; i < 15; i++) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = 128
        canvas.height = 128
        
        context.font = `${Math.random() * 20 + 30}px Arial`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = '#00d4ff'
        context.fillText(iconShapes[Math.floor(Math.random() * iconShapes.length)], 64, 64)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6
        })
        
        const geometry = new THREE.PlaneGeometry(3, 3)
        const iconMesh = new THREE.Mesh(geometry, material)
        
        iconMesh.position.set(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 60
        )
        
        ;(iconMesh as any).rotationSpeed = {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.015,
          z: (Math.random() - 0.5) * 0.01
        }
        
        icons.add(iconMesh)
      }
      
      scene.add(icons)
      return icons
    }

    // Create Digital Rain Effect
    const createDigitalRain = () => {
      const rain = new THREE.Group()
      const rainCount = 30
      
      for (let i = 0; i < rainCount; i++) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = 32
        canvas.height = 256
        
        context.fillStyle = '#00ff41'
        context.font = '14px Courier New'
        
        // Create vertical line of random characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
        for (let j = 0; j < 18; j++) {
          const opacity = 1 - (j / 18) * 0.8
          context.fillStyle = `rgba(0, 255, 65, ${opacity})`
          context.fillText(
            chars[Math.floor(Math.random() * chars.length)], 
            8, 
            j * 14 + 14
          )
        }
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.8
        })
        
        const geometry = new THREE.PlaneGeometry(2, 16)
        const rainDrop = new THREE.Mesh(geometry, material)
        
        rainDrop.position.set(
          (Math.random() - 0.5) * 100,
          Math.random() * 40 + 20,
          (Math.random() - 0.5) * 40
        )
        
        ;(rainDrop as any).fallSpeed = Math.random() * 0.1 + 0.05
        ;(rainDrop as any).resetY = rainDrop.position.y
        
        rain.add(rainDrop)
      }
      
      scene.add(rain)
      return rain
    }

    // Create Wireframe Skulls
    const createWireframeSkulls = () => {
      const skulls = new THREE.Group()
      
      for (let i = 0; i < 8; i++) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = 128
        canvas.height = 128
        
        context.strokeStyle = '#ff006e'
        context.lineWidth = 2
        context.font = 'bold 60px Arial'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = 'rgba(255, 0, 110, 0.3)'
        context.fillText('💀', 64, 64)
        context.strokeText('💀', 64, 64)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.5
        })
        
        const geometry = new THREE.PlaneGeometry(4, 4)
        const skull = new THREE.Mesh(geometry, material)
        
        skull.position.set(
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 60
        )
        
        ;(skull as any).rotationSpeed = (Math.random() - 0.5) * 0.01
        ;(skull as any).scaleSpeed = Math.random() * 0.005 + 0.002
        
        skulls.add(skull)
      }
      
      scene.add(skulls)
      return skulls
    }

    // Create elements
    const numbers = createFloatingNumbers()
    const icons = createSecurityIcons()
    const rain = createDigitalRain()
    const skulls = createWireframeSkulls()

    // Animation variables
    let time = 0

    // Animation loop
    const animate = () => {
      time += 0.016 // 60fps delta time

      // Animate floating numbers
      numbers.children.forEach((number) => {
        const vel = (number as any).velocity
        number.position.x += vel.x
        number.position.y += vel.y
        number.position.z += vel.z
        
        // Wrap around boundaries
        if (Math.abs(number.position.x) > 50) vel.x *= -1
        if (Math.abs(number.position.y) > 30) vel.y *= -1
        if (Math.abs(number.position.z) > 40) vel.z *= -1
        
        // Rotation
        number.rotation.y += (number as any).rotationSpeed
        
        // Pulsing opacity
        if (number.material instanceof THREE.MeshBasicMaterial) {
          number.material.opacity = 0.4 + Math.sin(time * 2 + number.position.x * 0.1) * 0.3
        }
      })

      // Animate security icons
      icons.children.forEach((icon) => {
        const rotSpeed = (icon as any).rotationSpeed
        icon.rotation.x += rotSpeed.x
        icon.rotation.y += rotSpeed.y
        icon.rotation.z += rotSpeed.z
        
        // Floating motion
        icon.position.y += Math.sin(time + icon.position.x * 0.1) * 0.02
      })

      // Animate digital rain
      rain.children.forEach((drop) => {
        drop.position.y -= (drop as any).fallSpeed
        
        // Reset to top when it falls below
        if (drop.position.y < -30) {
          drop.position.y = (drop as any).resetY
          drop.position.x = (Math.random() - 0.5) * 100
        }
      })

      // Animate skulls
      skulls.children.forEach((skull, index) => {
        skull.rotation.y += (skull as any).rotationSpeed
        skull.rotation.z += (skull as any).rotationSpeed * 0.5
        
        // Breathing scale effect
        const scaleOffset = Math.sin(time * (skull as any).scaleSpeed + index) * 0.2 + 1
        skull.scale.set(scaleOffset, scaleOffset, scaleOffset)
      })

      // Dynamic camera movement
      camera.position.x = Math.sin(time * 0.05) * 8
      camera.position.y = Math.cos(time * 0.04) * 5
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          }
        }
      })
      
      renderer.dispose()
    }
  }, [])

  return (
    <div className="background-animation">
      <div ref={mountRef} className="three-container" />
      
      {/* Additional 2D overlay effects */}
      <div className="scan-line" />
      <div className="grid-overlay" />
      
      {/* Cyber noise overlay */}
      <div className="noise-overlay" />
    </div>
  )
}

export default BackgroundAnimation