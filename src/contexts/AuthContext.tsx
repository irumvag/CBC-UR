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
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
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
  full_name: 'Demo User',
  student_id: '220012345',
  year_of_study: '3',
  department: 'cs',
  bio: 'Passionate about AI and building innovative solutions for Rwanda.',
  avatar_url: null,
  role: 'member',
  status: 'approved',
  joined_at: '2026-01-15T10:00:00+02:00',
  created_at: '2026-01-15T10:00:00+02:00',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch member profile from database
  const fetchMember = useCallback(async (userId: string) => {
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

      if (error) {
        // Member might not exist yet (new user)
        console.log('Member not found, may need to create profile')
        setMember(null)
      } else {
        setMember(data as Member)
      }
    } catch (err) {
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
    if (!isSupabaseConfigured) {
      // For development, start logged out
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchMember(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchMember(session.user.id)
        } else {
          setMember(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchMember])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign in for development
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(mockUser)
      setMember(mockMember)
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign up for development
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser({ ...mockUser, email, user_metadata: { full_name: fullName } })
      setMember({ ...mockMember, email, full_name: fullName })
      return { error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    // Create member profile after signup
    if (!error && data.user) {
      await supabase.from('members').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: 'member',
        status: 'pending',
      } as any)
    }

    return { error }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setMember(null)
      return
    }

    await supabase.auth.signOut()
    setUser(null)
    setMember(null)
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Mock Google sign in for development
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(mockUser)
      setMember(mockMember)
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        member,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
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
