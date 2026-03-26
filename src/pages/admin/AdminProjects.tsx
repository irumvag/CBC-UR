import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import { AdminTable, PageHeader, AddButton, StatusBadge, type Column } from '@/components/admin/AdminTable'
import { AdminModal, FormField, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'

const EMPTY: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: null,
  author_name: null,
  tags: [],
  github_url: null,
  demo_url: null,
  image_path: null,
  is_featured: false,
  is_published: true,
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [tagsInput, setTagsInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY })
    setTagsInput('')
    setModalOpen(true)
  }

  function openEdit(project: Project) {
    setEditing(project)
    setForm({
      title: project.title,
      description: project.description,
      author_name: project.author_name,
      tags: project.tags,
      github_url: project.github_url,
      demo_url: project.demo_url,
      image_path: project.image_path,
      is_featured: project.is_featured,
      is_published: project.is_published,
    })
    setTagsInput(project.tags.join(', '))
    setModalOpen(true)
  }

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Project deleted.', 'success')
    fetchProjects()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        description: form.description || null,
        author_name: form.author_name || null,
        github_url: form.github_url || null,
        demo_url: form.demo_url || null,
        image_path: form.image_path || null,
      }

      if (editing) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editing.id)
        if (error) throw error
        showToast('Project updated.', 'success')
      } else {
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
        showToast('Project added to showcase.', 'success')
      }
      setModalOpen(false)
      fetchProjects()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: Column<Project>[] = [
    {
      header: 'Project',
      key: 'title',
      render: (p) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {p.title}
            {p.is_featured && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Featured</span>
            )}
          </div>
          {p.author_name && <div className="text-xs text-foreground/50">{p.author_name}</div>}
        </div>
      ),
    },
    {
      header: 'Tags',
      key: 'tags',
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-cream px-2 py-0.5 text-[11px] text-foreground/60">
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'is_published',
      render: (p) => <StatusBadge active={p.is_published} labels={['Published', 'Hidden']} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Projects Showcase"
        description="Manage member projects displayed on the showcase page."
        action={<AddButton onClick={openAdd} label="Add Project" />}
      />

      <AdminTable
        columns={columns}
        data={projects}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No projects yet. Add your first project to the showcase."
      />

      {modalOpen && (
        <AdminModal
          title={editing ? 'Edit Project' : 'Add Project'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <FormField label="Project Title" required>
            <AdminInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Claude Study Buddy"
              required
            />
          </FormField>

          <FormField label="Author / Team">
            <AdminInput
              value={form.author_name || ''}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              placeholder="e.g. CBC-UR Team"
            />
          </FormField>

          <FormField label="Description">
            <AdminTextarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this project do?"
              rows={3}
            />
          </FormField>

          <FormField label="Tags" hint="Comma-separated: e.g. Claude API, Python, Education">
            <AdminInput
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Claude API, Python, Education"
            />
          </FormField>

          <FormField label="GitHub URL">
            <AdminInput
              value={form.github_url || ''}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              placeholder="https://github.com/..."
              type="url"
            />
          </FormField>

          <FormField label="Demo URL">
            <AdminInput
              value={form.demo_url || ''}
              onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
              placeholder="https://..."
              type="url"
            />
          </FormField>

          <FormField label="Image Path" hint="Path to image in /public/images/ (e.g. /images/projects/myproject.png)">
            <AdminInput
              value={form.image_path || ''}
              onChange={(e) => setForm({ ...form, image_path: e.target.value })}
              placeholder="/images/projects/name.png"
            />
          </FormField>

          <div className="flex flex-col gap-3">
            <AdminToggle
              checked={form.is_featured}
              onChange={(checked) => setForm({ ...form, is_featured: checked })}
              label="Featured project (shown first)"
            />
            <AdminToggle
              checked={form.is_published}
              onChange={(checked) => setForm({ ...form, is_published: checked })}
              label="Published (visible on website)"
            />
          </div>
        </AdminModal>
      )}
    </div>
  )
}
