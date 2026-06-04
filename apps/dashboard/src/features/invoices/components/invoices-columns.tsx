import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatCalendarDate } from '@/lib/date'
import type { Invoice } from '../api/invoices.api'
import {
  formatMoney,
  statusLabel,
  statusVariant,
  typeLabel,
} from '../invoices.lib'

const columnHelper = createColumnHelper<Invoice>()

export function getInvoicesColumns() {
  return [
    columnHelper.accessor('invoice_number', {
      header: 'Invoice',
      cell: (info) => (
        <span className="font-mono text-sm font-medium">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('supplier_name', {
      header: 'Supplier',
      cell: (info) => {
        const ruc = info.row.original.supplier_ruc
        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {info.getValue() || '—'}
            </p>
            {ruc && (
              <p className="truncate text-xs text-muted-foreground tabular-nums">
                RUC {ruc}
              </p>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('invoice_type', {
      header: 'Type',
      cell: (info) => (
        <span className="text-sm">{typeLabel(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('issue_date', {
      header: 'Issue date',
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
      header: () => <div className="text-right">Total</div>,
      cell: (info) => (
        <div className="text-right text-sm font-medium tabular-nums">
          {formatMoney(info.getValue(), info.row.original.currency)}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
        return (
          <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
        )
      },
    }),
  ]
}
