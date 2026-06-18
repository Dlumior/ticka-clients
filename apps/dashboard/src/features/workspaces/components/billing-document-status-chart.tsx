import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Label, Pie, PieChart } from 'recharts'
import { RiPieChartLine } from '@remixicon/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import type {
  BillingDocumentStatus,
  WorkspaceStats,
} from '@/features/workspaces/api/workspace-stats.api'

// Pipeline order, with a color per stage. Terminal states use semantic tokens
// (primary for the happy path, destructive for failures); the rest walk the
// chart palette so the donut reads as a progression.
const STATUS_ORDER: BillingDocumentStatus[] = [
  'received',
  'parsing',
  'parsed',
  'review_needed',
  'approved',
  'exported',
  'failed',
]

const STATUS_COLOR: Record<BillingDocumentStatus, string> = {
  received: 'var(--chart-5)',
  parsing: 'var(--chart-4)',
  parsed: 'var(--chart-3)',
  review_needed: 'var(--chart-2)',
  approved: 'var(--chart-1)',
  exported: 'var(--primary)',
  failed: 'var(--destructive)',
}

interface BillingDocumentStatusChartProps {
  stats: WorkspaceStats
  className?: string
}

export function BillingDocumentStatusChart({ stats, className }: BillingDocumentStatusChartProps) {
  const { t } = useTranslation('workspaces')
  const byStatus = stats.billing_documents.by_status
  const total = stats.billing_documents.total

  const data = useMemo(
    () =>
      STATUS_ORDER.filter((status) => byStatus[status] > 0).map((status) => ({
        status,
        count: byStatus[status],
        fill: STATUS_COLOR[status],
      })),
    [byStatus],
  )

  const config = useMemo(() => {
    const c: ChartConfig = { count: { label: t('metrics.billingDocuments') } }
    for (const status of STATUS_ORDER) {
      c[status] = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: t(`metrics.status.${status}` as any),
        color: STATUS_COLOR[status],
      }
    }
    return c
  }, [t])

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RiPieChartLine className="size-3.5 shrink-0" />
          <span className="text-xs font-medium tracking-wider uppercase">
            {t('metrics.statusTitle')}
          </span>
        </div>
        <CardTitle className="text-base">{t('metrics.statusHeading')}</CardTitle>
        <CardDescription>{t('metrics.statusDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square w-full max-w-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={58}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox)) return null
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold tabular-nums"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 22}
                        className="fill-muted-foreground text-xs"
                      >
                        {t('metrics.billingDocuments')}
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex flex-1 flex-col gap-2">
          {data.map((d) => (
            <li
              key={d.status}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2.5 shrink-0"
                  style={{ backgroundColor: d.fill }}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`metrics.status.${d.status}` as any)}
              </span>
              <span className="font-mono tabular-nums">
                {d.count.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
