import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireApproved?: boolean
}

export function ProtectedRoute({ children, requireApproved = false }: ProtectedRouteProps) {
  const { user, member, loading } = useAuth()
  const location = useLocation()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShouldRedirect(true)
    }
  }, [loading, user])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-claude-terracotta mx-auto mb-4" />
          <p className="text-stone">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if not logged in
  if (shouldRedirect || !user) {
    return <Navigate to="/" state={{ from: location, openAuth: true }} replace />
  }

  // Check if member is approved (if required)
  if (requireApproved && member?.status !== 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-claude-terracotta/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-claude-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-serif font-semibold text-2xl text-ink mb-2">
            Application Pending
          </h2>
          <p className="text-stone mb-6">
            Your membership application is being reviewed. We'll notify you once it's approved.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-claude-terracotta font-medium hover:underline"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
