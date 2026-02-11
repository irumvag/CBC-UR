import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-claude-terracotta rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal rounded-full blur-3xl" />
      </div>

      <div className="container-main relative">
        <div className="py-20 md:py-28 lg:py-32 max-w-3xl mx-auto text-center">
          <h2 className="font-serif font-semibold text-white text-3xl md:text-4xl lg:text-5xl mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-cloudy text-lg md:text-xl leading-relaxed mb-10">
            Join a community of curious minds at University of Rwanda. Learn to build
            with Claude AI, create real-world projects, and shape the future together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <Link to="/events">
              <Button
                variant="ghost"
                size="lg"
                className="text-pampas hover:text-white hover:bg-white/10"
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
