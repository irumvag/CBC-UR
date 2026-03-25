import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/lib/types'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  return { events, loading, error, refetch: fetchEvents }
}
