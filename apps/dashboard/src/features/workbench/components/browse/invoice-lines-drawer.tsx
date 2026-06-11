import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useInvoiceDetail } from '@/features/invoices/api/invoices.api'
import { formatMoney, formatNumber } from '@/features/invoices/invoices.lib'
import { useWorkbenchContext } from '../../context/workbench.context'

export function InvoiceLinesDrawer() {
  const { t } = useTranslation('workbench')
  const { workspaceId, lines, selection } = useWorkbenchContext()
  const open = lines.invoiceId !== null
  const { data: invoice, isLoading } = useInvoiceDetail(
    workspaceId,
    lines.invoiceId ?? '',
  )

  return (
    <Sheet open={open} onOpenChange={(o) => !o && lines.close()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {invoice?.header?.invoice_number || t('invoiceLines.title')}
          </SheetTitle>
          <SheetDescription>
            {t('invoiceLines.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : !invoice || invoice.line_items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t('invoiceLines.empty')}
            </p>
          ) : (
            <ul className="flex flex-col divide-y">
              {invoice.line_items.map((line) => {
                const checked = selection.isLineItemSelected(line.id)
                return (
                  <li key={line.id} className="flex items-start gap-3 py-3">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 cursor-pointer accent-primary"
                      checked={checked}
                      aria-label={t('invoiceLines.selectLineItem')}
                      onChange={() => selection.toggleLineItem(line.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {line.description ||
                          t('invoiceLines.line', { number: line.line_number })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('invoiceLines.qty')} {formatNumber(line.quantity)} ·{' '}
                        {formatMoney(line.subtotal, invoice.header?.currency)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
