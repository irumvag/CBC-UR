import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Event, EventRSVPInput } from '@/types/database'

// Mock data for development without Supabase
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Introduction to Claude AI',
    description: 'Learn the fundamentals of Claude AI and discover what makes it unique. Perfect for beginners.',
    event_type: 'workshop',
    date: '2026-02-16T14:00:00+02:00',
    end_date: '2026-02-16T17:00:00+02:00',
    location: 'CST Building, Room 201',
    max_attendees: 50,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '2',
    title: 'Prompt Engineering Masterclass',
    description: 'Deep dive into advanced prompting techniques to get the best results from Claude.',
    event_type: 'workshop',
    date: '2026-02-23T14:00:00+02:00',
    end_date: '2026-02-23T17:00:00+02:00',
    location: 'CST Building, Room 201',
    max_attendees: 40,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '3',
    title: 'CBC Weekly Meetup #3',
    description: 'Join us for our weekly gathering to share progress, get feedback, and connect with fellow builders.',
    event_type: 'meetup',
    date: '2026-03-16T14:00:00+02:00',
    end_date: '2026-03-16T16:00:00+02:00',
    location: 'CST Building, Room 201',
    max_attendees: 100,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '4',
    title: 'Build for Rwanda Hackathon',
    description: 'Our flagship 24-hour hackathon where teams build AI solutions for real Rwandan challenges.',
    event_type: 'hackathon',
    date: '2026-04-13T09:00:00+02:00',
    end_date: '2026-04-13T21:00:00+02:00',
    location: 'University Main Hall',
    max_attendees: 200,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '5',
    title: 'Project Showcase Demo Day',
    description: 'Celebrate our achievements! Members present their AI projects to the university community.',
    event_type: 'demo_day',
    date: '2026-04-20T15:00:00+02:00',
    end_date: '2026-04-20T18:00:00+02:00',
    location: 'University Auditorium',
    max_attendees: 300,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '6',
    title: 'Club Kickoff Event',
    description: 'The official launch of Claude Builder Club with tabling and introductory demonstrations.',
    event_type: 'meetup',
    date: '2026-02-09T10:00:00+02:00',
    end_date: '2026-02-09T16:00:00+02:00',
    location: 'Campus Main Square',
    max_attendees: null,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
]

interface UseEventsResult {
  events: Event[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseEventResult {
  event: Event | null
  isLoading: boolean
  error: string | null
}

interface UseRSVPResult {
  rsvp: (input: EventRSVPInput) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
}

export function useEvents(filter?: 'upcoming' | 'past' | 'all'): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Use mock data
        const now = new Date()
        let filteredEvents = [...mockEvents]

        if (filter === 'upcoming') {
          filteredEvents = mockEvents.filter((e) => new Date(e.date) >= now)
        } else if (filter === 'past') {
          filteredEvents = mockEvents.filter((e) => new Date(e.date) < now)
        }

        // Sort by date
        filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        setEvents(filteredEvents)
        return
      }

      let query = supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: true })

      const now = new Date().toISOString()
      if (filter === 'upcoming') {
        query = query.gte('date', now)
      } else if (filter === 'past') {
        query = query.lt('date', now)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load events. Please try again.')
      // Fallback to mock data on error
      setEvents(mockEvents)
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return { events, isLoading, error, refetch: fetchEvents }
}

export function useEvent(eventId: string): UseEventResult {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true)
      setError(null)

      try {
        if (!isSupabaseConfigured) {
          const mockEvent = mockEvents.find((e) => e.id === eventId) || null
          setEvent(mockEvent)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (fetchError) throw fetchError
        setEvent(data)
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event details.')
        setEvent(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  return { event, isLoading, error }
}

export function useRSVP(): UseRSVPResult {
  const [isLoading, setIsLoading] = useState(false)

  const rsvp = async (input: EventRSVPInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      if (!isSupabaseConfigured) {
        // Return success immediately for mock
        return { success: true }
      }

      const { error: rsvpError } = await supabase
        .from('event_rsvps')
        .insert({
          event_id: input.event_id,
          member_id: input.member_id,
          status: 'registered' as const,
        } as any)

      if (rsvpError) {
        if (rsvpError.code === '23505') {
          return { success: false, error: 'You have already registered for this event.' }
        }
        throw rsvpError
      }

      return { success: true }
    } catch (err) {
      console.error('Error RSVPing to event:', err)
      return { success: false, error: 'Failed to register. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  return { rsvp, isLoading }
}
