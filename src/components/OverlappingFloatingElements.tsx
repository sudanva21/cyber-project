import React from 'react'
import { motion } from 'framer-motion'
import './OverlappingFloatingElements.css'

interface OverlappingFloatingElementsProps {
  onMicrophoneClick?: () => void
  onReactClick?: () => void
  onBrainClick?: () => void
  onCrystalClick?: () => void
}

const OverlappingFloatingElements: React.FC<OverlappingFloatingElementsProps> = ({
  onMicrophoneClick,
  onReactClick,
  onBrainClick,
  onCrystalClick
}) => {
  const elements = [
    { emoji: '🎤', delay: 0, onClick: onMicrophoneClick, className: 'microphone' },
    { emoji: '⚛️', delay: 0.2, onClick: onReactClick, className: 'react' },
    { emoji: '🧠', delay: 0.4, onClick: onBrainClick, className: 'brain' },
    { emoji: '🔮', delay: 0.6, onClick: onCrystalClick, className: 'crystal' }
  ]

  return (
    <div className="overlapping-floating-container">
      {elements.map((element, index) => (
        <motion.div
          key={element.emoji}
          className={`floating-element ${element.className}`}
          initial={{ 
            opacity: 0,
            scale: 0.8
          }}
          animate={{ 
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.6,
            delay: element.delay,
            ease: "easeOut"
          }}
          whileHover={{
            scale: 1.15,
            rotate: 10,
            transition: { duration: 0.3 }
          }}
          whileTap={{
            scale: 0.95
          }}
          onClick={element.onClick}
        >
          <motion.div
            className="element-inner"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2.5 + index * 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {element.emoji}
          </motion.div>
          
          {/* Quantum glow effect */}
          <div className="quantum-glow-ring"></div>
          
          {/* Simplified particle effects */}
          <div className="particles">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
      
      {/* Debug info - remove this later */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: '0',
        color: '#ff0000',
        fontSize: '12px',
        pointerEvents: 'none'
      }}>
        DEBUG: Left Side Elements
      </div>
    </div>
  )
}

export default OverlappingFloatingElements