import { useTranslation } from 'react-i18next'
import { RiStore2Line } from '@remixicon/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/lib/utils'
import type { WorkspaceStats } from '@/features/workspaces/api/workspace-stats.api'

interface TopSuppliersCardProps {
  stats: WorkspaceStats
  className?: string
}

export function TopSuppliersCard({ stats, className }: TopSuppliersCardProps) {
  const { t } = useTranslation('workspaces')
  const top = stats.suppliers.top
  const max = Math.max(...top.map((s) => s.billing_document_count), 1)

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RiStore2Line className="size-3.5 shrink-0" />
          <span className="text-xs font-medium tracking-wider uppercase">
            {t('metrics.topSuppliersTitle')}
          </span>
        </div>
        <CardTitle className="text-base">
          {t('metrics.topSuppliersHeading')}
        </CardTitle>
        <CardDescription>{t('metrics.topSuppliersDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {top.length === 0 ? (
          <Empty className="h-full border-none p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RiStore2Line />
              </EmptyMedia>
              <EmptyTitle>{t('metrics.noSuppliersTitle')}</EmptyTitle>
              <EmptyDescription>{t('metrics.noSuppliersDesc')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ol className="flex flex-col gap-4">
            {top.map((supplier, index) => (
              <li key={supplier.ruc} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm font-medium">
                      {supplier.name || supplier.ruc}
                    </span>
                  </span>
                  <span className="font-mono text-sm tabular-nums">
                    {supplier.billing_document_count.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(supplier.billing_document_count / max) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
