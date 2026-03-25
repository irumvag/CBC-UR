import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteContent } from '@/lib/types'
import { AdminInput, AdminTextarea } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'
import { Skeleton } from '@/components/ui/Skeleton'

interface ContentSection {
  section: string
  label: string
  fields: {
    key: string
    label: string
    hint?: string
    multiline?: boolean
  }[]
}

const CONTENT_SECTIONS: ContentSection[] = [
  {
    section: 'hero',
    label: 'Hero Section',
    fields: [
      { key: 'hero_heading', label: 'Main Heading', hint: 'The large headline at the top of the homepage' },
      { key: 'hero_subheading', label: 'Subheading', hint: 'The paragraph below the main headline', multiline: true },
      { key: 'hero_cta_primary', label: 'Primary Button Text' },
      { key: 'hero_cta_secondary', label: 'Secondary Button Text' },
    ],
  },
  {
    section: 'outreach',
    label: 'Outreach / Partnership Section',
    fields: [
      { key: 'outreach_heading', label: 'Section Heading' },
      { key: 'outreach_subheading', label: 'Section Description', multiline: true },
      { key: 'outreach_email', label: 'Contact Email' },
      { key: 'outreach_cta', label: 'Button Text' },
    ],
  },
  {
    section: 'about',
    label: 'About Page',
    fields: [
      { key: 'about_mission', label: 'Mission Statement', multiline: true },
      { key: 'about_description', label: 'Club Description', hint: 'The main paragraph describing the club', multiline: true },
    ],
  },
]

export default function AdminContent() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from('site_content').select('key, value')
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((item: Pick<SiteContent, 'key' | 'value'>) => {
          if (item.value !== null) map[item.key] = item.value
        })
        setContent(map)
      }
      setLoading(false)
    }
    fetchContent()
  }, [])

  async function saveSection(sectionDef: ContentSection) {
    setSaving(sectionDef.section)
    try {
      const upserts = sectionDef.fields.map((field) => ({
        key: field.key,
        value: content[field.key] || '',
        section: sectionDef.section,
      }))

      const { error } = await supabase
        .from('site_content')
        .upsert(upserts, { onConflict: 'key' })

      if (error) throw error
      showToast(`${sectionDef.label} saved successfully.`, 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error')
    } finally {
      setSaving(null)
    }
  }

  function updateField(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Site Content</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Edit the text content displayed on your website. Changes are reflected immediately.
        </p>
      </div>

      <div className="space-y-6">
        {CONTENT_SECTIONS.map((section) => (
          <section key={section.section} className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{section.label}</h2>
              <button
                type="button"
                onClick={() => saveSection(section)}
                disabled={saving === section.section}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-60"
              >
                {saving === section.section ? 'Saving…' : 'Save Section'}
              </button>
            </div>

            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {field.label}
                  </label>
                  {field.multiline ? (
                    <AdminTextarea
                      value={content[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <AdminInput
                      value={content[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                  )}
                  {field.hint && (
                    <p className="mt-1 text-xs text-foreground/50">{field.hint}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
