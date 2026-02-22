import { ExternalLink } from 'lucide-react'
import { SEO } from '@/components/SEO'

const links = [
  {
    title: 'Claude AI',
    description: 'Try Claude — the AI assistant by Anthropic.',
    url: 'https://claude.ai',
  },
  {
    title: 'Anthropic',
    description: 'Learn about the AI safety company behind Claude.',
    url: 'https://www.anthropic.com',
  },
  {
    title: 'Claude Documentation',
    description: 'Official API docs, guides, and tutorials for building with Claude.',
    url: 'https://docs.anthropic.com',
  },
  {
    title: 'University of Rwanda',
    description: 'Our home institution — the largest public university in Rwanda.',
    url: 'https://ur.ac.rw',
  },
  {
    title: 'Claude Builder Club Program',
    description: 'Learn about the global Claude Builder Club initiative.',
    url: 'https://www.anthropic.com/claude-builder-clubs',
  },
  {
    title: 'GitHub',
    description: 'Check out our open-source projects and contributions.',
    url: 'https://github.com/claude-builder-club-ur',
  },
]

export default function Links() {
  return (
    <>
      <SEO
        title="Links"
        description="Quick links and resources from Claude Builder Club at University of Rwanda."
        url="/links"
      />

      {/* Header */}
      <section className="bg-surface dark:bg-dark-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-claude-terracotta">
            Resources
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-4xl md:text-5xl">
            Quick Links
          </h1>
          <p className="mt-4 max-w-2xl text-base text-stone dark:text-dark-muted sm:text-lg">
            Useful resources, tools, and platforms related to Claude Builder Club.
          </p>
        </div>
      </section>

      {/* Links Grid */}
      <section className="bg-pampas dark:bg-dark-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink dark:text-dark-text">
                    {link.title}
                    <ExternalLink className="h-4 w-4 text-stone/50 transition-colors group-hover:text-claude-terracotta" />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone dark:text-dark-muted">
                    {link.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
