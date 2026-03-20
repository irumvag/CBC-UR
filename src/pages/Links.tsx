import { Link as RouterLink } from 'react-router-dom'
import { ExternalLink, Users } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useLinks } from '@/hooks/useLinks'
import type { Link } from '@/lib/types'
import { Skeleton } from '@/components/ui/Skeleton'

function LinkCard({ link }: { link: Link }) {
  const isExternal = link.url.startsWith('http') || link.url.startsWith('mailto')
  const isInternal = link.url.startsWith('/')

  const content = (
    <div className="group flex items-center gap-4 rounded-xl border border-muted/20 bg-surface p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 sm:h-14 sm:w-14">
        {link.icon ? (
          <span className="text-xl">{link.icon}</span>
        ) : (
          <ExternalLink className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">
          {link.title}
        </h3>
        {link.description && (
          <p className="mt-0.5 truncate text-xs text-foreground/70 sm:text-sm">
            {link.description}
          </p>
        )}
      </div>
      <ExternalLink className="h-3 w-3 shrink-0 text-foreground/30 transition-colors group-hover:text-primary sm:h-4 sm:w-4" />
    </div>
  )

  if (isInternal) {
    return <RouterLink to={link.url}>{content}</RouterLink>
  }

  return (
    <a
      href={link.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  )
}

export default function Links() {
  const { links, loading, error } = useLinks()

  return (
    <>
      <SEO
        title="Links"
        description="Quick access to all our resources, forms, and social media."
        url="/links"
      />

      {/* Page Hero */}
      <section className="border-b border-muted/20 bg-surface px-4 py-10 text-center sm:px-8 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Links
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground/70 sm:mt-6 sm:text-base md:text-lg">
          Quick access to all our resources, forms, and social media
        </p>
      </section>

      {/* Links Grid */}
      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-12">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            Failed to load links. Please try again later.
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : links.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-4">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-muted/20 bg-surface p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-foreground/20" />
            <p className="mt-4 text-foreground/70">
              Links coming soon! Check back later.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
