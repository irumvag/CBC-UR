import { Cpu, Trophy, Users, BookOpen } from 'lucide-react'

const benefits = [
  {
    icon: Cpu,
    title: 'Claude Access',
    description: 'Get hands-on experience with Claude AI through exclusive workshops and dedicated API access for club projects.',
  },
  {
    icon: Trophy,
    title: 'Hackathons',
    description: 'Compete in AI hackathons, build innovative solutions, and showcase your skills to the community.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with fellow builders, share ideas, and collaborate on projects that make a real impact in Rwanda.',
  },
  {
    icon: BookOpen,
    title: 'Learn & Grow',
    description: 'From beginner-friendly intros to advanced prompt engineering — level up your AI skills every week.',
  },
]

export function Benefits() {
  return (
    <section className="bg-pampas dark:bg-dark-surface py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-ink dark:text-dark-text sm:text-3xl md:text-4xl">
            Why Join the Club?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone dark:text-dark-muted sm:text-lg">
            Whether you&apos;re a beginner or experienced developer, there&apos;s something for everyone.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-pampas-warm dark:border-dark-border bg-white dark:bg-dark-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-claude-terracotta/10">
                  <Icon className="h-6 w-6 text-claude-terracotta" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-ink dark:text-dark-text">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone dark:text-dark-muted">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
