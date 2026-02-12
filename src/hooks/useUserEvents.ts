import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Event, RSVPStatus } from '@/types/database'

interface UserEventRSVP {
  id: string
  event: Event
  status: RSVPStatus
  created_at: string
}

interface UseUserEventsResult {
  events: UserEventRSVP[]
  isLoading: boolean
  error: string | null
}

// Mock data for development
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI-Powered Web Apps Workshop',
    description: 'Learn to build web applications with Claude API. We\'ll cover prompt engineering, API integration, and best practices.',
    event_type: 'workshop',
    date: '2026-02-20T14:00:00+02:00',
    end_date: null,
    location: 'Room A202, College of Science',
    max_attendees: 30,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '2',
    title: 'CBC-UR Hackathon 2026',
    description: 'A 24-hour hackathon to build innovative solutions using Claude. Great prizes and mentorship available!',
    event_type: 'hackathon',
    date: '2026-03-01T09:00:00+02:00',
    end_date: '2026-03-02T18:00:00+02:00',
    location: 'Main Auditorium',
    max_attendees: 100,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '3',
    title: 'Introduction to AI Ethics',
    description: 'A workshop on responsible AI development and deployment considerations.',
    event_type: 'workshop',
    date: '2026-01-10T10:00:00+02:00',
    end_date: null,
    location: 'Room B105',
    max_attendees: 40,
    image_url: null,
    is_published: true,
    created_at: '2025-12-15T10:00:00+02:00',
  },
  {
    id: '4',
    title: 'Monthly Meetup - January',
    description: 'Our first meetup of 2026! Share progress, network, and collaborate.',
    event_type: 'meetup',
    date: '2026-01-15T17:00:00+02:00',
    end_date: null,
    location: 'Student Center',
    max_attendees: 50,
    image_url: null,
    is_published: true,
    created_at: '2026-01-01T10:00:00+02:00',
  },
]

export function useUserEvents(filter: 'upcoming' | 'past'): UseUserEventsResult {
  const { user } = useAuth()
  const [events, setEvents] = useState<UserEventRSVP[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserEvents() {
      if (!user) {
        setEvents([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        if (!isSupabaseConfigured) {
          // Use mock data for development
          await new Promise((resolve) => setTimeout(resolve, 500))

          const now = new Date()
          const filteredEvents = mockEvents
            .filter((event) => {
              const eventDate = new Date(event.date)
              return filter === 'upcoming' ? eventDate > now : eventDate <= now
            })
            .sort((a, b) => {
              const dateA = new Date(a.date).getTime()
              const dateB = new Date(b.date).getTime()
              return filter === 'upcoming' ? dateA - dateB : dateB - dateA
            })
            .map((event, index) => ({
              id: `rsvp-${index}`,
              event,
              status: (filter === 'past' ? 'attended' : 'registered') as RSVPStatus,
              created_at: '2026-01-15T10:00:00+02:00',
            }))

          setEvents(filteredEvents)
          return
        }

        // Fetch from Supabase
        const now = new Date().toISOString()
        let query = supabase
          .from('event_rsvps')
          .select(`
            id,
            status,
            created_at,
            event:events (*)
          `)
          .eq('member_id', user.id)

        // Add date filter based on upcoming/past
        // We need to filter after fetching since we can't filter on joined table directly

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        const userEvents: UserEventRSVP[] = (data || [])
          .map((rsvp: any) => ({
            id: rsvp.id,
            event: rsvp.event,
            status: rsvp.status,
            created_at: rsvp.created_at,
          }))
          .filter((item: UserEventRSVP) => {
            if (!item.event) return false
            const eventDate = new Date(item.event.date)
            const now = new Date()
            return filter === 'upcoming' ? eventDate > now : eventDate <= now
          })
          .sort((a: UserEventRSVP, b: UserEventRSVP) => {
            const dateA = new Date(a.event.date).getTime()
            const dateB = new Date(b.event.date).getTime()
            return filter === 'upcoming' ? dateA - dateB : dateB - dateA
          })

        setEvents(userEvents)
      } catch (err) {
        console.error('Error fetching user events:', err)
        setError('Failed to load events')
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserEvents()
  }, [user, filter])

  return { events, isLoading, error }
}
