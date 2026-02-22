import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Member } from '@/types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  member: Member | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshMember: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for development without Supabase
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@ur.ac.rw',
  app_metadata: {},
  user_metadata: { full_name: 'Demo User' },
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
}

const mockMember: Member = {
  id: 'mock-user-id',
  email: 'demo@ur.ac.rw',
  full_name: 'Demo Admin',
  student_id: '220012345',
  year_of_study: '3',
  department: 'cs',
  bio: 'Passionate about AI and building innovative solutions for Rwanda.',
  avatar_url: null,
  role: 'admin',
  status: 'approved',
  joined_at: '2026-01-15T10:00:00+02:00',
  created_at: '2026-01-15T10:00:00+02:00',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state instantly for mock mode - no loading delay
  const [user, setUser] = useState<User | null>(!isSupabaseConfigured ? mockUser : null)
  const [session, setSession] = useState<Session | null>(null)
  const [member, setMember] = useState<Member | null>(!isSupabaseConfigured ? mockMember : null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const fetchMember = useCallback(async (userId: string, signal?: AbortSignal) => {
    if (!isSupabaseConfigured) {
      setMember(mockMember)
      return
    }

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .single()

      if (signal?.aborted) return

      if (error) {
        console.log('Member not found or not an admin')
        setMember(null)
      } else {
        setMember(data as Member)
      }
    } catch (err) {
      if (signal?.aborted) return
      console.error('Error fetching member:', err)
      setMember(null)
    }
  }, [])

  const refreshMember = useCallback(async () => {
    if (user?.id) {
      await fetchMember(user.id)
    }
  }, [user?.id, fetchMember])

  useEffect(() => {
    // Skip all async setup for mock mode - already initialized
    if (!isSupabaseConfigured) return

    const abortController = new AbortController()

    // Fast timeout - 3 seconds max
    const sessionTimeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (abortController.signal.aborted) return
      clearTimeout(sessionTimeout)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchMember(session.user.id, abortController.signal)
      }
      setLoading(false)
    }).catch(() => {
      if (abortController.signal.aborted) return
      clearTimeout(sessionTimeout)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (abortController.signal.aborted) return
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchMember(session.user.id, abortController.signal)
        } else {
          setMember(null)
        }
      }
    )

    return () => {
      abortController.abort()
      clearTimeout(sessionTimeout)
      subscription.unsubscribe()
    }
  }, [fetchMember])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Instant mock sign in - no delay
      setUser(mockUser)
      setMember(mockMember)
      return { error: null }
    }

    try {
      const signInPromise = supabase.auth.signInWithPassword({ email, password })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Sign in timed out. Please try again.')), 8000)
      )

      const { error } = await Promise.race([signInPromise, timeoutPromise])
      return { error }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      return { error: { message } as AuthError }
    }
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    setMember(null)

    if (!isSupabaseConfigured) return

    try {
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timed out')), 3000)
      )
      await Promise.race([signOutPromise, timeoutPromise])
    } catch (err) {
      console.error('Sign out error (state already cleared):', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        member,
        loading,
        signIn,
        signOut,
        refreshMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
