import React, { useState } from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import AudioManager from '../utils/AudioManager'
import './AuthModal.css'

interface AuthModalProps {
  onClose: () => void
  audioManager: AudioManager
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, audioManager }) => {
  const { signIn, signUp, signInWithGoogle } = useSupabase()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username)
        if (error) {
          setError(error.message)
          audioManager.playError()
        } else {
          audioManager.playSuccess()
          onClose()
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
          audioManager.playError()
        } else {
          audioManager.playSuccess()
          onClose()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      audioManager.playError()
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = () => {
    audioManager.playTyping()
  }

  const handleTabSwitch = (signup: boolean) => {
    setIsSignUp(signup)
    setError('')
    audioManager.playClick()
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    audioManager.playClick()

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
        audioManager.playError()
      } else {
        audioManager.playSuccess()
        // Note: Google OAuth will redirect, so onClose might not be called
        // onClose()
      }
    } catch (err) {
      setError('Google sign-in failed')
      audioManager.playError()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-title">
            <span className="auth-icon">🔐</span>
            <h2 className="font-primary">SYSTEM ACCESS</h2>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => handleTabSwitch(false)}
          >
            <span className="tab-icon">🔓</span>
            <span className="font-code">LOGIN</span>
          </button>
          <button
            className={`tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => handleTabSwitch(true)}
          >
            <span className="tab-icon">👤</span>
            <span className="font-code">REGISTER</span>
          </button>
        </div>

        {/* Google Sign-In Button */}
        <div className="social-auth-section">
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <span className="google-icon">🚀</span>
            <span className="font-code">CONTINUE WITH GOOGLE</span>
          </button>
        </div>

        <div className="auth-divider">
          <span className="divider-line"></span>
          <span className="divider-text font-code">OR</span>
          <span className="divider-line"></span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username (Sign Up only) */}
          {isSignUp && (
            <div className="form-group">
              <label className="form-label font-code">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  handleInputChange()
                }}
                className="form-input"
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label font-code">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleInputChange()
              }}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label font-code">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                handleInputChange()
              }}
              className="form-input"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="font-code">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              <span className="submit-icon">{isSignUp ? '🚀' : '🔑'}</span>
            )}
            <span className="font-code">
              {loading ? 'PROCESSING...' : (isSignUp ? 'CREATE ACCOUNT' : 'ACCESS SYSTEM')}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <div className="security-info font-code">
            <span className="security-icon">🔒</span>
            <span>END-TO-END ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal