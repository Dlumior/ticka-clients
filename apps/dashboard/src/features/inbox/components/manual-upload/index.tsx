import { useTranslation } from 'react-i18next'
import { useManualAttachments } from '../../api/inbox.api'
import { useManualUpload } from '../../hooks/use-manual-upload'
import { DropZone } from './drop-zone'
import { UploadErrors } from './upload-errors'
import { UploadProgress } from './upload-progress'
import { UploadedFileRow } from './uploaded-file-row'

interface ManualUploadTabProps {
  workspaceId: string
  timezone: string
  // When set (via the ?attachmentId deep-link), highlights that uploaded file.
  highlightAttachmentId?: string
}

export function ManualUploadTab({
  workspaceId,
  timezone,
  highlightAttachmentId,
}: ManualUploadTabProps) {
  const { t } = useTranslation('inbox')
  const { data: attachments, isFetching } = useManualAttachments(workspaceId)
  const {
    inputRef,
    isDragOver,
    pendingUploads,
    pendingErrors,
    onDrop,
    onDragOver,
    onDragLeave,
    onInputChange,
    dismissError,
  } = useManualUpload({ workspaceId })

  return (
    <div className="flex flex-col gap-6">
      <DropZone
        isDragOver={isDragOver}
        inputRef={inputRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onInputChange={onInputChange}
      />

      <UploadProgress pendingUploads={pendingUploads} />

      <UploadErrors pendingErrors={pendingErrors} onDismiss={dismissError} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{t('uploadedFiles.title')}</p>
          {attachments && attachments.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {t('uploadedFiles.count', { count: attachments.length })}
            </span>
          )}
        </div>

        {isFetching && !attachments ? (
          <div className="flex flex-col gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/30" />
            ))}
          </div>
        ) : !attachments || attachments.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
            <p className="text-sm text-muted-foreground">{t('uploadedFiles.empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {attachments.map((a) => (
              <UploadedFileRow
                key={a.id}
                attachment={a}
                workspaceId={workspaceId}
                timezone={timezone}
                highlighted={a.id === highlightAttachmentId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
