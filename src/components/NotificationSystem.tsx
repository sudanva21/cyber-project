import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: number
  message: string
  type: 'success' | 'warning' | 'error' | 'info' | 'threat'
  timestamp: Date
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
    style?: 'primary' | 'secondary' | 'danger'
  }>
}

interface NotificationSystemProps {
  notifications: Notification[]
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Update visible notifications when prop changes
    const newNotifications = notifications.filter(n => !dismissedIds.has(n.id))
    setVisibleNotifications(newNotifications)

    // Auto-dismiss non-persistent notifications
    newNotifications.forEach(notification => {
      if (!notification.persistent) {
        const duration = notification.duration || 5000
        setTimeout(() => {
          dismissNotification(notification.id)
        }, duration)
      }
    })
  }, [notifications, dismissedIds])

  const dismissNotification = (id: number) => {
    setDismissedIds(prev => new Set(prev).add(id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      case 'threat': return '🛡️'
      default: return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'info': return '#00d4ff'
      case 'threat': return '#7c3aed'
      default: return '#6b7280'
    }
  }

  const getNotificationGradient = (type: string) => {
    switch (type) {
      case 'success': return 'linear-gradient(135deg, #10b981, #059669)'
      case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)'
      case 'error': return 'linear-gradient(135deg, #ef4444, #dc2626)'
      case 'info': return 'linear-gradient(135deg, #00d4ff, #0ea5e9)'
      case 'threat': return 'linear-gradient(135deg, #7c3aed, #6d28d9)'
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)'
    }
  }

  return (
    <div className="notification-system" style={{
      position: 'fixed',
      top: '6rem',
      right: '2rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '400px',
      pointerEvents: 'none'
    }}>
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ 
              opacity: 0, 
              x: 400, 
              scale: 0.8,
              rotateY: 45
            }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              x: 400, 
              scale: 0.8,
              rotateY: -45,
              transition: { duration: 0.3 }
            }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: index * 0.1
            }}
            className="notification-item"
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: `1px solid ${getNotificationColor(notification.type)}`,
              borderRadius: '1rem',
              padding: '1rem 1.5rem',
              backdropFilter: 'blur(20px)',
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${getNotificationColor(notification.type)}40`,
              position: 'relative',
              overflow: 'hidden',
              pointerEvents: 'auto',
              minHeight: '80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {/* Animated Background */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: getNotificationGradient(notification.type),
                opacity: 0.1,
                zIndex: -1
              }}
              animate={{
                left: ['100%', '-100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Content */}
            <div className="notification-content" style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              {/* Icon */}
              <motion.div
                style={{
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {getNotificationIcon(notification.type)}
              </motion.div>

              {/* Text Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  wordWrap: 'break-word'
                }}>
                  {notification.message}
                </div>
                
                <div style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.8rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {notification.timestamp.toLocaleTimeString()}
                </div>

                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    {notification.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => {
                          action.action()
                          if (action.style !== 'secondary') {
                            dismissNotification(notification.id)
                          }
                        }}
                        className={`holographic-btn ${action.style || 'secondary'}`}
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.8rem',
                          minHeight: 'auto'
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dismiss Button */}
              <motion.button
                onClick={() => dismissNotification(notification.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.6)',
                  flexShrink: 0,
                  fontSize: '0.8rem'
                }}
                whileHover={{ 
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  scale: 1.1
                }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            {/* Progress Bar for Timed Notifications */}
            {!notification.persistent && (
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '3px',
                  background: getNotificationColor(notification.type),
                  borderBottomLeftRadius: '1rem',
                  borderBottomRightRadius: '1rem'
                }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ 
                  duration: (notification.duration || 5000) / 1000,
                  ease: "linear"
                }}
              />
            )}

            {/* Pulse Effect for Critical Notifications */}
            {(notification.type === 'error' || notification.type === 'threat') && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  border: `2px solid ${getNotificationColor(notification.type)}`,
                  borderRadius: '1rem',
                  pointerEvents: 'none',
                  zIndex: -1
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}

            {/* Holographic Shimmer Effect */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 1
              }}
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Global Notification Controls */}
      {visibleNotifications.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="notification-controls"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={() => {
              visibleNotifications.forEach(n => dismissNotification(n.id))
            }}
            className="holographic-btn secondary"
            style={{
              fontSize: '0.8rem',
              padding: '0.5rem 1rem'
            }}
          >
            Clear All ({visibleNotifications.length})
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default NotificationSystem