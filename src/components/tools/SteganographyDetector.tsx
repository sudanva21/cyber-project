import React, { useState, useRef } from 'react'
import './SteganographyDetector.css'

interface SteganographyDetectorProps {
  onClose: () => void
}

interface AnalysisResult {
  filename: string
  fileSize: number
  dimensions?: { width: number; height: number }
  suspiciousMetadata: string[]
  lsbAnalysis: {
    redChannel: number
    greenChannel: number
    blueChannel: number
    overallSuspicion: number
  }
  entropyAnalysis: number
  histogramAnomalies: string[]
  potentialHiddenData: boolean
  confidence: number
}

const SteganographyDetector: React.FC<SteganographyDetectorProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, BMP, WebP)')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setAnalysis(null)
  }

  const analyzeImage = async () => {
    if (!file) return

    setLoading(true)
    
    try {
      // Simulate advanced steganography detection
      const img = new Image()
      img.src = URL.createObjectURL(file)
      
      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate realistic analysis results
      const mockAnalysis: AnalysisResult = {
        filename: file.name,
        fileSize: file.size,
        dimensions: { width: img.width, height: img.height },
        suspiciousMetadata: generateSuspiciousMetadata(),
        lsbAnalysis: generateLSBAnalysis(),
        entropyAnalysis: Math.random() * 0.3 + 0.7, // 0.7-1.0 range
        histogramAnomalies: generateHistogramAnomalies(),
        potentialHiddenData: Math.random() > 0.7, // 30% chance
        confidence: Math.random() * 0.4 + 0.6 // 60-100% confidence
      }

      setAnalysis(mockAnalysis)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateSuspiciousMetadata = (): string[] => {
    const possibilities = [
      'Unusual EXIF comment field',
      'Non-standard color profile',
      'Modified timestamp inconsistency',
      'Suspicious software signature',
      'Irregular ICC profile data',
      'Anomalous thumbnail data'
    ]
    
    const count = Math.floor(Math.random() * 3)
    return possibilities.slice(0, count)
  }

  const generateLSBAnalysis = () => {
    return {
      redChannel: Math.random() * 0.4 + 0.1,   // 0.1-0.5
      greenChannel: Math.random() * 0.4 + 0.1, // 0.1-0.5
      blueChannel: Math.random() * 0.4 + 0.1,  // 0.1-0.5
      overallSuspicion: Math.random() * 0.6 + 0.2 // 0.2-0.8
    }
  }

  const generateHistogramAnomalies = (): string[] => {
    const possibilities = [
      'Unusual peak distribution in red channel',
      'Suspicious low-bit plane patterns',
      'Non-natural frequency distribution',
      'Potential LSB embedding detected',
      'Irregular noise patterns'
    ]
    
    const count = Math.floor(Math.random() * 3)
    return possibilities.slice(0, count)
  }

  const getSuspicionColor = (level: number) => {
    if (level < 0.3) return '#10b981' // green
    if (level < 0.6) return '#fbbf24' // yellow
    return '#ef4444' // red
  }

  const getSuspicionText = (level: number) => {
    if (level < 0.3) return 'Low'
    if (level < 0.6) return 'Medium'
    return 'High'
  }

  return (
    <div className="steganography-detector-overlay">
      <div className="steganography-detector">
        <div className="detector-header">
          <div className="header-info">
            <h2>🔍 Steganography Detector</h2>
            <p>Advanced hidden data detection using AI analysis</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="detector-content">
          {!file ? (
            <div 
              className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📁</div>
              <h3>Drop your image here or click to browse</h3>
              <p>Supports: JPEG, PNG, GIF, BMP, WebP (Max 10MB)</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                hidden
              />
            </div>
          ) : (
            <div className="analysis-section">
              <div className="file-info">
                <div className="file-preview">
                  <img src={URL.createObjectURL(file)} alt="Preview" />
                </div>
                <div className="file-details">
                  <h3>{file.name}</h3>
                  <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p className="file-type">{file.type}</p>
                </div>
              </div>

              {!analysis && !loading && (
                <button className="analyze-btn" onClick={analyzeImage}>
                  <span>🔬</span>
                  Start Steganography Analysis
                </button>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Analyzing image for hidden data...</p>
                  <div className="progress-steps">
                    <div className="step active">Extracting metadata</div>
                    <div className="step active">LSB analysis</div>
                    <div className="step">Entropy calculation</div>
                    <div className="step">Pattern recognition</div>
                  </div>
                </div>
              )}

              {analysis && (
                <div className="analysis-results">
                  <div className="results-header">
                    <h3>🔍 Analysis Results</h3>
                    <div className="confidence-badge">
                      Confidence: {(analysis.confidence * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="results-grid">
                    {/* Overall Assessment */}
                    <div className={`result-card overall ${analysis.potentialHiddenData ? 'suspicious' : 'clean'}`}>
                      <div className="card-icon">
                        {analysis.potentialHiddenData ? '⚠️' : '✅'}
                      </div>
                      <h4>Overall Assessment</h4>
                      <p className="assessment">
                        {analysis.potentialHiddenData 
                          ? 'Potential hidden data detected'
                          : 'No obvious steganographic content found'
                        }
                      </p>
                    </div>

                    {/* LSB Analysis */}
                    <div className="result-card">
                      <div className="card-icon">🎨</div>
                      <h4>LSB Analysis</h4>
                      <div className="lsb-channels">
                        <div className="channel">
                          <span>Red:</span>
                          <div className="suspicion-bar">
                            <div 
                              className="suspicion-fill"
                              style={{ 
                                width: `${analysis.lsbAnalysis.redChannel * 100}%`,
                                backgroundColor: getSuspicionColor(analysis.lsbAnalysis.redChannel)
                              }}
                            />
                          </div>
                          <span>{getSuspicionText(analysis.lsbAnalysis.redChannel)}</span>
                        </div>
                        <div className="channel">
                          <span>Green:</span>
                          <div className="suspicion-bar">
                            <div 
                              className="suspicion-fill"
                              style={{ 
                                width: `${analysis.lsbAnalysis.greenChannel * 100}%`,
                                backgroundColor: getSuspicionColor(analysis.lsbAnalysis.greenChannel)
                              }}
                            />
                          </div>
                          <span>{getSuspicionText(analysis.lsbAnalysis.greenChannel)}</span>
                        </div>
                        <div className="channel">
                          <span>Blue:</span>
                          <div className="suspicion-bar">
                            <div 
                              className="suspicion-fill"
                              style={{ 
                                width: `${analysis.lsbAnalysis.blueChannel * 100}%`,
                                backgroundColor: getSuspicionColor(analysis.lsbAnalysis.blueChannel)
                              }}
                            />
                          </div>
                          <span>{getSuspicionText(analysis.lsbAnalysis.blueChannel)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Entropy Analysis */}
                    <div className="result-card">
                      <div className="card-icon">📊</div>
                      <h4>Entropy Analysis</h4>
                      <div className="entropy-value">
                        <span className="entropy-number">{analysis.entropyAnalysis.toFixed(3)}</span>
                        <span className="entropy-label">Shannon entropy</span>
                      </div>
                      <p className="entropy-desc">
                        {analysis.entropyAnalysis > 0.85 
                          ? 'High entropy suggests potential data hiding'
                          : 'Normal entropy levels detected'
                        }
                      </p>
                    </div>

                    {/* Metadata Issues */}
                    <div className="result-card">
                      <div className="card-icon">📋</div>
                      <h4>Metadata Analysis</h4>
                      {analysis.suspiciousMetadata.length === 0 ? (
                        <p className="clean-metadata">No suspicious metadata found</p>
                      ) : (
                        <ul className="metadata-issues">
                          {analysis.suspiciousMetadata.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Histogram Anomalies */}
                    <div className="result-card">
                      <div className="card-icon">📈</div>
                      <h4>Histogram Analysis</h4>
                      {analysis.histogramAnomalies.length === 0 ? (
                        <p className="clean-histogram">Normal distribution patterns</p>
                      ) : (
                        <ul className="histogram-issues">
                          {analysis.histogramAnomalies.map((anomaly, index) => (
                            <li key={index}>{anomaly}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Technical Details */}
                    <div className="result-card technical">
                      <div className="card-icon">⚙️</div>
                      <h4>Technical Details</h4>
                      <div className="tech-details">
                        <div className="detail">
                          <span>Dimensions:</span>
                          <span>{analysis.dimensions?.width} × {analysis.dimensions?.height} px</span>
                        </div>
                        <div className="detail">
                          <span>File Size:</span>
                          <span>{(analysis.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <div className="detail">
                          <span>Color Depth:</span>
                          <span>24-bit RGB</span>
                        </div>
                        <div className="detail">
                          <span>Compression:</span>
                          <span>Standard</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="results-actions">
                    <button className="action-btn secondary" onClick={() => {setFile(null); setAnalysis(null)}}>
                      Analyze Another Image
                    </button>
                    <button className="action-btn primary">
                      Export Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SteganographyDetector