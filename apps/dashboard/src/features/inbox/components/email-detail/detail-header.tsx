import { useTranslation } from 'react-i18next'
import { RiErrorWarningLine, RiMailLine, RiTimeLine } from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatDatetimeInTz } from '@/lib/date'
import { EMAIL_STATUS_VARIANT } from '../../inbox.lib'
import type { InboundEmailDetail } from '../../api/inbox.api'

interface DetailHeaderProps {
  detail: InboundEmailDetail | undefined
  timezone: string
}

export function DetailHeader({ detail, timezone }: DetailHeaderProps) {
  const { t } = useTranslation('inbox')
  const emailStatus = detail?.status
  const statusVariant = emailStatus ? (EMAIL_STATUS_VARIANT[emailStatus] ?? 'secondary') : 'secondary'
  const statusLabel = emailStatus ? t(`emailStatus.${emailStatus}` as `emailStatus.${string}`, { defaultValue: emailStatus }) : null

  return (
    <div className="shrink-0 border-b bg-muted/20">
      <div className="flex items-start justify-between gap-4 px-6 py-4">
        <SheetHeader className="gap-0.5 text-left">
          <SheetTitle className="text-base leading-snug">
            {detail?.subject || t('detail.noSubject')}
          </SheetTitle>
          <SheetDescription className="text-sm">{detail?.sender_email}</SheetDescription>
        </SheetHeader>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t px-6 py-3">
        {detail?.sender_name && (
          <div className="flex items-center gap-1.5">
            <RiMailLine className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{t('col.from')}</span>
            <span className="text-xs font-medium">{detail.sender_name}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <RiTimeLine className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{t('col.received')}</span>
          <span className="text-xs tabular-nums">
            {detail ? formatDatetimeInTz(detail.received_at, timezone) : '—'}
          </span>
        </div>
        {statusLabel && (
          <Badge variant={statusVariant} className="text-[10px]">
            {statusLabel}
          </Badge>
        )}
        {detail?.failure_reason && (
          <div className="flex w-full items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
            <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-xs leading-relaxed text-destructive">{detail.failure_reason}</p>
          </div>
        )}
      </div>
    </div>
  )
}
