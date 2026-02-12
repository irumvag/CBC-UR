import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Stats } from '@/components/sections/Stats'
import { Features } from '@/components/sections/Features'
import { CTA } from '@/components/sections/CTA'
import { HomeSEO } from '@/components/SEO'

export default function Home() {
  return (
    <>
      <HomeSEO />
      <Hero />
      <Stats />
      <About />
      <Features />
      <CTA />
    </>
  )
}
