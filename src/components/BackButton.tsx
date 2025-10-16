import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AudioManager from '../utils/AudioManager'

interface BackButtonProps {
  audioManager?: AudioManager
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({ audioManager, className = '' }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
    audioManager?.playClick?.()
  }

  return (
    <motion.button
      className={`quantum-back-btn ${className}`}
      onClick={handleBack}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      ← Back
    </motion.button>
  )
}

export default BackButton