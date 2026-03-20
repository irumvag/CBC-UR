import { Pencil, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

export interface Column<T> {
  header: string
  key: keyof T | string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface AdminTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  emptyMessage?: string
  keyField?: keyof T
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  emptyMessage = 'No records found.',
}: AdminTableProps<T>) {
  const showActions = onEdit || onDelete

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-muted/20 bg-surface">
        <div className="border-b border-muted/20 px-6 py-4">
          <Skeleton className="h-4 w-48" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-muted/10 px-6 py-4 last:border-b-0">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border border-muted/20 bg-surface px-6 py-12 text-center">
        <p className="text-sm text-foreground/50">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-muted/20 bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-muted/20 bg-cream/50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-foreground/50 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-muted/10 transition-colors last:border-b-0 hover:bg-cream/30"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-sm text-foreground ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                  </td>
                ))}
                {showActions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="rounded-md p-1.5 text-foreground/40 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  active: boolean
  labels?: [string, string]
}

export function StatusBadge({ active, labels = ['Active', 'Inactive'] }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted/20 text-foreground/50'
      }`}
    >
      {active ? labels[0] : labels[1]}
    </span>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-foreground/60">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

interface AddButtonProps {
  onClick: () => void
  label?: string
}

export function AddButton({ onClick, label = 'Add New' }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
    >
      <span className="text-base leading-none">+</span>
      {label}
    </button>
  )
}
