import { Link } from 'react-router-dom'
import { useSiteContent } from '@/hooks/useSiteContent'

export function Hero() {
  const { content } = useSiteContent('hero')

  const heading = content.hero_heading || "UR's Premier AI Club"
  const subheading = content.hero_subheading || 'Join a community of builders exploring, creating, and shipping with Claude. Workshops, hackathons, and demos every month.'
  const ctaPrimary = content.hero_cta_primary || 'View Events'
  const ctaSecondary = content.hero_cta_secondary || 'Learn More'

  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-10 md:flex-row md:items-center md:gap-12 md:px-12 md:pb-36 md:pt-16">
      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-6xl">
          {heading}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70 sm:mt-10 sm:text-lg md:text-xl">
          {subheading}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-5">
          <Link
            to="/events"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark sm:px-10 sm:py-3.5 sm:text-base md:text-lg"
          >
            {ctaPrimary}
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-md border-2 border-primary px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:px-10 sm:py-3.5 sm:text-base md:text-lg"
          >
            {ctaSecondary}
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
