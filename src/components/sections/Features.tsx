import { Users, Calendar, Presentation, Table2, Code, Megaphone } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Users,
    title: 'CBC Meetings',
    description: 'Weekly gatherings to learn, collaborate, and build together with fellow AI enthusiasts.',
  },
  {
    icon: Code,
    title: 'Hackathons',
    description: 'Intensive building sprints culminating in our Week 10 grand finale showcase.',
  },
  {
    icon: Presentation,
    title: 'Mini Demos',
    description: 'Quick showcases of Claude capabilities and student projects to inspire and educate.',
  },
  {
    icon: Table2,
    title: 'Tabling Events',
    description: 'Campus presence to engage new members, answer questions, and share knowledge.',
  },
  {
    icon: Calendar,
    title: 'Workshops',
    description: 'Hands-on sessions covering everything from prompt engineering to full applications.',
  },
  {
    icon: Megaphone,
    title: 'Social Community',
    description: 'Active WhatsApp group and social media presence for ongoing connection and support.',
  },
]

export function Features() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container-main">
        <SectionHeader
          eyebrow="Program Deliverables"
          title="What We Do"
          subtitle="Our 10-week program includes diverse activities designed to build awareness, foster learning, and encourage hands-on experimentation with Claude AI."
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={cn(
                  'group p-6 md:p-8 rounded-2xl',
                  'bg-white border border-pampas-warm',
                  'transition-all duration-500 ease-out',
                  'hover:shadow-lg hover:-translate-y-1 hover:border-claude-terracotta-light',
                  'opacity-0 translate-y-4',
                  isVisible && 'opacity-100 translate-y-0'
                )}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                }}
              >
                <div className="w-14 h-14 rounded-2xl bg-claude-terracotta/10 flex items-center justify-center mb-5 group-hover:bg-claude-terracotta/20 transition-colors">
                  <Icon className="w-7 h-7 text-claude-terracotta" />
                </div>
                <h3 className="font-serif font-semibold text-ink text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
