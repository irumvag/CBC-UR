import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Hackathon, PrizeItem, ScheduleItem, FaqItem } from '@/lib/types'
import { FormField, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'
import { Skeleton } from '@/components/ui/Skeleton'

const EMPTY_HACKATHON: Omit<Hackathon, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  tagline: null,
  description: null,
  date_start: null,
  date_end: null,
  location: null,
  registration_url: null,
  prizes: [],
  schedule: [],
  faq: [],
  is_active: true,
}

export default function AdminHackathon() {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...EMPTY_HACKATHON })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchHackathon() {
      // Prefer active hackathon; fall back to most recently created
      let { data } = await supabase
        .from('hackathons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!data) {
        const fallback = await supabase
          .from('hackathons')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        data = fallback.data
      }

      if (data) {
        setHackathon(data)
        setForm({
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          date_start: data.date_start,
          date_end: data.date_end,
          location: data.location,
          registration_url: data.registration_url,
          prizes: data.prizes || [],
          schedule: data.schedule || [],
          faq: data.faq || [],
          is_active: data.is_active,
        })
      }
      setLoading(false)
    }
    fetchHackathon()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        tagline: form.tagline || null,
        description: form.description || null,
        date_start: form.date_start || null,
        date_end: form.date_end || null,
        location: form.location || null,
        registration_url: form.registration_url || null,
      }

      // If setting this hackathon as active, deactivate all others first
      if (payload.is_active) {
        const deactivateQuery = supabase
          .from('hackathons')
          .update({ is_active: false })
          .eq('is_active', true)
        if (hackathon) {
          await deactivateQuery.neq('id', hackathon.id)
        } else {
          await deactivateQuery
        }
      }

      if (hackathon) {
        const { error } = await supabase.from('hackathons').update(payload).eq('id', hackathon.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('hackathons').insert(payload).select().single()
        if (error) throw error
        setHackathon(data as typeof hackathon)
      }
      showToast(
        payload.is_active
          ? 'Hackathon saved and set as active. Other hackathons were deactivated.'
          : 'Hackathon saved successfully.',
        'success'
      )
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Prize helpers
  function addPrize() {
    setForm({ ...form, prizes: [...form.prizes, { place: '', amount: '', description: '' }] })
  }
  function updatePrize(i: number, field: keyof PrizeItem, value: string) {
    const prizes = [...form.prizes]
    prizes[i] = { ...prizes[i], [field]: value }
    setForm({ ...form, prizes })
  }
  function removePrize(i: number) {
    setForm({ ...form, prizes: form.prizes.filter((_, idx) => idx !== i) })
  }

  // Schedule helpers
  function addScheduleItem() {
    setForm({ ...form, schedule: [...form.schedule, { time: '', title: '', description: '' }] })
  }
  function updateSchedule(i: number, field: keyof ScheduleItem, value: string) {
    const schedule = [...form.schedule]
    schedule[i] = { ...schedule[i], [field]: value }
    setForm({ ...form, schedule })
  }
  function removeSchedule(i: number) {
    setForm({ ...form, schedule: form.schedule.filter((_, idx) => idx !== i) })
  }

  // FAQ helpers
  function addFaq() {
    setForm({ ...form, faq: [...form.faq, { question: '', answer: '' }] })
  }
  function updateFaq(i: number, field: keyof FaqItem, value: string) {
    const faq = [...form.faq]
    faq[i] = { ...faq[i], [field]: value }
    setForm({ ...form, faq })
  }
  function removeFaq(i: number) {
    setForm({ ...form, faq: form.faq.filter((_, idx) => idx !== i) })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hackathon</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Manage the hackathon page content displayed at <code className="bg-cream px-1 rounded">/hackathon</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-foreground">Basic Information</h2>
          <div className="space-y-4">
            <FormField label="Hackathon Title" required>
              <AdminInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. CBC-UR AI Hackathon 2026"
                required
              />
            </FormField>
            <FormField label="Tagline">
              <AdminInput
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="e.g. Build the future of Rwanda with AI"
              />
            </FormField>
            <FormField label="Description">
              <AdminTextarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Full description of the hackathon..."
                rows={4}
              />
            </FormField>
            <AdminToggle
              checked={form.is_active}
              onChange={(checked) => setForm({ ...form, is_active: checked })}
              label="Show hackathon page on website"
            />
          </div>
        </section>

        {/* Dates & Location */}
        <section className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-foreground">Dates & Location</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Start Date">
              <AdminInput
                type="date"
                value={form.date_start || ''}
                onChange={(e) => setForm({ ...form, date_start: e.target.value || null })}
              />
            </FormField>
            <FormField label="End Date">
              <AdminInput
                type="date"
                value={form.date_end || ''}
                onChange={(e) => setForm({ ...form, date_end: e.target.value || null })}
              />
            </FormField>
            <FormField label="Location" hint="Full address or venue name">
              <AdminInput
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="University of Rwanda, Kigali"
              />
            </FormField>
            <FormField label="Registration URL">
              <AdminInput
                value={form.registration_url || ''}
                onChange={(e) => setForm({ ...form, registration_url: e.target.value })}
                placeholder="https://..."
                type="url"
              />
            </FormField>
          </div>
        </section>

        {/* Prizes */}
        <section className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Prizes</h2>
            <button type="button" onClick={addPrize} className="flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5">
              <Plus className="h-3.5 w-3.5" /> Add Prize
            </button>
          </div>
          <div className="space-y-3">
            {form.prizes.map((prize, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground/70">Place</label>
                  <AdminInput value={prize.place} onChange={(e) => updatePrize(i, 'place', e.target.value)} placeholder="1st Place" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground/70">Amount</label>
                  <AdminInput value={prize.amount} onChange={(e) => updatePrize(i, 'amount', e.target.value)} placeholder="$500" />
                </div>
                <button type="button" onClick={() => removePrize(i)} className="flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="col-span-3">
                  <AdminInput value={prize.description || ''} onChange={(e) => updatePrize(i, 'description', e.target.value)} placeholder="Prize description (optional)" />
                </div>
              </div>
            ))}
            {form.prizes.length === 0 && (
              <p className="text-sm text-foreground/40">No prizes added yet.</p>
            )}
          </div>
        </section>

        {/* Schedule */}
        <section className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Schedule / Timeline</h2>
            <button type="button" onClick={addScheduleItem} className="flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {form.schedule.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="w-28 shrink-0">
                  <label className="mb-1 block text-xs font-medium text-foreground/70">Time</label>
                  <AdminInput value={item.time} onChange={(e) => updateSchedule(i, 'time', e.target.value)} placeholder="9:00 AM" />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-foreground/70">Activity</label>
                  <AdminInput value={item.title} onChange={(e) => updateSchedule(i, 'title', e.target.value)} placeholder="Opening Ceremony" />
                </div>
                <button type="button" onClick={() => removeSchedule(i)} className="mt-6 flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {form.schedule.length === 0 && (
              <p className="text-sm text-foreground/40">No schedule items yet.</p>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">FAQ</h2>
            <button type="button" onClick={addFaq} className="flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/5">
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
          </div>
          <div className="space-y-4">
            {form.faq.map((item, i) => (
              <div key={i} className="rounded-lg border border-muted/20 p-4 relative">
                <button type="button" onClick={() => removeFaq(i)} className="absolute right-3 top-3 rounded p-1 text-red-400 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground/70">Question</label>
                    <AdminInput value={item.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} placeholder="Who can participate?" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground/70">Answer</label>
                    <AdminTextarea value={item.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} placeholder="Answer..." rows={2} />
                  </div>
                </div>
              </div>
            ))}
            {form.faq.length === 0 && (
              <p className="text-sm text-foreground/40">No FAQ items yet.</p>
            )}
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? 'Saving…' : hackathon ? 'Save Changes' : 'Create Hackathon Page'}
          </button>
        </div>
      </form>
    </div>
  )
}
