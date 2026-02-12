import { cn } from '@/lib/utils'

interface PageLoaderProps {
  className?: string
}

export function PageLoader({ className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'min-h-[60vh] flex flex-col items-center justify-center',
        className
      )}
    >
      {/* Claude Starburst Loader */}
      <div className="relative w-16 h-16">
        {/* Outer ring pulse */}
        <div className="absolute inset-0 rounded-full border-2 border-claude-terracotta/20 animate-ping" />

        {/* Inner spinning starburst */}
        <div className="absolute inset-2 flex items-center justify-center">
          <svg
            viewBox="0 0 32 32"
            className="w-10 h-10 loading-spinner"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Starburst rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
              <rect
                key={rotation}
                x="15"
                y="2"
                width="2"
                height="8"
                rx="1"
                fill="#da7756"
                style={{
                  transformOrigin: '16px 16px',
                  transform: `rotate(${rotation}deg)`,
                  opacity: 0.2 + (index * 0.1),
                }}
              />
            ))}
            {/* Center circle */}
            <circle cx="16" cy="16" r="4" fill="#da7756" />
          </svg>
        </div>
      </div>

      <p className="mt-4 text-stone dark:text-dark-muted text-sm font-medium animate-pulse">
        Loading...
      </p>
    </div>
  )
}

// Full page loader for Suspense fallback
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-surface dark:bg-dark-bg z-50 flex items-center justify-center transition-colors">
      <PageLoader />
    </div>
  )
}

// Route transition loader
export function RouteLoader() {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark-bg transition-colors">
      <PageLoader className="min-h-screen" />
    </div>
  )
}
