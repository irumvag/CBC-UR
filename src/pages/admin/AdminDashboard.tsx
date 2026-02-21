import { useState } from 'react'
import { BarChart3, Users, FileText, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

type AdminTab = 'overview' | 'features' | 'team' | 'partners' | 'stats' | 'content'

const tabs = [
  { value: 'overview', label: 'Overview', icon: BarChart3 },
  { value: 'features', label: 'Features', icon: FileText },
  { value: 'team', label: 'Team Members', icon: Users },
  { value: 'partners', label: 'Partners', icon: Users },
  { value: 'stats', label: 'Statistics', icon: BarChart3 },
  { value: 'content', label: 'Site Content', icon: Settings },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const { member, signOut } = useAuth()
  const navigate = useNavigate()

  // Check if user is admin
  const isAdmin = member?.role === 'admin' || member?.role === 'lead'

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface dark:bg-dark-bg pt-20">
        <div className="container-main text-center py-20">
          <h1 className="font-serif text-3xl font-semibold text-ink dark:text-dark-text mb-4">
            Access Denied
          </h1>
          <p className="text-stone dark:text-dark-muted mb-6">
            You don't have permission to access the admin dashboard. Only admins and leads can access this area.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg pt-20">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink dark:text-dark-text mb-2">
              Admin Dashboard
            </h1>
            <p className="text-stone dark:text-dark-muted">
              Welcome, {member?.full_name || 'Admin'}. Manage your site content here.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-pampas-warm dark:border-dark-border mb-8">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as AdminTab)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap',
                    activeTab === tab.value
                      ? 'border-claude-terracotta text-claude-terracotta'
                      : 'border-transparent text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'
                  )}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border p-6 md:p-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'features' && <FeaturesTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'partners' && <PartnersTab />}
          {activeTab === 'stats' && <StatsTab />}
          {activeTab === 'content' && <ContentTab />}
        </div>
      </div>
    </div>
  )
}

// Tab Components
function OverviewTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-text">
        Admin Overview
      </h2>
      <p className="text-stone dark:text-dark-muted">
        Use the tabs above to manage different aspects of your site. You can create, update, and delete:
      </p>
      <ul className="list-disc list-inside space-y-2 text-stone dark:text-dark-muted">
        <li>Features - Learning and development features displayed on home</li>
        <li>Team Members - Club leadership and team members</li>
        <li>Partners - Organizations and sponsors</li>
        <li>Statistics - Community stats (members, projects, etc.)</li>
        <li>Site Content - Translations and custom content</li>
      </ul>
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-blue-900 dark:text-blue-300 text-sm">
          <strong>Note:</strong> All changes are stored in the database and will be visible to all users immediately after saving.
        </p>
      </div>
    </div>
  )
}

function FeaturesTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-text mb-6">
        Manage Features
      </h2>
      <p className="text-stone dark:text-dark-muted">Feature management UI - Coming soon</p>
      <p className="text-sm text-stone dark:text-dark-muted mt-4">
        Click tabs at the top to navigate to other admin sections.
      </p>
    </div>
  )
}

function TeamTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-text mb-6">
        Manage Team Members
      </h2>
      <p className="text-stone dark:text-dark-muted">Team members management UI - Coming soon</p>
      <p className="text-sm text-stone dark:text-dark-muted mt-4">
        Click tabs at the top to navigate to other admin sections.
      </p>
    </div>
  )
}

function PartnersTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-text mb-6">
        Manage Partners
      </h2>
      <p className="text-stone dark:text-dark-muted">Partners management UI - Coming soon</p>
      <p className="text-sm text-stone dark:text-dark-muted mt-4">
        Click tabs at the top to navigate to other admin sections.
      </p>
    </div>
  )
}

function StatsTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-text mb-6">
        Manage Statistics
      </h2>
      <p className="text-stone dark:text-dark-muted">Statistics management UI - Coming soon</p>
      <p className="text-sm text-stone dark:text-dark-muted mt-4">
        Click tabs at the top to navigate to other admin sections.
      </p>
    </div>
  )
}

function ContentTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-semibold text-ink dark:text-dark-text mb-6">
        Manage Site Content
      </h2>
      <p className="text-stone dark:text-dark-muted">Site content and translations management UI - Coming soon</p>
      <p className="text-sm text-stone dark:text-dark-muted mt-4">
        Click tabs at the top to navigate to other admin sections.
      </p>
    </div>
  )
}
