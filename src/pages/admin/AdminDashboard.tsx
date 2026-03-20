import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Calendar, FolderOpen, ExternalLink, Trophy, FileText, Link as LinkIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/Skeleton'

interface Stats {
  team: number
  events: number
  projects: number
  links: number
}

interface RecentEvent {
  id: string
  title: string
  date: string
  event_type: string
  is_published: boolean
}

const STAT_ITEMS = [
  { key: 'team' as keyof Stats, label: 'Team Members', icon: Users, to: '/admin/team', color: 'bg-violet-50 text-violet-600' },
  { key: 'events' as keyof Stats, label: 'Events', icon: Calendar, to: '/admin/events', color: 'bg-sky-50 text-sky-600' },
  { key: 'projects' as keyof Stats, label: 'Projects', icon: FolderOpen, to: '/admin/projects', color: 'bg-emerald-50 text-emerald-600' },
  { key: 'links' as keyof Stats, label: 'Active Links', icon: LinkIcon, to: '/admin/links', color: 'bg-amber-50 text-amber-600' },
]

const QUICK_LINKS = [
  { to: '/admin/team', icon: Users, label: 'Manage Team' },
  { to: '/admin/events', icon: Calendar, label: 'Manage Events' },
  { to: '/admin/hackathon', icon: Trophy, label: 'Hackathon' },
  { to: '/admin/content', icon: FileText, label: 'Site Content' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [teamRes, eventsRes, projectsRes, linksRes, recentRes] = await Promise.allSettled([
        supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('links').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('events').select('id, title, date, event_type, is_published').order('date', { ascending: false }).limit(5),
      ])

      setStats({
        team: teamRes.status === 'fulfilled' ? (teamRes.value.count || 0) : 0,
        events: eventsRes.status === 'fulfilled' ? (eventsRes.value.count || 0) : 0,
        projects: projectsRes.status === 'fulfilled' ? (projectsRes.value.count || 0) : 0,
        links: linksRes.status === 'fulfilled' ? (linksRes.value.count || 0) : 0,
      })
      setRecentEvents(recentRes.status === 'fulfilled' ? (recentRes.value.data || []) : [])
      setLoading(false)
    }

    fetchStats()
  }, [])

  const EVENT_TYPE_LABELS: Record<string, string> = {
    meetup: 'Meeting',
    hackathon: 'Hackathon',
    workshop: 'Workshop',
    demo_day: 'Demo Day',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-foreground/60">Welcome back! Here's an overview of your website content.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_ITEMS.map(({ key, label, icon: Icon, to, color }) => (
          <Link
            key={key}
            to={to}
            className="rounded-xl border border-muted/20 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            {loading ? (
              <Skeleton className="mb-1 h-7 w-12" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats?.[key] ?? 0}</div>
            )}
            <div className="text-xs text-foreground/50">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-muted/20 bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-muted/20 px-6 py-4">
              <h2 className="font-bold text-foreground">Recent Events</h2>
              <Link to="/admin/events" className="text-xs text-primary hover:underline">
                View all →
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentEvents.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-foreground/50">
                No events yet.{' '}
                <Link to="/admin/events" className="text-primary hover:underline">
                  Add your first event →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-muted/10">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 px-6 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{event.title}</div>
                      <div className="text-xs text-foreground/50">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      event.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-muted/20 text-foreground/50'
                    }`}>
                      {event.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="rounded-xl border border-muted/20 bg-surface shadow-sm">
            <div className="border-b border-muted/20 px-6 py-4">
              <h2 className="font-bold text-foreground">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {QUICK_LINKS.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </Link>
              ))}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-cream hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                View Live Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
