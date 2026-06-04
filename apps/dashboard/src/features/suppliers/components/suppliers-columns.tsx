import { createColumnHelper } from '@tanstack/react-table'
import type { Supplier } from '../api/suppliers.api'

const columnHelper = createColumnHelper<Supplier>()

export function getSuppliersColumns() {
  return [
    columnHelper.accessor('name', {
      header: 'Supplier',
      cell: (info) => (
        <span className="text-sm font-medium">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.accessor('ruc', {
      header: 'RUC',
      cell: (info) => (
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <span className="truncate text-sm text-muted-foreground">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('invoice_count', {
      header: () => <div className="text-right">Invoices</div>,
      cell: (info) => (
        <div className="text-right text-sm font-medium tabular-nums">
          {info.getValue()}
        </div>
      ),
    }),
  ]
}
