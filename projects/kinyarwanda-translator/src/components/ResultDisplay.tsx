interface Props {
  text: string
}

export function ResultDisplay({ text }: Props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        border: '1px solid #ddd',
        borderRadius: 8,
        backgroundColor: '#fafafa',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <strong>Translation</strong>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #ccc',
            borderRadius: 4,
            background: 'white',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Copy
        </button>
      </div>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  )
}
