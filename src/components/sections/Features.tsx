import {
  Users, Calendar, Presentation, Code, BookOpen, Star,
  Trophy, Flag, Award, Heart, Zap, Target, Globe, FolderKanban,
  Link2, Lightbulb, Rocket, Brain, LucideIcon
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useFeatures } from '@/hooks/useSiteContent'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'code': Code,
  'users': Users,
  'presentation': Presentation,
  'calendar': Calendar,
  'star': Star,
  'trophy': Trophy,
  'flag': Flag,
  'award': Award,
  'heart': Heart,
  'zap': Zap,
  'target': Target,
  'globe': Globe,
  'folder-kanban': FolderKanban,
  'handshake': Link2,
  'lightbulb': Lightbulb,
  'rocket': Rocket,
  'brain': Brain,
}

export function Features() {
  const { ref, isVisible } = useScrollReveal()
  const { t } = useTranslation()
  const { localizedFeatures, loading } = useFeatures()

  return (
    <section className="py-20 md:py-28 bg-surface dark:bg-dark-surface transition-colors">
      <div className="container-main">
        <SectionHeader
          eyebrow={t('home.features.tagline')}
          title={t('home.features.title')}
          subtitle={t('home.features.subtitle')}
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {localizedFeatures.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Star
              return (
                <div
                  key={feature.id}
                  className={cn(
                    'group p-6 md:p-8 rounded-2xl',
                    'bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border',
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
                  <h3 className="font-serif font-semibold text-ink dark:text-dark-text text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-stone dark:text-dark-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
