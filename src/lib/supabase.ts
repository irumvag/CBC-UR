import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create the Supabase client
// When not configured, we create a client with placeholder values
// The hooks will check isSupabaseConfigured and use mock data instead
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Log warning if not configured
if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase not configured. Using mock data. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  )
}
