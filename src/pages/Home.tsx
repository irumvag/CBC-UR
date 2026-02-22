import { Hero } from '@/components/sections/Hero'
import { Benefits } from '@/components/sections/Benefits'
import { Gallery } from '@/components/sections/Gallery'
import { Outreach } from '@/components/sections/Outreach'
import { HomeSEO } from '@/components/SEO'

export default function Home() {
  return (
    <>
      <HomeSEO />
      <Hero />
      <Benefits />
      <Gallery />
      <Outreach />

      {/* Keep Thinking Section */}
      <section className="bg-surface dark:bg-dark-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8 md:px-12">
          <p className="font-serif text-3xl font-bold text-ink dark:text-dark-text sm:text-4xl md:text-5xl">
            Keep thinking.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-base text-stone dark:text-dark-muted sm:text-lg">
            Building with Claude, one project at a time.
          </p>
        </div>
      </section>
    </>
  )
}
