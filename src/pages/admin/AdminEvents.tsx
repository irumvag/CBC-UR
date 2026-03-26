import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Event, EventType } from '@/lib/types'
import { AdminTable, PageHeader, AddButton, StatusBadge, type Column } from '@/components/admin/AdminTable'
import { AdminModal, FormField, AdminInput, AdminTextarea, AdminSelect, AdminToggle } from '@/components/admin/AdminModal'
import { useToast } from '@/components/ui/Toast'

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meetup: 'General Meeting',
  hackathon: 'Hackathon',
  workshop: 'Workshop',
  demo_day: 'Demo Day',
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  meetup: 'bg-violet-100 text-violet-700',
  hackathon: 'bg-primary/10 text-primary',
  workshop: 'bg-sky-100 text-sky-700',
  demo_day: 'bg-emerald-100 text-emerald-700',
}

const EMPTY: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: null,
  date: '',
  end_date: null,
  location: null,
  event_type: 'meetup',
  registration_url: null,
  is_published: true,
}

function toDatetimeLocal(isoStr: string | null): string {
  if (!isoStr) return ''
  return new Date(isoStr).toISOString().slice(0, 16)
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY })
    setModalOpen(true)
  }

  function openEdit(event: Event) {
    setEditing(event)
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      end_date: event.end_date,
      location: event.location,
      event_type: event.event_type,
      registration_url: event.registration_url,
      is_published: event.is_published,
    })
    setModalOpen(true)
  }

  async function handleDelete(event: Event) {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('events').delete().eq('id', event.id)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Event deleted.', 'success')
    fetchEvents()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date) {
      showToast('Please select a start date and time.', 'error')
      return
    }
    if (form.end_date && new Date(form.end_date) <= new Date(form.date)) {
      showToast('End date must be after the start date.', 'error')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        description: form.description || null,
        end_date: form.end_date || null,
        location: form.location || null,
        registration_url: form.registration_url || null,
      }

      if (editing) {
        const { error } = await supabase.from('events').update(payload).eq('id', editing.id)
        if (error) throw error
        showToast('Event updated. It now appears on the calendar!', 'success')
      } else {
        const { error } = await supabase.from('events').insert(payload)
        if (error) throw error
        showToast('Event created and added to the calendar!', 'success')
      }
      setModalOpen(false)
      fetchEvents()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: Column<Event>[] = [
    {
      header: 'Event',
      key: 'title',
      render: (e) => <span className="font-medium">{e.title}</span>,
    },
    {
      header: 'Date',
      key: 'date',
      render: (e) => (
        <span className="text-foreground/70">
          {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      header: 'Type',
      key: 'event_type',
      render: (e) => (
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${EVENT_TYPE_COLORS[e.event_type]}`}>
          {EVENT_TYPE_LABELS[e.event_type]}
        </span>
      ),
    },
    {
      header: 'Location',
      key: 'location',
      render: (e) => <span className="text-foreground/60 text-xs">{e.location || '—'}</span>,
    },
    {
      header: 'Status',
      key: 'is_published',
      render: (e) => <StatusBadge active={e.is_published} labels={['Published', 'Draft']} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Events"
        description="Create and manage events. Published events appear on the public calendar automatically."
        action={<AddButton onClick={openAdd} label="Add Event" />}
      />

      <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
        <strong>Calendar sync:</strong> Published events automatically appear on the public events calendar. Draft events are hidden from visitors.
      </div>

      <AdminTable
        columns={columns}
        data={events}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No events yet. Add your first event to populate the calendar."
      />

      {modalOpen && (
        <AdminModal
          title={editing ? 'Edit Event' : 'Add Event'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        >
          <FormField label="Event Title" required>
            <AdminInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Intro to Claude Workshop"
              required
            />
          </FormField>

          <FormField label="Event Type" required>
            <AdminSelect
              value={form.event_type}
              onChange={(e) => setForm({ ...form, event_type: e.target.value as EventType })}
            >
              {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </AdminSelect>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date & Time" required>
              <AdminInput
                type="datetime-local"
                value={toDatetimeLocal(form.date)}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </FormField>
            <FormField label="End Date & Time">
              <AdminInput
                type="datetime-local"
                value={toDatetimeLocal(form.end_date)}
                onChange={(e) => setForm({ ...form, end_date: e.target.value || null })}
              />
            </FormField>
          </div>

          <FormField label="Location">
            <AdminInput
              value={form.location || ''}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. University of Rwanda, CST Campus"
            />
          </FormField>

          <FormField label="Description">
            <AdminTextarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the event..."
              rows={3}
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

          <AdminToggle
            checked={form.is_published}
            onChange={(checked) => setForm({ ...form, is_published: checked })}
            label="Published (visible on calendar)"
          />
        </AdminModal>
      )}
    </div>
  )
}
