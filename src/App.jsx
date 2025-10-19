import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderResult = (data) => {
    if (!data) return null
    return (
      <div className="result">
        <h3>Результат классификации:</h3>
        <table className="result-table">
          <thead>
            <tr>
              <th>Поле</th>
              <th>Значение</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <details>
          <summary>Raw JSON</summary>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text Classifier</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст для классификации..."
            rows={5}
            cols={50}
            required
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Обработка...' : 'Classify'}
          </button>
        </form>

        {error && <div className="error">Ошибка: {error}</div>}
        {renderResult(result)}
      </header>
    </div>
  )
}

export default App