import { useState } from 'react'
import { TranslatorForm } from './components/TranslatorForm'
import { ResultDisplay } from './components/ResultDisplay'
import { translate } from './api/translate'

export type Direction = 'en-to-rw' | 'rw-to-en'

export default function App() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTranslate = async (text: string, direction: Direction, technical: boolean) => {
    setLoading(true)
    setError('')
    setResult('')

    try {
      const translated = await translate(text, direction, technical)
      setResult(translated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Kinyarwanda Translator</h1>
        <p style={{ color: '#666' }}>
          Translate between Kinyarwanda and English using Claude
        </p>
      </header>

      <TranslatorForm onTranslate={handleTranslate} loading={loading} />

      {error && (
        <div style={{ color: '#c15f3c', marginTop: '1rem', padding: '1rem', border: '1px solid #c15f3c', borderRadius: 8 }}>
          {error}
        </div>
      )}

      {result && <ResultDisplay text={result} />}
    </div>
  )
}
