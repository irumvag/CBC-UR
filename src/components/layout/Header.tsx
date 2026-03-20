import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Hackathon', href: '/hackathon' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Links', href: '/links' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-surface/95 backdrop-blur-md shadow-sm'
            : 'bg-surface'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-8 sm:py-2.5 md:px-12">
          <NavLink to="/" className="group flex items-center gap-1.5 sm:gap-2">
            <img
              src="/images/claude_logo.svg"
              alt="Claude logo"
              className="h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-12 sm:h-6 sm:w-6 md:h-7 md:w-7"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-sans text-xs font-bold tracking-tight text-foreground sm:text-sm md:text-base">
                University of Rwanda
              </span>
              <span className="text-[10px] font-semibold tracking-wide text-primary sm:text-xs md:text-sm">
                Claude Builder Club
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex lg:gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 lg:text-base ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:bg-cream hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-cream hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`grid transition-all duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-muted/20 bg-surface px-4 pb-4 pt-2">
              <nav className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-4 py-2.5 text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/70 hover:bg-cream hover:text-primary'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="h-[1.5px] w-full bg-primary" />
      </header>
    </>
  )
}
