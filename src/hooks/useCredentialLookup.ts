import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { CredentialWithSource } from '@/lib/types'

/**
 * Public hook for student credential search.
 * Queries email_credentials joined with credential_files for priority.
 * Deduplicates by email — highest-priority file wins.
 */
export function useCredentialLookup() {
  const [results, setResults] = useState<CredentialWithSource[]>([])
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
      // Use two separate queries to avoid PostgREST .or() parsing issues
      // with special characters (@, .) in the search term
      const selectQuery = '*, credential_file:credential_files(display_name, priority)'
      const [nameRes, emailRes] = await Promise.all([
        supabase
          .from('email_credentials')
          .select(selectQuery)
          .ilike('name', `%${q}%`)
          .limit(50),
        supabase
          .from('email_credentials')
          .select(selectQuery)
          .ilike('email', `%${q}%`)
          .limit(50),
      ])

      if (nameRes.error) throw nameRes.error
      if (emailRes.error) throw emailRes.error

      // Merge and deduplicate by id (same row may appear in both results)
      const seen = new Set<string>()
      const data: any[] = []
      for (const row of [...(nameRes.data || []), ...(emailRes.data || [])]) {
        if (!seen.has(row.id)) {
          seen.add(row.id)
          data.push(row)
        }
      }

      // Deduplicate by email — keep the entry from the highest-priority file
      const byEmail = new Map<string, CredentialWithSource>()
      for (const row of (data || []) as CredentialWithSource[]) {
        const key = row.email.toLowerCase()
        const existing = byEmail.get(key)
        if (
          !existing ||
          (row.credential_file?.priority ?? 0) > (existing.credential_file?.priority ?? 0)
        ) {
          byEmail.set(key, row)
        }
      }

      setResults(Array.from(byEmail.values()))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}
