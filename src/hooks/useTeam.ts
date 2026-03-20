import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/types'

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTeam() }, [fetchTeam])

  return { members, loading, error, refetch: fetchTeam }
}
