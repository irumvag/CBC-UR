import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard, FolderKanban, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, member, signOut, loading } = useAuth()

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
    setUserMenuOpen(false)
  }, [location.pathname])

  // Check if navigated from protected route
  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthModalOpen(true)
      setAuthModalTab('signin')
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const openSignIn = () => {
    setAuthModalTab('signin')
    setAuthModalOpen(true)
    setMobileMenuOpen(false)
  }

  const openSignUp = () => {
    setAuthModalTab('signup')
    setAuthModalOpen(true)
    setMobileMenuOpen(false)
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (member?.full_name) {
      return member.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return '?'
  }

  return (
    <>
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

              {/* Auth Section */}
              {!loading && (
                <>
                  {user ? (
                    // User is logged in - show avatar with dropdown
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={cn(
                          'flex items-center gap-2 pl-1 pr-3 py-1 rounded-full',
                          'border-2 border-pampas-warm bg-white',
                          'hover:border-claude-terracotta/30 transition-colors'
                        )}
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center">
                          {member?.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-semibold">
                              {getInitials()}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'text-stone transition-transform',
                            userMenuOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-pampas-warm py-2 animate-fade-in">
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-pampas-warm">
                            <p className="font-semibold text-ink text-sm truncate">
                              {member?.full_name || user.email}
                            </p>
                            <p className="text-stone text-xs truncate">{user.email}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-pampas-warm transition-colors"
                            >
                              <LayoutDashboard size={18} className="text-stone" />
                              Dashboard
                            </Link>
                            <Link
                              to="/dashboard/projects"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-pampas-warm transition-colors"
                            >
                              <FolderKanban size={18} className="text-stone" />
                              My Projects
                            </Link>
                            <Link
                              to="/dashboard/settings"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-pampas-warm transition-colors"
                            >
                              <Settings size={18} className="text-stone" />
                              Settings
                            </Link>
                          </div>

                          {/* Sign Out */}
                          <div className="border-t border-pampas-warm pt-1 mt-1">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                              <LogOut size={18} />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // User is not logged in - show Join button
                    <button
                      onClick={openSignUp}
                      className={cn(
                        'font-sans font-semibold text-sm px-5 py-2.5 rounded-full',
                        'bg-ink text-pampas',
                        'transition-all duration-200',
                        'hover:bg-claude-terracotta hover:text-white hover:-translate-y-0.5 hover:shadow-lg'
                      )}
                    >
                      Join the Club
                    </button>
                  )}
                </>
              )}
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

                {/* Mobile Auth Section */}
                {!loading && (
                  <>
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-pampas-warm">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center">
                            {member?.avatar_url ? (
                              <img
                                src={member.avatar_url}
                                alt={member.full_name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-semibold">
                                {getInitials()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-ink text-sm truncate">
                              {member?.full_name || user.email}
                            </p>
                            <p className="text-stone text-xs truncate">{user.email}</p>
                          </div>
                        </div>

                        {/* Mobile Dashboard Links */}
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-stone hover:bg-pampas hover:text-ink rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/projects"
                          className="flex items-center gap-3 px-4 py-3 text-stone hover:bg-pampas hover:text-ink rounded-xl transition-colors"
                        >
                          <FolderKanban size={18} />
                          My Projects
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-3 text-stone hover:bg-pampas hover:text-ink rounded-xl transition-colors"
                        >
                          <Settings size={18} />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={openSignIn}
                          className={cn(
                            'font-sans font-medium text-center px-5 py-3 mt-2 rounded-full',
                            'border-2 border-pampas-warm text-ink',
                            'hover:bg-pampas transition-colors'
                          )}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={openSignUp}
                          className={cn(
                            'font-sans font-semibold text-center px-5 py-3 mt-2 rounded-full',
                            'bg-ink text-pampas',
                            'hover:bg-claude-terracotta hover:text-white transition-colors'
                          )}
                        >
                          Join the Club
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  )
}
