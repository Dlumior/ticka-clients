import { useTranslation } from 'react-i18next'
import {
  RiErrorWarningLine,
  RiFileList3Line,
  RiMailCheckLine,
  RiStore2Line,
} from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { WorkspaceStats } from '@/features/workspaces/api/workspace-stats.api'

interface WorkspaceStatCardsProps {
  stats: WorkspaceStats
}

function ratio(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0
}

export function WorkspaceStatCards({ stats }: WorkspaceStatCardsProps) {
  const { t } = useTranslation('workspaces')
  const { billing_documents: billingDocuments, suppliers, ingestion } = stats

  const approved = billingDocuments.by_status.approved + billingDocuments.by_status.exported
  const approvalRate = ratio(approved, billingDocuments.total)
  const attentionRate = ratio(billingDocuments.needs_attention, billingDocuments.total)
  const completionRate = ratio(
    ingestion.attachments_completed,
    ingestion.attachments_total,
  )

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={<RiFileList3Line className="size-3.5 shrink-0" />}
        label={t('metrics.totalBillingDocuments')}
        value={billingDocuments.total}
        caption={t('metrics.approvedRate', { rate: approvalRate })}
      />
      <StatCard
        icon={<RiErrorWarningLine className="size-3.5 shrink-0" />}
        label={t('metrics.needsAttention')}
        value={billingDocuments.needs_attention}
        caption={t('metrics.percentOfTotal', { rate: attentionRate })}
        badge={
          billingDocuments.needs_attention > 0 ? (
            <Badge variant="destructive">{t('metrics.actionRequired')}</Badge>
          ) : (
            <Badge variant="secondary">{t('metrics.allClear')}</Badge>
          )
        }
      />
      <StatCard
        icon={<RiStore2Line className="size-3.5 shrink-0" />}
        label={t('metrics.suppliers')}
        value={suppliers.total}
        caption={t('metrics.uniqueVendors')}
      />
      <StatCard
        icon={<RiMailCheckLine className="size-3.5 shrink-0" />}
        label={t('metrics.processed')}
        value={ingestion.attachments_completed}
        caption={t('metrics.ofReceived', {
          rate: completionRate,
          total: ingestion.attachments_total,
        })}
      />
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  caption: string
  badge?: React.ReactNode
}

function StatCard({ icon, label, value, caption, badge }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {icon}
            <span className="text-xs font-medium tracking-wider uppercase">
              {label}
            </span>
          </div>
          {badge}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold tabular-nums leading-none">
          {value.toLocaleString()}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      </CardContent>
    </Card>
  )
}
