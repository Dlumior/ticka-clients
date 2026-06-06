import { useEffect, useRef } from 'react'
import {
  RiAttachmentLine,
  RiDownloadLine,
  RiLoaderLine,
  RiRefreshLine,
} from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDatetimeInTz } from '@/lib/date'
import {
  ATTACHMENT_STATUS_LABEL,
  ATTACHMENT_STATUS_VARIANT,
  StatusIcon,
  formatBytes,
} from '../../inbox.lib'
import {
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_VARIANT,
} from '@/features/invoices/invoices.lib'
import {
  useDownloadAttachment,
  useInvoiceForAttachment,
  useReprocessAttachment,
} from '../../api/inbox.api'
import type { InboundAttachment } from '../../api/inbox.api'

interface UploadedFileRowProps {
  attachment: InboundAttachment
  workspaceId: string
  timezone: string
  highlighted?: boolean
}

export function UploadedFileRow({
  attachment,
  workspaceId,
  timezone,
  highlighted,
}: UploadedFileRowProps) {
  const status = attachment.status ?? 'stored'
  const canDownload = !!attachment.storage_path && status !== 'duplicate'

  const download = useDownloadAttachment(workspaceId)
  const reprocess = useReprocessAttachment(workspaceId)
  const { data: invoice, isFetching: invoiceFetching } = useInvoiceForAttachment(
    workspaceId,
    status === 'completed' ? attachment.id : null,
  )

  // When deep-linked from an invoice, scroll this row into view and pulse a
  // highlight so the file the invoice came from is easy to spot.
  const rowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (highlighted) {
      rowRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [highlighted])

  return (
    <div
      ref={rowRef}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        highlighted ? 'bg-primary/5 ring-2 ring-primary/60' : 'hover:bg-muted/30'
      }`}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <RiAttachmentLine className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">
          {attachment.original_filename}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatBytes(attachment.file_size_bytes)} ·{' '}
          {formatDatetimeInTz(attachment.created_at, timezone)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1.5">
          <StatusIcon status={status} />
          <Badge variant={ATTACHMENT_STATUS_VARIANT[status] ?? 'outline'} className="text-[10px]">
            {ATTACHMENT_STATUS_LABEL[status] ?? status}
          </Badge>
          {status === 'completed' && (
            invoiceFetching ? (
              <RiLoaderLine className="size-3 animate-spin text-muted-foreground" />
            ) : invoice ? (
              <Badge
                variant={INVOICE_STATUS_VARIANT[invoice.status] ?? 'outline'}
                className="text-[10px]"
              >
                {INVOICE_STATUS_LABEL[invoice.status] ?? invoice.status}
              </Badge>
            ) : null
          )}
        </div>

        {status === 'failed' && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2.5 text-xs font-medium"
            onClick={() => reprocess.mutate(attachment.id)}
            disabled={reprocess.isPending}
          >
            {reprocess.isPending ? (
              <RiLoaderLine className="size-3.5 animate-spin" />
            ) : (
              <RiRefreshLine className="size-3.5" />
            )}
            Retry
          </Button>
        )}

        {canDownload && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5"
            onClick={() => download.mutate(attachment.id)}
            disabled={download.isPending}
            aria-label="Download file"
          >
            {download.isPending ? (
              <RiLoaderLine className="size-3.5 animate-spin" />
            ) : (
              <RiDownloadLine className="size-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
