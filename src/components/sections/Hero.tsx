import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-10 md:flex-row md:items-center md:gap-12 md:px-12 md:pb-36 md:pt-16">
      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-6xl">
          UR&apos;s Premier AI Club
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone sm:mt-10 sm:text-lg md:text-xl">
          Join a community of builders exploring, creating,
          and shipping with Claude. Workshops, hackathons, and demos every month.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-5">
          <Link
            to="/events"
            className="inline-flex items-center justify-center rounded-md bg-claude-terracotta-deep px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-claude-terracotta sm:px-10 sm:py-3.5 sm:text-base md:text-lg"
          >
            View Events
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-md border-2 border-claude-terracotta-deep px-8 py-3 text-sm font-semibold text-claude-terracotta-deep transition-colors hover:bg-claude-terracotta-deep hover:text-white sm:px-10 sm:py-3.5 sm:text-base md:text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center md:flex">
        <img
          src="/images/hero_image.png"
          alt="University of Rwanda AI Club illustration"
          className="h-auto w-full max-w-md md:max-w-lg"
        />
      </div>
    </section>
  )
}
