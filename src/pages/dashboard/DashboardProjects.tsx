import { useState, Fragment } from 'react'
import {
  Plus, FolderKanban, Github, ExternalLink, X, Loader2,
  Upload, Tag, Trash2
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useUserProjects } from '@/hooks/useUserProjects'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

const projectCategories = [
  'Healthcare',
  'Education',
  'Agriculture',
  'Finance',
  'Environment',
  'Social Impact',
  'Other',
]

interface ProjectFormData {
  title: string
  description: string
  category: string
  github_url: string
  demo_url: string
  tech_stack: string[]
  image_url: string
}

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  category: '',
  github_url: '',
  demo_url: '',
  tech_stack: [],
  image_url: '',
}

export default function DashboardProjects() {
  const { projects, isLoading, createProject, deleteProject } = useUserProjects()
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
  const [techInput, setTechInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const { error } = await createProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
        tech_stack: formData.tech_stack.length > 0 ? formData.tech_stack : null,
        image_url: formData.image_url || null,
      })

      if (error) {
        showToast(error, 'error')
      } else {
        showToast('Project created successfully!', 'success')
        setIsModalOpen(false)
        setFormData(initialFormData)
        setTechInput('')
      }
    } catch (err) {
      showToast('Failed to create project', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTech = () => {
    const tech = techInput.trim()
    if (tech && !formData.tech_stack.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, tech],
      }))
      setTechInput('')
    }
  }

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((tech) => tech !== techToRemove),
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTech()
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    const { error } = await deleteProject(projectId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Project deleted', 'success')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData(initialFormData)
    setTechInput('')
    setErrors({})
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif font-semibold text-2xl md:text-3xl text-ink mb-1">
              My Projects
            </h1>
            <p className="text-stone">
              Manage your Claude-powered projects
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-pampas-warm p-5 hover:border-claude-terracotta/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-claude-terracotta to-claude-terracotta-light flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">{project.title}</h3>
                      {project.category && (
                        <span className="text-xs text-stone">{project.category}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-stone hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="text-stone text-sm line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-full bg-pampas-warm text-stone"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-claude-terracotta hover:underline"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-pampas-warm p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-pampas-warm flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-10 h-10 text-stone" />
            </div>
            <h3 className="font-serif font-semibold text-xl text-ink mb-2">
              No projects yet
            </h3>
            <p className="text-stone mb-6 max-w-sm mx-auto">
              Start building with Claude! Add your first project to showcase your work and track your progress.
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} className="mr-2" />
              Start a Project
            </Button>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <Fragment>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 animate-fade-in"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <div
              className={cn(
                'bg-pampas rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto my-8',
                'transform transition-all duration-300 animate-modal-in'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-pampas-warm">
                <h2 className="font-serif font-semibold text-xl text-ink">
                  Add New Project
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="My Awesome AI Project"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 bg-white',
                      errors.title ? 'border-red-300' : 'border-pampas-warm',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                  {errors.title && <p className="mt-1 text-red-600 text-sm">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your project does..."
                    rows={3}
                    disabled={isSubmitting}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 bg-white resize-none',
                      errors.description ? 'border-red-300' : 'border-pampas-warm',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  />
                  {errors.description && <p className="mt-1 text-red-600 text-sm">{errors.description}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    disabled={isSubmitting}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 bg-white',
                      errors.category ? 'border-red-300' : 'border-pampas-warm',
                      'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                      'transition-all disabled:opacity-50'
                    )}
                  >
                    <option value="">Select a category</option>
                    {projectCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-red-600 text-sm">{errors.category}</p>}
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    GitHub URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                  </div>
                </div>

                {/* Demo URL */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Live Demo URL
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="url"
                      value={formData.demo_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, demo_url: e.target.value }))}
                      placeholder="https://myproject.demo.com"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Tech Stack
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="React, Claude API, etc."
                        disabled={isSubmitting}
                        className={cn(
                          'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                          'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                          'transition-all disabled:opacity-50'
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTech}
                      disabled={isSubmitting || !techInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  {formData.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-claude-terracotta/10 text-claude-terracotta text-sm"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="hover:bg-claude-terracotta/20 rounded-full p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block font-sans font-semibold text-ink text-sm mb-2">
                    Project Image URL
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.png"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pampas-warm bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                        'transition-all disabled:opacity-50'
                      )}
                    />
                  </div>
                  <p className="mt-1 text-stone text-xs">
                    Paste a URL to an image for your project thumbnail
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </DashboardLayout>
  )
}
