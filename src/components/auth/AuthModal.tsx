import { useState, useEffect, Fragment } from 'react'
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useAuth()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null)
    } else {
      setEmail('')
      setPassword('')
      setShowPassword(false)
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        setError(error.message)
      } else {
        onClose()
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={cn(
            'bg-pampas dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto',
            'transform transition-all duration-300',
            'animate-modal-in'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-pampas-warm dark:border-dark-border">
            <h2 className="font-serif font-semibold text-xl text-ink dark:text-dark-text">
              Admin Sign In
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text hover:bg-pampas-warm dark:hover:bg-dark-surface rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-stone dark:text-dark-muted text-sm mb-4">
              Sign in with your admin credentials. Admins are added to the system by existing administrators.
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block font-sans font-semibold text-ink dark:text-dark-text text-sm mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone dark:text-dark-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ur.ac.rw"
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-surface text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-sans font-semibold text-ink dark:text-dark-text text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone dark:text-dark-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={cn(
                      'w-full pl-12 pr-12 py-3 rounded-xl border-2 border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-surface text-ink dark:text-dark-text placeholder:text-stone dark:placeholder:text-dark-muted',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
