import type { ComponentProps } from 'react'
import { RiCheckboxCircleLine, RiErrorWarningLine, RiLoaderLine } from '@remixicon/react'
import { Badge } from '@/components/ui/badge'

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>

export const ATTACHMENT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  stored: 'outline',
  queued: 'secondary',
  processing: 'outline',
  completed: 'default',
  failed: 'destructive',
  duplicate: 'secondary',
  held: 'outline',
  discarded: 'secondary',
}

export const EMAIL_STATUS_VARIANT: Record<string, BadgeVariant> = {
  completed: 'default',
  failed: 'destructive',
  pending: 'secondary',
  processing: 'outline',
  no_attachments_found: 'secondary',
}

export function formatBytes(n: bigint | number): string {
  const bytes = typeof n === 'bigint' ? Number(n) : n
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function StatusIcon({ status }: { status: string }) {
  if (status === 'completed')
    return <RiCheckboxCircleLine className="size-3.5 text-emerald-500" />
  if (status === 'failed')
    return <RiErrorWarningLine className="size-3.5 text-destructive" />
  if (status === 'processing' || status === 'queued')
    return <RiLoaderLine className="size-3.5 animate-spin text-muted-foreground" />
  return null
}
