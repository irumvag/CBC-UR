import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, FolderKanban, Settings, Award, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Events', href: '/dashboard/events', icon: Calendar },
  { name: 'My Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { member, user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
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

  // Format join date
  const formatJoinDate = () => {
    if (member?.joined_at) {
      return new Date(member.joined_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    }
    return 'Jan 2026'
  }

  // Get role badge color
  const getRoleBadgeClass = () => {
    switch (member?.role) {
      case 'admin':
        return 'bg-claude-terracotta text-white'
      case 'lead':
        return 'bg-teal text-white'
      default:
        return 'bg-sage/20 text-sage'
    }
  }

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-pampas dark:bg-dark-bg pt-16 md:pt-20 transition-colors">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-pampas-warm dark:border-dark-border bg-surface dark:bg-dark-card min-h-[calc(100vh-5rem)] sticky top-20 transition-colors">
          {/* User Info Card */}
          <div className="p-4 border-b border-pampas-warm dark:border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center flex-shrink-0">
                {member?.avatar_url ? (
                  <img
                    src={member.avatar_url}
                    alt={member.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink dark:text-dark-text truncate">
                  {member?.full_name || user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full capitalize', getRoleBadgeClass())}>
                    {member?.role || 'member'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-stone dark:text-dark-muted text-xs">
              <Award size={14} />
              <span>Member since {formatJoinDate()}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const isActive = isActiveRoute(link.href)
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors',
                        isActive
                          ? 'bg-claude-terracotta/10 text-claude-terracotta'
                          : 'text-stone dark:text-dark-muted hover:bg-pampas-warm dark:hover:bg-dark-surface hover:text-ink dark:hover:text-dark-text'
                      )}
                    >
                      <Icon size={20} />
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-pampas-warm dark:border-dark-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-stone dark:text-dark-muted hover:bg-pampas-warm dark:hover:bg-dark-surface hover:text-ink dark:hover:text-dark-text transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Sidebar - Tablet (icons only) */}
        <aside className="hidden md:flex lg:hidden flex-col w-16 border-r border-pampas-warm dark:border-dark-border bg-surface dark:bg-dark-card min-h-[calc(100vh-5rem)] sticky top-20 transition-colors">
          {/* User Avatar */}
          <div className="p-3 border-b border-pampas-warm dark:border-dark-border flex justify-center">
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
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const isActive = isActiveRoute(link.href)
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      title={link.name}
                      className={cn(
                        'flex items-center justify-center p-3 rounded-xl transition-colors',
                        isActive
                          ? 'bg-claude-terracotta/10 text-claude-terracotta'
                          : 'text-stone dark:text-dark-muted hover:bg-pampas-warm dark:hover:bg-dark-surface hover:text-ink dark:hover:text-dark-text'
                      )}
                    >
                      <Icon size={20} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Sign Out Icon */}
          <div className="p-2 border-t border-pampas-warm dark:border-dark-border">
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="flex items-center justify-center w-full p-3 rounded-xl text-stone dark:text-dark-muted hover:bg-pampas-warm dark:hover:bg-dark-surface hover:text-ink dark:hover:text-dark-text transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-dark-card border-t border-pampas-warm dark:border-dark-border z-40 transition-colors">
        <ul className="flex justify-around">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = isActiveRoute(link.href)
            return (
              <li key={link.name} className="flex-1">
                <Link
                  to={link.href}
                  className={cn(
                    'flex flex-col items-center gap-1 py-3 px-2 transition-colors',
                    isActive
                      ? 'text-claude-terracotta'
                      : 'text-stone dark:text-dark-muted'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{link.name}</span>
                </Link>
              </li>
            )
          })}
          {/* Sign Out in mobile nav */}
          <li className="flex-1">
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center gap-1 py-3 px-2 w-full text-stone dark:text-dark-muted transition-colors"
            >
              <LogOut size={20} />
              <span className="text-xs font-medium">Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
