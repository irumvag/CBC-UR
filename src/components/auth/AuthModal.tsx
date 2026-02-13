import { useState, useEffect, Fragment } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up form state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')

  const { signIn, signUp, signInWithGoogle } = useAuth()

  // Reset form when tab changes
  useEffect(() => {
    setError(null)
    setSuccessMessage(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [activeTab])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setError(null)
      setSuccessMessage(null)
    } else {
      // Clear form on close
      setSignInEmail('')
      setSignInPassword('')
      setSignUpName('')
      setSignUpEmail('')
      setSignUpPassword('')
      setSignUpConfirmPassword('')
    }
  }, [isOpen, defaultTab])

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
    setIsLoading(true)

    try {
      const { error } = await signIn(signInEmail, signInPassword)
      if (error) {
        setError(error.message)
      } else {
        onClose()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (signUpPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error, needsEmailVerification } = await signUp(signUpEmail, signUpPassword, signUpName)
      if (error) {
        setError(error.message)
      } else if (needsEmailVerification) {
        setSuccessMessage('Account created! Please check your email to verify your account before signing in.')
        // Clear the form
        setSignUpName('')
        setSignUpEmail('')
        setSignUpPassword('')
        setSignUpConfirmPassword('')
      } else {
        onClose()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        // Check for common OAuth configuration errors
        if (error.message.includes('provider is not enabled') || error.message.includes('Unsupported provider')) {
          setError('Google sign-in is not configured yet. Please use email/password to sign in, or contact the administrator to enable Google authentication.')
        } else {
          setError(error.message)
        }
        setIsLoading(false)
      }
      // Don't close modal or set loading false - will redirect to Google
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
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
            'bg-pampas rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto',
            'transform transition-all duration-300',
            'animate-modal-in'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-pampas-warm">
            <h2 className="font-serif font-semibold text-xl text-ink">
              {activeTab === 'signin' ? 'Welcome Back' : 'Join CBC-UR'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-pampas-warm">
            <button
              onClick={() => setActiveTab('signin')}
              className={cn(
                'flex-1 py-3 font-sans font-medium text-sm transition-colors relative',
                activeTab === 'signin'
                  ? 'text-claude-terracotta'
                  : 'text-stone hover:text-ink'
              )}
            >
              Sign In
              {activeTab === 'signin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-claude-terracotta" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={cn(
                'flex-1 py-3 font-sans font-medium text-sm transition-colors relative',
                activeTab === 'signup'
                  ? 'text-claude-terracotta'
                  : 'text-stone hover:text-ink'
              )}
            >
              Sign Up
              {activeTab === 'signup' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-claude-terracotta" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success message */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="your.email@ur.ac.rw"
                      required
                      disabled={isLoading}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className={cn(
                        'w-full pl-12 pr-12 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone hover:text-ink"
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

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-pampas-warm" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-pampas text-stone">or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl',
                    'border-2 border-pampas-warm bg-white',
                    'font-sans font-medium text-ink',
                    'hover:bg-pampas-warm transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="your.email@ur.ac.rw"
                      required
                      disabled={isLoading}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      disabled={isLoading}
                      className={cn(
                        'w-full pl-12 pr-12 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone hover:text-ink"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                      className={cn(
                        'w-full pl-12 pr-12 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone hover:text-ink"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <p className="text-xs text-stone text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}
