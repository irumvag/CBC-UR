import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Activities', href: '/events' },
  { name: 'Projects', href: '/projects' },
  { name: 'Community', href: '/join' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-surface/80 backdrop-blur-lg shadow-sm border-b border-pampas-warm'
          : 'bg-transparent'
      )}
    >
      <nav className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Claude Starburst Icon */}
            <div className="w-9 h-9 relative flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                <circle cx="18" cy="6" r="3" className="fill-claude-terracotta" />
                <circle cx="26.5" cy="9.5" r="3" className="fill-claude-terracotta" />
                <circle cx="30" cy="18" r="3" className="fill-claude-terracotta" />
                <circle cx="26.5" cy="26.5" r="3" className="fill-claude-terracotta" />
                <circle cx="18" cy="30" r="3" className="fill-claude-terracotta" />
                <circle cx="9.5" cy="26.5" r="3" className="fill-claude-terracotta" />
                <circle cx="6" cy="18" r="3" className="fill-claude-terracotta" />
                <circle cx="9.5" cy="9.5" r="3" className="fill-claude-terracotta" />
                <circle cx="18" cy="18" r="4" className="fill-claude-terracotta" />
              </svg>
            </div>
            <span className="font-serif font-semibold text-lg">
              <span className="text-claude-terracotta">CBC</span>
              <span className="text-stone mx-1">—</span>
              <span className="text-ink">UR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'font-sans font-medium text-sm transition-colors',
                  location.pathname === link.href
                    ? 'text-claude-terracotta'
                    : 'text-stone hover:text-ink'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/join"
              className={cn(
                'font-sans font-semibold text-sm px-5 py-2.5 rounded-full',
                'bg-ink text-pampas',
                'transition-all duration-200',
                'hover:bg-claude-terracotta hover:text-white hover:-translate-y-0.5 hover:shadow-lg'
              )}
            >
              Join the Club
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-ink hover:text-claude-terracotta transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 animate-slide-down">
            <div className="flex flex-col gap-1 pt-4 border-t border-pampas-warm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'font-sans font-medium px-4 py-3 rounded-xl transition-colors',
                    location.pathname === link.href
                      ? 'bg-claude-terracotta/10 text-claude-terracotta'
                      : 'text-stone hover:bg-pampas hover:text-ink'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/join"
                className={cn(
                  'font-sans font-semibold text-center px-5 py-3 mt-2 rounded-full',
                  'bg-ink text-pampas',
                  'hover:bg-claude-terracotta hover:text-white transition-colors'
                )}
              >
                Join the Club
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
