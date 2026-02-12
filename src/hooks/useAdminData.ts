import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Member, Event, Project, MemberRole, MemberStatus } from '@/types/database'

// Admin Stats
interface AdminStats {
  totalMembers: number
  pendingMembers: number
  approvedMembers: number
  upcomingEvents: number
  totalProjects: number
  totalSubscribers: number
}

// Mock data for development
const mockMembers: Member[] = [
  {
    id: '1',
    email: 'kaio@ur.ac.rw',
    full_name: 'Kaio Mugisha',
    student_id: '220001234',
    year_of_study: '4',
    department: 'cs',
    bio: 'Passionate about AI',
    avatar_url: null,
    role: 'admin',
    status: 'approved',
    joined_at: '2025-09-01T10:00:00+02:00',
    created_at: '2025-09-01T10:00:00+02:00',
  },
  {
    id: '2',
    email: 'sandrine@ur.ac.rw',
    full_name: 'Sandrine Niyonzima',
    student_id: '220001235',
    year_of_study: '3',
    department: 'it',
    bio: 'Building the future',
    avatar_url: null,
    role: 'lead',
    status: 'approved',
    joined_at: '2025-09-15T10:00:00+02:00',
    created_at: '2025-09-15T10:00:00+02:00',
  },
  {
    id: '3',
    email: 'jean@ur.ac.rw',
    full_name: 'Jean Baptiste K.',
    student_id: '220001236',
    year_of_study: '4',
    department: 'cs',
    bio: null,
    avatar_url: null,
    role: 'member',
    status: 'pending',
    joined_at: '2026-02-10T10:00:00+02:00',
    created_at: '2026-02-10T10:00:00+02:00',
  },
  {
    id: '4',
    email: 'grace@ur.ac.rw',
    full_name: 'Grace Uwimana',
    student_id: '220001237',
    year_of_study: '2',
    department: 'business',
    bio: 'Interested in AI for business',
    avatar_url: null,
    role: 'member',
    status: 'pending',
    joined_at: '2026-02-11T10:00:00+02:00',
    created_at: '2026-02-11T10:00:00+02:00',
  },
  {
    id: '5',
    email: 'patrick@ur.ac.rw',
    full_name: 'Patrick Habimana',
    student_id: '220001238',
    year_of_study: '3',
    department: 'ee',
    bio: null,
    avatar_url: null,
    role: 'member',
    status: 'approved',
    joined_at: '2025-10-01T10:00:00+02:00',
    created_at: '2025-10-01T10:00:00+02:00',
  },
]

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI-Powered Web Apps Workshop',
    description: 'Learn to build web applications with Claude API',
    event_type: 'workshop',
    date: '2026-02-20T14:00:00+02:00',
    end_date: null,
    location: 'Room A202',
    max_attendees: 30,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '2',
    title: 'CBC-UR Hackathon 2026',
    description: 'Build innovative solutions using Claude',
    event_type: 'hackathon',
    date: '2026-03-01T09:00:00+02:00',
    end_date: '2026-03-02T18:00:00+02:00',
    location: 'Main Auditorium',
    max_attendees: 100,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
  {
    id: '3',
    title: 'Project Demo Day',
    description: 'Showcase your AI projects',
    event_type: 'demo_day',
    date: '2026-03-15T15:00:00+02:00',
    end_date: null,
    location: 'Conference Hall',
    max_attendees: 50,
    image_url: null,
    is_published: false,
    created_at: '2026-01-15T10:00:00+02:00',
  },
]

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Kigali Health Assistant',
    description: 'AI-powered health Q&A system',
    long_description: null,
    category: 'Healthcare',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/kigali-health',
    demo_url: null,
    tech_stack: ['Claude API', 'React', 'Node.js'],
    is_featured: true,
    created_at: '2026-01-20T10:00:00+02:00',
  },
  {
    id: '2',
    title: 'StudyBuddy UR',
    description: 'AI study companion for students',
    long_description: null,
    category: 'Education',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/studybuddy',
    demo_url: 'https://studybuddy.demo.com',
    tech_stack: ['Claude API', 'Next.js', 'Supabase'],
    is_featured: false,
    created_at: '2026-01-25T10:00:00+02:00',
  },
  {
    id: '3',
    title: 'AgriSmart Rwanda',
    description: 'Farming advice chatbot',
    long_description: null,
    category: 'Agriculture',
    image_url: null,
    github_url: null,
    demo_url: null,
    tech_stack: ['Claude API', 'WhatsApp API'],
    is_featured: true,
    created_at: '2026-02-01T10:00:00+02:00',
  },
]

// Hook for admin dashboard stats
export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    pendingMembers: 0,
    approvedMembers: 0,
    upcomingEvents: 0,
    totalProjects: 0,
    totalSubscribers: 0,
  })
  const [pendingApplications, setPendingApplications] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)

      try {
        if (!isSupabaseConfigured) {
          await new Promise((r) => setTimeout(r, 500))
          const pending = mockMembers.filter((m) => m.status === 'pending')
          const approved = mockMembers.filter((m) => m.status === 'approved')
          const upcoming = mockEvents.filter((e) => new Date(e.date) > new Date())

          setStats({
            totalMembers: mockMembers.length,
            pendingMembers: pending.length,
            approvedMembers: approved.length,
            upcomingEvents: upcoming.length,
            totalProjects: mockProjects.length,
            totalSubscribers: 42,
          })
          setPendingApplications(pending.slice(0, 5))
          return
        }

        // Fetch real data from Supabase
        const [membersRes, eventsRes, projectsRes, subscribersRes] = await Promise.all([
          supabase.from('members').select('*'),
          supabase.from('events').select('*').gte('date', new Date().toISOString()),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('subscribers').select('*', { count: 'exact', head: true }),
        ])

        const members = (membersRes.data || []) as Member[]
        const pending = members.filter((m) => m.status === 'pending')
        const approved = members.filter((m) => m.status === 'approved')

        setStats({
          totalMembers: members.length,
          pendingMembers: pending.length,
          approvedMembers: approved.length,
          upcomingEvents: eventsRes.data?.length || 0,
          totalProjects: projectsRes.count || 0,
          totalSubscribers: subscribersRes.count || 0,
        })
        setPendingApplications(
          pending
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
        )
      } catch (err) {
        console.error('Error fetching admin stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, pendingApplications, isLoading }
}

// Hook for members management
interface UseMembersOptions {
  search?: string
  status?: MemberStatus | 'all'
  role?: MemberRole | 'all'
  page?: number
  pageSize?: number
}

export function useAdminMembers(options: UseMembersOptions = {}) {
  const { search = '', status = 'all', role = 'all', page = 1, pageSize = 10 } = options
  const [members, setMembers] = useState<Member[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchMembers = useCallback(async () => {
    setIsLoading(true)

    try {
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300))

        let filtered = [...mockMembers]

        if (search) {
          const s = search.toLowerCase()
          filtered = filtered.filter(
            (m) =>
              m.full_name.toLowerCase().includes(s) ||
              m.email.toLowerCase().includes(s)
          )
        }

        if (status !== 'all') {
          filtered = filtered.filter((m) => m.status === status)
        }

        if (role !== 'all') {
          filtered = filtered.filter((m) => m.role === role)
        }

        setTotalCount(filtered.length)
        const start = (page - 1) * pageSize
        setMembers(filtered.slice(start, start + pageSize))
        return
      }

      let query = supabase.from('members').select('*', { count: 'exact' })

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      if (role !== 'all') {
        query = query.eq('role', role)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setMembers((data || []) as Member[])
      setTotalCount(count || 0)
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setIsLoading(false)
    }
  }, [search, status, role, page, pageSize])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const updateMemberStatus = async (memberId: string, newStatus: MemberStatus) => {
    try {
      if (!isSupabaseConfigured) {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
        )
        return { error: null }
      }

      const { error } = await (supabase.from('members') as any)
        .update({ status: newStatus })
        .eq('id', memberId)

      if (error) throw error

      await fetchMembers()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to update member status' }
    }
  }

  const updateMemberRole = async (memberId: string, newRole: MemberRole) => {
    try {
      if (!isSupabaseConfigured) {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
        )
        return { error: null }
      }

      const { error } = await (supabase.from('members') as any)
        .update({ role: newRole })
        .eq('id', memberId)

      if (error) throw error

      await fetchMembers()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to update member role' }
    }
  }

  const bulkUpdateStatus = async (memberIds: string[], newStatus: MemberStatus) => {
    try {
      if (!isSupabaseConfigured) {
        setMembers((prev) =>
          prev.map((m) =>
            memberIds.includes(m.id) ? { ...m, status: newStatus } : m
          )
        )
        return { error: null }
      }

      const { error } = await (supabase.from('members') as any)
        .update({ status: newStatus })
        .in('id', memberIds)

      if (error) throw error

      await fetchMembers()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to update members' }
    }
  }

  return {
    members,
    totalCount,
    isLoading,
    updateMemberStatus,
    updateMemberRole,
    bulkUpdateStatus,
    refetch: fetchMembers,
  }
}

// Hook for events management
export function useAdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)

    try {
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300))
        setEvents(mockEvents)
        return
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setEvents((data || []) as Event[])
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at'>) => {
    try {
      if (!isSupabaseConfigured) {
        const newEvent: Event = {
          ...eventData,
          id: `mock-${Date.now()}`,
          created_at: new Date().toISOString(),
        }
        setEvents((prev) => [newEvent, ...prev])
        return { error: null }
      }

      const { error } = await (supabase.from('events') as any).insert(eventData)
      if (error) throw error

      await fetchEvents()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to create event' }
    }
  }

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
      if (!isSupabaseConfigured) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, ...eventData } : e))
        )
        return { error: null }
      }

      const { error } = await (supabase.from('events') as any)
        .update(eventData)
        .eq('id', eventId)

      if (error) throw error

      await fetchEvents()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to update event' }
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      if (!isSupabaseConfigured) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId))
        return { error: null }
      }

      const { error } = await supabase.from('events').delete().eq('id', eventId)
      if (error) throw error

      await fetchEvents()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to delete event' }
    }
  }

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}

// Hook for projects management
export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    setIsLoading(true)

    try {
      if (!isSupabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300))
        setProjects(mockProjects)
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects((data || []) as Project[])
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const toggleFeatured = async (projectId: string, isFeatured: boolean) => {
    try {
      if (!isSupabaseConfigured) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, is_featured: isFeatured } : p))
        )
        return { error: null }
      }

      const { error } = await (supabase.from('projects') as any)
        .update({ is_featured: isFeatured })
        .eq('id', projectId)

      if (error) throw error

      await fetchProjects()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to update project' }
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      if (!isSupabaseConfigured) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
        return { error: null }
      }

      const { error } = await supabase.from('projects').delete().eq('id', projectId)
      if (error) throw error

      await fetchProjects()
      return { error: null }
    } catch (err) {
      return { error: 'Failed to delete project' }
    }
  }

  return {
    projects,
    isLoading,
    toggleFeatured,
    deleteProject,
    refetch: fetchProjects,
  }
}
