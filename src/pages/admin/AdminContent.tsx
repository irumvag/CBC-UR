import { useState } from 'react'
import {
  Plus, Pencil, Trash2, Save,
  Users, Link2, Award, BarChart3
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import {
  useAdminFeatures,
  useAdminTeamMembers,
  useAdminPartners,
  useAdminStats,
} from '@/hooks/useSiteContent'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type {
  Feature, FeatureInput,
  TeamMember, TeamMemberInput,
  Partner, PartnerInput,
  SiteStat, SiteStatInput,
} from '@/types/database'

type ContentTab = 'features' | 'team' | 'partners' | 'stats'

const tabs: { key: ContentTab; label: string; icon: React.ElementType }[] = [
  { key: 'features', label: 'Features', icon: Award },
  { key: 'team', label: 'Team Members', icon: Users },
  { key: 'partners', label: 'Partners', icon: Link2 },
  { key: 'stats', label: 'Stats', icon: BarChart3 },
]

const iconOptions = [
  'book-open', 'code', 'users', 'presentation', 'calendar', 'star',
  'trophy', 'flag', 'award', 'heart', 'zap', 'target', 'globe',
  'folder-kanban', 'handshake', 'lightbulb', 'rocket', 'brain'
]

const tierOptions = [
  { value: 'platinum', label: 'Platinum' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'partner', label: 'Partner' },
]

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<ContentTab>('features')
  const { showToast } = useToast()

  return (
    <AdminLayout
      title="Site Content"
      description="Manage features, team members, partners, and statistics displayed on the website."
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors',
                activeTab === tab.key
                  ? 'bg-claude-terracotta text-white'
                  : 'bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'
              )}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'features' && <FeaturesTab showToast={showToast} />}
      {activeTab === 'team' && <TeamMembersTab showToast={showToast} />}
      {activeTab === 'partners' && <PartnersTab showToast={showToast} />}
      {activeTab === 'stats' && <StatsTab showToast={showToast} />}
    </AdminLayout>
  )
}

// ============================================
// Features Tab
// ============================================
function FeaturesTab({ showToast }: { showToast: (message: string, type?: 'success' | 'error') => void }) {
  const { features, loading, createFeature, updateFeature, deleteFeature } = useAdminFeatures()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<FeatureInput>({
    icon: 'star',
    title_en: '',
    title_rw: '',
    description_en: '',
    description_rw: '',
    sort_order: 0,
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      icon: 'star',
      title_en: '',
      title_rw: '',
      description_en: '',
      description_rw: '',
      sort_order: features.length + 1,
      is_active: true,
    })
  }

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id)
    setFormData({
      icon: feature.icon,
      title_en: feature.title_en,
      title_rw: feature.title_rw || '',
      description_en: feature.description_en,
      description_rw: feature.description_rw || '',
      sort_order: feature.sort_order,
      is_active: feature.is_active,
    })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!formData.title_en || !formData.description_en) {
      showToast('Title and description are required', 'error')
      return
    }

    if (isCreating) {
      const result = await createFeature(formData)
      if (result.success) {
        showToast('Feature created successfully', 'success')
        resetForm()
        setIsCreating(false)
      } else {
        showToast(result.error || 'Failed to create feature', 'error')
      }
    } else if (editingId) {
      const result = await updateFeature(editingId, formData)
      if (result.success) {
        showToast('Feature updated successfully', 'success')
        setEditingId(null)
        resetForm()
      } else {
        showToast(result.error || 'Failed to update feature', 'error')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return
    const result = await deleteFeature(id)
    if (result.success) {
      showToast('Feature deleted successfully', 'success')
    } else {
      showToast(result.error || 'Failed to delete feature', 'error')
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
  }

  return (
    <div className="space-y-6">
      {/* Add New Button */}
      {!isCreating && !editingId && (
        <Button
          onClick={() => {
            resetForm()
            setIsCreating(true)
          }}
          className="gap-2"
        >
          <Plus size={18} />
          Add Feature
        </Button>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-ink dark:text-dark-text">
            {isCreating ? 'Create New Feature' : 'Edit Feature'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Title (English) *</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
                placeholder="Learn AI Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Title (Kinyarwanda)</label>
              <input
                type="text"
                value={formData.title_rw}
                onChange={(e) => setFormData({ ...formData, title_rw: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
                placeholder="Wige Iterambere rya AI"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Description (English) *</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
                placeholder="Master prompt engineering..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Description (Kinyarwanda)</label>
              <textarea
                value={formData.description_rw}
                onChange={(e) => setFormData({ ...formData, description_rw: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
                placeholder="Menya ubuhanga bwo gukoresha prompt..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="feature-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-pampas-warm"
              />
              <label htmlFor="feature-active" className="text-sm text-stone dark:text-dark-muted">Active</label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save size={18} />
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreating(false)
                setEditingId(null)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="space-y-3">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={cn(
              'bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-4',
              !feature.is_active && 'opacity-60'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-pampas dark:bg-dark-surface px-2 py-0.5 rounded font-mono">
                    {feature.icon}
                  </span>
                  <span className="text-xs text-stone dark:text-dark-muted">Order: {feature.sort_order}</span>
                  {!feature.is_active && (
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-ink dark:text-dark-text">{feature.title_en}</h4>
                {feature.title_rw && (
                  <p className="text-sm text-claude-terracotta">{feature.title_rw}</p>
                )}
                <p className="text-sm text-stone dark:text-dark-muted mt-1 line-clamp-2">{feature.description_en}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(feature)}
                  className="p-2 text-stone hover:text-ink dark:text-dark-muted dark:hover:text-dark-text rounded-lg hover:bg-pampas dark:hover:bg-dark-surface transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(feature.id)}
                  className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Team Members Tab
// ============================================
function TeamMembersTab({ showToast }: { showToast: (message: string, type?: 'success' | 'error') => void }) {
  const { teamMembers, loading, createTeamMember, updateTeamMember, deleteTeamMember } = useAdminTeamMembers()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<TeamMemberInput>({
    name: '',
    role_en: '',
    role_rw: '',
    bio_en: '',
    bio_rw: '',
    image_url: '',
    linkedin_url: '',
    github_url: '',
    sort_order: 0,
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      name: '',
      role_en: '',
      role_rw: '',
      bio_en: '',
      bio_rw: '',
      image_url: '',
      linkedin_url: '',
      github_url: '',
      sort_order: teamMembers.length + 1,
      is_active: true,
    })
  }

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setFormData({
      name: member.name,
      role_en: member.role_en,
      role_rw: member.role_rw || '',
      bio_en: member.bio_en || '',
      bio_rw: member.bio_rw || '',
      image_url: member.image_url || '',
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      sort_order: member.sort_order,
      is_active: member.is_active,
    })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.role_en) {
      showToast('Name and role are required', 'error')
      return
    }

    if (isCreating) {
      const result = await createTeamMember(formData)
      if (result.success) {
        showToast('Team member added successfully', 'success')
        resetForm()
        setIsCreating(false)
      } else {
        showToast(result.error || 'Failed to add team member', 'error')
      }
    } else if (editingId) {
      const result = await updateTeamMember(editingId, formData)
      if (result.success) {
        showToast('Team member updated successfully', 'success')
        setEditingId(null)
        resetForm()
      } else {
        showToast(result.error || 'Failed to update team member', 'error')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    const result = await deleteTeamMember(id)
    if (result.success) {
      showToast('Team member deleted successfully', 'success')
    } else {
      showToast(result.error || 'Failed to delete team member', 'error')
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
  }

  return (
    <div className="space-y-6">
      {!isCreating && !editingId && (
        <Button onClick={() => { resetForm(); setIsCreating(true) }} className="gap-2">
          <Plus size={18} />
          Add Team Member
        </Button>
      )}

      {(isCreating || editingId) && (
        <div className="bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-ink dark:text-dark-text">
            {isCreating ? 'Add Team Member' : 'Edit Team Member'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Role (English) *</label>
              <input
                type="text"
                value={formData.role_en}
                onChange={(e) => setFormData({ ...formData, role_en: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Role (Kinyarwanda)</label>
              <input
                type="text"
                value={formData.role_rw}
                onChange={(e) => setFormData({ ...formData, role_rw: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Bio (English)</label>
              <textarea
                value={formData.bio_en}
                onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Bio (Kinyarwanda)</label>
              <textarea
                value={formData.bio_rw}
                onChange={(e) => setFormData({ ...formData, bio_rw: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="team-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-pampas-warm"
              />
              <label htmlFor="team-active" className="text-sm text-stone dark:text-dark-muted">Active</label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save size={18} />
              Save
            </Button>
            <Button variant="secondary" onClick={() => { setIsCreating(false); setEditingId(null); resetForm() }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={cn(
              'bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-4',
              !member.is_active && 'opacity-60'
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center text-white font-semibold">
                {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-ink dark:text-dark-text">{member.name}</h4>
                <p className="text-sm text-claude-terracotta">{member.role_en}</p>
                {member.bio_en && (
                  <p className="text-sm text-stone dark:text-dark-muted mt-1 line-clamp-2">{member.bio_en}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-stone hover:text-ink dark:text-dark-muted dark:hover:text-dark-text rounded-lg hover:bg-pampas dark:hover:bg-dark-surface transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Partners Tab
// ============================================
function PartnersTab({ showToast }: { showToast: (message: string, type?: 'success' | 'error') => void }) {
  const { partners, loading, createPartner, updatePartner, deletePartner } = useAdminPartners()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<PartnerInput>({
    name: '',
    logo_url: '',
    website_url: '',
    description_en: '',
    description_rw: '',
    tier: 'partner',
    sort_order: 0,
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      description_en: '',
      description_rw: '',
      tier: 'partner',
      sort_order: partners.length + 1,
      is_active: true,
    })
  }

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id)
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      description_en: partner.description_en || '',
      description_rw: partner.description_rw || '',
      tier: partner.tier,
      sort_order: partner.sort_order,
      is_active: partner.is_active,
    })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!formData.name) {
      showToast('Partner name is required', 'error')
      return
    }

    if (isCreating) {
      const result = await createPartner(formData)
      if (result.success) {
        showToast('Partner added successfully', 'success')
        resetForm()
        setIsCreating(false)
      } else {
        showToast(result.error || 'Failed to add partner', 'error')
      }
    } else if (editingId) {
      const result = await updatePartner(editingId, formData)
      if (result.success) {
        showToast('Partner updated successfully', 'success')
        setEditingId(null)
        resetForm()
      } else {
        showToast(result.error || 'Failed to update partner', 'error')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return
    const result = await deletePartner(id)
    if (result.success) {
      showToast('Partner deleted successfully', 'success')
    } else {
      showToast(result.error || 'Failed to delete partner', 'error')
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
  }

  return (
    <div className="space-y-6">
      {!isCreating && !editingId && (
        <Button onClick={() => { resetForm(); setIsCreating(true) }} className="gap-2">
          <Plus size={18} />
          Add Partner
        </Button>
      )}

      {(isCreating || editingId) && (
        <div className="bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-ink dark:text-dark-text">
            {isCreating ? 'Add Partner' : 'Edit Partner'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as PartnerInput['tier'] })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              >
                {tierOptions.map((tier) => (
                  <option key={tier.value} value={tier.value}>{tier.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Website URL</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Description (English)</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone dark:text-dark-muted mb-1">Description (Kinyarwanda)</label>
              <textarea
                value={formData.description_rw}
                onChange={(e) => setFormData({ ...formData, description_rw: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="partner-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-pampas-warm"
              />
              <label htmlFor="partner-active" className="text-sm text-stone dark:text-dark-muted">Active</label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save size={18} />
              Save
            </Button>
            <Button variant="secondary" onClick={() => { setIsCreating(false); setEditingId(null); resetForm() }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={cn(
              'bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-4',
              !partner.is_active && 'opacity-60'
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded font-medium',
                    partner.tier === 'platinum' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                    partner.tier === 'gold' && 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
                    partner.tier === 'silver' && 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
                    partner.tier === 'partner' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  )}>
                    {partner.tier}
                  </span>
                </div>
                <h4 className="font-semibold text-ink dark:text-dark-text">{partner.name}</h4>
                {partner.description_en && (
                  <p className="text-sm text-stone dark:text-dark-muted line-clamp-1">{partner.description_en}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(partner)}
                  className="p-2 text-stone hover:text-ink dark:text-dark-muted dark:hover:text-dark-text rounded-lg hover:bg-pampas dark:hover:bg-dark-surface transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Stats Tab
// ============================================
function StatsTab({ showToast }: { showToast: (message: string, type?: 'success' | 'error') => void }) {
  const { stats, loading, updateStat } = useAdminStats()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<SiteStatInput>>({})

  const handleEdit = (stat: SiteStat) => {
    setEditingId(stat.id)
    setFormData({
      value: stat.value,
      label_en: stat.label_en,
      label_rw: stat.label_rw || '',
      icon: stat.icon,
    })
  }

  const handleSave = async () => {
    if (!editingId) return
    const result = await updateStat(editingId, formData)
    if (result.success) {
      showToast('Stat updated successfully', 'success')
      setEditingId(null)
      setFormData({})
    } else {
      showToast(result.error || 'Failed to update stat', 'error')
    }
  }

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20" />)}</div>
  }

  return (
    <div className="space-y-6">
      <p className="text-stone dark:text-dark-muted text-sm">
        Update the statistics displayed on the homepage. These numbers showcase your club's achievements.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border rounded-xl p-4"
          >
            {editingId === stat.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone dark:text-dark-muted mb-1">Value</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone dark:text-dark-muted mb-1">Icon</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone dark:text-dark-muted mb-1">Label (EN)</label>
                  <input
                    type="text"
                    value={formData.label_en}
                    onChange={(e) => setFormData({ ...formData, label_en: e.target.value })}
                    className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone dark:text-dark-muted mb-1">Label (RW)</label>
                  <input
                    type="text"
                    value={formData.label_rw}
                    onChange={(e) => setFormData({ ...formData, label_rw: e.target.value })}
                    className="w-full px-3 py-2 border border-pampas-warm dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => { setEditingId(null); setFormData({}) }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-claude-terracotta">{stat.value}</div>
                  <div className="text-sm text-ink dark:text-dark-text font-medium">{stat.label_en}</div>
                  {stat.label_rw && (
                    <div className="text-xs text-stone dark:text-dark-muted">{stat.label_rw}</div>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(stat)}
                  className="p-2 text-stone hover:text-ink dark:text-dark-muted dark:hover:text-dark-text rounded-lg hover:bg-pampas dark:hover:bg-dark-surface transition-colors"
                >
                  <Pencil size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
