import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search, Filter, CheckCircle, XCircle, ChevronDown,
  ChevronLeft, ChevronRight, MoreHorizontal, User
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAdminMembers } from '@/hooks/useAdminData'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { MemberRole, MemberStatus } from '@/types/database'

const statusOptions: { value: MemberStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const roleOptions: { value: MemberRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'member', label: 'Member' },
  { value: 'lead', label: 'Lead' },
  { value: 'admin', label: 'Admin' },
]

const departmentLabels: Record<string, string> = {
  cs: 'Computer Science',
  it: 'Information Technology',
  ce: 'Computer Engineering',
  ee: 'Electrical Engineering',
  me: 'Mechanical Engineering',
  civil: 'Civil Engineering',
  business: 'Business Administration',
  other: 'Other',
}

export default function AdminMembers() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showToast } = useToast()

  // Filters from URL params
  const search = searchParams.get('search') || ''
  const statusFilter = (searchParams.get('status') as MemberStatus | 'all') || 'all'
  const roleFilter = (searchParams.get('role') as MemberRole | 'all') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const {
    members,
    totalCount,
    isLoading,
    updateMemberStatus,
    updateMemberRole,
    bulkUpdateStatus,
  } = useAdminMembers({
    search,
    status: statusFilter,
    role: roleFilter,
    page,
    pageSize,
  })

  const totalPages = Math.ceil(totalCount / pageSize)

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })
    // Reset to page 1 when filters change
    if (!updates.page) {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }

  const handleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(members.map((m) => m.id))
    }
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleApprove = async (memberId: string) => {
    const { error } = await updateMemberStatus(memberId, 'approved')
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Member approved', 'success')
    }
    setOpenDropdownId(null)
  }

  const handleReject = async (memberId: string) => {
    const { error } = await updateMemberStatus(memberId, 'rejected')
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Member rejected', 'success')
    }
    setOpenDropdownId(null)
  }

  const handleRoleChange = async (memberId: string, newRole: MemberRole) => {
    const { error } = await updateMemberRole(memberId, newRole)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Role updated', 'success')
    }
    setOpenDropdownId(null)
  }

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return
    const { error } = await bulkUpdateStatus(selectedIds, 'approved')
    if (error) {
      showToast(error, 'error')
    } else {
      showToast(`${selectedIds.length} members approved`, 'success')
      setSelectedIds([])
    }
  }

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return
    const { error } = await bulkUpdateStatus(selectedIds, 'rejected')
    if (error) {
      showToast(error, 'error')
    } else {
      showToast(`${selectedIds.length} members rejected`, 'success')
      setSelectedIds([])
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-sage/10 text-sage'
      case 'pending':
        return 'bg-claude-terracotta/10 text-claude-terracotta'
      case 'rejected':
        return 'bg-red-50 text-red-600'
    }
  }

  const getRoleBadge = (role: MemberRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700'
      case 'lead':
        return 'bg-teal/10 text-teal'
      default:
        return 'bg-pampas-warm text-stone'
    }
  }

  return (
    <AdminLayout title="Members" breadcrumbs={[{ label: 'Members' }]}>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-pampas-warm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateParams({ search: e.target.value })}
                placeholder="Search by name or email..."
                className={cn(
                  'w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-pampas-warm bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                  'transition-all'
                )}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => updateParams({ status: e.target.value })}
              className={cn(
                'pl-10 pr-8 py-2.5 rounded-xl border-2 border-pampas-warm bg-white appearance-none',
                'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                'transition-all min-w-[140px]'
              )}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => updateParams({ role: e.target.value })}
              className={cn(
                'pl-10 pr-8 py-2.5 rounded-xl border-2 border-pampas-warm bg-white appearance-none',
                'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta',
                'transition-all min-w-[140px]'
              )}
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-pampas-warm">
            <span className="text-sm text-stone">
              {selectedIds.length} selected
            </span>
            <Button variant="secondary" size="sm" onClick={handleBulkApprove}>
              <CheckCircle size={16} className="mr-1" />
              Approve
            </Button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <XCircle size={16} className="inline mr-1" />
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-pampas-warm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : members.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-pampas-warm/50">
                    <th className="py-3 px-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === members.length && members.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-stone"
                      />
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-ink text-sm">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-ink text-sm hidden md:table-cell">Student ID</th>
                    <th className="py-3 px-4 text-left font-semibold text-ink text-sm hidden lg:table-cell">Department</th>
                    <th className="py-3 px-4 text-left font-semibold text-ink text-sm">Role</th>
                    <th className="py-3 px-4 text-left font-semibold text-ink text-sm">Status</th>
                    <th className="py-3 px-4 text-left font-semibold text-ink text-sm hidden lg:table-cell">Joined</th>
                    <th className="py-3 px-4 text-right font-semibold text-ink text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pampas-warm">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-pampas-warm/30 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(member.id)}
                          onChange={() => handleSelect(member.id)}
                          className="rounded border-stone"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-claude-terracotta/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-claude-terracotta font-semibold text-xs">
                              {member.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-ink text-sm truncate">{member.full_name}</p>
                            <p className="text-stone text-xs truncate">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-stone hidden md:table-cell">
                        {member.student_id || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-stone hidden lg:table-cell">
                        {member.department ? departmentLabels[member.department] || member.department : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', getRoleBadge(member.role))}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', getStatusBadge(member.status))}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-stone hidden lg:table-cell">
                        {formatDate(member.joined_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                            className="p-2 text-stone hover:text-ink hover:bg-pampas-warm rounded-lg transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openDropdownId === member.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-pampas-warm py-2 z-20">
                                {member.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(member.id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-sage hover:bg-sage/10 transition-colors"
                                    >
                                      <CheckCircle size={16} />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleReject(member.id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <XCircle size={16} />
                                      Reject
                                    </button>
                                    <hr className="my-1 border-pampas-warm" />
                                  </>
                                )}
                                <div className="px-4 py-2">
                                  <p className="text-xs text-stone mb-2">Change Role</p>
                                  {(['member', 'lead', 'admin'] as MemberRole[]).map((role) => (
                                    <button
                                      key={role}
                                      onClick={() => handleRoleChange(member.id, role)}
                                      className={cn(
                                        'w-full text-left px-2 py-1.5 text-sm rounded-lg transition-colors capitalize',
                                        member.role === role
                                          ? 'bg-claude-terracotta/10 text-claude-terracotta'
                                          : 'text-ink hover:bg-pampas-warm'
                                      )}
                                    >
                                      {role}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-pampas-warm">
                <p className="text-sm text-stone">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateParams({ page: String(page - 1) })}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-pampas-warm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pampas-warm transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-ink px-3">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => updateParams({ page: String(page + 1) })}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-pampas-warm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pampas-warm transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-pampas-warm flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-stone" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-ink mb-1">
              No members found
            </h3>
            <p className="text-stone text-sm">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
