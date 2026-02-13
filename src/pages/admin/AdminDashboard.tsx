import { Link } from 'react-router-dom'
import { Users, Calendar, FolderKanban, Mail, UserPlus, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAdminStats } from '@/hooks/useAdminData'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const { stats, pendingApplications, isLoading } = useAdminStats()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </>
        ) : (
          <>
            {/* Members */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-stone dark:text-dark-muted text-sm font-medium">Total Members</p>
                  <p className="text-3xl font-semibold text-ink dark:text-dark-text mt-1">{stats.totalMembers}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-sage flex items-center gap-1">
                      <CheckCircle size={12} />
                      {stats.approvedMembers} approved
                    </span>
                    <span className="text-claude-terracotta flex items-center gap-1">
                      <Clock size={12} />
                      {stats.pendingMembers} pending
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-claude-terracotta/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-claude-terracotta" />
                </div>
              </div>
            </div>

            {/* Events */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-stone dark:text-dark-muted text-sm font-medium">Upcoming Events</p>
                  <p className="text-3xl font-semibold text-ink dark:text-dark-text mt-1">{stats.upcomingEvents}</p>
                  <p className="text-xs text-stone dark:text-dark-muted mt-2">Scheduled events</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal" />
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-stone dark:text-dark-muted text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-semibold text-ink dark:text-dark-text mt-1">{stats.totalProjects}</p>
                  <p className="text-xs text-stone dark:text-dark-muted mt-2">Community projects</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-sage" />
                </div>
              </div>
            </div>

            {/* Subscribers */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-stone dark:text-dark-muted text-sm font-medium">Newsletter</p>
                  <p className="text-3xl font-semibold text-ink dark:text-dark-text mt-1">{stats.totalSubscribers}</p>
                  <p className="text-xs text-stone dark:text-dark-muted mt-2">Subscribers</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border">
          <div className="flex items-center justify-between p-4 border-b border-pampas-warm dark:border-dark-border">
            <h2 className="font-serif font-semibold text-lg text-ink dark:text-dark-text">
              Recent Applications
            </h2>
            <Link
              to="/admin/members?status=pending"
              className="text-claude-terracotta text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : pendingApplications.length > 0 ? (
              <div className="divide-y divide-pampas-warm dark:divide-dark-border">
                {pendingApplications.map((member) => (
                  <div key={member.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-claude-terracotta/10 flex items-center justify-center">
                          <span className="text-claude-terracotta font-semibold text-sm">
                            {member.full_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-ink dark:text-dark-text text-sm">{member.full_name}</p>
                          <p className="text-stone dark:text-dark-muted text-xs">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-stone dark:text-dark-muted">{formatDate(member.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-sage" />
                </div>
                <p className="text-stone dark:text-dark-muted text-sm">No pending applications</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-pampas-warm dark:border-dark-border">
          <div className="p-4 border-b border-pampas-warm dark:border-dark-border">
            <h2 className="font-serif font-semibold text-lg text-ink dark:text-dark-text">
              Quick Actions
            </h2>
          </div>

          <div className="p-4 space-y-3">
            <Link to="/admin/events" state={{ openCreate: true }}>
              <button
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-pampas-warm dark:border-dark-border',
                  'hover:border-claude-terracotta/30 hover:bg-claude-terracotta/5 transition-colors text-left'
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <p className="font-semibold text-ink dark:text-dark-text">Create Event</p>
                  <p className="text-stone dark:text-dark-muted text-sm">Schedule a new workshop, meetup, or hackathon</p>
                </div>
              </button>
            </Link>

            <Link to="/admin/members?status=pending">
              <button
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-pampas-warm dark:border-dark-border',
                  'hover:border-claude-terracotta/30 hover:bg-claude-terracotta/5 transition-colors text-left'
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-claude-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-claude-terracotta" />
                </div>
                <div>
                  <p className="font-semibold text-ink dark:text-dark-text">Approve Members</p>
                  <p className="text-stone dark:text-dark-muted text-sm">
                    {stats.pendingMembers > 0
                      ? `${stats.pendingMembers} pending applications await review`
                      : 'No pending applications'}
                  </p>
                </div>
              </button>
            </Link>

            <Link to="/admin/projects">
              <button
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-pampas-warm dark:border-dark-border',
                  'hover:border-claude-terracotta/30 hover:bg-claude-terracotta/5 transition-colors text-left'
                )}
              >
                <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <FolderKanban className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <p className="font-semibold text-ink dark:text-dark-text">Manage Projects</p>
                  <p className="text-stone dark:text-dark-muted text-sm">Review and feature community projects</p>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
