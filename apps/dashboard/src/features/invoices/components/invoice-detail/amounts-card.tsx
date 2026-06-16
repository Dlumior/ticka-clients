import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import type { InvoiceDetail } from '../../api/invoices.api'
import { formatMoney, formatNumber } from '../../invoices.lib'

interface AmountsCardProps {
  detail: InvoiceDetail
}

function AmountRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

export function AmountsCard({ detail }: AmountsCardProps) {
  const { t } = useTranslation('invoices')
  const header = detail.header
  if (!header) return null

  const currency = header.currency

  return (
    <div className="flex flex-col gap-3">
      {/* Core amounts */}
      <div className="rounded-lg border bg-muted/20 p-4">
        <div className="flex flex-col gap-2">
          <AmountRow
            label={t('detail.fieldSubtotal')}
            value={formatMoney(header.subtotal, currency)}
          />
          <AmountRow
            label={t('detail.fieldIgv')}
            value={formatMoney(header.igv_amount, currency)}
          />
          {header.icbper_amount != null && (
            <AmountRow
              label={t('detail.fieldIcbper')}
              value={formatMoney(header.icbper_amount, currency)}
            />
          )}
          {header.perception_amount != null && (
            <AmountRow
              label={t('detail.fieldPerceptionAmount')}
              value={formatMoney(header.perception_amount, currency)}
            />
          )}
          {header.prepaid_amount != null && (
            <AmountRow
              label={t('detail.fieldPrepaidAmount')}
              value={`-${formatMoney(header.prepaid_amount, currency)}`}
            />
          )}
          <Separator />
          <div className="flex items-center justify-between text-base font-semibold">
            <span>{t('detail.fieldTotal')}</span>
            <span className="tabular-nums">{formatMoney(header.total, currency)}</span>
          </div>
        </div>
      </div>

      {/* Detraction block */}
      {header.detraction_amount != null && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('detail.sectionDetraction')}
          </p>
          <div className="flex flex-col gap-2">
            {header.detraction_service_code && (
              <AmountRow
                label={t('detail.fieldDetractionCode')}
                value={header.detraction_service_code}
              />
            )}
            {header.detraction_account && (
              <AmountRow
                label={t('detail.fieldDetractionAccount')}
                value={header.detraction_account}
              />
            )}
            {header.detraction_percent != null && (
              <AmountRow
                label={t('detail.fieldDetractionPercent')}
                value={`${formatNumber(header.detraction_percent)}%`}
              />
            )}
            <AmountRow
              label={t('detail.fieldDetractionAmount')}
              value={formatMoney(header.detraction_amount, currency)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
