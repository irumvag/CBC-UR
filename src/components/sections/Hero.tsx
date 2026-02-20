import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Typing animation hook
function useTypingAnimation(text: string, delay: number = 2000, speed: number = 50) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true)
      let index = 0
      const typeTimer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          index++
        } else {
          clearInterval(typeTimer)
          setIsTyping(false)
        }
      }, speed)

      return () => clearInterval(typeTimer)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [text, delay, speed])

  return { displayText, isTyping, isComplete: displayText === text }
}

// Claude starburst icon component
function ClaudeStarburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} fill="none">
      <circle cx="18" cy="6" r="2.5" fill="currentColor" />
      <circle cx="26.5" cy="9.5" r="2.5" fill="currentColor" />
      <circle cx="30" cy="18" r="2.5" fill="currentColor" />
      <circle cx="26.5" cy="26.5" r="2.5" fill="currentColor" />
      <circle cx="18" cy="30" r="2.5" fill="currentColor" />
      <circle cx="9.5" cy="26.5" r="2.5" fill="currentColor" />
      <circle cx="6" cy="18" r="2.5" fill="currentColor" />
      <circle cx="9.5" cy="9.5" r="2.5" fill="currentColor" />
      <circle cx="18" cy="18" r="3.5" fill="currentColor" />
    </svg>
  )
}

export function Hero() {
  const { t } = useTranslation()
  const { displayText, isComplete } = useTypingAnimation(
    "Let's create something remarkable together",
    3000,
    40
  )

  return (
    <section className="relative overflow-hidden bg-pampas dark:bg-dark-bg min-h-[calc(100vh-5rem)] transition-colors">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-claude-terracotta/5 dark:bg-claude-terracotta/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-sage/5 dark:bg-sage/10 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side: Content */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8',
                  'bg-claude-terracotta/10 border border-claude-terracotta/20',
                  'opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-claude-terracotta font-medium text-sm">
                  {t('home.hero.tagline')}
                </span>
              </div>

              {/* Title */}
              <h1
                className={cn(
                  'font-serif font-semibold text-ink dark:text-dark-text mb-6',
                  'text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1]',
                  'opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
              >
                {t('home.hero.title')}
              </h1>

              {/* Subtitle */}
              <p
                className={cn(
                  'text-stone dark:text-dark-muted text-lg md:text-xl leading-relaxed mb-8 max-w-xl',
                  'opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                {t('home.hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div
                className={cn(
                  'flex flex-col sm:flex-row items-start sm:items-center gap-4',
                  'opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
              >
                <Link to="/join">
                  <Button variant="primary" size="lg">
                    {t('home.hero.cta')}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="secondary" size="lg">
                    {t('home.hero.secondaryCta')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side: Claude card */}
            <div className="order-1 lg:order-2 relative">
              {/* Main card */}
              <div
                className={cn(
                  'relative bg-white dark:bg-dark-card rounded-3xl shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden',
                  'opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                {/* Terracotta gradient bar */}
                <div className="h-1 bg-gradient-to-r from-claude-terracotta via-claude-terracotta-light to-claude-terracotta" />

                <div className="p-6 md:p-8">
                  {/* Avatar and name */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-claude-terracotta to-claude-terracotta-deep flex items-center justify-center">
                      <ClaudeStarburst className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-ink dark:text-dark-text text-lg">Claude</h3>
                      <p className="text-stone dark:text-dark-muted text-sm">AI Assistant by Anthropic</p>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="space-y-4">
                    <p className="text-charcoal dark:text-dark-text leading-relaxed">
                      Welcome to CBC-UR! I'm here to help you learn AI development,
                      build meaningful projects, and prepare for the future of technology.
                    </p>

                    {/* Typing animation line */}
                    <p className="text-claude-terracotta-deep dark:text-claude-terracotta font-medium">
                      {displayText}
                      {!isComplete && <span className="typing-cursor" />}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badges - hidden on mobile */}
              <div
                className={cn(
                  'absolute -top-4 -left-4 md:-left-8',
                  'hidden md:flex items-center gap-2 px-4 py-2.5',
                  'bg-white dark:bg-dark-card rounded-full shadow-lg shadow-ink/10 dark:shadow-black/20',
                  'float opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
              >
                <Star className="w-4 h-4 text-claude-terracotta fill-claude-terracotta" />
                <span className="text-sm font-semibold text-ink dark:text-dark-text">100+ {t('home.stats.members')}</span>
              </div>

              <div
                className={cn(
                  'absolute -bottom-4 -right-4 md:-right-8',
                  'hidden md:flex items-center gap-2 px-4 py-2.5',
                  'bg-white dark:bg-dark-card rounded-full shadow-lg shadow-ink/10 dark:shadow-black/20',
                  'float-delayed opacity-0 animate-fade-in'
                )}
                style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
              >
                <Activity className="w-4 h-4 text-sage" />
                <span className="text-sm font-semibold text-ink dark:text-dark-text">{t('home.stats.projects')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
