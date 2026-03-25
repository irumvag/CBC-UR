import { useState } from 'react'
import { MapPin, Clock, CalendarPlus, Star } from 'lucide-react'
import { EventsSEO } from '@/components/SEO'
import { useEvents } from '@/hooks/useEvents'
import { SkeletonEventCard } from '@/components/ui/Skeleton'

type EventType = 'meetup' | 'hackathon' | 'workshop' | 'demo_day'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  end_date: string | null
  location: string | null
  event_type: EventType
  registration_url: string | null
}

const EVENT_TYPE_STYLES: Record<EventType, { bg: string; border: string; badge: string; label: string }> = {
  meetup: {
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    badge: 'bg-violet-600 text-white',
    label: 'General Meeting',
  },
  hackathon: {
    bg: 'bg-primary/5',
    border: 'border-primary',
    badge: 'bg-primary text-white',
    label: 'Hackathon',
  },
  workshop: {
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    badge: 'bg-sky-500 text-white',
    label: 'Workshop',
  },
  demo_day: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    badge: 'bg-emerald-600 text-white',
    label: 'Demo Day',
  },
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

function getAddToCalendarUrl(event: Event) {
  const startDate = new Date(event.date).toISOString().replace(/-|:|\.\d+/g, '')
  const endDate = event.end_date
    ? new Date(event.end_date).toISOString().replace(/-|:|\.\d+/g, '')
    : (() => {
        const d = new Date(event.date)
        d.setHours(d.getHours() + 2)
        return d.toISOString().replace(/-|:|\.\d+/g, '')
      })()

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || '',
    location: event.location || '',
  })

  return `https://calendar.google.com/calendar/render?${params}`
}

export default function Events() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const { events: fetchedEvents, loading, error, refetch } = useEvents()
  const events = fetchedEvents

  // Parse events into Date objects for calendar rendering
  const parsedEvents = events.map((e) => ({
    ...e,
    parsedDate: new Date(e.date),
  }))

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const eventsThisMonth = parsedEvents.filter(
    (event) =>
      event.parsedDate.getMonth() === currentMonth &&
      event.parsedDate.getFullYear() === currentYear
  )

  const upcomingEvents = parsedEvents
    .filter((event) => event.parsedDate >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }

    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
  }

  const getEventsForDay = (day: number) => {
    return eventsThisMonth.filter((event) => event.parsedDate.getDate() === day)
  }

  const activeEventTypes = [...new Set(events.map((event) => event.event_type).filter(Boolean))] as EventType[]

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const formatEndTime = (endDateStr?: string | null) => {
    if (!endDateStr) return null
    return new Date(endDateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <>
      <EventsSEO />

      {/* Page Hero */}
      <section className="border-b border-muted/20 bg-surface px-4 py-10 text-center sm:px-8 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Upcoming Events
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground/70 sm:mt-6 sm:text-base md:text-lg">
          Workshops, hackathons, and demos to help you build with Claude.
        </p>
      </section>

      {/* Calendar Section */}
      {error ? (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 lg:px-12">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            <p>Failed to load events.</p>
            <button
              onClick={refetch}
              className="mt-3 rounded-md bg-red-100 px-4 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
            >
              Try again
            </button>
          </div>
        </section>
      ) : loading ? (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 md:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SkeletonEventCard />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonEventCard key={i} />)}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 md:px-8 lg:px-12">
          {/* Event Type Legend */}
          {activeEventTypes.length > 0 && (
            <div className="mb-6 hidden flex-wrap items-center gap-4 sm:flex">
              <span className="text-sm font-medium text-foreground/60">Event Types:</span>
              {activeEventTypes.map((type) => {
                const styles = EVENT_TYPE_STYLES[type]
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${styles.badge.split(' ')[0]}`} />
                    <span className="text-sm text-foreground/70">{styles.label}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-3 lg:grid-rows-[auto_1fr]">
            {/* Next Event - Shows FIRST on mobile */}
            <div className="order-1 lg:order-2 lg:col-start-3 lg:row-start-1">
              {upcomingEvents.length > 0 && (() => {
                const nextEvent = upcomingEvents[0]
                const nextType = nextEvent.event_type || 'meetup'
                const nextStyles = EVENT_TYPE_STYLES[nextType]
                return (
                  <div className={`rounded-xl border-l-4 ${nextStyles.border} ${nextStyles.bg} p-4 shadow-sm sm:p-5`}>
                    <div className="mb-2 flex items-center justify-between sm:mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground/50 sm:text-xs">
                        Next Event
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase sm:px-2 sm:text-[10px] ${nextStyles.badge}`}>
                        {nextStyles.label}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground sm:text-lg">
                      {nextEvent.title}
                    </h3>
                    <div className="mt-2 space-y-1 text-xs text-foreground/70 sm:mt-3 sm:space-y-1.5 sm:text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarPlus className="h-3 w-3 shrink-0 text-foreground/40 sm:h-3.5 sm:w-3.5" />
                        <span>
                          {nextEvent.parsedDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 shrink-0 text-foreground/40 sm:h-3.5 sm:w-3.5" />
                        <span>
                          {formatTime(nextEvent.date)}
                          {nextEvent.end_date && ` - ${formatEndTime(nextEvent.end_date)}`}
                        </span>
                      </div>
                      {nextEvent.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 shrink-0 text-foreground/40 sm:h-3.5 sm:w-3.5" />
                          <span>{nextEvent.location}</span>
                        </div>
                      )}
                    </div>
                    {nextEvent.description && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-foreground/70 sm:mt-3 sm:line-clamp-none sm:text-sm">
                        {nextEvent.description}
                      </p>
                    )}
                    <a
                      href={getAddToCalendarUrl(nextEvent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-3 inline-flex items-center gap-2 rounded-md ${nextStyles.badge} px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90 sm:mt-4 sm:px-4 sm:py-2 sm:text-sm`}
                    >
                      <CalendarPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Add to Calendar
                    </a>
                  </div>
                )
              })()}

              {upcomingEvents.length === 0 && (
                <div className="rounded-xl border border-muted/30 bg-surface p-6 text-center shadow-sm">
                  <p className="text-sm text-foreground/60">
                    No upcoming events scheduled. Check back soon!
                  </p>
                </div>
              )}
            </div>

            {/* Calendar Grid */}
            <div className="order-2 lg:order-1 lg:col-span-2 lg:row-span-2">
              <div className="rounded-xl border border-muted/30 bg-surface p-3 shadow-sm sm:p-5 md:p-8">
                {/* Month Navigation */}
                <div className="mb-4 flex items-center justify-between sm:mb-8">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="rounded-md px-2 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-cream hover:text-foreground sm:px-3 sm:py-2 sm:text-sm"
                  >
                    &larr; Prev
                  </button>
                  <h2 className="text-lg font-bold text-foreground sm:text-2xl md:text-3xl">
                    {MONTHS[currentMonth]} {currentYear}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="rounded-md px-2 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-cream hover:text-foreground sm:px-3 sm:py-2 sm:text-sm"
                  >
                    Next &rarr;
                  </button>
                </div>

                {/* Day Headers */}
                <div className="mb-2 grid grid-cols-7 gap-1 sm:mb-3 sm:gap-2">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-foreground/50 sm:py-2 sm:text-xs md:text-sm"
                    >
                      <span className="sm:hidden">{day.charAt(0)}</span>
                      <span className="hidden sm:inline">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Empty cells */}
                  {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-12 sm:h-20 md:h-28 lg:h-32" />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const dayDate = new Date(currentYear, currentMonth, day)
                    const dayEvents = getEventsForDay(day)
                    const isCurrentDay = isToday(dayDate)
                    const hasHackathon = dayEvents.some((e) => e.event_type === 'hackathon')
                    const isDayPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0))

                    return (
                      <div
                        key={day}
                        className={`relative h-12 rounded-md border p-1 transition-colors sm:h-20 sm:rounded-lg sm:p-1.5 md:h-28 md:p-2 lg:h-32 ${
                          hasHackathon
                            ? 'border-primary bg-gradient-to-br from-primary/5 to-amber-50'
                            : isCurrentDay
                              ? 'border-primary/50 bg-primary/5'
                              : 'border-transparent hover:border-muted/30 hover:bg-cream/50'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-medium sm:text-xs md:text-sm ${
                            isCurrentDay ? 'font-bold text-primary' : isDayPast ? 'text-foreground/30' : 'text-foreground/70'
                          }`}
                        >
                          {day}
                        </span>

                        <div className="mt-0.5 flex flex-col gap-0.5 sm:mt-1">
                          {/* Mobile: dots */}
                          <div className="flex flex-wrap gap-1 sm:hidden">
                            {dayEvents.slice(0, 3).map((event) => {
                              const type = event.event_type || 'meetup'
                              const styles = EVENT_TYPE_STYLES[type]
                              return (
                                <button
                                  key={event.id}
                                  onClick={() => setSelectedEvent(event)}
                                  className={`h-2 w-2 rounded-full ${styles.badge.split(' ')[0]}`}
                                  aria-label={event.title}
                                />
                              )
                            })}
                            {dayEvents.length > 3 && (
                              <span className="text-[8px] text-foreground/50">
                                +{dayEvents.length - 3}
                              </span>
                            )}
                          </div>
                          {/* Desktop: full titles */}
                          <div className="hidden sm:flex sm:flex-col sm:gap-0.5">
                            {dayEvents.slice(0, 2).map((event) => {
                              const type = event.event_type || 'meetup'
                              const styles = EVENT_TYPE_STYLES[type]
                              return (
                                <button
                                  key={event.id}
                                  onClick={() => setSelectedEvent(event)}
                                  className={`w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium transition-all md:text-xs ${styles.bg} ${styles.border} border hover:opacity-80`}
                                >
                                  {event.event_type === 'hackathon' && (
                                    <Star className="mr-0.5 inline h-2 w-2 text-primary" />
                                  )}
                                  {event.title}
                                </button>
                              )
                            })}
                            {dayEvents.length > 2 && (
                              <span className="text-[10px] text-foreground/50">
                                +{dayEvents.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* All Events sidebar */}
            {upcomingEvents.length > 1 && (
              <div className="order-3 lg:order-3 lg:col-start-3 lg:row-start-2">
                <div className="flex max-h-[280px] flex-col rounded-xl border border-muted/30 bg-surface shadow-sm sm:max-h-[350px] lg:max-h-none lg:h-full">
                  <h3 className="shrink-0 border-b border-muted/20 px-4 py-3 text-sm font-bold text-foreground sm:px-5 sm:py-4 sm:text-base">
                    All Events ({upcomingEvents.length})
                  </h3>
                  <div className="flex flex-col overflow-y-auto lg:max-h-[400px]">
                    {upcomingEvents.slice(1).map((event) => {
                      const type = event.event_type || 'meetup'
                      const styles = EVENT_TYPE_STYLES[type]
                      return (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="flex items-start gap-2 border-b border-muted/10 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-cream/50 sm:gap-3 sm:px-5 sm:py-4"
                        >
                          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full sm:mt-1.5 sm:h-2.5 sm:w-2.5 ${styles.badge.split(' ')[0]}`} />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-semibold text-foreground sm:text-base">
                              {event.title}
                            </span>
                            <div className="mt-0.5 text-[11px] text-foreground/60 sm:mt-1 sm:text-xs">
                              {event.parsedDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              &middot; {formatTime(event.date)}
                            </div>
                            {event.location && (
                              <div className="mt-0.5 text-[11px] text-primary/70 sm:text-xs">
                                {event.location}
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (() => {
        const selType = selectedEvent.event_type || 'meetup'
        const selStyles = EVENT_TYPE_STYLES[selType]
        const eventIsPast = isPast(selectedEvent.date)
        return (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 animate-fade-in sm:items-center sm:p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-xl animate-slide-up sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted/40 sm:hidden" />

              <div className="mb-3 flex items-start justify-between sm:mb-4">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {eventIsPast && (
                    <span className="rounded-full bg-muted/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/50 sm:py-1 sm:text-xs">
                      Past Event
                    </span>
                  )}
                  {selectedEvent.event_type === 'hackathon' && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary sm:py-1 sm:text-xs">
                      <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Featured
                    </span>
                  )}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase sm:px-2 sm:py-1 sm:text-xs ${selStyles.badge}`}>
                    {selStyles.label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-full p-1 text-foreground/50 transition-colors hover:bg-muted/20 hover:text-foreground"
                >
                  &#10005;
                </button>
              </div>

              <h2 className={`text-xl font-bold sm:text-2xl ${selectedEvent.event_type === 'hackathon' ? 'text-primary' : 'text-foreground'}`}>
                {selectedEvent.title}
              </h2>

              <div className="mt-3 space-y-1.5 text-sm text-foreground/70 sm:mt-4 sm:space-y-2">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                  <span>
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })} &middot; {formatTime(selectedEvent.date)}
                    {selectedEvent.end_date && ` - ${formatEndTime(selectedEvent.end_date)}`}
                  </span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80 sm:mt-4 sm:text-base">
                  {selectedEvent.description}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {!eventIsPast && selectedEvent.registration_url && (
                  <a
                    href={selectedEvent.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                  >
                    Register Now
                  </a>
                )}
                {!eventIsPast ? (
                  <a
                    href={getAddToCalendarUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    Add to Calendar
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-md border border-muted/20 bg-muted/10 px-5 py-2.5 text-sm font-medium text-foreground/40 cursor-not-allowed">
                    <CalendarPlus className="h-4 w-4" />
                    Event Ended
                  </span>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="inline-flex items-center justify-center rounded-md border border-muted/30 px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
