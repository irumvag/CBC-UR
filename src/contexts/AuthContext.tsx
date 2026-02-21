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
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null; needsEmailVerification?: boolean }>
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
      // For development without Supabase, auto-login as mock admin
      setUser(mockUser)
      setMember(mockMember)
      setLoading(false)
      return
    }

    // Get initial session with a timeout to prevent infinite loading
    const sessionTimeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(sessionTimeout)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchMember(session.user.id)
      }
      setLoading(false)
    }).catch(() => {
      clearTimeout(sessionTimeout)
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

    return () => {
      clearTimeout(sessionTimeout)
      subscription.unsubscribe()
    }
  }, [fetchMember])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign in for development
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(mockUser)
      setMember(mockMember)
      return { error: null }
    }

    try {
      // Add a timeout to prevent infinite loading if Supabase hangs
      const signInPromise = supabase.auth.signInWithPassword({ email, password })
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign in request timed out. Please check your connection and try again.')), 10000)
      )

      const { error } = await Promise.race([signInPromise, timeoutPromise]) as any
      return { error }
    } catch (err: any) {
      return { error: { message: err.message || 'Sign in failed' } as AuthError }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign up for development
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser({ ...mockUser, email, user_metadata: { full_name: fullName } })
      setMember({ ...mockMember, email, full_name: fullName })
      return { error: null, needsEmailVerification: false }
    }

    try {
      // Get the correct redirect URL (not localhost in production)
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin

      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${siteUrl}/dashboard`,
        },
      })

      // Add a timeout to prevent infinite loading if Supabase hangs
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign up request timed out. Please check your connection and try again.')), 10000)
      )

      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any

      // Create member profile after signup
      if (!error && data?.user) {
        try {
          await supabase.from('members').insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'member',
            status: 'pending',
          } as any)
        } catch (memberErr: any) {
          console.error('Error creating member profile:', memberErr)
          // Don't fail sign-up if member profile creation fails
        }
      }

      // Check if email confirmation is required
      const needsEmailVerification = !error && !!data?.user && !data?.session

      return { error, needsEmailVerification }
    } catch (err: any) {
      return { error: { message: err.message || 'Sign up failed' } as AuthError, needsEmailVerification: false }
    }
  }

  const signOut = async () => {
    // Clear state immediately so UI reflects sign-out right away
    setUser(null)
    setSession(null)
    setMember(null)

    if (!isSupabaseConfigured) return

    // Fire-and-forget Supabase sign out with timeout so it never hangs
    try {
      const signOutPromise = supabase.auth.signOut()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timed out')), 5000)
      )
      await Promise.race([signOutPromise, timeoutPromise])
    } catch (err) {
      console.error('Sign out error (state already cleared):', err)
    }
  }

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Mock Google sign in for development
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(mockUser)
      setMember(mockMember)
      return { error: null }
    }

    try {
      const googleSignInPromise = supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      // Add a timeout to prevent infinite loading if Supabase hangs
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Google sign in request timed out. Please check your connection and try again.')), 10000)
      )

      const { error } = await Promise.race([googleSignInPromise, timeoutPromise]) as any
      return { error }
    } catch (err: any) {
      return { error: { message: err.message || 'Google sign in failed' } as AuthError }
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
