import { useTranslation } from 'react-i18next'
import {
  RiFileCopyLine,
  RiMailLine,
  RiTimeLine,
  RiUploadCloud2Line,
} from '@remixicon/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatRelative } from '@/lib/date'
import type { WorkspaceStats } from '@/features/workspaces/api/workspace-stats.api'

interface IngestionActivityCardProps {
  stats: WorkspaceStats
  className?: string
}

export function IngestionActivityCard({
  stats,
  className,
}: IngestionActivityCardProps) {
  const { t } = useTranslation('workspaces')
  const { ingestion, billing_documents: billingDocuments } = stats

  const rows = [
    {
      icon: <RiMailLine className="size-4 shrink-0 text-muted-foreground" />,
      label: t('metrics.emailsReceived'),
      value: ingestion.emails_total.toLocaleString(),
    },
    {
      icon: <RiFileCopyLine className="size-4 shrink-0 text-muted-foreground" />,
      label: t('metrics.duplicatesDetected'),
      value: ingestion.duplicates.toLocaleString(),
    },
    {
      icon: (
        <RiUploadCloud2Line className="size-4 shrink-0 text-muted-foreground" />
      ),
      label: t('metrics.manualUploads'),
      value: ingestion.manual_uploads.toLocaleString(),
    },
    {
      icon: <RiTimeLine className="size-4 shrink-0 text-muted-foreground" />,
      label: t('metrics.lastBillingDocument'),
      value: billingDocuments.last_received_at
        ? formatRelative(billingDocuments.last_received_at)
        : '—',
    },
  ]

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RiMailLine className="size-3.5 shrink-0" />
          <span className="text-xs font-medium tracking-wider uppercase">
            {t('metrics.ingestionTitle')}
          </span>
        </div>
        <CardTitle className="text-base">
          {t('metrics.ingestionHeading')}
        </CardTitle>
        <CardDescription>{t('metrics.ingestionDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        <dl className="flex flex-col">
          {rows.map((row, index) => (
            <div key={row.label}>
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between gap-3 py-2.5">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  {row.icon}
                  {row.label}
                </dt>
                <dd className="font-mono text-sm tabular-nums">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
