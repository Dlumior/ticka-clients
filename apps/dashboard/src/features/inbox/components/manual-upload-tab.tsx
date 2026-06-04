import {
  RiAttachmentLine,
  RiCheckboxCircleLine,
  RiDownloadLine,
  RiErrorWarningLine,
  RiLoaderLine,
  RiRefreshLine,
  RiUploadCloud2Line,
} from '@remixicon/react'
import { useCallback, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDatetimeInTz } from '@/lib/date'
import { isApiError } from '@/lib/api-error'
import {
  useDownloadAttachment,
  useManualAttachments,
  useReprocessAttachment,
  useUploadInvoiceFile,
  useInvoiceForAttachment,
} from '../api/inbox.api'
import type { InboundAttachment } from '../api/inbox.api'
import { INVOICE_STATUS_LABEL, INVOICE_STATUS_VARIANT } from '@/features/invoices/invoices.lib'

const ATTACHMENT_STATUS_VARIANT: Record<
  string,
  'default' | 'destructive' | 'secondary' | 'outline'
> = {
  stored: 'outline',
  queued: 'secondary',
  processing: 'outline',
  completed: 'default',
  failed: 'destructive',
  duplicate: 'secondary',
}

const ATTACHMENT_STATUS_LABEL: Record<string, string> = {
  stored: 'Stored',
  queued: 'Queued',
  processing: 'Processing',
  completed: 'Invoiced',
  failed: 'Failed',
  duplicate: 'Duplicate',
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed')
    return <RiCheckboxCircleLine className="size-3.5 text-emerald-500" />
  if (status === 'failed')
    return <RiErrorWarningLine className="size-3.5 text-destructive" />
  if (status === 'processing' || status === 'queued')
    return <RiLoaderLine className="size-3.5 animate-spin text-muted-foreground" />
  return null
}

function UploadedFileRow({
  attachment,
  workspaceId,
  timezone,
}: {
  attachment: InboundAttachment
  workspaceId: string
  timezone: string
}) {
  const status = attachment.status ?? 'stored'
  const canDownload = !!attachment.storage_path && status !== 'duplicate'

  const download = useDownloadAttachment(workspaceId)
  const reprocess = useReprocessAttachment(workspaceId)
  const { data: invoice, isFetching: invoiceFetching } = useInvoiceForAttachment(
    workspaceId,
    status === 'completed' ? attachment.id : null,
  )

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors">
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

interface UploadState {
  filename: string
  uploading: boolean
  error: string | null
}

interface ManualUploadTabProps {
  workspaceId: string
  timezone: string
}

export function ManualUploadTab({ workspaceId, timezone }: ManualUploadTabProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStates, setUploadStates] = useState<UploadState[]>([])

  const { data: attachments, isFetching } = useManualAttachments(workspaceId)
  const upload = useUploadInvoiceFile(workspaceId)

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files)
      const allowed = list.filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase()
        return ext === 'xml' || ext === 'pdf'
      })

      if (allowed.length === 0) return

      const newStates: UploadState[] = allowed.map((f) => ({
        filename: f.name,
        uploading: true,
        error: null,
      }))
      setUploadStates((prev) => [...prev, ...newStates])

      allowed.forEach((file) => {
        upload.mutate(file, {
          onSuccess: () => {
            setUploadStates((prev) =>
              prev.filter((s) => !(s.filename === file.name && s.uploading)),
            )
          },
          onError: (err) => {
            const message = isApiError(err) ? err.message : 'Upload failed.'
            setUploadStates((prev) =>
              prev.map((s) =>
                s.filename === file.name && s.uploading
                  ? { ...s, uploading: false, error: message }
                  : s,
              ),
            )
          },
        })
      })
    },
    [upload],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const onDragLeave = () => setIsDragOver(false)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  const pendingErrors = uploadStates.filter((s) => !s.uploading && s.error)
  const pendingUploads = uploadStates.filter((s) => s.uploading)

  return (
    <div className="flex flex-col gap-6">
      {/* Drop zone */}
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-12 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/30'
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload invoice file"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <RiUploadCloud2Line className="size-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Drop files here or{' '}
            <span className="text-primary underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports XML and PDF · Max 10 MB per file
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".xml,.pdf"
          multiple
          className="sr-only"
          onChange={onInputChange}
        />
      </div>

      {/* In-progress uploads */}
      {pendingUploads.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {pendingUploads.map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
              <RiLoaderLine className="size-4 shrink-0 animate-spin text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm">{s.filename}</span>
              <span className="text-xs text-muted-foreground">Uploading…</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload errors */}
      {pendingErrors.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {pendingErrors.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3"
            >
              <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.filename}</p>
                <p className="text-xs text-destructive">{s.error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() =>
                  setUploadStates((prev) =>
                    prev.filter((_, idx) => idx !== pendingErrors.indexOf(s)),
                  )
                }
              >
                Dismiss
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded files list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Uploaded files</p>
          {attachments && attachments.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {attachments.length} file{attachments.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isFetching && !attachments ? (
          <div className="flex flex-col gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : !attachments || attachments.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
            <p className="text-sm text-muted-foreground">No files uploaded yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {attachments.map((a) => (
              <UploadedFileRow
                key={a.id}
                attachment={a}
                workspaceId={workspaceId}
                timezone={timezone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
