import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { formatCalendarDate, formatDatetimeInTz } from '@/lib/date'
import { useInvoicesContext } from '../../context/invoices.context'
import type { InvoiceDetail } from '../../api/invoices.api'
import { AmountsCard } from './amounts-card'
import { Field } from './field'
import { LineItemsTable } from './line-items-table'
import { SectionLabel } from './section-label'
import { SourceField } from './source-field'
import { SupplierCard } from './supplier-card'

interface DetailBodyProps {
  detail: InvoiceDetail
}

export function DetailBody({ detail }: DetailBodyProps) {
  const { t } = useTranslation('invoices')
  const { timezone } = useInvoicesContext()
  const header = detail.header

  return (
    <>
      {/* Details */}
      <div className="flex flex-col gap-3">
        <SectionLabel>{t('detail.sectionDetails')}</SectionLabel>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field
            label={t('detail.fieldIssueDate')}
            value={header?.issue_date ? formatCalendarDate(header.issue_date) : null}
          />
          <Field
            label={t('detail.fieldDueDate')}
            value={header?.due_date ? formatCalendarDate(header.due_date) : null}
          />
          <Field label={t('detail.fieldCurrency')} value={header?.currency} />
          <Field
            label={t('detail.fieldReceived')}
            value={
              detail.received_at
                ? formatDatetimeInTz(detail.received_at, timezone)
                : null
            }
          />
          <Field label={t('detail.fieldFormat')} value={detail.source_type?.toUpperCase()} />
          <Field label={t('detail.fieldSender')} value={detail.sender_email} />
          <SourceField detail={detail} />
        </div>
        {detail.tags && detail.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {detail.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Amounts + Supplier */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <SectionLabel>{t('detail.sectionAmounts')}</SectionLabel>
          {header ? (
            <AmountsCard detail={detail} />
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
              <p className="text-sm text-muted-foreground">{t('detail.notParsed')}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <SectionLabel>{t('detail.sectionSupplier')}</SectionLabel>
          <SupplierCard detail={detail} />
        </div>
      </div>

      {/* Line items */}
      <div className="flex flex-col gap-3">
        <SectionLabel>{t('detail.sectionLineItems')}</SectionLabel>
        <LineItemsTable detail={detail} />
      </div>
    </>
  )
}
