import { Link } from 'react-router-dom'
import { Cpu, Users, Lightbulb, Rocket } from 'lucide-react'
import { AboutSEO } from '@/components/SEO'

const activities = [
  {
    icon: Cpu,
    title: 'Workshops',
    description: 'Hands-on sessions covering prompt engineering, tool use, and building with Claude API.',
  },
  {
    icon: Users,
    title: 'Community Projects',
    description: 'Collaborate on open-source projects that solve real problems facing Rwandan communities.',
  },
  {
    icon: Lightbulb,
    title: 'Speaker Events',
    description: 'Learn from industry professionals, AI researchers, and fellow student builders.',
  },
  {
    icon: Rocket,
    title: 'Hackathons',
    description: 'Compete in themed build sprints, ship products, and demo your work to the community.',
  },
]

export default function About() {
  return (
    <>
      <AboutSEO />

      {/* Mission Section */}
      <section className="bg-surface dark:bg-dark-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-claude-terracotta">
            Our Mission
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-4xl md:text-5xl">
            Empowering AI Builders in Rwanda
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-stone dark:text-dark-muted sm:text-lg md:text-xl">
            The Claude Builder Club at University of Rwanda exists to democratize AI literacy across Rwanda.
            We provide hands-on learning experiences, mentorship, and a vibrant community for students from all
            disciplines to build practical solutions using Claude AI. Our goal is simple: learn by building.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-pampas dark:bg-dark-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
          <h2 className="mb-10 text-center font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-text sm:mb-14 sm:text-3xl md:text-4xl">
            What We Do
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.title}
                  className="rounded-2xl border border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-claude-terracotta/10">
                    <Icon className="h-6 w-6 text-claude-terracotta" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold text-ink dark:text-dark-text">
                    {activity.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone dark:text-dark-muted">
                    {activity.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Backed by Anthropic */}
      <section className="bg-surface dark:bg-dark-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8 md:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone dark:text-dark-muted">
            Backed By
          </p>
          <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-3xl">
            Anthropic
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone dark:text-dark-muted sm:text-lg">
            As part of the global Claude Builder Club program, we&apos;re supported by Anthropic — the AI safety
            company behind Claude. This partnership provides us with API access, resources, and a network of
            builder communities worldwide.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pampas dark:bg-dark-surface py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8 md:px-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-3xl md:text-4xl">
            Ready to Build?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-stone dark:text-dark-muted sm:text-lg">
            Check out our upcoming events and start building with Claude today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-5">
            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-md bg-claude-terracotta px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-claude-terracotta-deep sm:text-base"
            >
              View Events
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-md border-2 border-claude-terracotta px-8 py-3 text-sm font-semibold text-claude-terracotta transition-colors hover:bg-claude-terracotta hover:text-white sm:text-base"
            >
              See Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
