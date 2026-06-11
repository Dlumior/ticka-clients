import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDatetimeInTz } from '@/lib/date'
import { useExports } from '../../api/workbench.api'
import { exportStatusVariant, formatBytes } from '../../workbench.lib'
import { ExportRowActions } from './export-row-actions'

interface ExportsTabProps {
  workspaceId: string
  timezone: string
}

const PAGE_SIZE = 20

export function ExportsTab({ workspaceId, timezone }: ExportsTabProps) {
  const { t } = useTranslation('workbench')
  const [pageIndex, setPageIndex] = useState(0)
  const { data, isLoading } = useExports(workspaceId, {
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
  })

  const totalCount = data?.count ?? 0
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const rows = data?.results ?? []

  const exportStatusLabels: Record<string, string> = {
    pending: t('exports.exportStatus.pending'),
    processing: t('exports.exportStatus.processing'),
    completed: t('exports.exportStatus.completed'),
    failed: t('exports.exportStatus.failed'),
  }

  function formatRange(
    start: string | null | undefined,
    end: string | null | undefined,
  ): string {
    if (start && end) return `${start} → ${end}`
    if (start) return t('range.from', { date: start })
    if (end) return t('range.until', { date: end })
    return t('range.allDates')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">{t('exports.colTemplate')}</th>
              <th className="px-3 py-2 font-medium">{t('exports.colRange')}</th>
              <th className="px-3 py-2 font-medium">{t('exports.colStatus')}</th>
              <th className="px-3 py-2 font-medium text-right">{t('exports.colRows')}</th>
              <th className="px-3 py-2 font-medium text-right">{t('exports.colInvoices')}</th>
              <th className="px-3 py-2 font-medium text-right">{t('exports.colSize')}</th>
              <th className="px-3 py-2 font-medium">{t('exports.colCreated')}</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-3 py-3">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-12 text-center text-sm text-muted-foreground"
                >
                  {t('exports.noExports')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3 font-medium">
                    {row.template_name || '—'}
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground tabular-nums">
                    {formatRange(row.start_date, row.end_date)}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={exportStatusVariant(row.status)}>
                      {exportStatusLabels[row.status ?? ''] ?? row.status ?? '—'}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {row.row_count}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {row.invoice_count}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatBytes(row.file_size_bytes)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-xs text-muted-foreground">
                    {formatDatetimeInTz(row.created_at, timezone)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <ExportRowActions workspaceId={workspaceId} export={row} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {totalCount > 0 ? t('pagination.total', { count: totalCount }) : ''}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {t('pagination.page', { current: pageIndex + 1, pageCount })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
          >
            {t('pagination.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((p) => p + 1)}
            disabled={pageIndex + 1 >= pageCount}
          >
            {t('pagination.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
