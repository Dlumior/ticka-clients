import type { TFunction } from 'i18next'
import { createColumnHelper } from '@tanstack/react-table'
import type { Supplier } from '../api/suppliers.api'

const columnHelper = createColumnHelper<Supplier>()

export function getSuppliersColumns(t: TFunction<'suppliers'>) {
  return [
    columnHelper.accessor('name', {
      header: t('col.supplier'),
      cell: (info) => (
        <span className="text-sm font-medium">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.accessor('ruc', {
      header: t('col.ruc'),
      cell: (info) => (
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('email', {
      header: t('col.email'),
      cell: (info) => (
        <span className="truncate text-sm text-muted-foreground">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('phone', {
      header: t('col.phone'),
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {info.getValue() || '—'}
        </span>
      ),
    }),
    columnHelper.accessor('invoice_count', {
      header: () => <div className="text-right">{t('col.invoices')}</div>,
      cell: (info) => (
        <div className="text-right text-sm font-medium tabular-nums">
          {info.getValue()}
        </div>
      ),
    }),
  ]
}
