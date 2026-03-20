import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Hackathon } from '@/lib/types'

export function useHackathon() {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHackathon() {
      try {
        const { data, error } = await supabase
          .from('hackathons')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        setHackathon(data || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hackathon')
      } finally {
        setLoading(false)
      }
    }

    fetchHackathon()
  }, [])

  return { hackathon, loading, error }
}
