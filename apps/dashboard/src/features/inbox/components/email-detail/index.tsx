import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useInboxAttachments, useInboxEmailDetail } from '../../api/inbox.api'
import { useInboxTableContext } from '../../context/inbox-table.context'
import { AttachmentsPanel } from './attachments-panel'
import { DetailHeader } from './detail-header'
import { EmailBody } from './email-body'
import { SectionLabel } from './section-label'

export function EmailDetailSheet() {
  const {
    workspaceId,
    timezone,
    detail: { selectedEmailId, sheetOpen, closeDetail },
  } = useInboxTableContext()

  // The detail query carries every header field the strip needs, so the sheet
  // can open from an id alone — no list-row object required. This is what makes
  // deep-linking work.
  const { t } = useTranslation('inbox')
  const { data: detail, isFetching: detailFetching } = useInboxEmailDetail(
    workspaceId,
    selectedEmailId ?? '',
  )
  const { data: attachments, isFetching: attachmentsFetching } = useInboxAttachments(
    workspaceId,
    selectedEmailId ?? '',
  )

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) closeDetail() }}>
      {/*
        Use a very wide drawer — roughly 85 vw capped at 1200px.
        Tailwind doesn't ship a class this wide so we override via style.
      */}
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0"
        style={{ maxWidth: 'min(1200px, 85vw)' }}
      >
        <DetailHeader detail={detail} timezone={timezone} />

        <div className="flex min-h-0 flex-1 divide-x">
          <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
            <SectionLabel>{t('detail.message')}</SectionLabel>
            <EmailBody
              bodyHtml={detail?.body_html ?? ''}
              bodyText={detail?.body_text ?? ''}
              isLoading={detailFetching && !detail}
            />
          </div>

          <div className="flex w-[520px] shrink-0 flex-col gap-3 overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <SectionLabel>{t('detail.attachments')}</SectionLabel>
              {attachments && attachments.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {t('uploadedFiles.count', { count: attachments.length })}
                </span>
              )}
            </div>
            <AttachmentsPanel
              attachments={attachments}
              isFetching={attachmentsFetching}
              workspaceId={workspaceId}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
