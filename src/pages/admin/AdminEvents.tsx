import { useState, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Plus, Calendar, MapPin, Users, Clock, Edit2, Trash2,
  X, Loader2, LayoutGrid, List, Globe, EyeOff
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAdminEvents } from '@/hooks/useAdminData'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { Event, EventType } from '@/types/database'

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'demo_day', label: 'Demo Day' },
]

interface EventFormData {
  title: string
  description: string
  event_type: EventType | ''
  date: string
  end_date: string
  location: string
  max_attendees: string
  image_url: string
  is_published: boolean
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  event_type: '',
  date: '',
  end_date: '',
  location: '',
  max_attendees: '',
  image_url: '',
  is_published: true,
}

export default function AdminEvents() {
  const location = useLocation()
  const { showToast } = useToast()
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useAdminEvents()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(location.state?.openCreate || false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingEvent(null)
    setFormData(initialFormData)
    setIsModalOpen(true)
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
      location: event.location || '',
      max_attendees: event.max_attendees?.toString() || '',
      image_url: event.image_url || '',
      is_published: event.is_published,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
    setFormData(initialFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      event_type: formData.event_type || null,
      date: formData.date,
      end_date: formData.end_date || null,
      location: formData.location || null,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      image_url: formData.image_url || null,
      is_published: formData.is_published,
    }

    try {
      if (editingEvent) {
        const { error } = await updateEvent(editingEvent.id, eventData)
        if (error) {
          showToast(error, 'error')
        } else {
          showToast('Event updated', 'success')
          closeModal()
        }
      } else {
        const { error } = await createEvent(eventData as any)
        if (error) {
          showToast(error, 'error')
        } else {
          showToast('Event created', 'success')
          closeModal()
        }
      }
    } catch (err) {
      showToast('An error occurred', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    setDeletingId(eventId)
    const { error } = await deleteEvent(eventId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Event deleted', 'success')
    }
    setDeletingId(null)
  }

  const togglePublished = async (event: Event) => {
    const { error } = await updateEvent(event.id, { is_published: !event.is_published })
    if (error) {
      showToast(error, 'error')
    } else {
      showToast(event.is_published ? 'Event unpublished' : 'Event published', 'success')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getEventTypeBadge = (type: EventType | null) => {
    switch (type) {
      case 'workshop':
        return 'bg-claude-terracotta/10 text-claude-terracotta'
      case 'hackathon':
        return 'bg-purple-100 text-purple-700'
      case 'meetup':
        return 'bg-teal/10 text-teal'
      case 'demo_day':
        return 'bg-sage/10 text-sage'
      default:
        return 'bg-pampas-warm text-stone'
    }
  }

  const isPastEvent = (date: string) => new Date(date) < new Date()

  return (
    <AdminLayout title="Events" breadcrumbs={[{ label: 'Events' }]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-stone">
          {events.length} total events
        </p>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-pampas-warm rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-pampas-warm text-ink' : 'text-stone hover:text-ink'
              )}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-pampas-warm text-ink' : 'text-stone hover:text-ink'
              )}
            >
              <List size={18} />
            </button>
          </div>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={18} className="mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Events */}
      {isLoading ? (
        <div className={cn(viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4')}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className={viewMode === 'grid' ? 'h-64 rounded-xl' : 'h-24 rounded-xl'} />
          ))}
        </div>
      ) : events.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'bg-white rounded-xl border border-pampas-warm overflow-hidden group',
                  isPastEvent(event.date) && 'opacity-70'
                )}
              >
                {/* Image placeholder */}
                <div className="h-32 bg-gradient-to-br from-claude-terracotta/20 to-teal/20 relative">
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.event_type && (
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getEventTypeBadge(event.event_type))}>
                        {event.event_type.replace('_', ' ')}
                      </span>
                    )}
                    {!event.is_published && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-stone/80 text-white">
                        Draft
                      </span>
                    )}
                  </div>
                  {isPastEvent(event.date) && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-stone text-white">
                      Past
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-ink mb-2 line-clamp-1">{event.title}</h3>

                  <div className="space-y-1.5 text-sm text-stone mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {formatTime(event.date)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-pampas-warm">
                    <button
                      onClick={() => togglePublished(event)}
                      title={event.is_published ? 'Unpublish' : 'Publish'}
                      className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                    >
                      {event.is_published ? <Globe size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId === event.id}
                      className="p-2 text-stone hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === event.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                    {event.max_attendees && (
                      <div className="ml-auto flex items-center gap-1 text-stone text-xs">
                        <Users size={14} />
                        {event.max_attendees}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-pampas-warm divide-y divide-pampas-warm">
            {events.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'flex items-center gap-4 p-4',
                  isPastEvent(event.date) && 'opacity-70'
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-claude-terracotta/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-claude-terracotta">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xs text-claude-terracotta uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink truncate">{event.title}</h3>
                    {event.event_type && (
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getEventTypeBadge(event.event_type))}>
                        {event.event_type.replace('_', ' ')}
                      </span>
                    )}
                    {!event.is_published && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-stone/10 text-stone">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(event.date)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePublished(event)}
                    title={event.is_published ? 'Unpublish' : 'Publish'}
                    className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                  >
                    {event.is_published ? <Globe size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => openEditModal(event)}
                    className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="p-2 text-stone hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === event.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-pampas-warm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-pampas-warm flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-stone" />
          </div>
          <h3 className="font-serif font-semibold text-xl text-ink mb-2">No events yet</h3>
          <p className="text-stone mb-6">Create your first event to get started.</p>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={18} className="mr-2" />
            Create Event
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <Fragment>
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 animate-fade-in"
            onClick={closeModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <div
              className="bg-pampas rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto my-8 animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-pampas-warm">
                <h2 className="font-serif font-semibold text-xl text-ink">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-ink text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-ink text-sm mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block font-semibold text-ink text-sm mb-2">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData((p) => ({ ...p, event_type: e.target.value as EventType }))}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                  >
                    <option value="">Select type</option>
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Date/Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-ink text-sm mb-2">Start Date/Time *</label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-ink text-sm mb-2">End Date/Time</label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Location & Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-ink text-sm mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                      placeholder="Room 201"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-ink text-sm mb-2">Max Attendees</label>
                    <input
                      type="number"
                      value={formData.max_attendees}
                      onChange={(e) => setFormData((p) => ({ ...p, max_attendees: e.target.value }))}
                      placeholder="30"
                      min="1"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block font-semibold text-ink text-sm mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://..."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all disabled:opacity-50"
                  />
                </div>

                {/* Published Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, is_published: !p.is_published }))}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-colors',
                      formData.is_published ? 'bg-sage' : 'bg-stone/30'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                        formData.is_published ? 'left-7' : 'left-1'
                      )}
                    />
                  </button>
                  <span className="text-sm text-ink">
                    {formData.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" className="flex-1" onClick={closeModal} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {editingEvent ? 'Saving...' : 'Creating...'}
                      </>
                    ) : editingEvent ? 'Save Changes' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </AdminLayout>
  )
}
