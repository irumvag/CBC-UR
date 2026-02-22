import { Link } from 'react-router-dom'

export function Outreach() {
  return (
    <section className="bg-pampas dark:bg-dark-surface py-16 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 sm:px-8 md:flex-row md:gap-16 md:px-12">
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-3xl md:text-4xl">
            Partner With Us
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone dark:text-dark-muted sm:text-lg">
            We&apos;re always looking for organizations, companies, and individuals who share our vision
            of empowering the next generation of AI builders in Rwanda. Whether it&apos;s sponsoring events,
            mentoring students, or providing resources — let&apos;s build something meaningful together.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-md bg-claude-terracotta px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-claude-terracotta-deep sm:text-base"
            >
              Learn More
            </Link>
            <a
              href="mailto:claudebuilderclub.ur@gmail.com"
              className="inline-flex items-center justify-center rounded-md border-2 border-claude-terracotta px-8 py-3 text-sm font-semibold text-claude-terracotta transition-colors hover:bg-claude-terracotta hover:text-white sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-gradient-to-br from-claude-terracotta/10 to-pampas dark:from-claude-terracotta/20 dark:to-dark-card sm:h-72 sm:w-72 md:h-80 md:w-80">
            <div className="text-center">
              <p className="font-serif text-5xl font-bold text-claude-terracotta sm:text-6xl">
                CBC
              </p>
              <p className="mt-1 text-sm font-medium tracking-widest text-stone dark:text-dark-muted">
                UNIVERSITY OF RWANDA
              </p>
              <div className="mx-auto mt-4 h-0.5 w-16 bg-claude-terracotta/40" />
              <p className="mt-3 text-xs text-stone/70 dark:text-dark-muted/70">
                Backed by Anthropic
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
