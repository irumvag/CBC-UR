import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Event, Project } from '@/types/database'

interface DashboardStats {
  eventsAttended: number
  projectsCount: number
  memberSince: string
}

interface UseDashboardDataResult {
  upcomingEvents: Event[]
  userProjects: Project[]
  stats: DashboardStats
  isLoading: boolean
}

// Mock data for development
const mockUpcomingEvents: Event[] = [
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
    description: 'Showcase your AI projects to the community',
    event_type: 'demo_day',
    date: '2026-03-15T15:00:00+02:00',
    end_date: null,
    location: 'Conference Hall',
    max_attendees: 50,
    image_url: null,
    is_published: true,
    created_at: '2026-01-15T10:00:00+02:00',
  },
]

const mockUserProjects: Project[] = [
  {
    id: '1',
    title: 'Kigali Health Assistant',
    description: 'AI-powered health Q&A system designed for rural clinics in Rwanda',
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
    description: 'AI study companion for University of Rwanda students',
    long_description: null,
    category: 'Education',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/studybuddy',
    demo_url: 'https://studybuddy-ur.demo.com',
    tech_stack: ['Claude API', 'Next.js', 'Supabase'],
    is_featured: false,
    created_at: '2026-01-25T10:00:00+02:00',
  },
]

export function useDashboardData(): UseDashboardDataResult {
  const { user, member } = useAuth()
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    eventsAttended: 0,
    projectsCount: 0,
    memberSince: 'Jan 2026',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        if (!isSupabaseConfigured) {
          // Use mock data immediately without delay
          setUpcomingEvents(mockUpcomingEvents)
          setUserProjects(mockUserProjects)
          setStats({
            eventsAttended: 5,
            projectsCount: mockUserProjects.length,
            memberSince: member?.joined_at
              ? new Date(member.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Jan 2026',
          })
          setIsLoading(false)
          return
        }

        // Fetch user's RSVP'd upcoming events
        const { data: rsvpEvents } = await supabase
          .from('event_rsvps')
          .select(`
            event:events (*)
          `)
          .eq('member_id', user.id)
          .eq('status', 'registered')

        const events = rsvpEvents
          ?.map((rsvp: any) => rsvp.event)
          .filter((event: Event) => event && new Date(event.date) > new Date())
          .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []

        setUpcomingEvents(events)

        // Fetch user's projects
        const { data: projectMembers } = await supabase
          .from('project_members')
          .select(`
            project:projects (*)
          `)
          .eq('member_id', user.id)

        const projects = projectMembers?.map((pm: any) => pm.project).filter(Boolean) || []
        setUserProjects(projects)

        // Get events attended count
        const { count: attendedCount } = await supabase
          .from('event_rsvps')
          .select('*', { count: 'exact', head: true })
          .eq('member_id', user.id)
          .eq('status', 'attended')

        setStats({
          eventsAttended: attendedCount || 0,
          projectsCount: projects.length,
          memberSince: member?.joined_at
            ? new Date(member.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'N/A',
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        // Fallback to mock data on error
        setUpcomingEvents(mockUpcomingEvents)
        setUserProjects(mockUserProjects)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, member])

  return { upcomingEvents, userProjects, stats, isLoading }
}
