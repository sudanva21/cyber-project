import React from 'react'
import { useSupabase } from '../providers/SupabaseProvider'
import './ProtectedRoute.css'

interface ProtectedRouteProps {
  children: React.ReactNode
  onAuthRequired: () => void
  requireAuth?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  onAuthRequired,
  requireAuth = true 
}) => {
  const { user } = useSupabase()

  if (requireAuth && !user) {
    // Show authentication warning overlay
    return (
      <div className="auth-warning-overlay">
        <div className="auth-warning-container">
          <div className="auth-warning-card">
            <div className="warning-icon">🔐</div>
            <h2>ACCESS RESTRICTED</h2>
            <p>
              This feature requires authentication. Please log in or create an account to continue.
            </p>
            <button 
              className="auth-warning-btn"
              onClick={onAuthRequired}
            >
              <span className="btn-icon">🔑</span>
              <span className="btn-text">LOGIN / REGISTER</span>
            </button>
          </div>
        </div>
        
        {/* Blurred background content */}
        <div className="protected-content-preview">
          {children}
        </div>
        
        <div className="warning-bg-overlay" />
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute