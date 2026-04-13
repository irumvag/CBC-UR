import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Calendar, FolderOpen,
  Trophy, FileText, Link, LogOut, Menu, X, KeyRound
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { to: '/admin/hackathon', label: 'Hackathon', icon: Trophy },
  { to: '/admin/content', label: 'Site Content', icon: FileText },
  { to: '/admin/links', label: 'Links', icon: Link },
  { to: '/admin/credentials', label: 'Credentials', icon: KeyRound },
]

function getCurrentPageLabel(pathname: string): string {
  const match = NAV_ITEMS.find((item) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to)
  )
  return match?.label ?? 'Admin'
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const pageLabel = getCurrentPageLabel(location.pathname)

  return (
    <div className="flex h-full min-h-screen bg-cream">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-foreground text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <img src="/images/claude_logo.svg" alt="Claude" className="h-8 w-8 invert" />
          <div>
            <div className="text-sm font-bold leading-tight">CBC-UR Admin</div>
            <div className="text-[11px] text-white/50">Management Panel</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded p-1 hover:bg-white/10 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'border-primary bg-white/10 text-white'
                        : 'border-transparent text-white/60 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-muted/20 bg-surface px-4 py-3 shadow-sm sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1.5 text-foreground/60 hover:bg-cream hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground/40">CBC-UR</span>
            <span className="text-foreground/30">/</span>
            <span className="text-sm font-semibold text-foreground">{pageLabel}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-muted/30 px-3 py-1 text-xs font-medium text-foreground/60 transition-colors hover:border-primary/30 hover:text-primary"
            >
              View Website ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
