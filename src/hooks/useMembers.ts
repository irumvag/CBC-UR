import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { MemberApplicationInput, Member } from '@/types/database'

interface SubmitApplicationResult {
  success: boolean
  error?: string
  member?: Member
}

interface UseMembersResult {
  submitApplication: (input: MemberApplicationInput) => Promise<SubmitApplicationResult>
  isLoading: boolean
}

export function useMembers(): UseMembersResult {
  const [isLoading, setIsLoading] = useState(false)

  const submitApplication = async (input: MemberApplicationInput): Promise<SubmitApplicationResult> => {
    setIsLoading(true)

    try {
      // Validate input
      if (!input.email || !input.full_name) {
        return { success: false, error: 'Email and full name are required.' }
      }

      if (!isSupabaseConfigured) {
        // Simulate success for mock
        await new Promise((resolve) => setTimeout(resolve, 800))
        return {
          success: true,
          member: {
            id: 'mock-id',
            email: input.email,
            full_name: input.full_name,
            student_id: input.student_id || null,
            year_of_study: input.year_of_study || null,
            department: input.department || null,
            bio: input.bio || null,
            avatar_url: null,
            role: 'member',
            status: 'pending',
            joined_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        }
      }

      const { data, error: insertError } = await supabase
        .from('members')
        .insert({
          email: input.email,
          full_name: input.full_name,
          student_id: input.student_id || null,
          year_of_study: input.year_of_study || null,
          department: input.department || null,
          bio: input.bio || null,
          role: 'member' as const,
          status: 'pending' as const,
        } as any)
        .select()
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          return { success: false, error: 'An application with this email already exists.' }
        }
        throw insertError
      }

      return { success: true, member: data }
    } catch (err) {
      console.error('Error submitting application:', err)
      return { success: false, error: 'Failed to submit application. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  return { submitApplication, isLoading }
}
