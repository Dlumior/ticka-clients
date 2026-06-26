import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiAttachmentLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLoaderLine,
  RiRefreshLine,
} from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ATTACHMENT_STATUS_VARIANT,
  StatusIcon,
  formatBytes,
} from '../../inbox.lib'
import {
  BILLING_DOCUMENT_STATUS_VARIANT,
} from '@/features/billing-documents/billing-documents.lib'
import {
  useAttachmentPreviewUrl,
  useDiscardAttachment,
  useDownloadAttachment,
  useBillingDocumentForAttachment,
  useReprocessAttachment,
} from '../../api/inbox.api'
import type { InboundAttachment } from '../../api/inbox.api'

interface AttachmentRowProps {
  attachment: InboundAttachment
  workspaceId: string
  isSelected: boolean
  onSelect: () => void
}

export function AttachmentRow({
  attachment,
  workspaceId,
  isSelected,
  onSelect,
}: AttachmentRowProps) {
  const { t } = useTranslation('inbox')
  const { t: tc } = useTranslation('common')
  const { t: tBillingDocuments } = useTranslation('billing-documents')
  const status = attachment.status ?? 'stored'
  const isPdf = attachment.content_type === 'application/pdf'
  const canDownload = !!attachment.storage_path && status !== 'duplicate'
  const canReprocess = status === 'failed' || status === 'discarded'
  const canDiscard = status === 'duplicate' || status === 'failed'

  const [discardOpen, setDiscardOpen] = useState(false)

  const download = useDownloadAttachment(workspaceId)
  const reprocess = useReprocessAttachment(workspaceId)
  const discard = useDiscardAttachment(workspaceId)

  async function handleDiscard() {
    await discard.mutateAsync(attachment.id)
    setDiscardOpen(false)
  }

  const { data: billingDocument, isFetching: billingDocumentFetching } = useBillingDocumentForAttachment(
    workspaceId,
    status === 'completed' ? attachment.id : null,
  )

  const {
    data: previewUrl,
    isFetching: urlFetching,
    isError: urlError,
  } = useAttachmentPreviewUrl(workspaceId, isSelected ? attachment.id : null)

  return (
    <div className="flex flex-col gap-0">
      <div
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
          isSelected ? 'bg-muted/60' : 'hover:bg-muted/30'
        }`}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <RiAttachmentLine className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-tight font-medium">
            {attachment.original_filename}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatBytes(attachment.file_size_bytes)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5">
            <StatusIcon status={status} />
            <Badge variant={ATTACHMENT_STATUS_VARIANT[status] ?? 'outline'} className="text-[10px]">
              {t(`attachmentStatus.${status}` as `attachmentStatus.${string}`, { defaultValue: status })}
            </Badge>
            {status === 'completed' && (
              billingDocumentFetching ? (
                <RiLoaderLine className="size-3 animate-spin text-muted-foreground" />
              ) : billingDocument ? (
                <Badge
                  variant={BILLING_DOCUMENT_STATUS_VARIANT[billingDocument.status] ?? 'outline'}
                  className="text-[10px]"
                >
                  {tBillingDocuments(`status.${billingDocument.status}` as `status.${string}`, { defaultValue: billingDocument.status })}
                </Badge>
              ) : null
            )}
          </div>

          {canReprocess && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={() => reprocess.mutate(attachment.id)}
              disabled={reprocess.isPending}
              aria-label="Retry processing as billing document"
            >
              {reprocess.isPending ? (
                <RiLoaderLine className="size-3.5 animate-spin" />
              ) : (
                <RiRefreshLine className="size-3.5" />
              )}
              {t('uploadStatus.retry')}
            </Button>
          )}

          {canDiscard && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={() => setDiscardOpen(true)}
              disabled={discard.isPending}
              aria-label={t('attachmentActions.discard')}
            >
              <RiDeleteBinLine className="size-3.5" />
            </Button>
          )}

          {canDownload && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={() => download.mutate(attachment.id)}
              disabled={download.isPending}
              aria-label="Download attachment"
            >
              {download.isPending ? (
                <RiLoaderLine className="size-3.5 animate-spin" />
              ) : (
                <RiDownloadLine className="size-3.5" />
              )}
            </Button>
          )}

          {isPdf && (
            <Button
              variant={isSelected ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={onSelect}
              aria-label={isSelected ? 'Hide PDF preview' : 'Show PDF preview'}
            >
              {isSelected ? (
                <RiEyeOffLine className="size-3.5" />
              ) : (
                <RiEyeLine className="size-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {reprocess.isError && (
        <p className="px-3 pb-1 text-xs text-destructive" role="alert">
          {reprocess.error.message}
        </p>
      )}

      <Dialog
        open={discardOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDiscardOpen(false)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('discardDialog.title')}</DialogTitle>
            <DialogDescription>{t('discardDialog.body')}</DialogDescription>
          </DialogHeader>

          {discard.error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
              <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-xs text-destructive" role="alert">
                {discard.error.message}
              </p>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDiscardOpen(false)}
              disabled={discard.isPending}
            >
              {tc('cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDiscard}
              disabled={discard.isPending}
            >
              {discard.isPending ? tc('deleting') : t('discardDialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isSelected && (
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
          {urlFetching && !previewUrl ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : urlError ? (
            <div className="flex items-center gap-2 px-4 py-3">
              <RiErrorWarningLine className="size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{t('detail.failedPreview')}</p>
            </div>
          ) : previewUrl ? (
            <>
              <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
                <span className="truncate text-xs font-medium text-muted-foreground">
                  {attachment.original_filename}
                </span>
                <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                  {formatBytes(attachment.file_size_bytes)}
                </span>
              </div>
              <iframe
                src={previewUrl}
                title={attachment.original_filename}
                className="w-full flex-1"
                style={{ minHeight: '520px' }}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
