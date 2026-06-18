import { useTranslation } from 'react-i18next'
import type { BillingDocumentDetail } from '../../api/billing-documents.api'
import { formatMoney, formatNumber } from '../../billing-documents.lib'

interface LineItemsTableProps {
  detail: BillingDocumentDetail
}

export function LineItemsTable({ detail }: LineItemsTableProps) {
  const { t } = useTranslation('billing-documents')
  const items = detail.line_items ?? []
  const currency = detail.header?.currency

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
        <p className="text-sm text-muted-foreground">{t('lineItems.noItems')}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2 font-semibold">{t('lineItems.colNum')}</th>
            <th className="px-3 py-2 font-semibold">{t('lineItems.colDescription')}</th>
            <th className="px-3 py-2 text-right font-semibold">{t('lineItems.colQty')}</th>
            <th className="px-3 py-2 text-right font-semibold">{t('lineItems.colUnitPrice')}</th>
            <th className="px-3 py-2 text-right font-semibold">{t('lineItems.colSubtotal')}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2 tabular-nums text-muted-foreground">
                {item.line_number}
              </td>
              <td className="px-3 py-2">{item.description || '—'}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatNumber(item.quantity)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatMoney(item.unit_price, currency)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatMoney(item.subtotal, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
