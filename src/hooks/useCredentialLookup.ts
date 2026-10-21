import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { CredentialSearchResult } from '@/lib/types'

/**
 * Public hook for student credential search.
 * Calls the search_credentials RPC, which matches on name or email and returns
 * one row per email (highest-priority file wins) — without the email or password.
 * Passwords are only released by claim_credential after server-side verification.
 */
export function useCredentialLookup() {
  const [results, setResults] = useState<CredentialSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc('search_credentials', { p_query: q })
      if (error) throw error
      setResults((data ?? []) as CredentialSearchResult[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}
