import { useTranslation } from 'react-i18next'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useBillingDocumentDetail } from '@/features/billing-documents/api/billing-documents.api'
import { formatMoney, formatNumber } from '@/features/billing-documents/billing-documents.lib'
import { useWorkbenchContext } from '../../context/workbench.context'

export function BillingDocumentLinesDrawer() {
  const { t } = useTranslation('workbench')
  const { workspaceId, lines, selection } = useWorkbenchContext()
  const open = lines.billingDocumentId !== null
  const { data: billingDocument, isLoading } = useBillingDocumentDetail(
    workspaceId,
    lines.billingDocumentId ?? '',
  )

  return (
    <Sheet open={open} onOpenChange={(o) => !o && lines.close()}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {billingDocument?.header?.invoice_number || t('billingDocumentLines.title')}
          </SheetTitle>
          <SheetDescription>
            {t('billingDocumentLines.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : !billingDocument || billingDocument.line_items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t('billingDocumentLines.empty')}
            </p>
          ) : (
            <ul className="flex flex-col divide-y">
              {billingDocument.line_items.map((line) => {
                const checked = selection.isLineItemSelected(line.id)
                return (
                  <li key={line.id} className="flex items-start gap-3 py-3">
                    <input
                      type="checkbox"
                      className="mt-1 size-4 cursor-pointer accent-primary"
                      checked={checked}
                      aria-label={t('billingDocumentLines.selectLineItem')}
                      onChange={() => selection.toggleLineItem(line.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {line.description ||
                          t('billingDocumentLines.line', { number: line.line_number })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('billingDocumentLines.qty')} {formatNumber(line.quantity)} ·{' '}
                        {formatMoney(line.subtotal, billingDocument.header?.currency)}
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
