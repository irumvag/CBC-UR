import { Instagram, Linkedin } from 'lucide-react'
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
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm text-foreground/50">Follow us:</span>
            <a
              href="https://www.instagram.com/claudebuilderclub.urcst/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/50 transition-all hover:bg-[#E1306C]/10 hover:text-[#E1306C]"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/cbc-ur-cst/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/50 transition-all hover:bg-[#0077B5]/10 hover:text-[#0077B5]"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
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
