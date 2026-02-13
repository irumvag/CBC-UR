import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface SubscribeResult {
  success: boolean
  error?: string
}

interface UseSubscribeResult {
  subscribe: (email: string) => Promise<SubscribeResult>
  isLoading: boolean
}

export function useSubscribe(): UseSubscribeResult {
  const [isLoading, setIsLoading] = useState(false)

  const subscribe = async (email: string): Promise<SubscribeResult> => {
    setIsLoading(true)

    try {
      // Validate email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' }
      }

      if (!isSupabaseConfigured) {
        // Return success immediately for mock
        return { success: true }
      }

      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({ email } as any)

      if (insertError) {
        if (insertError.code === '23505') {
          // Email already exists - treat as success
          return { success: true }
        }
        throw insertError
      }

      return { success: true }
    } catch (err) {
      console.error('Error subscribing:', err)
      return { success: false, error: 'Failed to subscribe. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  return { subscribe, isLoading }
}
