import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/types'
import { AdminTable, PageHeader, AddButton, StatusBadge, type Column } from '@/components/admin/AdminTable'
import { AdminModal, FormField, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'

const EMPTY: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  role: '',
  bio: null,
  linkedin_url: null,
  email: null,
  image_path: null,
  display_order: 0,
  is_active: true,
}

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  async function fetchMembers() {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
    setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMembers() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY, display_order: members.length + 1 })
    setModalOpen(true)
  }

  function openEdit(member: TeamMember) {
    setEditing(member)
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      linkedin_url: member.linkedin_url,
      email: member.email,
      image_path: member.image_path,
      display_order: member.display_order,
      is_active: member.is_active,
    })
    setModalOpen(true)
  }

  async function handleDelete(member: TeamMember) {
    if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return
    const { error } = await supabase.from('team_members').delete().eq('id', member.id)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Team member deleted.', 'success')
    fetchMembers()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        bio: form.bio || null,
        linkedin_url: form.linkedin_url || null,
        email: form.email || null,
        image_path: form.image_path || null,
      }

      if (editing) {
        const { error } = await supabase.from('team_members').update(payload).eq('id', editing.id)
        if (error) throw error
        showToast('Team member updated.', 'success')
      } else {
        const { error } = await supabase.from('team_members').insert(payload)
        if (error) throw error
        showToast('Team member added.', 'success')
      }
      setModalOpen(false)
      fetchMembers()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: Column<TeamMember>[] = [
    {
      header: 'Member',
      key: 'name',
      render: (m) => (
        <div className="flex items-center gap-3">
          {m.image_path ? (
            <img src={m.image_path} alt={m.name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {m.name.charAt(0)}
            </div>
          )}
          <span className="font-medium">{m.name}</span>
        </div>
      ),
    },
    { header: 'Role', key: 'role' },
    {
      header: 'Order',
      key: 'display_order',
      className: 'w-20 text-center',
      render: (m) => <span className="text-center block text-foreground/60">{m.display_order}</span>,
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (m) => <StatusBadge active={m.is_active} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Team Members"
        description="Manage the club's team members shown on the website."
        action={<AddButton onClick={openAdd} label="Add Member" />}
      />

      <AdminTable
        columns={columns}
        data={members}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No team members yet. Add your first member."
      />

      {modalOpen && (
        <AdminModal
          title={editing ? 'Edit Team Member' : 'Add Team Member'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <FormField label="Full Name" required>
            <AdminInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Gad Anaclet Irumva"
              required
            />
          </FormField>

          <FormField label="Role / Title" required>
            <AdminInput
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. President & Founder"
              required
            />
          </FormField>

          <FormField label="Bio">
            <AdminTextarea
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Short bio about this member..."
              rows={3}
            />
          </FormField>

          <FormField label="Image Path" hint="Path to image in /public/images/team/ (e.g. /images/team/gad.jpg)">
            <AdminInput
              value={form.image_path || ''}
              onChange={(e) => setForm({ ...form, image_path: e.target.value })}
              placeholder="/images/team/name.jpg"
            />
          </FormField>

          <FormField label="LinkedIn URL">
            <AdminInput
              value={form.linkedin_url || ''}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              type="url"
            />
          </FormField>

          <FormField label="Email">
            <AdminInput
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              type="email"
            />
          </FormField>

          <FormField label="Display Order" hint="Lower number appears first">
            <AdminInput
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              type="number"
              min={0}
            />
          </FormField>

          <AdminToggle
            checked={form.is_active}
            onChange={(checked) => setForm({ ...form, is_active: checked })}
            label="Show on website"
          />
        </AdminModal>
      )}
    </div>
  )
}
