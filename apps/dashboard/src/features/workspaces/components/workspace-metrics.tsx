import { useTranslation } from 'react-i18next'
import { RiInboxLine } from '@remixicon/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspaceStats } from '@/features/workspaces/api/workspace-stats.api'
import { IngestionActivityCard } from './ingestion-activity-card'
import { BillingDocumentStatusChart } from './billing-document-status-chart'
import { BillingDocumentTypeChart } from './billing-document-type-chart'
import { TopSuppliersCard } from './top-suppliers-card'
import { WorkspaceStatCards } from './workspace-stat-cards'

interface WorkspaceMetricsProps {
  workspaceId: string
  inboxEmail: string
}

export function WorkspaceMetrics({
  workspaceId,
  inboxEmail,
}: WorkspaceMetricsProps) {
  const { t } = useTranslation('workspaces')
  const { data: stats, isPending, isError } = useWorkspaceStats(workspaceId)

  if (isPending) return <MetricsSkeleton />

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('metrics.errorTitle')}</AlertTitle>
        <AlertDescription>{t('metrics.errorDesc')}</AlertDescription>
      </Alert>
    )
  }

  if (stats.billing_documents.total === 0) {
    return (
      <Card>
        <CardContent>
          <Empty className="border-none">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RiInboxLine />
              </EmptyMedia>
              <EmptyTitle>{t('metrics.emptyTitle')}</EmptyTitle>
              <EmptyDescription>{t('metrics.emptyDesc')}</EmptyDescription>
            </EmptyHeader>
            <span className="font-mono text-sm text-primary">{inboxEmail}</span>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <WorkspaceStatCards stats={stats} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BillingDocumentStatusChart stats={stats} className="lg:col-span-2" />
        <IngestionActivityCard stats={stats} />
        <TopSuppliersCard stats={stats} className="lg:col-span-2" />
        <BillingDocumentTypeChart stats={stats} />
      </div>
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-3.5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
              <Skeleton className="mt-2 h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
        <Skeleton className="h-56 lg:col-span-2" />
        <Skeleton className="h-56" />
      </div>
    </div>
  )
}
