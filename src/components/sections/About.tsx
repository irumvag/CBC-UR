import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function About() {
  return (
    <section className="section-padding bg-pampas">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <p className="text-claude-terracotta font-sans font-semibold text-sm uppercase tracking-wider mb-3">
              About the Club
            </p>
            <h2 className="font-serif font-semibold text-ink mb-6">
              Where Curiosity Meets Creation
            </h2>
            <div className="space-y-4 text-stone leading-relaxed">
              <p>
                The Claude Builder Club at University of Rwanda is a student-led community
                dedicated to making AI accessible to everyone. We believe the best way to
                learn is by building — and that everyone can be a builder.
              </p>
              <p>
                Over 10 weeks starting February 9, 2026, we'll guide you through the
                Know → Learn → Try journey, from understanding what Claude can do to
                building your own AI-powered projects.
              </p>
              <p>
                Whether you're studying computer science, business, agriculture, or arts —
                if you're curious about AI, there's a place for you here.
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

          {/* Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-pampas-warm">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-claude-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-ink mb-1">Know</h4>
                    <p className="text-stone text-sm">Discover what Claude AI can do and how it's changing the world.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-ink mb-1">Learn</h4>
                    <p className="text-stone text-sm">Develop skills through workshops, tutorials, and peer collaboration.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-ink mb-1">Try</h4>
                    <p className="text-stone text-sm">Build real projects and showcase your work at our hackathon.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-claude-terracotta/5 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
