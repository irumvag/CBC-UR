import { Github, ExternalLink, Code2, Rocket } from 'lucide-react'
import { SEO } from '@/components/SEO'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubPath: string
  image?: string
}

const GITHUB_BASE = 'https://github.com/irumvag/CBC-UR/tree/main/projects'

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Claude Study Buddy',
    description: 'An AI-powered study assistant that helps University of Rwanda students prepare for exams by generating practice questions and explanations using Claude.',
    tags: ['Claude API', 'Python', 'Education'],
    githubPath: 'claude-study-buddy',
  },
  {
    id: '2',
    title: 'Kinyarwanda Translator',
    description: 'A translation tool leveraging Claude to translate between Kinyarwanda and English, built to help bridge language gaps in technical documentation.',
    tags: ['Claude API', 'React', 'NLP'],
    githubPath: 'kinyarwanda-translator',
  },
  {
    id: '3',
    title: 'Campus Event Planner',
    description: 'A smart event planning assistant that helps club organizers schedule, promote, and manage campus events with AI-generated content.',
    tags: ['Claude API', 'TypeScript', 'Automation'],
    githubPath: 'campus-event-planner',
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col rounded-xl border border-muted/20 bg-surface shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {/* Card Header */}
      <div className="flex items-start gap-3 border-b border-muted/10 p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Code2 className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground sm:text-base">
            {project.title}
          </h3>
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
        <p className="flex-1 text-xs leading-relaxed text-foreground/70 sm:text-sm">
          {project.description}
        </p>

        <a
          href={`${GITHUB_BASE}/${project.githubPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-surface transition-colors hover:bg-foreground/80 sm:text-sm"
        >
          <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          View on GitHub
          <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </a>
      </div>
    </div>
  )
}

export default function Showcase() {
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
        {PROJECTS.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {PROJECTS.map((project) => (
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
