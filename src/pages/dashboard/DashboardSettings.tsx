import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, BookOpen, Building, FileText, Camera, Loader2, AlertTriangle, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const yearOptions = [
  { value: '1', label: 'Year 1' },
  { value: '2', label: 'Year 2' },
  { value: '3', label: 'Year 3' },
  { value: '4', label: 'Year 4' },
  { value: '5', label: 'Year 5' },
  { value: 'graduate', label: 'Graduate Student' },
  { value: 'alumni', label: 'Alumni' },
]

const departmentOptions = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'it', label: 'Information Technology' },
  { value: 'ce', label: 'Computer Engineering' },
  { value: 'ee', label: 'Electrical Engineering' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'business', label: 'Business Administration' },
  { value: 'other', label: 'Other' },
]

interface ProfileFormData {
  full_name: string
  student_id: string
  year_of_study: string
  department: string
  bio: string
  avatar_url: string
}

export default function DashboardSettings() {
  const { user, member, signOut, refreshMember } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    student_id: '',
    year_of_study: '',
    department: '',
    bio: '',
    avatar_url: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form with member data
  useEffect(() => {
    if (member) {
      setFormData({
        full_name: member.full_name || '',
        student_id: member.student_id || '',
        year_of_study: member.year_of_study || '',
        department: member.department || '',
        bio: member.bio || '',
        avatar_url: member.avatar_url || '',
      })
    }
  }, [member])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!isSupabaseConfigured || !user) {
        // Mock save for development
        await new Promise((resolve) => setTimeout(resolve, 500))
        showToast('Profile updated successfully!', 'success')
        return
      }

      const { error } = await (supabase
        .from('members') as any)
        .update({
          full_name: formData.full_name,
          student_id: formData.student_id || null,
          year_of_study: formData.year_of_study || null,
          department: formData.department || null,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null,
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshMember()
      showToast('Profile updated successfully!', 'success')
    } catch (err) {
      console.error('Error updating profile:', err)
      showToast('Failed to update profile. Please try again.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsDeleting(true)

    try {
      if (!isSupabaseConfigured) {
        // Mock delete for development
        await new Promise((resolve) => setTimeout(resolve, 500))
        await signOut()
        navigate('/')
        showToast('Account deleted', 'success')
        return
      }

      // Delete member data (cascade will handle related records)
      if (!user?.id) throw new Error('User not found')

      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', user.id)

      if (error) throw error

      // Sign out and redirect
      await signOut()
      navigate('/')
      showToast('Account deleted successfully', 'success')
    } catch (err) {
      console.error('Error deleting account:', err)
      showToast('Failed to delete account. Please try again.', 'error')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Get user initials for avatar preview
  const getInitials = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return '?'
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-serif font-semibold text-2xl md:text-3xl text-ink mb-1">
            Settings
          </h1>
          <p className="text-stone">
            Manage your profile and account settings
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-pampas-warm p-6 mb-6">
            <h2 className="font-serif font-semibold text-lg text-ink mb-6">
              Profile Information
            </h2>

            {/* Avatar Section */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-pampas-warm">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt={formData.full_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <span className="text-white text-xl font-semibold">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-sans font-semibold text-ink text-sm mb-2">
                  Avatar URL
                </label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    disabled={isSaving}
                    className={cn(
                      'w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-pampas-warm bg-white text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block font-sans font-semibold text-ink text-sm mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={isSaving}
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block font-sans font-semibold text-ink text-sm mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    disabled
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-pampas-warm/50',
                      'text-stone cursor-not-allowed'
                    )}
                  />
                </div>
                <p className="mt-1 text-stone text-xs">Email cannot be changed</p>
              </div>

              {/* Student ID */}
              <div>
                <label className="block font-sans font-semibold text-ink text-sm mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="e.g., 220012345"
                    disabled={isSaving}
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                </div>
              </div>

              {/* Year and Department Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Year of Study */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Year of Study
                  </label>
                  <select
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={handleChange}
                    disabled={isSaving}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  >
                    <option value="">Select year</option>
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone pointer-events-none" />
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={isSaving}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50 appearance-none'
                      )}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-sans font-semibold text-ink text-sm mb-2">
                  Bio
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 w-5 h-5 text-stone" />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself, your interests in AI, and what you want to build..."
                    rows={4}
                    disabled={isSaving}
                    className={cn(
                      'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white resize-none',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                </div>
                <p className="mt-1 text-stone text-xs">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 pt-6 border-t border-pampas-warm">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-lg text-ink">
                Danger Zone
              </h2>
              <p className="text-stone text-sm">
                Irreversible and destructive actions
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
            <h3 className="font-semibold text-ink mb-1">Delete Account</h3>
            <p className="text-stone text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {showDeleteConfirm ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className={cn(
                    'px-5 py-2.5 rounded-full font-sans font-semibold text-sm',
                    'bg-red-600 text-white hover:bg-red-700',
                    'transition-colors disabled:opacity-50 flex items-center justify-center'
                  )}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Yes, Delete My Account
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteAccount}
                className={cn(
                  'px-5 py-2.5 rounded-full font-sans font-medium text-sm',
                  'border-2 border-red-200 text-red-600 hover:bg-red-50',
                  'transition-colors'
                )}
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
