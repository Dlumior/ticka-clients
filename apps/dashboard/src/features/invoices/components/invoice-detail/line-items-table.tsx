import type { InvoiceDetail } from '../../api/invoices.api'
import { formatMoney, formatNumber } from '../../invoices.lib'

interface LineItemsTableProps {
  detail: InvoiceDetail
}

export function LineItemsTable({ detail }: LineItemsTableProps) {
  const items = detail.line_items ?? []
  const currency = detail.header?.currency

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
        <p className="text-sm text-muted-foreground">No line items.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2 font-semibold">#</th>
            <th className="px-3 py-2 font-semibold">Description</th>
            <th className="px-3 py-2 text-right font-semibold">Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Unit price</th>
            <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
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
