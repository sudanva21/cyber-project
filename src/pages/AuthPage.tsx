import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSupabase } from '../providers/SupabaseProvider'
import QuantumBackground from '../components/QuantumBackground'
import './AuthPage.css'

const AuthPage: React.FC = () => {
  const { user, signIn, signUp, signInWithGoogle, loading } = useSupabase()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  })
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return false
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (isSignUp && formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }

    if (isSignUp && !formData.username) {
      setError('Username is required for registration')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setAuthLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.username)
        if (error) {
          setError(error.message)
        } else {
          setSuccess('Account created successfully! Please check your email for verification.')
          setTimeout(() => navigate('/dashboard'), 2000)
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
        setAuthLoading(false)
      }
      // Note: Google OAuth will redirect, so we don't set loading to false here
    } catch (err) {
      setError('Google sign-in failed')
      setAuthLoading(false)
    }
  }

  const switchAuthMode = (signup: boolean) => {
    setIsSignUp(signup)
    setError('')
    setSuccess('')
    setFormData({ email: '', password: '', username: '', confirmPassword: '' })
  }

  if (loading) {
    return (
      <div className="auth-loading">
        <QuantumBackground />
        <div className="auth-loading-content">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡
          </motion.div>
          <p>Initializing Quantum Authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <QuantumBackground theme="quantum" />
      
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="auth-header">
            <motion.div 
              className="auth-logo"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🔐
            </motion.div>
            <h1 className="auth-title font-primary">NEXUS CYBER SHIELD</h1>
            <p className="auth-subtitle">Quantum Security Authentication</p>
          </div>

          {/* Tab Switcher */}
          <div className="auth-tabs">
            <motion.button
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => switchAuthMode(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon">🔑</span>
              <span>LOGIN</span>
            </motion.button>
            <motion.button
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => switchAuthMode(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tab-icon">🚀</span>
              <span>REGISTER</span>
            </motion.button>
          </div>

          {/* Google Sign-In */}
          <motion.button
            type="button"
            className="google-auth-btn"
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="google-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span>Continue with Google</span>
          </motion.button>

          <div className="auth-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Username (Sign Up only) */}
            {isSignUp && (
              <motion.div
                className="form-group"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="form-label">USERNAME</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="form-input"
                  placeholder="Enter your username"
                  disabled={authLoading}
                />
              </motion.div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                disabled={authLoading}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                disabled={authLoading}
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <motion.div
                className="form-group"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="form-label">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="form-input"
                  placeholder="Confirm your password"
                  disabled={authLoading}
                />
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                className="message error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="message-icon">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                className="message success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="message-icon">✅</span>
                <span>{success}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={authLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {authLoading && (
                <motion.div
                  className="btn-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
              )}
              <span className="btn-text">
                {authLoading 
                  ? 'PROCESSING...' 
                  : (isSignUp ? 'CREATE ACCOUNT' : 'ACCESS SYSTEM')
                }
              </span>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <div className="security-info">
              <span className="security-icon">🔒</span>
              <span>QUANTUM-ENCRYPTED AUTHENTICATION</span>
            </div>
            <motion.button
              className="back-btn"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage