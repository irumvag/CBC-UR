import { useEffect } from 'react'
import { X } from 'lucide-react'

interface AdminModalProps {
  title: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  submitting?: boolean
  submitLabel?: string
  children: React.ReactNode
}

export function AdminModal({
  title,
  onClose,
  onSubmit,
  submitting = false,
  submitLabel = 'Save',
  children,
}: AdminModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, submitting])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-muted/20 px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-foreground/40 transition-colors hover:bg-cream hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="px-6 py-5 space-y-4">{children}</div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-muted/20 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-muted/30 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting ? 'Saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

export function FormField({ label, required, children, hint }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-foreground/50">{hint}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function AdminInput({ className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-muted/30 bg-cream px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

export function AdminTextarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-muted/30 bg-cream px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

export function AdminSelect({
  className = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-muted/30 bg-cream px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
    />
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function AdminToggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`h-5 w-9 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted/40'}`} />
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  )
}
