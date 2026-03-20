import { Github, ExternalLink, Code2, Rocket } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useProjects } from '@/hooks/useProjects'
import type { Project } from '@/lib/types'
import { SkeletonProjectCard } from '@/components/ui/Skeleton'

function ProjectCard({ project }: { project: Project }) {
  const githubUrl = project.github_url
  const demoUrl = project.demo_url

  return (
    <div className="group flex flex-col rounded-xl border border-muted/20 bg-surface shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {/* Featured badge */}
      {project.is_featured && (
        <div className="flex items-center gap-1.5 border-b border-amber-100 bg-amber-50 px-4 py-2">
          <span className="text-xs font-semibold text-amber-700">⭐ Featured Project</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start gap-3 border-b border-muted/10 p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Code2 className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground sm:text-base">
            {project.title}
          </h3>
          {project.author_name && (
            <p className="mt-0.5 text-xs text-foreground/50">by {project.author_name}</p>
          )}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {project.description && (
          <p className="flex-1 text-xs leading-relaxed text-foreground/70 sm:text-sm">
            {project.description}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-surface transition-colors hover:bg-foreground/80 sm:text-sm"
            >
              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              View on GitHub
              <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 sm:text-sm"
            >
              Live Demo
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Showcase() {
  const { projects, loading, error } = useProjects()

  return (
    <>
      <SEO
        title="Showcase"
        description="Explore projects and demos built by Claude Builder Club members at the University of Rwanda."
        url="/showcase"
      />

      {/* Page Hero */}
      <section className="border-b border-muted/20 bg-surface px-4 py-10 text-center sm:px-8 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Project Showcase
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground/70 sm:mt-6 sm:text-base md:text-lg">
          Projects and demos built by our members using Claude
        </p>
      </section>

      {/* Projects Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 md:py-16">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            Failed to load projects. Please try again later.
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonProjectCard key={i} />)}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-muted/20 bg-surface p-8 text-center sm:p-12">
            <Rocket className="mx-auto h-12 w-12 text-foreground/20" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Coming Soon
            </h3>
            <p className="mt-2 text-sm text-foreground/70">
              Projects will appear here as members submit their work.
            </p>
          </div>
        )}

        {/* Submit CTA */}
        <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center sm:mt-12 sm:p-8">
          <h3 className="text-base font-bold text-foreground sm:text-lg">
            Built something with Claude?
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-xs text-foreground/70 sm:text-sm">
            Submit your project to our GitHub repository and it will be featured here.
          </p>
          <a
            href="https://github.com/irumvag/CBC-UR/tree/main/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
          >
            <Github className="h-4 w-4" />
            Submit Your Project
          </a>
        </div>
      </section>
    </>
  )
}
