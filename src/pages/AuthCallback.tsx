import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSupabase } from '../providers/SupabaseProvider'
import QuantumBackground from '../components/QuantumBackground'
import { supabase } from '../config/supabase'
import './AuthCallback.css'

const AuthCallback: React.FC = () => {
  const { user, loading } = useSupabase()
  const navigate = useNavigate()
  const [callbackLoading, setCallbackLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the URL hash for auth tokens
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError(error.message)
          setTimeout(() => navigate('/auth'), 3000)
        } else if (data.session) {
          // Successfully authenticated
          console.log('Authentication successful:', data.session)
          setTimeout(() => navigate('/dashboard'), 2000)
        } else {
          // No session found, redirect to auth
          setTimeout(() => navigate('/auth'), 2000)
        }
      } catch (err) {
        console.error('Callback processing error:', err)
        setError('Authentication failed')
        setTimeout(() => navigate('/auth'), 3000)
      } finally {
        setCallbackLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate])

  // If user is already authenticated, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />
  }

  // Show error state
  if (error) {
    return (
      <div className="auth-callback-page">
        <QuantumBackground theme="quantum" />
        <div className="callback-container">
          <motion.div
            className="callback-card error-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="callback-icon error-icon">❌</div>
            <h2>Authentication Failed</h2>
            <p>{error}</p>
            <p>Redirecting to login page...</p>
            <motion.div
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  // Show loading state
  return (
    <div className="auth-callback-page">
      <QuantumBackground theme="quantum" />
      <div className="callback-container">
        <motion.div
          className="callback-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="callback-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🔐
          </motion.div>
          <h2>Processing Authentication</h2>
          <p>Quantum systems are validating your credentials...</p>
          <div className="auth-steps">
            <motion.div
              className="step"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ✅ OAuth verification complete
            </motion.div>
            <motion.div
              className="step"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              🔍 Validating user credentials
            </motion.div>
            <motion.div
              className="step"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              🚀 Redirecting to dashboard...
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}

export default AuthCallback