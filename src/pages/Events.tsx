import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, Code, Presentation, Megaphone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EventCardSkeleton } from '@/components/ui/Skeleton'
import { useEvents } from '@/hooks/useEvents'
import { useSubscribe } from '@/hooks/useSubscribe'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import type { EventType } from '@/types/database'

type FilterType = 'upcoming' | 'past' | 'all'

const typeColors: Record<EventType, string> = {
  workshop: 'bg-claude-terracotta/10 text-claude-terracotta',
  hackathon: 'bg-sage/10 text-sage',
  meetup: 'bg-teal/10 text-teal',
  demo_day: 'bg-stone/10 text-stone',
}

const typeLabels: Record<EventType, string> = {
  workshop: 'Workshop',
  hackathon: 'Hackathon',
  meetup: 'Meetup',
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
  const [email, setEmail] = useState('')

  const { events, isLoading, error } = useEvents(filter === 'all' ? undefined : filter)
  const { subscribe, isLoading: isSubscribing } = useSubscribe()
  const { showToast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const result = await subscribe(email)
    if (result.success) {
      showToast("You're subscribed! We'll keep you updated.", 'success')
      setEmail('')
    } else {
      showToast(result.error || 'Failed to subscribe', 'error')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('en-US', { month: 'short' }),
    }
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
      {/* Page Header */}
      <section className="bg-pampas-warm py-16 md:py-20">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Events</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-3">
              Events & Workshops
            </p>
            <h1 className="font-serif font-semibold text-ink text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              Learn, Build, and Connect
            </h1>
            <p className="text-stone text-lg md:text-xl leading-relaxed">
              Join our workshops, meetups, and hackathons. From beginner-friendly introductions to advanced
              build sessions — there's something for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Events Grid */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="container-main">
          {/* Filter Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-pampas rounded-full p-1">
              {(['upcoming', 'past', 'all'] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-all',
                    filter === tab
                      ? 'bg-claude-terracotta text-white shadow-sm'
                      : 'text-stone hover:text-ink'
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8 text-stone">
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const { day, month } = formatDate(event.date)
                const eventType = event.event_type || 'meetup'
                const TypeIcon = typeIcons[eventType]
                const isPast = isPastEvent(event.date)

                return (
                  <div
                    key={event.id}
                    className={cn(
                      'bg-white rounded-2xl border border-pampas-warm overflow-hidden',
                      'transition-all duration-300 ease-out',
                      'hover:shadow-lg hover:-translate-y-1',
                      isPast && 'opacity-75'
                    )}
                  >
                    {/* Date Badge */}
                    <div className="flex items-start p-5 pb-0">
                      <div className="bg-claude-terracotta text-white rounded-xl p-3 text-center min-w-[60px]">
                        <span className="block text-2xl font-serif font-bold leading-none">{day}</span>
                        <span className="block text-xs font-medium uppercase mt-1">{month}</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <Badge className={typeColors[eventType]}>
                          <TypeIcon size={12} className="mr-1" />
                          {typeLabels[eventType]}
                        </Badge>
                        <h3 className="font-serif font-semibold text-ink text-lg mt-2 leading-tight">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-stone text-sm leading-relaxed mb-4">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-stone">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-claude-terracotta" />
                          <span>{formatTime(event.date, event.end_date)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-claude-terracotta" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-pampas">
                        <Button
                          variant={isPast ? 'secondary' : 'primary'}
                          size="sm"
                          className="w-full"
                          disabled={isPast}
                        >
                          {isPast ? 'Event Passed' : 'Register Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!isLoading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone text-lg">No events found for this filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 md:py-20 bg-pampas">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-claude-terracotta/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-claude-terracotta" />
            </div>
            <h2 className="font-serif font-semibold text-ink text-2xl md:text-3xl mb-4">
              Never Miss an Event
            </h2>
            <p className="text-stone mb-8">
              Subscribe to get notified about upcoming workshops, hackathons, and meetups.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={cn(
                  'flex-1 px-4 py-3 rounded-xl border border-pampas-warm',
                  'bg-white text-ink placeholder:text-stone',
                  'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                  'transition-all'
                )}
              />
              <Button type="submit" variant="primary" disabled={isSubscribing}>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
