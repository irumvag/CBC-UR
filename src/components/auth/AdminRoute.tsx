import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AdminRouteProps {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, member, loading } = useAuth()
  const location = useLocation()

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
  if (!user) {
    return <Navigate to="/" state={{ from: location, openAuth: true }} replace />
  }

  // Check if user has admin or lead role
  const isAdmin = member?.role === 'admin' || member?.role === 'lead'

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-serif font-semibold text-3xl text-ink mb-3">
            Access Denied
          </h1>
          <p className="text-stone mb-8">
            You don't have permission to access the admin panel. This area is restricted to club administrators and leads.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="secondary" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <a href="/dashboard">
              <Button variant="primary">
                Go to Dashboard
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
