import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Project } from '@/types/database'

interface CreateProjectInput {
  title: string
  description: string | null
  category: string | null
  github_url: string | null
  demo_url: string | null
  tech_stack: string[] | null
  image_url: string | null
}

interface UseUserProjectsResult {
  projects: Project[]
  isLoading: boolean
  error: string | null
  createProject: (input: CreateProjectInput) => Promise<{ error: string | null }>
  deleteProject: (projectId: string) => Promise<{ error: string | null }>
  refreshProjects: () => Promise<void>
}

// Mock data for development
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Kigali Health Assistant',
    description: 'AI-powered health Q&A system designed for rural clinics in Rwanda. Helps healthcare workers quickly access medical information.',
    long_description: null,
    category: 'Healthcare',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/kigali-health',
    demo_url: null,
    tech_stack: ['Claude API', 'React', 'Node.js', 'PostgreSQL'],
    is_featured: true,
    created_at: '2026-01-20T10:00:00+02:00',
  },
  {
    id: '2',
    title: 'StudyBuddy UR',
    description: 'AI study companion for University of Rwanda students. Provides personalized study plans and Q&A assistance.',
    long_description: null,
    category: 'Education',
    image_url: null,
    github_url: 'https://github.com/cbc-ur/studybuddy',
    demo_url: 'https://studybuddy-ur.demo.com',
    tech_stack: ['Claude API', 'Next.js', 'Supabase', 'Tailwind CSS'],
    is_featured: false,
    created_at: '2026-01-25T10:00:00+02:00',
  },
]

export function useUserProjects(): UseUserProjectsResult {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        // Use mock data immediately
        setProjects(mockProjects)
        setIsLoading(false)
        return
      }

      // Fetch user's projects through project_members junction table
      const { data, error: fetchError } = await supabase
        .from('project_members')
        .select(`
          project:projects (*)
        `)
        .eq('member_id', user.id)

      if (fetchError) throw fetchError

      const userProjects = (data || [])
        .map((pm: any) => pm.project)
        .filter(Boolean)
        .sort((a: Project, b: Project) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

      setProjects(userProjects)
    } catch (err) {
      console.error('Error fetching user projects:', err)
      setError('Failed to load projects')
      // Fallback to mock data
      setProjects(mockProjects)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = async (input: CreateProjectInput): Promise<{ error: string | null }> => {
    if (!user) {
      return { error: 'You must be logged in to create a project' }
    }

    try {
      if (!isSupabaseConfigured) {
        // Mock project creation immediately
        const newProject: Project = {
          id: `mock-${Date.now()}`,
          title: input.title,
          description: input.description,
          long_description: null,
          category: input.category,
          image_url: input.image_url,
          github_url: input.github_url,
          demo_url: input.demo_url,
          tech_stack: input.tech_stack,
          is_featured: false,
          created_at: new Date().toISOString(),
        }
        setProjects((prev) => [newProject, ...prev])
        return { error: null }
      }

      // Create project in Supabase
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: input.title,
          description: input.description,
          category: input.category,
          github_url: input.github_url,
          demo_url: input.demo_url,
          tech_stack: input.tech_stack,
          image_url: input.image_url,
          is_featured: false,
        } as any)
        .select()
        .single()

      if (projectError) throw projectError

      const projectData = project as Project

      // Add user as project member
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectData.id,
          member_id: user.id,
          role: 'owner',
        } as any)

      if (memberError) {
        // Rollback project creation
        await supabase.from('projects').delete().eq('id', projectData.id)
        throw memberError
      }

      // Refresh projects list
      await fetchProjects()
      return { error: null }
    } catch (err) {
      console.error('Error creating project:', err)
      return { error: 'Failed to create project. Please try again.' }
    }
  }

  const deleteProject = async (projectId: string): Promise<{ error: string | null }> => {
    if (!user) {
      return { error: 'You must be logged in to delete a project' }
    }

    try {
      if (!isSupabaseConfigured) {
        // Mock delete immediately
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
        return { error: null }
      }

      // Delete project membership first (cascade should handle this, but being explicit)
      await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('member_id', user.id)

      // Delete project
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (deleteError) throw deleteError

      // Update local state
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting project:', err)
      return { error: 'Failed to delete project. Please try again.' }
    }
  }

  return {
    projects,
    isLoading,
    error,
    createProject,
    deleteProject,
    refreshProjects: fetchProjects,
  }
}
