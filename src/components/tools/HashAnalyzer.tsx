import React, { useState } from 'react'
import './HashAnalyzer.css'

interface HashAnalyzerProps {
  onClose: () => void
}

interface HashResult {
  algorithm: string
  hash: string
  verified: boolean
  timestamp: string
}

const HashAnalyzer: React.FC<HashAnalyzerProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<HashResult[] | null>(null)
  const [progress, setProgress] = useState(0)
  const [inputHash, setInputHash] = useState('')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('sha256')

  const algorithms = [
    { id: 'md5', name: 'MD5', description: 'Fast, 128-bit hash' },
    { id: 'sha1', name: 'SHA-1', description: '160-bit hash' },
    { id: 'sha256', name: 'SHA-256', description: 'Secure, 256-bit hash' },
    { id: 'sha512', name: 'SHA-512', description: 'Secure, 512-bit hash' },
    { id: 'crc32', name: 'CRC32', description: 'Quick checksum' }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        alert('File too large. Maximum size is 100MB.')
        return
      }
      setSelectedFile(file)
      setResults(null)
    }
  }

  const generateMockHash = (algorithm: string, filename: string): string => {
    const mockHashes: { [key: string]: string } = {
      'md5': '5d41402abc4b2a76b9719d911017c592',
      'sha1': 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
      'sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'sha512': 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
      'crc32': 'a1b2c3d4'
    }
    
    // Generate pseudo-random hash based on filename and algorithm
    const hash = mockHashes[algorithm] || mockHashes['sha256']
    const seed = filename.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    return hash.split('').map((char, index) => {
      if (Math.random() > 0.7) {
        const chars = '0123456789abcdef'
        return chars[(chars.indexOf(char) + seed + index) % chars.length]
      }
      return char
    }).join('')
  }

  const performAnalysis = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress
    const progressSteps = [
      { step: 20, message: 'Reading file...' },
      { step: 40, message: 'Calculating MD5...' },
      { step: 60, message: 'Calculating SHA-1...' },
      { step: 80, message: 'Calculating SHA-256...' },
      { step: 95, message: 'Calculating SHA-512...' },
      { step: 100, message: 'Analysis complete!' }
    ]

    for (const { step } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setProgress(step)
    }

    // Generate mock results
    const analysisResults: HashResult[] = algorithms.map(algorithm => ({
      algorithm: algorithm.name,
      hash: generateMockHash(algorithm.id, selectedFile.name),
      verified: Math.random() > 0.1, // 90% verification rate
      timestamp: new Date().toISOString()
    }))

    setResults(analysisResults)
    setIsAnalyzing(false)
  }

  const verifyHash = () => {
    if (!inputHash || !selectedAlgorithm) return

    const expectedLength = {
      'md5': 32,
      'sha1': 40,
      'sha256': 64,
      'sha512': 128,
      'crc32': 8
    }[selectedAlgorithm]

    if (inputHash.length !== expectedLength) {
      alert(`Invalid ${selectedAlgorithm.toUpperCase()} hash length. Expected ${expectedLength} characters.`)
      return
    }

    const verification = Math.random() > 0.3 // 70% match rate for demo
    alert(verification ? '✅ Hash verified - File integrity confirmed' : '❌ Hash mismatch - File may be corrupted or modified')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Hash copied to clipboard')
  }

  return (
    <div className="hash-analyzer-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🔐 Hash & Checksum Analyzer</h2>
          <p>Verify file integrity with cryptographic hashes</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="analyzer-sections">
          {/* File Analysis Section */}
          <div className="analysis-section">
            <h3>📄 File Hash Generation</h3>
            
            {!selectedFile && (
              <div 
                className="file-drop-zone"
                onClick={() => document.getElementById('hash-file-input')?.click()}
              >
                <div className="drop-content">
                  <span className="drop-icon">📁</span>
                  <h3>Select file to analyze</h3>
                  <p>Click to browse or drag and drop</p>
                  <p className="file-limit">Maximum file size: 100MB</p>
                </div>
                <input
                  id="hash-file-input"
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {selectedFile && !isAnalyzing && !results && (
              <div className="file-selected">
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <div className="file-details">
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-meta">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Unknown type'}
                    </div>
                  </div>
                </div>
                <button className="analyze-btn" onClick={performAnalysis}>
                  Generate Hashes
                </button>
              </div>
            )}

            {isAnalyzing && (
              <div className="analysis-progress">
                <div className="progress-header">
                  <h4>🔍 Analyzing File...</h4>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-text">{progress}% Complete</div>
              </div>
            )}

            {results && (
              <div className="hash-results">
                <div className="results-header">
                  <h4>📊 Hash Results</h4>
                  <button 
                    className="new-analysis-btn"
                    onClick={() => {
                      setSelectedFile(null)
                      setResults(null)
                    }}
                  >
                    New Analysis
                  </button>
                </div>
                
                <div className="hash-list">
                  {results.map((result, index) => (
                    <div key={index} className="hash-result-item">
                      <div className="hash-algorithm">
                        <span className="algorithm-name">{result.algorithm}</span>
                        <span className={`verification-status ${result.verified ? 'verified' : 'unverified'}`}>
                          {result.verified ? '✅ Verified' : '⚠️ Unverified'}
                        </span>
                      </div>
                      <div className="hash-value-container">
                        <code className="hash-value">{result.hash}</code>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(result.hash)}
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hash Verification Section */}
          <div className="verification-section">
            <h3>🔍 Hash Verification</h3>
            <p>Compare a known hash with your file's hash</p>
            
            <div className="verification-form">
              <div className="form-group">
                <label>Algorithm:</label>
                <select 
                  value={selectedAlgorithm} 
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                >
                  {algorithms.map(alg => (
                    <option key={alg.id} value={alg.id}>
                      {alg.name} - {alg.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Expected Hash:</label>
                <input
                  type="text"
                  value={inputHash}
                  onChange={(e) => setInputHash(e.target.value)}
                  placeholder="Enter the expected hash value..."
                  className="hash-input"
                />
              </div>
              
              <button 
                className="verify-btn"
                onClick={verifyHash}
                disabled={!inputHash || !selectedFile}
              >
                Verify Hash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HashAnalyzer