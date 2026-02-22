import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-10 md:flex-row md:items-center md:gap-12 md:px-12 md:pb-36 md:pt-16">
      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-4xl md:text-6xl font-serif">
          Rwanda&apos;s Premier AI Builder Club
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone dark:text-dark-muted sm:mt-10 sm:text-lg md:text-xl">
          Join a community of builders at the University of Rwanda exploring, creating,
          and shipping with Claude. Workshops, hackathons, and demos every month.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-5">
          <Link
            to="/events"
            className="inline-flex items-center justify-center rounded-md bg-claude-terracotta px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-claude-terracotta-deep sm:px-10 sm:py-3.5 sm:text-base md:text-lg"
          >
            View Events
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-md border-2 border-claude-terracotta px-8 py-3 text-sm font-semibold text-claude-terracotta transition-colors hover:bg-claude-terracotta hover:text-white sm:px-10 sm:py-3.5 sm:text-base md:text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center md:flex">
        <div className="relative">
          <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-gradient-to-br from-claude-terracotta/10 to-pampas flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-40 h-40 lg:w-48 lg:h-48" fill="none">
              <circle cx="18" cy="6" r="3" className="fill-claude-terracotta/70" />
              <circle cx="26.5" cy="9.5" r="3" className="fill-claude-terracotta/60" />
              <circle cx="30" cy="18" r="3" className="fill-claude-terracotta/50" />
              <circle cx="26.5" cy="26.5" r="3" className="fill-claude-terracotta/60" />
              <circle cx="18" cy="30" r="3" className="fill-claude-terracotta/70" />
              <circle cx="9.5" cy="26.5" r="3" className="fill-claude-terracotta/60" />
              <circle cx="6" cy="18" r="3" className="fill-claude-terracotta/50" />
              <circle cx="9.5" cy="9.5" r="3" className="fill-claude-terracotta/60" />
              <circle cx="18" cy="18" r="4" className="fill-claude-terracotta" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
