import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Layers, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

const pillars = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Master AI fundamentals through hands-on workshops and peer collaboration.',
    color: 'bg-claude-terracotta',
    bgColor: 'bg-claude-terracotta/10',
  },
  {
    icon: Layers,
    title: 'Build',
    description: 'Create real projects that solve problems for Rwandan communities.',
    color: 'bg-sage',
    bgColor: 'bg-sage/10',
  },
  {
    icon: Users,
    title: 'Connect',
    description: 'Join a network of builders, mentors, and industry professionals.',
    color: 'bg-teal',
    bgColor: 'bg-teal/10',
  },
  {
    icon: Globe,
    title: 'Impact',
    description: 'Apply AI to address local challenges with global perspective.',
    color: 'bg-stone',
    bgColor: 'bg-stone/10',
  },
]

export function About() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-20 md:py-28 bg-pampas">
      <div className="container-main">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left: Content */}
          <div
            className={cn(
              'opacity-0 translate-y-6 transition-all duration-700',
              isVisible && 'opacity-100 translate-y-0'
            )}
          >
            <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-4">
              About CBC-UR
            </p>
            <h2 className="font-serif font-semibold text-ink text-3xl md:text-4xl lg:text-[2.75rem] leading-tight mb-6">
              Where Rwandan students meet world-class AI
            </h2>
            <div className="space-y-4 text-stone text-base md:text-lg leading-relaxed">
              <p>
                The Claude Builder Club at University of Rwanda is a student-led community
                dedicated to making AI accessible to everyone. We believe the best way to
                learn is by building — and that anyone can be a builder, regardless of
                their technical background.
              </p>
              <p>
                Over 10 weeks starting February 9, 2026, we'll guide you through
                hands-on workshops, collaborative projects, and a final hackathon
                where you'll showcase what you've built. Whether you're studying
                computer science, business, agriculture, or arts — there's a place
                for you here.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/about">
                <Button variant="secondary">
                  Our Story
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: 2x2 Offset Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon
                // Offset: 2nd card (index 1) pushed down, 3rd card (index 2) pulled up
                const offsetClass =
                  index === 1
                    ? 'mt-8 md:mt-12'
                    : index === 2
                    ? '-mt-8 md:-mt-12'
                    : ''

                return (
                  <div
                    key={pillar.title}
                    className={cn(
                      'group p-5 md:p-6 rounded-2xl',
                      'bg-white border border-pampas-warm',
                      'transition-all duration-500 ease-out',
                      'hover:shadow-lg hover:-translate-y-1',
                      'opacity-0 translate-y-4',
                      isVisible && 'opacity-100 translate-y-0',
                      offsetClass
                    )}
                    style={{
                      transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms',
                    }}
                  >
                    <div
                      className={cn(
                        'w-11 h-11 rounded-full flex items-center justify-center mb-4',
                        pillar.color
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-serif font-semibold text-ink text-lg mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-stone text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-claude-terracotta/5 rounded-full -z-10" />
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-sage/5 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
