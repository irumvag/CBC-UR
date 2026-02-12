import { Users, Calendar, Presentation, Table2, Code, Megaphone, LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

const featureIcons: LucideIcon[] = [Users, Code, Presentation, Table2, Calendar, Megaphone]
const featureKeys = ['learn', 'build', 'connect', 'showcase'] as const

export function Features() {
  const { ref, isVisible } = useScrollReveal()
  const { t } = useTranslation()

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container-main">
        <SectionHeader
          eyebrow={t('home.features.tagline')}
          title={t('home.features.title')}
          subtitle={t('home.features.subtitle')}
        />

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index]
            return (
              <div
                key={key}
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
                  {t(`home.features.${key}.title`)}
                </h3>
                <p className="text-stone text-sm leading-relaxed">
                  {t(`home.features.${key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
