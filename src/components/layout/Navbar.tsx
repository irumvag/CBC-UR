import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { cn } from '@/lib/utils'
import { languages, changeLanguage } from '@/lib/i18n'

const navLinks = [
  { key: 'about', href: '/about' },
  { key: 'events', href: '/events' },
  { key: 'projects', href: '/projects' },
  { key: 'blog', href: '/blog' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, member, signOut, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()

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
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Close user menu and lang menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
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

  const isAdmin = member?.role === 'admin' || member?.role === 'lead'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-surface/80 dark:bg-dark-bg/80 backdrop-blur-lg shadow-sm border-b border-pampas-warm dark:border-dark-border'
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
                <span className="text-stone dark:text-dark-muted mx-1">—</span>
                <span className="text-ink dark:text-dark-text">UR</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.href}
                  className={cn(
                    'font-sans font-medium text-sm transition-colors',
                    location.pathname === link.href
                      ? 'text-claude-terracotta'
                      : 'text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'
                  )}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}

              {/* Language Toggle */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-300',
                    'text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text',
                    'hover:bg-pampas-warm dark:hover:bg-dark-card',
                    'text-sm font-medium'
                  )}
                  aria-label="Change language"
                >
                  <span>{i18n.language === 'rw' ? '🇷🇼' : '🇬🇧'}</span>
                  <span className="uppercase">{i18n.language === 'rw' ? 'RW' : 'EN'}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-pampas-warm dark:border-dark-border py-1 animate-fade-in">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code as 'en' | 'rw')
                          setLangMenuOpen(false)
                        }}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 text-sm w-full transition-colors',
                          i18n.language === lang.code
                            ? 'text-claude-terracotta bg-claude-terracotta/5'
                            : 'text-ink dark:text-dark-text hover:bg-pampas-warm dark:hover:bg-dark-surface'
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-full transition-all duration-300',
                  'text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text',
                  'hover:bg-pampas-warm dark:hover:bg-dark-card',
                  'theme-toggle'
                )}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon size={18} className="theme-toggle-icon" />
                ) : (
                  <Sun size={18} className="theme-toggle-icon" />
                )}
              </button>

              {/* Auth Section */}
              {!loading && (
                <>
                  {user && isAdmin ? (
                    // Admin is logged in - show avatar with dropdown
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={cn(
                          'flex items-center gap-2 pl-1 pr-3 py-1 rounded-full',
                          'border-2 border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-card',
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
                            'text-stone dark:text-dark-muted transition-transform',
                            userMenuOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-pampas-warm dark:border-dark-border py-2 animate-fade-in">
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-pampas-warm dark:border-dark-border">
                            <p className="font-semibold text-ink dark:text-dark-text text-sm truncate">
                              {member?.full_name || user.email}
                            </p>
                            <p className="text-stone dark:text-dark-muted text-xs truncate">{user.email}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="py-1">
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink dark:text-dark-text hover:bg-pampas-warm dark:hover:bg-dark-surface transition-colors"
                            >
                              <LayoutDashboard size={18} className="text-stone dark:text-dark-muted" />
                              Admin Panel
                            </Link>
                          </div>

                          {/* Sign Out */}
                          <div className="border-t border-pampas-warm dark:border-dark-border pt-1 mt-1">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                            >
                              <LogOut size={18} />
                              {t('common.signOut')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : !user ? (
                    // No user logged in - show Admin Sign In button
                    <button
                      onClick={openSignIn}
                      className={cn(
                        'font-sans font-medium text-sm px-4 py-2 rounded-full',
                        'border-2 border-pampas-warm dark:border-dark-border text-stone dark:text-dark-muted',
                        'transition-all duration-200',
                        'hover:border-claude-terracotta/30 hover:text-ink dark:hover:text-dark-text'
                      )}
                    >
                      {t('common.signIn')}
                    </button>
                  ) : null}
                </>
              )}
            </div>

            {/* Mobile: Language + Theme Toggle + Menu Button */}
            <div className="md:hidden flex items-center gap-1">
              {/* Mobile Language Toggle */}
              <button
                onClick={() => {
                  const newLang = i18n.language === 'en' ? 'rw' : 'en'
                  changeLanguage(newLang)
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-300',
                  'text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text',
                  'hover:bg-pampas-warm dark:hover:bg-dark-card',
                  'text-xs font-medium'
                )}
                aria-label="Change language"
              >
                <span>{i18n.language === 'rw' ? '🇷🇼' : '🇬🇧'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-full transition-all duration-300',
                  'text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text',
                  'hover:bg-pampas-warm dark:hover:bg-dark-card'
                )}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                type="button"
                className="p-2 text-ink dark:text-dark-text hover:text-claude-terracotta transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-6 animate-slide-down">
              <div className="flex flex-col gap-1 pt-4 border-t border-pampas-warm dark:border-dark-border">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    to={link.href}
                    className={cn(
                      'font-sans font-medium px-4 py-3 rounded-xl transition-colors',
                      location.pathname === link.href
                        ? 'bg-claude-terracotta/10 text-claude-terracotta'
                        : 'text-stone dark:text-dark-muted hover:bg-pampas dark:hover:bg-dark-card hover:text-ink dark:hover:text-dark-text'
                    )}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                {!loading && (
                  <>
                    {user && isAdmin ? (
                      <>
                        {/* User Info */}
                        <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-pampas-warm dark:border-dark-border">
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
                            <p className="font-semibold text-ink dark:text-dark-text text-sm truncate">
                              {member?.full_name || user.email}
                            </p>
                            <p className="text-stone dark:text-dark-muted text-xs truncate">{user.email}</p>
                          </div>
                        </div>

                        {/* Mobile Admin Link */}
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-stone dark:text-dark-muted hover:bg-pampas dark:hover:bg-dark-card hover:text-ink dark:hover:text-dark-text rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          Admin Panel
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <LogOut size={18} />
                          {t('common.signOut')}
                        </button>
                      </>
                    ) : !user ? (
                      <button
                        onClick={openSignIn}
                        className={cn(
                          'font-sans font-medium text-center px-5 py-3 mt-2 rounded-full',
                          'border-2 border-pampas-warm dark:border-dark-border text-ink dark:text-dark-text',
                          'hover:bg-pampas dark:hover:bg-dark-card transition-colors'
                        )}
                      >
                        {t('common.signIn')}
                      </button>
                    ) : null}
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
      />
    </>
  )
}
