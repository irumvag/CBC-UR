import { Link } from 'react-router-dom'
import { Calendar, FolderKanban, Clock, ArrowRight, Plus, CalendarDays } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboardData } from '@/hooks/useDashboardData'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export default function DashboardOverview() {
  const { member, user } = useAuth()
  const { upcomingEvents, userProjects, stats, isLoading } = useDashboardData()

  // Format date for event display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
  }

  const firstName = member?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Builder'

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-serif font-semibold text-2xl md:text-3xl text-ink mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-stone">
            Here's what's happening with your Claude Builder Club membership.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-pampas-warm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-claude-terracotta/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-claude-terracotta" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink">{stats.eventsAttended}</p>
                    <p className="text-stone text-sm">Events Attended</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-pampas-warm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink">{stats.projectsCount}</p>
                    <p className="text-stone text-sm">Projects</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-pampas-warm p-4 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-ink">{stats.memberSince}</p>
                    <p className="text-stone text-sm">Member Since</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Two Column Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-pampas-warm">
            <div className="flex items-center justify-between p-4 border-b border-pampas-warm">
              <h2 className="font-serif font-semibold text-lg text-ink">Upcoming Events</h2>
              <Link
                to="/dashboard/events"
                className="text-claude-terracotta text-sm font-medium flex items-center gap-1 hover:underline"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              ) : upcomingEvents.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event) => {
                    const { day, month, time } = formatEventDate(event.date)
                    return (
                      <li
                        key={event.id}
                        className="flex gap-4 p-3 rounded-lg hover:bg-pampas-warm/50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-claude-terracotta/10 flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold text-claude-terracotta">{day}</span>
                          <span className="text-xs text-claude-terracotta uppercase">{month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-ink truncate">{event.title}</h3>
                          <p className="text-stone text-sm flex items-center gap-1 mt-1">
                            <CalendarDays size={14} />
                            {time} {event.location && `• ${event.location}`}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-pampas-warm flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-stone" />
                  </div>
                  <p className="text-stone mb-3">No upcoming events</p>
                  <Link to="/events">
                    <Button variant="secondary" size="sm">
                      Browse Events
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl border border-pampas-warm">
            <div className="flex items-center justify-between p-4 border-b border-pampas-warm">
              <h2 className="font-serif font-semibold text-lg text-ink">My Projects</h2>
              <Link
                to="/dashboard/projects"
                className="text-claude-terracotta text-sm font-medium flex items-center gap-1 hover:underline"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              ) : userProjects.length > 0 ? (
                <ul className="space-y-3">
                  {userProjects.slice(0, 3).map((project) => (
                    <li
                      key={project.id}
                      className="p-3 rounded-lg hover:bg-pampas-warm/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          'bg-gradient-to-br from-sage to-teal'
                        )}>
                          <FolderKanban className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-ink truncate">{project.title}</h3>
                          <p className="text-stone text-sm line-clamp-1 mt-0.5">
                            {project.description || 'No description'}
                          </p>
                          {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech_stack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-xs px-2 py-0.5 rounded-full bg-pampas-warm text-stone"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-pampas-warm flex items-center justify-center mx-auto mb-3">
                    <FolderKanban className="w-6 h-6 text-stone" />
                  </div>
                  <p className="text-stone mb-3">No projects yet</p>
                  <Link to="/dashboard/projects">
                    <Button variant="primary" size="sm">
                      <Plus size={16} className="mr-1" />
                      Start a Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
