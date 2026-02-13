import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Calendar, FolderKanban, ChevronRight, Home, FileText } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
}

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Content', href: '/admin/content', icon: FileText },
]

export function AdminLayout({ children, title, description, breadcrumbs = [] }: AdminLayoutProps) {
  const location = useLocation()
  const { member } = useAuth()

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(href)
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
    return 'A'
  }

  return (
    <div className="min-h-screen bg-surface pt-16 md:pt-20">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-ink min-h-[calc(100vh-5rem)] sticky top-20">
          {/* Admin Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-claude-terracotta flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {getInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {member?.full_name || 'Admin'}
                </p>
                <p className="text-pampas/60 text-xs capitalize">
                  {member?.role || 'admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <p className="text-pampas/40 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
              Management
            </p>
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                const isActive = isActiveRoute(link.href)
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all',
                        isActive
                          ? 'bg-claude-terracotta text-white'
                          : 'text-pampas/70 hover:bg-white/5 hover:text-pampas'
                      )}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Back to Site */}
          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-pampas/60 hover:text-pampas text-sm transition-colors"
            >
              <Home size={16} />
              Back to Site
            </Link>
          </div>
        </aside>

        {/* Sidebar - Tablet */}
        <aside className="hidden md:flex lg:hidden flex-col w-16 bg-ink min-h-[calc(100vh-5rem)] sticky top-20">
          {/* Avatar */}
          <div className="p-3 border-b border-white/10 flex justify-center">
            <div className="w-10 h-10 rounded-lg bg-claude-terracotta flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getInitials()}
              </span>
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
                        'flex items-center justify-center p-3 rounded-lg transition-all',
                        isActive
                          ? 'bg-claude-terracotta text-white'
                          : 'text-pampas/70 hover:bg-white/5 hover:text-pampas'
                      )}
                    >
                      <Icon size={20} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Back to Site */}
          <div className="p-2 border-t border-white/10">
            <Link
              to="/"
              title="Back to Site"
              className="flex items-center justify-center p-3 text-pampas/60 hover:text-pampas transition-colors"
            >
              <Home size={18} />
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-5rem)]">
          {/* Breadcrumb & Title */}
          <div className="bg-white dark:bg-dark-surface border-b border-pampas-warm dark:border-dark-border px-4 md:px-6 lg:px-8 py-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-2">
              <Link to="/admin" className="text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text transition-colors">
                Admin
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-stone/50 dark:text-dark-muted/50" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-ink dark:text-dark-text font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
            {/* Title */}
            <h1 className="font-serif font-semibold text-2xl text-ink dark:text-dark-text">{title}</h1>
            {description && (
              <p className="text-stone dark:text-dark-muted text-sm mt-1">{description}</p>
            )}
          </div>

          {/* Page Content */}
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ink border-t border-white/10 z-40">
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
                      : 'text-pampas/60'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
