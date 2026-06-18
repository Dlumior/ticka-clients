import type { TFunction } from 'i18next'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatCalendarDate } from '@/lib/date'
import type { BillingDocument } from '../api/billing-documents.api'
import {
  formatMoney,
  statusVariant,
} from '../billing-documents.lib'
import { BillingDocumentRowActions } from './billing-document-row-actions'

const columnHelper = createColumnHelper<BillingDocument>()

interface BillingDocumentsColumnActions {
  canManage: boolean
  t: TFunction<'billing-documents'>
}

export function getBillingDocumentsColumns({ canManage, t }: BillingDocumentsColumnActions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<BillingDocument, any>[] = [
    columnHelper.accessor('invoice_number', {
      header: t('col.document'),
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
    columnHelper.accessor('billing_document_type', {
      header: t('col.type'),
      cell: (info) => {
        const val = info.getValue()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <span className="text-sm">{val ? t(`type.${val}` as any, { defaultValue: val }) : '—'}</span>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const label = status ? t(`status.${status}` as any, { defaultValue: status }) : '—'
        return (
          <Badge variant={statusVariant(status)}>{label}</Badge>
        )
      },
    }),
  ]

  if (canManage) {
    columns.push(
      columnHelper.display({
        id: 'actions',
        header: () => <span className="sr-only">{t('col.actions')}</span>,
        cell: (info) => <BillingDocumentRowActions billingDocument={info.row.original} />,
      }),
    )
  }

  return columns
}
