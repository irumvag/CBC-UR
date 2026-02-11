import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

const stats = [
  { value: '100+', label: 'Active Members' },
  { value: '25+', label: 'Projects Built' },
  { value: '12', label: 'Workshops' },
  { value: '5', label: 'Hackathons' },
]

export function Stats() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="container-main">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'group text-center p-6 md:p-8 rounded-2xl',
                'bg-white border border-pampas-warm',
                'transition-all duration-300 ease-out',
                'hover:shadow-lg hover:-translate-y-1 hover:border-claude-terracotta-light',
                'opacity-0 translate-y-4',
                isVisible && 'opacity-100 translate-y-0'
              )}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <p className="font-serif text-4xl md:text-5xl font-semibold text-claude-terracotta-deep mb-2 group-hover:text-claude-terracotta transition-colors">
                {stat.value}
              </p>
              <p className="font-sans text-stone text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
