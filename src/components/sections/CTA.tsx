import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

export function CTA() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-claude-terracotta/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] bg-sage/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal/5 rounded-full blur-[120px]" />
      </div>

      <div className="container-main relative">
        <div
          ref={ref}
          className="py-20 md:py-28 lg:py-32 max-w-3xl mx-auto text-center"
        >
          <h2
            className={cn(
              'font-serif font-semibold text-white',
              'text-3xl md:text-4xl lg:text-5xl leading-tight mb-6',
              'opacity-0 translate-y-6 transition-all duration-700',
              isVisible && 'opacity-100 translate-y-0'
            )}
          >
            Ready to start building?
          </h2>
          <p
            className={cn(
              'text-cloudy text-lg md:text-xl leading-relaxed mb-10',
              'opacity-0 translate-y-6 transition-all duration-700 delay-100',
              isVisible && 'opacity-100 translate-y-0'
            )}
          >
            Join a community of curious minds at University of Rwanda. Learn to build
            with Claude AI, create real-world projects, and shape the future together.
          </p>
          <div
            className={cn(
              'flex flex-col sm:flex-row items-center justify-center gap-4',
              'opacity-0 translate-y-6 transition-all duration-700 delay-200',
              isVisible && 'opacity-100 translate-y-0'
            )}
          >
            <Link to="/join">
              <Button
                variant="primary"
                size="lg"
                className="bg-claude-terracotta hover:bg-claude-terracotta-light"
              >
                Join the Club
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/join">
              <Button
                variant="ghost"
                size="lg"
                className="text-pampas border border-pampas/30 hover:text-white hover:border-pampas/60 hover:bg-white/5"
              >
                View Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
