import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Stats } from '@/components/sections/Stats'
import { Features } from '@/components/sections/Features'
import { CTA } from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Features />
      <CTA />
    </>
  )
}
