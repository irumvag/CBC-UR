import { useState } from 'react'
import {
  FolderKanban, Star, Trash2, Github, ExternalLink, Loader2
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAdminProjects } from '@/hooks/useAdminData'
import { useToast } from '@/components/ui/Toast'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  Healthcare: 'from-rose-500 to-pink-500',
  Education: 'from-blue-500 to-cyan-500',
  Agriculture: 'from-green-500 to-emerald-500',
  Finance: 'from-yellow-500 to-orange-500',
  Environment: 'from-teal-500 to-green-500',
  'Social Impact': 'from-purple-500 to-violet-500',
  Chatbots: 'from-indigo-500 to-blue-500',
  Other: 'from-stone-500 to-slate-500',
}

export default function AdminProjects() {
  const { showToast } = useToast()
  const { projects, isLoading, toggleFeatured, deleteProject } = useAdminProjects()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleToggleFeatured = async (projectId: string, currentStatus: boolean) => {
    setTogglingId(projectId)
    const { error } = await toggleFeatured(projectId, !currentStatus)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast(currentStatus ? 'Removed from featured' : 'Added to featured', 'success')
    }
    setTogglingId(null)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setDeletingId(projectId)
    const { error } = await deleteProject(projectId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Project deleted', 'success')
    }
    setDeletingId(null)
  }

  const getGradient = (category: string | null) => {
    return categoryColors[category || 'Other'] || categoryColors.Other
  }

  const featuredCount = projects.filter((p) => p.is_featured).length

  return (
    <AdminLayout title="Projects" breadcrumbs={[{ label: 'Projects' }]}>
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-stone">
            <FolderKanban size={18} />
            <span>{projects.length} total projects</span>
          </div>
          <div className="flex items-center gap-2 text-claude-terracotta">
            <Star size={18} className="fill-current" />
            <span>{featuredCount} featured</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-pampas-warm overflow-hidden group"
            >
              {/* Header with gradient */}
              <div className={cn('h-24 bg-gradient-to-br relative', getGradient(project.category))}>
                {/* Featured badge */}
                {project.is_featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-claude-terracotta text-xs font-medium">
                    <Star size={12} className="fill-current" />
                    Featured
                  </div>
                )}
                {/* Category */}
                {project.category && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-white/90 text-ink text-xs font-medium">
                    {project.category}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-ink mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-stone text-sm line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                {/* Tech stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech_stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded-full bg-pampas-warm text-stone"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-pampas-warm text-stone">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-stone hover:text-ink transition-colors"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-claude-terracotta hover:underline"
                    >
                      <ExternalLink size={14} />
                      Demo
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-pampas-warm">
                  <button
                    onClick={() => handleToggleFeatured(project.id, project.is_featured)}
                    disabled={togglingId === project.id}
                    title={project.is_featured ? 'Remove from featured' : 'Add to featured'}
                    className={cn(
                      'p-2 rounded-lg transition-colors disabled:opacity-50',
                      project.is_featured
                        ? 'text-claude-terracotta bg-claude-terracotta/10 hover:bg-claude-terracotta/20'
                        : 'text-stone hover:text-ink hover:bg-pampas-warm'
                    )}
                  >
                    {togglingId === project.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Star size={16} className={project.is_featured ? 'fill-current' : ''} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="p-2 text-stone hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === project.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-pampas-warm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-pampas-warm flex items-center justify-center mx-auto mb-4">
            <FolderKanban className="w-8 h-8 text-stone" />
          </div>
          <h3 className="font-serif font-semibold text-xl text-ink mb-2">No projects yet</h3>
          <p className="text-stone">
            Projects created by members will appear here.
          </p>
        </div>
      )}
    </AdminLayout>
  )
}
