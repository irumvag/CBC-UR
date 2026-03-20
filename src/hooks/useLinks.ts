import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Link } from '@/lib/types'

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) throw error
        setLinks(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load links')
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  return { links, loading, error }
}
