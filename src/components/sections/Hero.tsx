import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-pampas">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 bg-claude-terracotta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative">
        <div className="py-20 md:py-28 lg:py-36 max-w-4xl mx-auto text-center">
          {/* Eyebrow Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="terracotta" className="gap-2">
              <Sparkles size={14} />
              Program starts February 9, 2026
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif font-semibold text-ink mb-6 animate-fade-in">
            Build the Future
            <span className="block text-claude-terracotta">with Claude AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in animate-delay-100">
            Join the Claude Builder Club at University of Rwanda. Learn to create
            real-world AI solutions through hands-on workshops, collaborative projects,
            and a supportive community of curious minds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-200">
            <Link to="/join">
              <Button variant="primary" size="lg">
                Join the Club
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 pt-12 border-t border-pampas-warm flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in animate-delay-300">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-ink">10</p>
              <p className="text-stone text-sm mt-1">Week Program</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-ink">5+</p>
              <p className="text-stone text-sm mt-1">CBC Meetings</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-ink">1</p>
              <p className="text-stone text-sm mt-1">Major Hackathon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
