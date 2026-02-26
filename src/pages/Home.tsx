import { Hero } from '@/components/sections/Hero'
import { Benefits } from '@/components/sections/Benefits'
import { Gallery } from '@/components/sections/Gallery'
import { LogicChallenge } from '@/components/sections/LogicChallenge'
import { Outreach } from '@/components/sections/Outreach'
import { HomeSEO } from '@/components/SEO'

export default function Home() {
  return (
    <>
      <HomeSEO />
      <Hero />
      <Benefits />
      <Gallery />
      <LogicChallenge />
      <Outreach />
      <section className="bg-primary px-[8%] py-16 sm:py-20 md:py-28">
        <p className="text-center text-5xl font-light leading-tight text-cream sm:text-6xl md:text-left md:text-7xl lg:text-8xl">
          Keep
          <br />
          thinking.
        </p>
      </section>
    </>
  )
}
