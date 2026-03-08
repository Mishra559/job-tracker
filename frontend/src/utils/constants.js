/**
 * Application status definitions with display labels and colors.
 */
export const STATUSES = {
  APPLIED: {
    label: 'Applied',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    dot: 'bg-cyan-400',
    chart: '#06b6d4',
  },
  INTERVIEW: {
    label: 'Interview',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    dot: 'bg-violet-400',
    chart: '#8b5cf6',
  },
  OFFER: {
    label: 'Offer',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
    chart: '#10b981',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
    dot: 'bg-rose-400',
    chart: '#f43f5e',
  },
}

export const STATUS_OPTIONS = Object.entries(STATUSES).map(([value, meta]) => ({
  value,
  label: meta.label,
}))

/**
 * Format a date string (YYYY-MM-DD) to a human-readable label.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Truncate text with an ellipsis after maxLength characters.
 */
export const truncate = (text, maxLength = 60) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}
