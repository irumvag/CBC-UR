import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/30',
        className
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
      <Skeleton className="mb-4 h-12 w-12 rounded-full" />
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="mb-1 h-4 w-1/3" />
      <Skeleton className="mt-3 h-16 w-full" />
    </div>
  )
}

export function SkeletonTeamCard() {
  return (
    <div className="rounded-xl border border-muted/20 bg-surface p-6 text-center shadow-sm">
      <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
      <Skeleton className="mx-auto mb-2 h-5 w-36" />
      <Skeleton className="mx-auto mb-3 h-4 w-24" />
      <Skeleton className="mx-auto h-12 w-full" />
    </div>
  )
}

export function SkeletonEventCard() {
  return (
    <div className="rounded-xl border-l-4 border-muted/30 bg-surface p-5 shadow-sm">
      <Skeleton className="mb-3 h-4 w-20" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="mb-1 h-4 w-1/2" />
      <Skeleton className="mb-1 h-4 w-2/3" />
    </div>
  )
}

export function SkeletonProjectCard() {
  return (
    <div className="rounded-xl border border-muted/20 bg-surface shadow-sm overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="mb-2 h-6 w-2/3" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
