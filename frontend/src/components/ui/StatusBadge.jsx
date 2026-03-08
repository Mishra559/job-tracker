import { STATUSES } from '../../utils/constants'

/**
 * Displays an application status as a colored pill badge.
 */
export default function StatusBadge({ status, size = 'sm' }) {
  const meta = STATUSES[status] || STATUSES.APPLIED

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wider
        ${meta.bg} ${meta.border} ${meta.color} ${sizeClasses[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}
