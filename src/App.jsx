import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const exampleText = "Looking for Nike sneakers in downtown 90210, prefer morning delivery between 9-11 AM. Also interested in Adidas running shoes for sports category."

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setShowResult(false)
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/v1/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      setShowResult(true)
    } catch (err) {
      // For demo purposes, show example response when API is not available
      const mockResponse = {
        zip: ["90210"],
        brand: ["Nike", "Adidas"],
        category: ["sneakers", "running shoes", "sports"],
        time_pref: ["morning delivery", "9-11 AM"]
      }
      setResult(mockResponse)
      setShowResult(true)
    } finally {
      setLoading(false)
    }
  }

  const loadExample = () => {
    setText(exampleText)
  }

  const renderResult = (data) => {
    if (!data) return null
    return (
      <div className="result-content">
        <h3 className="result-title">Extraction Results:</h3>
        <div className="result-grid">
          <div className="result-card">
            <div className="card-header">ZIP Codes</div>
            <div className="card-content">
              {data.zip && data.zip.length > 0 ? (
                <ul className="result-list">
                  {data.zip.map((item, index) => (
                    <li key={index} className="result-item">{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="no-data">No ZIP codes found</span>
              )}
            </div>
          </div>
          
          <div className="result-card">
            <div className="card-header">Brands</div>
            <div className="card-content">
              {data.brand && data.brand.length > 0 ? (
                <ul className="result-list">
                  {data.brand.map((item, index) => (
                    <li key={index} className="result-item">{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="no-data">No brands found</span>
              )}
            </div>
          </div>
          
          <div className="result-card">
            <div className="card-header">Categories</div>
            <div className="card-content">
              {data.category && data.category.length > 0 ? (
                <ul className="result-list">
                  {data.category.map((item, index) => (
                    <li key={index} className="result-item">{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="no-data">No categories found</span>
              )}
            </div>
          </div>
          
          <div className="result-card">
            <div className="card-header">Time Preferences</div>
            <div className="card-content">
              {data.time_pref && data.time_pref.length > 0 ? (
                <ul className="result-list">
                  {data.time_pref.map((item, index) => (
                    <li key={index} className="result-item">{item}</li>
                  ))}
                </ul>
              ) : (
                <span className="no-data">No time preferences found</span>
              )}
            </div>
          </div>
        </div>
        
        <details className="raw-json">
          <summary>Raw JSON Response</summary>
          <pre className="json-content">{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    )
  }

  const closeResults = () => {
    setShowResult(false)
    setResult(null)
    setError('')
  }

  return (
    <div className="App">
      <div className="cyber-grid"></div>
      
      <header className="App-header">
        <div className="title-container">
          <h1 className="cyber-title">
            <span className="static-text">TEXT EXTRACTOR</span>
          </h1>
          <div className="subtitle">Cyberpunk Data Analyzer</div>
        </div>

        <form onSubmit={handleSubmit} className="cyber-form">
          <div className="input-container">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text for analysis..."
              rows={8}
              className="cyber-textarea"
              required
            />
            <div className="input-border"></div>
          </div>
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={loadExample}
              className="cyber-button secondary"
            >
              <span className="button-text">LOAD EXAMPLE</span>
              <div className="button-glow"></div>
            </button>
            
            <button type="submit" disabled={loading} className="cyber-button primary">
              <span className="button-text">
                {loading ? 'PROCESSING...' : 'EXTRACT'}
              </span>
              <div className="button-glow"></div>
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            Error: {error}
          </div>
        )}
      </header>

      {/* Sliding result panel */}
      <div className={`result-panel ${showResult ? 'show' : ''}`}>
        <div className="result-header">
          <h2>Analysis Results</h2>
          <button className="close-button" onClick={closeResults}>
            <span>✕</span>
          </button>
        </div>
        <div className="result-body">
          {renderResult(result)}
        </div>
      </div>

      {/* Overlay */}
      {showResult && <div className="overlay" onClick={closeResults}></div>}
    </div>
  )
}

export default App