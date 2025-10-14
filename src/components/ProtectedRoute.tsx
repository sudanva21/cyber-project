import React from 'react'
import { useSupabase } from '../providers/SupabaseProvider'

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
          <div className="auth-warning-content">
            <div className="warning-icon">🔐</div>
            <h2 className="warning-title font-primary">ACCESS RESTRICTED</h2>
            <p className="warning-message font-body">
              This feature requires authentication. Please log in or create an account to continue.
            </p>
            <div className="warning-actions">
              <button 
                className="auth-warning-btn primary"
                onClick={onAuthRequired}
              >
                <span className="btn-icon">🔑</span>
                <span className="btn-text font-code">LOGIN / REGISTER</span>
              </button>
            </div>
          </div>
          <div className="warning-bg-overlay" />
        </div>
        
        {/* Blurred background content */}
        <div className="protected-content-preview">
          {children}
        </div>
        
        <style jsx>{`
          .auth-warning-overlay {
            position: relative;
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .protected-content-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: blur(8px);
            opacity: 0.3;
            pointer-events: none;
            z-index: 1;
          }

          .auth-warning-container {
            position: relative;
            z-index: 10;
            max-width: 500px;
            padding: 3rem 2rem;
            background: linear-gradient(135deg, 
              rgba(17, 24, 39, 0.95) 0%, 
              rgba(10, 11, 15, 0.98) 100%
            );
            backdrop-filter: blur(20px);
            border: 2px solid var(--cyber-primary);
            border-radius: 12px;
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.5),
              0 0 40px rgba(0, 212, 255, 0.3);
            text-align: center;
          }

          .warning-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            filter: drop-shadow(0 0 10px var(--cyber-primary));
            animation: warning-pulse 2s ease-in-out infinite;
          }

          .warning-title {
            font-size: 2rem;
            color: var(--cyber-primary);
            margin-bottom: 1rem;
            text-shadow: 0 0 15px var(--cyber-primary);
          }

          .warning-message {
            font-size: 1.1rem;
            color: var(--cyber-text-secondary);
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .warning-actions {
            display: flex;
            justify-content: center;
          }

          .auth-warning-btn {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--cyber-primary), var(--cyber-secondary));
            border: none;
            border-radius: 8px;
            color: var(--cyber-bg-primary);
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
          }

          .auth-warning-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.6);
          }

          .btn-icon {
            font-size: 1.2rem;
          }

          .btn-text {
            font-size: 0.95rem;
            letter-spacing: 1px;
          }

          @keyframes warning-pulse {
            0%, 100% { 
              transform: scale(1);
              text-shadow: 0 0 10px var(--cyber-primary);
            }
            50% { 
              transform: scale(1.1);
              text-shadow: 0 0 20px var(--cyber-primary);
            }
          }

          @media (max-width: 768px) {
            .auth-warning-container {
              margin: 1rem;
              padding: 2rem 1.5rem;
            }
            
            .warning-title {
              font-size: 1.5rem;
            }
            
            .warning-message {
              font-size: 1rem;
            }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute