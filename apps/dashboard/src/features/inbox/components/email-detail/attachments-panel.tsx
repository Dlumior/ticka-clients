import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import type { InboundAttachment } from '../../api/inbox.api'
import { AttachmentRow } from './attachment-row'

interface AttachmentsPanelProps {
  attachments: InboundAttachment[] | undefined
  isFetching: boolean
  workspaceId: string
}

export function AttachmentsPanel({
  attachments,
  isFetching,
  workspaceId,
}: AttachmentsPanelProps) {
  const { t } = useTranslation('inbox')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function toggle(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  if (isFetching) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    )
  }

  if (!attachments || attachments.length === 0) {
    return (
      <div className="mx-4 flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <p className="text-sm text-muted-foreground">{t('detail.noAttachments')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      {attachments.map((a) => (
        <AttachmentRow
          key={a.id}
          attachment={a}
          workspaceId={workspaceId}
          isSelected={selectedId === a.id}
          onSelect={() => toggle(a.id)}
        />
      ))}
    </div>
  )
}
