import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Link } from '@/lib/types'
import { AdminTable, PageHeader, AddButton, StatusBadge, type Column } from '@/components/admin/AdminTable'
import { AdminModal, FormField, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'

const EMPTY: Omit<Link, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  url: '',
  description: null,
  icon: null,
  display_order: 0,
  is_active: true,
}

export default function AdminLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Link | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  async function fetchLinks() {
    const { data } = await supabase
      .from('links')
      .select('*')
      .order('display_order', { ascending: true })
    setLinks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY, display_order: links.length + 1 })
    setModalOpen(true)
  }

  function openEdit(link: Link) {
    setEditing(link)
    setForm({
      title: link.title,
      url: link.url,
      description: link.description,
      icon: link.icon,
      display_order: link.display_order,
      is_active: link.is_active,
    })
    setModalOpen(true)
  }

  async function handleDelete(link: Link) {
    if (!confirm(`Delete "${link.title}"?`)) return
    const { error } = await supabase.from('links').delete().eq('id', link.id)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Link deleted.', 'success')
    fetchLinks()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        description: form.description || null,
        icon: form.icon || null,
      }

      if (editing) {
        const { error } = await supabase.from('links').update(payload).eq('id', editing.id)
        if (error) throw error
        showToast('Link updated.', 'success')
      } else {
        const { error } = await supabase.from('links').insert(payload)
        if (error) throw error
        showToast('Link added.', 'success')
      }
      setModalOpen(false)
      fetchLinks()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: Column<Link>[] = [
    {
      header: 'Title',
      key: 'title',
      render: (l) => (
        <div className="flex items-center gap-2">
          {l.icon && <span className="text-lg">{l.icon}</span>}
          <span className="font-medium">{l.title}</span>
        </div>
      ),
    },
    {
      header: 'URL',
      key: 'url',
      render: (l) => (
        <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate max-w-[200px] block">
          {l.url}
        </a>
      ),
    },
    {
      header: 'Order',
      key: 'display_order',
      className: 'w-20',
      render: (l) => <span className="text-foreground/60">{l.display_order}</span>,
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (l) => <StatusBadge active={l.is_active} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Quick Links"
        description="Manage the quick links displayed on the /links page."
        action={<AddButton onClick={openAdd} label="Add Link" />}
      />

      <AdminTable
        columns={columns}
        data={links}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No links yet."
      />

      {modalOpen && (
        <AdminModal
          title={editing ? 'Edit Link' : 'Add Link'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <FormField label="Title" required>
            <AdminInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Join the Club"
              required
            />
          </FormField>

          <FormField label="URL" required>
            <AdminInput
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://... or /page"
              required
            />
          </FormField>

          <FormField label="Description">
            <AdminTextarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of the link"
              rows={2}
            />
          </FormField>

          <FormField label="Icon" hint="Emoji or icon name (e.g. 📅 or Calendar)">
            <AdminInput
              value={form.icon || ''}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="📅"
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
