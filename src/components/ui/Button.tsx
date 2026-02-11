import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-sans font-semibold
      rounded-full
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-claude-terracotta focus:ring-offset-2 focus:ring-offset-surface
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:-translate-y-0.5
    `

    const variants = {
      primary: `
        bg-claude-terracotta-deep text-white
        hover:bg-claude-terracotta hover:shadow-lg hover:shadow-claude-terracotta/25
        active:translate-y-0
      `,
      secondary: `
        bg-transparent text-ink
        border-2 border-stone
        hover:border-claude-terracotta hover:text-claude-terracotta
      `,
      ghost: `
        bg-transparent text-stone
        hover:text-claude-terracotta hover:bg-claude-terracotta/5
      `,
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
