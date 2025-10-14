import React, { useState, useEffect } from 'react'
import './FloatingSystemTime.css'

const FloatingSystemTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className={`floating-time ${isMinimized ? 'minimized' : ''}`}>
      <div className="floating-time-header" onClick={toggleMinimized}>
        <span className="time-icon">🕒</span>
        {!isMinimized && (
          <>
            <span className="time-label font-code">SYS_TIME</span>
            <button className="minimize-btn">
              {isMinimized ? '▲' : '▼'}
            </button>
          </>
        )}
      </div>
      
      {!isMinimized && (
        <div className="floating-time-content">
          <div className="time-display font-code">
            <span className="time-value">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
          <div className="date-display font-code">
            <span className="date-value">
              {currentTime.toLocaleDateString('en-US', { 
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingSystemTime