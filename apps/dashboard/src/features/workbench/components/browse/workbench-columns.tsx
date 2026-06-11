import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import type { TFunction } from 'i18next'
import { Badge } from '@/components/ui/badge'
import { formatCalendarDate } from '@/lib/date'
import type { Invoice } from '@/features/invoices/api/invoices.api'
import {
  formatMoney,
  statusLabel,
  statusVariant,
} from '@/features/invoices/invoices.lib'
import type { WorkbenchSelection } from '../../hooks/use-workbench-selection'

const columnHelper = createColumnHelper<Invoice>()

interface WorkbenchColumnsOptions {
  selection: WorkbenchSelection
  t: TFunction<'workbench'>
}

export function getWorkbenchColumns({ selection, t }: WorkbenchColumnsOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<Invoice, any>[] = [
    columnHelper.display({
      id: 'select',
      header: () => <span className="sr-only">{t('col.select')}</span>,
      cell: (info) => {
        const id = info.row.original.id
        const checked = selection.selectAllMatching || selection.isInvoiceSelected(id)
        return (
          <input
            type="checkbox"
            className="size-4 cursor-pointer accent-primary"
            checked={checked}
            disabled={selection.selectAllMatching}
            aria-label={t('col.selectInvoice')}
            onClick={(e) => e.stopPropagation()}
            onChange={() => selection.toggleInvoice(id)}
          />
        )
      },
    }),
    columnHelper.accessor('invoice_number', {
      header: t('col.invoice'),
      cell: (info) => (
        <span className="font-mono text-sm font-medium">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('supplier_name', {
      header: t('col.supplier'),
      cell: (info) => {
        const ruc = info.row.original.supplier_ruc
        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{info.getValue() || '—'}</p>
            {ruc && (
              <p className="truncate text-xs text-muted-foreground tabular-nums">
                RUC {ruc}
              </p>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('issue_date', {
      header: t('col.issueDate'),
      cell: (info) => {
        const value = info.getValue()
        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {value ? formatCalendarDate(value) : '—'}
          </span>
        )
      },
    }),
    columnHelper.accessor('total', {
      header: () => <div className="text-right">{t('col.total')}</div>,
      cell: (info) => (
        <div className="text-right text-sm font-medium tabular-nums">
          {formatMoney(info.getValue(), info.row.original.currency)}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: t('col.status'),
      cell: (info) => {
        const status = info.getValue()
        return <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
      },
    }),
  ]

  return columns
}
