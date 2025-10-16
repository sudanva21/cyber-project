import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AudioManager from '../utils/AudioManager'
import BackButton from '../components/BackButton'
import './HolographicLab.css'

interface HolographicLabProps {
  audioManager: AudioManager
  onAnalysis: (result: any) => void
}

interface AnalysisResult {
  id: string
  fileName: string
  fileType: 'executable' | 'document' | 'archive' | 'unknown'
  threatLevel: 'safe' | 'suspicious' | 'malicious' | 'critical'
  verdict: string
  details: {
    signatures: number
    heuristics: string[]
    networkConnections: string[]
    fileModifications: string[]
  }
  analysisTime: number
}

const HolographicLab: React.FC<HolographicLabProps> = ({ audioManager, onAnalysis }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    audioManager?.playPageTransition?.()
  }, [audioManager])



  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      audioManager?.playClick?.()
    }
  }

  const startAnalysis = async () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    audioManager?.playClick?.()
    
    // Simulate analysis stages
    const stages = [
      { name: 'Static Analysis', duration: 1000 },
      { name: 'Dynamic Analysis', duration: 1500 },
      { name: 'Behavioral Analysis', duration: 2000 },
      { name: 'Signature Matching', duration: 800 },
      { name: 'Heuristic Scanning', duration: 1200 },
      { name: 'Threat Classification', duration: 500 }
    ]
    
    let totalProgress = 0
    const progressStep = 100 / stages.length
    
    for (const stage of stages) {
      await new Promise(resolve => {
        setTimeout(() => {
          totalProgress += progressStep
          setAnalysisProgress(totalProgress)
          resolve(void 0)
        }, stage.duration)
      })
    }
    
    // Generate analysis result
    const result: AnalysisResult = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      fileType: getFileType(selectedFile.name),
      threatLevel: Math.random() > 0.7 ? 'malicious' : Math.random() > 0.5 ? 'suspicious' : 'safe',
      verdict: generateVerdict(),
      details: {
        signatures: Math.floor(Math.random() * 50),
        heuristics: [
          'Suspicious API calls detected',
          'Obfuscated code patterns',
          'Network communication behavior'
        ],
        networkConnections: [
          'malicious-domain.com:443',
          '192.168.1.100:8080'
        ],
        fileModifications: [
          '/system/critical-file.dll',
          '/registry/HKLM/Software/Security'
        ]
      },
      analysisTime: stages.reduce((acc, stage) => acc + stage.duration, 0)
    }
    
    setCurrentAnalysis(result)
    setAnalysisResults(prev => [result, ...prev].slice(0, 10))
    onAnalysis(result)
    
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
      audioManager?.playSuccess?.()
    }, 500)
  }

  const getFileType = (fileName: string): AnalysisResult['fileType'] => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['exe', 'dll', 'bin'].includes(extension || '')) return 'executable'
    if (['doc', 'pdf', 'txt'].includes(extension || '')) return 'document'
    if (['zip', 'rar', '7z'].includes(extension || '')) return 'archive'
    return 'unknown'
  }

  const generateVerdict = (): string => {
    const verdicts = [
      'Clean - No threats detected',
      'Suspicious - Requires further investigation',
      'Malicious - Contains harmful code',
      'Potentially Unwanted - May contain adware'
    ]
    return verdicts[Math.floor(Math.random() * verdicts.length)]
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'safe': return '#00ff88'
      case 'suspicious': return '#ffaa00'
      case 'malicious': return '#ff4444'
      case 'critical': return '#ff0000'
      default: return '#00aaff'
    }
  }

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'executable': return '⚙️'
      case 'document': return '📄'
      case 'archive': return '📦'
      default: return '❓'
    }
  }

  return (
    <motion.div 
      className="holographic-lab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Back Button */}
      <BackButton audioManager={audioManager} />

      <div className="quantum-container">
        <motion.div 
          className="quantum-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="holographic-title">🔬 Holographic Forensics Lab</h1>
          <p className="quantum-subtitle">Advanced Malware Analysis & Digital Forensics</p>
        </motion.div>

        <div className="lab-layout">
          <div className="analysis-panel">
            <h2>File Analysis</h2>
            
            <div className="file-upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="fileInput" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <div>
                    {selectedFile ? selectedFile.name : 'Select file for analysis'}
                  </div>
                  <div className="upload-hint">
                    Drag & drop or click to select
                  </div>
                </label>
              </div>
              
              {selectedFile && (
                <motion.button
                  className="analyze-btn quantum-btn"
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAnalyzing ? 'ANALYZING...' : 'START ANALYSIS'}
                </motion.button>
              )}
            </div>

            {isAnalyzing && (
              <motion.div 
                className="analysis-progress quantum-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="progress-header">
                  <h3>Analysis in Progress</h3>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    style={{ width: `${analysisProgress}%` }}
                    animate={{ width: `${analysisProgress}%` }}
                  />
                </div>
                
                <div className="analysis-visualization">
                  <div className="scanning-grid">
                    {[...Array(64)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="scan-cell"
                        animate={{
                          backgroundColor: [
                            'rgba(138, 43, 226, 0.1)',
                            'rgba(138, 43, 226, 0.5)',
                            'rgba(138, 43, 226, 0.1)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.02
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentAnalysis && (
              <motion.div 
                className="analysis-result quantum-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="result-header">
                  <h3>Analysis Complete</h3>
                  <div 
                    className="threat-level"
                    style={{ color: getThreatColor(currentAnalysis.threatLevel) }}
                  >
                    {currentAnalysis.threatLevel.toUpperCase()}
                  </div>
                </div>
                
                <div className="result-details">
                  <div className="detail-row">
                    <span>File:</span>
                    <span>{getFileTypeIcon(currentAnalysis.fileType)} {currentAnalysis.fileName}</span>
                  </div>
                  <div className="detail-row">
                    <span>Verdict:</span>
                    <span>{currentAnalysis.verdict}</span>
                  </div>
                  <div className="detail-row">
                    <span>Signatures:</span>
                    <span>{currentAnalysis.details.signatures} detected</span>
                  </div>
                  <div className="detail-row">
                    <span>Analysis Time:</span>
                    <span>{(currentAnalysis.analysisTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>

                <div className="advanced-details">
                  <div className="detail-section">
                    <h4>Behavioral Analysis</h4>
                    {currentAnalysis.details.heuristics.map((item, index) => (
                      <div key={index} className="detail-item">• {item}</div>
                    ))}
                  </div>
                  
                  <div className="detail-section">
                    <h4>Network Connections</h4>
                    {currentAnalysis.details.networkConnections.map((conn, index) => (
                      <div key={index} className="detail-item network">🌐 {conn}</div>
                    ))}
                  </div>
                  
                  <div className="detail-section">
                    <h4>File Modifications</h4>
                    {currentAnalysis.details.fileModifications.map((mod, index) => (
                      <div key={index} className="detail-item modification">📝 {mod}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="results-history">
            <h2>Analysis History</h2>
            <div className="history-list">
              <AnimatePresence>
                {analysisResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    className="history-item quantum-card"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setCurrentAnalysis(result)}
                  >
                    <div className="history-header">
                      <span className="file-icon">{getFileTypeIcon(result.fileType)}</span>
                      <span className="file-name">{result.fileName}</span>
                      <span 
                        className="threat-badge"
                        style={{ backgroundColor: getThreatColor(result.threatLevel) }}
                      >
                        {result.threatLevel}
                      </span>
                    </div>
                    <div className="history-details">
                      <span>{result.verdict}</span>
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HolographicLab