import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'terracotta' | 'sage' | 'teal' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-pampas-warm text-charcoal',
    terracotta: 'bg-claude-terracotta/10 text-claude-terracotta-deep',
    sage: 'bg-sage/10 text-sage',
    teal: 'bg-teal/10 text-teal',
    outline: 'bg-transparent border border-stone text-stone',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1',
        'text-sm font-medium font-sans',
        'rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
