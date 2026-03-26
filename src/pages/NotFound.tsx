import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { SEO } from '@/components/SEO'

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
        noIndex
      />

      <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4">
        <div className="mx-auto w-full max-w-lg text-center">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <div className="select-none font-serif text-[130px] font-bold leading-none text-cream md:text-[180px]">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="mb-4 font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-base leading-relaxed text-foreground/70 md:text-lg">
            Oops! The page you're looking for seems to have wandered off.
            It might have been moved, deleted, or perhaps never existed.
          </p>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-muted/30 px-6 py-3 text-base font-medium text-foreground/70 transition-all hover:border-primary/30 hover:bg-pampas-warm hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 border-t border-muted/20 pt-8">
            <p className="mb-4 text-sm text-foreground/60">Maybe you were looking for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Team', href: '/team' },
                { label: 'Events', href: '/events' },
                { label: 'Showcase', href: '/showcase' },
                { label: 'Hackathon', href: '/hackathon' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-lg bg-cream px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-pampas-warm hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
