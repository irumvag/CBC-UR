import { useState } from 'react'
import { MapPin, Clock, Users, Code, Presentation, Megaphone, Loader2, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useEvents } from '@/hooks/useEvents'
import { EventsSEO } from '@/components/SEO'
import { cn } from '@/lib/utils'
import type { EventType } from '@/types/database'

type FilterType = 'upcoming' | 'past' | 'all'

const typeColors: Record<EventType, string> = {
  workshop: 'bg-sky-50 text-sky-600 border-sky-300',
  hackathon: 'bg-claude-terracotta-deep/5 text-claude-terracotta-deep border-claude-terracotta-deep',
  meetup: 'bg-violet-50 text-violet-600 border-violet-300',
  demo_day: 'bg-emerald-50 text-emerald-600 border-emerald-300',
}

const typeLabels: Record<EventType, string> = {
  workshop: 'Workshop',
  hackathon: 'Hackathon',
  meetup: 'General Meeting',
  demo_day: 'Demo Day',
}

const typeIcons: Record<EventType, typeof Users> = {
  workshop: Presentation,
  hackathon: Code,
  meetup: Users,
  demo_day: Megaphone,
}

export default function Events() {
  const [filter, setFilter] = useState<FilterType>('upcoming')

  const { events, isLoading, error } = useEvents(filter === 'all' ? undefined : filter)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate)
    const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    if (endDate) {
      const end = new Date(endDate)
      const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      return `${startTime} - ${endTime}`
    }
    return startTime
  }

  const isPastEvent = (dateStr: string) => new Date(dateStr) < new Date()

  return (
    <>
      <EventsSEO />

      {/* Page Hero */}
      <section className="border-b border-cloudy/20 bg-white px-4 py-10 text-center sm:px-8 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
          Upcoming Events
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-stone sm:mt-6 sm:text-base md:text-lg">
          Workshops, hackathons, and demos to help you build with Claude.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="bg-pampas px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
              {(['upcoming', 'past', 'all'] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-all',
                    filter === tab
                      ? 'bg-claude-terracotta-deep text-white shadow-sm'
                      : 'text-stone hover:text-ink'
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-claude-terracotta-deep" />
          <p className="mt-4 text-stone">Loading events...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && events.length === 0 && (
        <div className="mx-auto max-w-2xl px-8 py-12">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
            <h3 className="mt-3 font-semibold text-ink">Unable to load events</h3>
            <p className="mt-2 text-sm text-stone">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-claude-terracotta-deep px-4 py-2 text-sm font-medium text-white hover:bg-claude-terracotta"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
          {events.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const eventType = event.event_type || 'meetup'
                const TypeIcon = typeIcons[eventType]
                const isPast = isPastEvent(event.date)

                return (
                  <div
                    key={event.id}
                    className={cn(
                      'rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md sm:p-6',
                      isPast
                        ? 'border-cloudy/20 opacity-70'
                        : 'border-l-4 ' + typeColors[eventType].split(' ')[2]
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className={typeColors[eventType]}>
                        <TypeIcon size={12} className="mr-1" />
                        {typeLabels[eventType]}
                      </Badge>
                      {isPast && (
                        <span className="text-[10px] font-medium uppercase text-stone">Past</span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-ink sm:text-lg">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-stone sm:text-sm">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-3 space-y-1.5 text-xs text-stone sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 shrink-0 text-stone/40 sm:h-3.5 sm:w-3.5" />
                        <span>{formatDate(event.date)} · {formatTime(event.date, event.end_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 shrink-0 text-stone/40 sm:h-3.5 sm:w-3.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-cloudy/20 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-stone">
                No events found. Check back soon!
              </p>
            </div>
          )}
        </section>
      )}
    </>
  )
}
