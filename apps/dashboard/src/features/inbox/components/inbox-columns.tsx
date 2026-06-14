import type { TFunction } from 'i18next'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDatetimeInTz } from '@/lib/date'
import type { InboundEmail } from '../api/inbox.api'
import { EMAIL_STATUS_VARIANT } from '../inbox.lib'

const columnHelper = createColumnHelper<InboundEmail>()

export function getInboxColumns(timezone: string, t: TFunction<'inbox'>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<InboundEmail, any>[] = [
    columnHelper.accessor('sender_email', {
      id: 'from',
      header: t('col.from'),
      cell: (info) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{info.getValue()}</p>
          {info.row.original.sender_name && (
            <p className="truncate text-xs text-muted-foreground">
              {info.row.original.sender_name}
            </p>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('subject', {
      header: t('col.subject'),
      cell: (info) => (
        <span className="line-clamp-1 text-sm">{info.getValue() || t('detail.noSubject')}</span>
      ),
    }),
    columnHelper.accessor('received_at', {
      header: t('col.received'),
      cell: (info) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDatetimeInTz(info.getValue(), timezone)}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: t('col.status'),
      cell: (info) => {
        const status = info.getValue() ?? 'pending'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const label = t(`emailStatus.${status}` as any, { defaultValue: status })
        return (
          <Badge variant={EMAIL_STATUS_VARIANT[status] ?? 'outline'}>
            {label}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('attachment_count', {
      header: t('col.attachments'),
      cell: (info) => (
        <span className="text-sm tabular-nums">{info.getValue()}</span>
      ),
    }),
  ]

  return columns
}
