import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts'
import { RiBarChartHorizontalLine } from '@remixicon/react'
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
  BillingDocumentType,
  WorkspaceStats,
} from '@/features/workspaces/api/workspace-stats.api'

const TYPE_ORDER: BillingDocumentType[] = [
  'factura',
  'boleta',
  'nota_credito',
  'nota_debito',
  'comunicacion_baja',
  'resumen_diario',
  'guia_remitente',
]

const TYPE_COLOR: Record<BillingDocumentType, string> = {
  factura: 'var(--chart-1)',
  boleta: 'var(--chart-3)',
  nota_credito: 'var(--chart-2)',
  nota_debito: 'var(--chart-4)',
  comunicacion_baja: 'var(--chart-5)',
  resumen_diario: 'var(--muted-foreground)',
  guia_remitente: 'var(--border)',
}

interface BillingDocumentTypeChartProps {
  stats: WorkspaceStats
  className?: string
}

export function BillingDocumentTypeChart({ stats, className }: BillingDocumentTypeChartProps) {
  const { t } = useTranslation('workspaces')
  const byType = stats.billing_documents.by_type

  const data = useMemo(
    () =>
      TYPE_ORDER.map((type) => ({
        type,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: t(`metrics.type.${type}` as any),
        count: byType[type],
        fill: TYPE_COLOR[type],
      })),
    [byType, t],
  )

  const config: ChartConfig = { count: { label: t('metrics.billingDocuments') } }

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RiBarChartHorizontalLine className="size-3.5 shrink-0" />
          <span className="text-xs font-medium tracking-wider uppercase">
            {t('metrics.typeTitle')}
          </span>
        </div>
        <CardTitle className="text-base">{t('metrics.typeHeading')}</CardTitle>
        <CardDescription>{t('metrics.typeDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={config} className="h-full max-h-[180px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={92}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" barSize={22}>
              {data.map((d) => (
                <Cell key={d.type} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
