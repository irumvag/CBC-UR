import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, Code, Presentation, Megaphone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

type EventType = 'Workshop' | 'Hackathon' | 'Meetup' | 'Demo Day'
type FilterType = 'upcoming' | 'past' | 'all'

interface Event {
  id: string
  title: string
  description: string
  date: string
  day: string
  month: string
  time: string
  location: string
  type: EventType
  isPast: boolean
}

const events: Event[] = [
  {
    id: '1',
    title: 'Introduction to Claude AI',
    description: 'Learn the fundamentals of Claude AI and discover what makes it unique. Perfect for beginners.',
    date: '2026-02-16',
    day: '16',
    month: 'Feb',
    time: '2:00 PM - 5:00 PM',
    location: 'CST Building, Room 201',
    type: 'Workshop',
    isPast: false,
  },
  {
    id: '2',
    title: 'Prompt Engineering Masterclass',
    description: 'Deep dive into advanced prompting techniques to get the best results from Claude.',
    date: '2026-02-23',
    day: '23',
    month: 'Feb',
    time: '2:00 PM - 5:00 PM',
    location: 'CST Building, Room 201',
    type: 'Workshop',
    isPast: false,
  },
  {
    id: '3',
    title: 'CBC Weekly Meetup #3',
    description: 'Join us for our weekly gathering to share progress, get feedback, and connect with fellow builders.',
    date: '2026-03-16',
    day: '16',
    month: 'Mar',
    time: '2:00 PM - 4:00 PM',
    location: 'CST Building, Room 201',
    type: 'Meetup',
    isPast: false,
  },
  {
    id: '4',
    title: 'Build for Rwanda Hackathon',
    description: 'Our flagship 24-hour hackathon where teams build AI solutions for real Rwandan challenges.',
    date: '2026-04-13',
    day: '13',
    month: 'Apr',
    time: '9:00 AM - 9:00 PM',
    location: 'University Main Hall',
    type: 'Hackathon',
    isPast: false,
  },
  {
    id: '5',
    title: 'Project Showcase Demo Day',
    description: 'Celebrate our achievements! Members present their AI projects to the university community.',
    date: '2026-04-20',
    day: '20',
    month: 'Apr',
    time: '3:00 PM - 6:00 PM',
    location: 'University Auditorium',
    type: 'Demo Day',
    isPast: false,
  },
  {
    id: '6',
    title: 'Club Kickoff Event',
    description: 'The official launch of Claude Builder Club with tabling and introductory demonstrations.',
    date: '2026-02-09',
    day: '09',
    month: 'Feb',
    time: '10:00 AM - 4:00 PM',
    location: 'Campus Main Square',
    type: 'Meetup',
    isPast: true,
  },
]

const typeColors: Record<EventType, string> = {
  Workshop: 'bg-claude-terracotta/10 text-claude-terracotta',
  Hackathon: 'bg-sage/10 text-sage',
  Meetup: 'bg-teal/10 text-teal',
  'Demo Day': 'bg-stone/10 text-stone',
}

const typeIcons: Record<EventType, typeof Calendar> = {
  Workshop: Presentation,
  Hackathon: Code,
  Meetup: Users,
  'Demo Day': Megaphone,
}

export default function Events() {
  const [filter, setFilter] = useState<FilterType>('upcoming')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { ref: eventsRef, isVisible: eventsVisible } = useScrollReveal()

  const filteredEvents = events.filter((event) => {
    if (filter === 'upcoming') return !event.isPast
    if (filter === 'past') return event.isPast
    return true
  })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

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

          {/* Events Grid */}
          <div ref={eventsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const TypeIcon = typeIcons[event.type]
              return (
                <div
                  key={event.id}
                  className={cn(
                    'bg-white rounded-2xl border border-pampas-warm overflow-hidden',
                    'transition-all duration-500 ease-out',
                    'hover:shadow-lg hover:-translate-y-1',
                    'opacity-0 translate-y-4',
                    eventsVisible && 'opacity-100 translate-y-0',
                    event.isPast && 'opacity-75'
                  )}
                  style={{ transitionDelay: eventsVisible ? `${index * 100}ms` : '0ms' }}
                >
                  {/* Date Badge */}
                  <div className="flex items-start p-5 pb-0">
                    <div className="bg-claude-terracotta text-white rounded-xl p-3 text-center min-w-[60px]">
                      <span className="block text-2xl font-serif font-bold leading-none">{event.day}</span>
                      <span className="block text-xs font-medium uppercase mt-1">{event.month}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <Badge className={typeColors[event.type]}>
                        <TypeIcon size={12} className="mr-1" />
                        {event.type}
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
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-claude-terracotta" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-pampas">
                      <Button
                        variant={event.isPast ? 'secondary' : 'primary'}
                        size="sm"
                        className="w-full"
                        disabled={event.isPast}
                      >
                        {event.isPast ? 'Event Passed' : 'Register Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
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

            {subscribed ? (
              <div className="bg-sage/10 text-sage rounded-xl p-4 inline-block">
                <p className="font-medium">You're subscribed! We'll keep you updated.</p>
              </div>
            ) : (
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
                <Button type="submit" variant="primary">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
