import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDatetimeInTz } from '@/lib/date'
import type { InboundEmail } from '../api/inbox.api'
import { EMAIL_STATUS_LABEL, EMAIL_STATUS_VARIANT } from '../inbox.lib'

const columnHelper = createColumnHelper<InboundEmail>()

export function getInboxColumns(timezone: string) {
  return [
    columnHelper.accessor('sender_email', {
      id: 'from',
      header: 'From',
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
      header: 'Subject',
      cell: (info) => (
        <span className="line-clamp-1 text-sm">{info.getValue() || '(no subject)'}</span>
      ),
    }),
    columnHelper.accessor('received_at', {
      header: 'Received',
      cell: (info) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDatetimeInTz(info.getValue(), timezone)}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() ?? 'pending'
        return (
          <Badge variant={EMAIL_STATUS_VARIANT[status] ?? 'outline'}>
            {EMAIL_STATUS_LABEL[status] ?? status}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('attachment_count', {
      header: 'Attachments',
      cell: (info) => (
        <span className="text-sm tabular-nums">{info.getValue()}</span>
      ),
    }),
  ]
}
