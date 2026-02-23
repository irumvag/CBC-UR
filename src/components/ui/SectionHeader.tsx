import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 md:mb-16',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="text-claude-terracotta font-sans font-semibold text-sm uppercase tracking-wider mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif font-semibold text-ink dark:text-dark-text mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone dark:text-dark-muted text-lg md:text-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
