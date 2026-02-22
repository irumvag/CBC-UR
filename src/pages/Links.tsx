import { Link } from 'react-router-dom'
import { FileText, Calendar, Mail, ExternalLink, Users, type LucideIcon } from 'lucide-react'
import { SEO } from '@/components/SEO'

// ============================================================
// LINKS CONFIGURATION
// ============================================================
// To add a new link: Copy a link object and update the fields
// To hide a link: Set visible: false (keeps it in code for later)
// ============================================================

interface LinkItem {
  id: string
  title: string
  description?: string
  url: string
  icon: LucideIcon
  visible: boolean
  isInternal?: boolean
}

const LINKS: LinkItem[] = [
  {
    id: "membership-form",
    title: "Membership Sign-Up",
    description: "Join the Claude Builder Club",
    url: "https://www.jotform.com/253555944387168",
    icon: FileText,
    visible: true,
  },
  {
    id: "events",
    title: "Upcoming Events",
    description: "See what's happening",
    url: "/events",
    icon: Calendar,
    visible: true,
    isInternal: true,
  },
  {
    id: "email",
    title: "Contact Us",
    description: "Reach out via email",
    url: "mailto:claudebuilderclub.ur@gmail.com",
    icon: Mail,
    visible: true,
  },
]

function LinkCard({ link }: { link: LinkItem }) {
  const Icon = link.icon
  const isExternal = link.url.startsWith("http") || link.url.startsWith("mailto")

  const content = (
    <div className="group flex items-center gap-4 rounded-xl border border-cloudy/20 bg-white p-4 shadow-sm transition-all hover:border-claude-terracotta-deep/30 hover:shadow-md sm:p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-claude-terracotta-deep/10 transition-colors group-hover:bg-claude-terracotta-deep/20 sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 text-claude-terracotta-deep sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-ink sm:text-base">
          {link.title}
        </h3>
        {link.description && (
          <p className="mt-0.5 truncate text-xs text-stone sm:text-sm">
            {link.description}
          </p>
        )}
      </div>
      <ExternalLink className="h-3 w-3 shrink-0 text-stone/30 transition-colors group-hover:text-claude-terracotta-deep sm:h-4 sm:w-4" />
    </div>
  )

  if (link.isInternal) {
    return <Link to={link.url}>{content}</Link>
  }

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  )
}

export default function Links() {
  const visibleLinks = LINKS.filter((link) => link.visible)

  return (
    <>
      <SEO
        title="Links"
        description="Quick access to all our resources, forms, and social media."
        url="/links"
      />

      {/* Page Hero */}
      <section className="border-b border-cloudy/20 bg-white px-4 py-10 text-center sm:px-8 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
          Links
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-stone sm:mt-6 sm:text-base md:text-lg">
          Quick access to all our resources, forms, and social media
        </p>
      </section>

      {/* Links Grid */}
      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-12">
        {visibleLinks.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-4">
            {visibleLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-cloudy/20 bg-white p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-stone/20" />
            <p className="mt-4 text-stone">
              Links coming soon! Check back later.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
