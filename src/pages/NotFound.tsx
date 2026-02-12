import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noIndex
      />

      <div className="min-h-[80vh] flex items-center justify-center bg-surface">
        <div className="container-main">
          <div className="max-w-lg mx-auto text-center">
            {/* 404 Illustration */}
            <div className="relative mb-8">
              <div className="text-[150px] md:text-[200px] font-serif font-bold text-pampas-warm leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-claude-terracotta/10 flex items-center justify-center">
                  <Search className="w-12 h-12 text-claude-terracotta" />
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className="font-serif font-semibold text-ink text-2xl md:text-3xl mb-4">
              Page Not Found
            </h1>
            <p className="text-stone text-lg mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off.
              It might have been moved, deleted, or perhaps never existed.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" size="lg">
                  <Home size={18} />
                  Go Home
                </Button>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-pampas-warm text-stone hover:text-ink hover:bg-pampas-warm transition-all font-medium"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-pampas-warm">
              <p className="text-stone text-sm mb-4">Maybe you were looking for:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Events', href: '/events' },
                  { label: 'Projects', href: '/projects' },
                  { label: 'Join', href: '/join' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 rounded-lg bg-pampas text-stone text-sm hover:text-ink hover:bg-pampas-warm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
