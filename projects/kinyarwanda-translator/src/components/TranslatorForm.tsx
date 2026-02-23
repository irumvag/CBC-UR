import { useState } from 'react'
import { LanguageToggle } from './LanguageToggle'
import type { Direction } from '../App'

interface Props {
  onTranslate: (text: string, direction: Direction, technical: boolean) => void
  loading: boolean
}

export function TranslatorForm({ onTranslate, loading }: Props) {
  const [text, setText] = useState('')
  const [direction, setDirection] = useState<Direction>('en-to-rw')
  const [technical, setTechnical] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onTranslate(text, direction, technical)
  }

  return (
    <form onSubmit={handleSubmit}>
      <LanguageToggle direction={direction} onToggle={setDirection} />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          direction === 'en-to-rw'
            ? 'Enter English text...'
            : 'Andika mu Kinyarwanda...'
        }
        rows={6}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: 8,
          border: '1px solid #ddd',
          fontSize: '1rem',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#555' }}>
          <input
            type="checkbox"
            checked={technical}
            onChange={(e) => setTechnical(e.target.checked)}
          />
          Technical Mode
        </label>

        <button
          type="submit"
          disabled={loading || !text.trim()}
          style={{
            marginLeft: 'auto',
            padding: '0.625rem 1.5rem',
            backgroundColor: '#c15f3c',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading || !text.trim() ? 0.6 : 1,
          }}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </form>
  )
}
