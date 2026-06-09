import type { ComponentProps } from 'react'
import type { Badge } from '@/components/ui/badge'

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>

export const EXPORT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: 'secondary',
  processing: 'outline',
  completed: 'default',
  failed: 'destructive',
}

export const EXPORT_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
}

export function exportStatusLabel(status: string | null | undefined): string {
  if (!status) return '—'
  return EXPORT_STATUS_LABEL[status] ?? status
}

export function exportStatusVariant(
  status: string | null | undefined,
): BadgeVariant {
  if (!status) return 'outline'
  return EXPORT_STATUS_VARIANT[status] ?? 'outline'
}

// Human-readable byte size for the exports history table.
export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(value < 10 && unit > 0 ? 1 : 0)} ${units[unit]}`
}

// Renders the date range / period a single export covered.
export function formatRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  if (start && end) return `${start} → ${end}`
  if (start) return `from ${start}`
  if (end) return `until ${end}`
  return 'All dates'
}
