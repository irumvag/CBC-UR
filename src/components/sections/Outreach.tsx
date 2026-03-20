import { useSiteContent } from '@/hooks/useSiteContent'

export function Outreach() {
  const { content } = useSiteContent('outreach')

  const heading = content.outreach_heading || 'Partner With Us'
  const subheading = content.outreach_subheading || 'Are you interested in partnering with Claude Builder Club for your organization or an event in University of Rwanda? Reach out at'
  const email = content.outreach_email || 'claudebuilderclub.urcst@gmail.com'

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-12 md:py-16">
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-16">
        <div className="flex-1">
          <h2 className="mb-3 text-lg font-bold text-foreground sm:mb-4 sm:text-xl md:text-3xl">
            {heading}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70 sm:text-base md:text-lg">
            {subheading}{' '}
            <a
              href={`mailto:${email}`}
              className="font-semibold text-primary underline transition-colors hover:text-claude-terracotta"
            >
              {email}
            </a>
            .
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <img
            src="/images/claude-icons/hands.png"
            alt="Partnership hands icon"
            className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64"
          />
        </div>
      </div>
    </section>
  )
}
