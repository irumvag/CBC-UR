import type { Direction } from '../App'

interface Props {
  direction: Direction
  onToggle: (direction: Direction) => void
}

export function LanguageToggle({ direction, onToggle }: Props) {
  const swap = () => {
    onToggle(direction === 'en-to-rw' ? 'rw-to-en' : 'en-to-rw')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1rem',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
        {direction === 'en-to-rw' ? 'English' : 'Kinyarwanda'}
      </span>

      <button
        type="button"
        onClick={swap}
        style={{
          padding: '0.4rem 0.8rem',
          border: '1px solid #ddd',
          borderRadius: 8,
          background: 'white',
          cursor: 'pointer',
          fontSize: '1.1rem',
        }}
        aria-label="Swap languages"
      >
        ⇄
      </button>

      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
        {direction === 'en-to-rw' ? 'Kinyarwanda' : 'English'}
      </span>
    </div>
  )
}
