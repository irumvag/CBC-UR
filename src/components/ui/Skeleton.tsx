import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-pampas-warm dark:bg-dark-card',
        className
      )}
    />
  )
}

// Event Card Skeleton
export function EventCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border overflow-hidden">
      <div className="flex items-start p-5 pb-0">
        {/* Date badge */}
        <Skeleton className="w-[60px] h-[68px] rounded-xl" />
        <div className="ml-4 flex-1">
          {/* Badge */}
          <Skeleton className="w-20 h-5 rounded-full mb-2" />
          {/* Title */}
          <Skeleton className="w-3/4 h-6 mb-1" />
        </div>
      </div>
      <div className="p-5">
        {/* Description */}
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-2/3 h-4 mb-4" />
        {/* Time and location */}
        <div className="space-y-2 mb-4">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-40 h-4" />
        </div>
        {/* Button */}
        <div className="pt-4 border-t border-pampas dark:border-dark-border">
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-pampas-warm dark:border-dark-border overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-40 rounded-none" />
      <div className="p-5">
        {/* Category badge */}
        <Skeleton className="w-20 h-5 rounded-full mb-3" />
        {/* Title */}
        <Skeleton className="w-3/4 h-6 mb-2" />
        {/* Description */}
        <Skeleton className="w-full h-4 mb-1" />
        <Skeleton className="w-full h-4 mb-1" />
        <Skeleton className="w-1/2 h-4 mb-4" />
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
        {/* Team and links */}
        <div className="flex items-center justify-between pt-4 border-t border-pampas dark:border-dark-border">
          <div className="flex -space-x-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="w-5 h-5 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Benefits List Skeleton
export function BenefitsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-card border border-pampas-warm dark:border-dark-border"
        >
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="flex-1 h-5" />
        </div>
      ))}
    </div>
  )
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <div>
        <Skeleton className="w-20 h-4 mb-2" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <div>
        <Skeleton className="w-28 h-4 mb-2" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
      </div>
      <Skeleton className="w-full h-12 rounded-xl mt-6" />
    </div>
  )
}
