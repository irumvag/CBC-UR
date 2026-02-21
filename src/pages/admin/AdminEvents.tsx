import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export default function AdminEvents() {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg pt-20">
      <div className="container-main">
        <Link to="/admin">
          <Button variant="secondary" className="mb-6">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Button>
        </Link>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-8 text-center">
          <h1 className="font-serif text-3xl font-semibold text-ink dark:text-dark-text mb-4">
            Manage Events
          </h1>
          <p className="text-stone dark:text-dark-muted">Coming soon...</p>
        </div>
      </div>
    </div>
  )
}
