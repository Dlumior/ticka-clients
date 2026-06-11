import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import type { InvoiceDetail } from '../../api/invoices.api'
import { formatMoney } from '../../invoices.lib'

interface AmountsCardProps {
  detail: InvoiceDetail
}

export function AmountsCard({ detail }: AmountsCardProps) {
  const { t } = useTranslation('invoices')
  const header = detail.header
  if (!header) return null
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('detail.fieldSubtotal')}</span>
          <span className="tabular-nums">
            {formatMoney(header.subtotal, header.currency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('detail.fieldIgv')}</span>
          <span className="tabular-nums">
            {formatMoney(header.igv_amount, header.currency)}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-base font-semibold">
          <span>{t('detail.fieldTotal')}</span>
          <span className="tabular-nums">
            {formatMoney(header.total, header.currency)}
          </span>
        </div>
      </div>
    </div>
  )
}
