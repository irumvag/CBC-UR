import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useSiteStats } from '@/hooks/useSiteContent'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export function Stats() {
  const { ref, isVisible } = useScrollReveal()
  const { localizedStats, loading } = useSiteStats()

  return (
    <section className="py-16 md:py-20 bg-pampas dark:bg-dark-surface transition-colors">
      <div className="container-main">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div
            ref={ref}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {localizedStats.map((stat, index) => (
              <div
                key={stat.id}
                className={cn(
                  'group text-center p-6 md:p-8 rounded-2xl',
                  'bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border',
                  'transition-all duration-300 ease-out',
                  'hover:shadow-lg hover:-translate-y-1 hover:border-claude-terracotta-light dark:hover:border-claude-terracotta',
                  'opacity-0 translate-y-4',
                  isVisible && 'opacity-100 translate-y-0'
                )}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                }}
              >
                <p className="font-serif text-4xl md:text-5xl font-semibold text-claude-terracotta-deep dark:text-claude-terracotta mb-2 group-hover:text-claude-terracotta dark:group-hover:text-claude-terracotta-light transition-colors">
                  {stat.value}+
                </p>
                <p className="font-sans text-stone dark:text-dark-muted text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
