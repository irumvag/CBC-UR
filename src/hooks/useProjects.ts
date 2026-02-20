import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Project } from '@/types/database'

// Extended project type with team members for display
export interface ProjectWithTeam extends Project {
  team: { initials: string; name: string }[]
}

// Mock data for development without Supabase
const mockProjects: ProjectWithTeam[] = [
  {
    id: '1',
    title: 'Kigali Health Assistant',
    description: 'AI-powered health Q&A system designed for rural clinics in Rwanda, providing accessible medical information in Kinyarwanda and English.',
    long_description: null,
    category: 'Healthcare',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/kigali-health',
    demo_url: 'https://kigali-health.demo.com',
    tech_stack: ['Claude API', 'Healthcare', 'Bilingual'],
    is_featured: true,
    created_at: '2026-01-15T10:00:00+02:00',
    team: [
      { initials: 'PM', name: 'Patrick M.' },
      { initials: 'SN', name: 'Sandrine N.' },
    ],
  },
  {
    id: '2',
    title: 'Inyarwanda Tutor',
    description: 'Interactive Kinyarwanda language learning platform that uses Claude to provide personalized lessons, pronunciation feedback, and cultural context.',
    long_description: null,
    category: 'Education',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/inyarwanda-tutor',
    demo_url: null,
    tech_stack: ['Language Learning', 'Claude API', 'Education'],
    is_featured: true,
    created_at: '2026-01-15T10:00:00+02:00',
    team: [
      { initials: 'JB', name: 'Jean Baptiste' },
      { initials: 'AN', name: 'Alice N.' },
      { initials: 'EM', name: 'Emmanuel M.' },
    ],
  },
  {
    id: '3',
    title: 'AgriSmart Rwanda',
    description: 'Farming advice chatbot tailored for local farmers, providing guidance on crop selection, pest management, and weather-based recommendations.',
    long_description: null,
    category: 'Chatbots',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/agrismart',
    demo_url: null,
    tech_stack: ['Agriculture', 'Chatbot', 'SMS Integration'],
    is_featured: false,
    created_at: '2026-01-15T10:00:00+02:00',
    team: [
      { initials: 'GU', name: 'Grace U.' },
      { initials: 'DM', name: 'David M.' },
    ],
  },
  {
    id: '4',
    title: 'StudyBuddy UR',
    description: 'AI study companion for University of Rwanda students, offering course-specific help, exam preparation, and collaborative learning features.',
    long_description: null,
    category: 'Education',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/studybuddy',
    demo_url: 'https://studybuddy-ur.demo.com',
    tech_stack: ['Education', 'Web App', 'Study Tools'],
    is_featured: true,
    created_at: '2026-01-15T10:00:00+02:00',
    team: [
      { initials: 'KM', name: 'Kaio M.' },
      { initials: 'JN', name: 'Justine N.' },
    ],
  },
  {
    id: '5',
    title: 'Rwanda Heritage Guide',
    description: "Cultural tourism assistant that helps visitors explore Rwanda's rich heritage, traditions, and historical sites with AI-powered storytelling.",
    long_description: null,
    category: 'Web Apps',
    image_url: null,
    github_url: null,
    demo_url: 'https://rwanda-heritage.demo.com',
    tech_stack: ['Tourism', 'Culture', 'Web App'],
    is_featured: false,
    created_at: '2026-01-15T10:00:00+02:00',
    team: [
      { initials: 'IM', name: 'Irene M.' },
      { initials: 'CB', name: 'Claude B.' },
      { initials: 'NJ', name: 'Nadine J.' },
    ],
  },
  {
    id: '6',
    title: 'CodeMentor',
    description: 'Programming tutor powered by Claude API, providing personalized coding lessons, code reviews, and debugging help for aspiring developers.',
    long_description: null,
    category: 'Education',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/codementor',
    demo_url: null,
    tech_stack: ['Programming', 'Claude API', 'Learning'],
    is_featured: false,
    created_at: '2026-01-15T10:00:00+02:00',
    team: [
      { initials: 'PN', name: 'Patrick N.' },
    ],
  },
]

type Category = 'All' | 'Web Apps' | 'Chatbots' | 'Data Analysis' | 'Education' | 'Healthcare'

interface UseProjectsResult {
  projects: ProjectWithTeam[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseProjectResult {
  project: ProjectWithTeam | null
  isLoading: boolean
  error: string | null
}

export function useProjects(category?: Category): UseProjectsResult {
  const [projects, setProjects] = useState<ProjectWithTeam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Use mock data
        let filteredProjects = [...mockProjects]

        if (category && category !== 'All') {
          filteredProjects = mockProjects.filter((p) => p.category === category)
        }

        // Sort by featured first, then by created_at
        filteredProjects.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        setProjects(filteredProjects)
        return
      }

      let query = supabase
        .from('projects')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (category && category !== 'All') {
        query = query.eq('category', category)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      const transformedProjects: ProjectWithTeam[] = (data || []).map((project: any) => ({
        ...project,
        team: [],
      }))

      setProjects(transformedProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects. Please try again.')
      // Fallback to mock data on error
      setProjects(mockProjects)
    } finally {
      setIsLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, isLoading, error, refetch: fetchProjects }
}

export function useProject(projectId: string): UseProjectResult {
  const [project, setProject] = useState<ProjectWithTeam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true)
      setError(null)

      try {
        if (!isSupabaseConfigured) {
          const mockProject = mockProjects.find((p) => p.id === projectId) || null
          setProject(mockProject)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (fetchError) throw fetchError

        const transformedProject: ProjectWithTeam = {
          ...(data as any),
          team: [],
        }

        setProject(transformedProject)
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project details.')
        setProject(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  return { project, isLoading, error }
}

export const projectCategories: Category[] = [
  'All',
  'Web Apps',
  'Chatbots',
  'Data Analysis',
  'Education',
  'Healthcare',
]

// Gradient mappings for project cards
export const categoryGradients: Record<string, string> = {
  Healthcare: 'from-claude-terracotta to-claude-terracotta-light',
  Education: 'from-sage to-teal',
  Chatbots: 'from-teal to-sage',
  'Web Apps': 'from-claude-terracotta-light to-sage',
  'Data Analysis': 'from-stone to-charcoal',
  default: 'from-teal to-claude-terracotta',
}
