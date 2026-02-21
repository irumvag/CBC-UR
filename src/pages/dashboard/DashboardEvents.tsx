import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useUserEvents } from '@/hooks/useUserEvents'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

type FilterType = 'upcoming' | 'past'

export default function DashboardEvents() {
  const [filter, setFilter] = useState<FilterType>('upcoming')
  const { events, isLoading } = useUserEvents(filter)

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif font-semibold text-2xl md:text-3xl text-ink dark:text-dark-text mb-1">
              My Events
            </h1>
            <p className="text-stone dark:text-dark-muted">
              Events you've registered for
            </p>
          </div>

          <Link to="/events">
            <Button variant="secondary" size="sm">
              <ExternalLink size={16} className="mr-2" />
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('upcoming')}
            className={cn(
              'px-4 py-2 rounded-full font-medium text-sm transition-colors',
              filter === 'upcoming'
                ? 'bg-claude-terracotta text-white'
                : 'bg-white dark:bg-dark-surface border border-pampas-warm dark:border-dark-border text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={cn(
              'px-4 py-2 rounded-full font-medium text-sm transition-colors',
              filter === 'past'
                ? 'bg-claude-terracotta text-white'
                : 'bg-white dark:bg-dark-surface border border-pampas-warm dark:border-dark-border text-stone dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'
            )}
          >
            Past
          </button>
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((item) => {
              const { full, time } = formatEventDate(item.event.date)
              const isPast = new Date(item.event.date) < new Date()

              return (
                <div
                  key={item.id}
                  className={cn(
                    'bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border p-4 md:p-5',
                    isPast && 'opacity-75'
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-claude-terracotta/10 flex flex-col items-center justify-center">
                      <span className="text-xl font-semibold text-claude-terracotta">
                        {new Date(item.event.date).getDate()}
                      </span>
                      <span className="text-xs text-claude-terracotta uppercase">
                        {new Date(item.event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-ink dark:text-dark-text text-lg">{item.event.title}</h3>
                        <span
                          className={cn(
                            'flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                            item.status === 'attended'
                              ? 'bg-sage/10 text-sage'
                              : item.status === 'cancelled'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-claude-terracotta/10 text-claude-terracotta'
                          )}
                        >
                          {item.status === 'attended' ? (
                            <>
                              <CheckCircle size={12} />
                              Attended
                            </>
                          ) : item.status === 'cancelled' ? (
                            <>
                              <XCircle size={12} />
                              Cancelled
                            </>
                          ) : (
                            <>
                              <Calendar size={12} />
                              Registered
                            </>
                          )}
                        </span>
                      </div>

                      {item.event.description && (
                        <p className="text-stone dark:text-dark-muted text-sm mt-1 line-clamp-2">
                          {item.event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-stone dark:text-dark-muted">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {full} at {time}
                        </span>
                        {item.event.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {item.event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-pampas-warm dark:bg-dark-surface flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-stone dark:text-dark-muted" />
            </div>
            <h3 className="font-serif font-semibold text-xl text-ink dark:text-dark-text mb-2">
              {filter === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </h3>
            <p className="text-stone dark:text-dark-muted mb-6">
              {filter === 'upcoming'
                ? "You haven't registered for any upcoming events yet."
                : "You don't have any past events in your history."}
            </p>
            <Link to="/events">
              <Button variant="primary">
                Browse Events
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
