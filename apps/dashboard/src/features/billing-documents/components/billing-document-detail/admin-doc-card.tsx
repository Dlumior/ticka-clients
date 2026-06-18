import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { formatCalendarDate } from '@/lib/date'
import type { BillingDocumentDetail } from '../../api/billing-documents.api'
import { Field } from './field'

interface AdminDocCardProps {
  detail: BillingDocumentDetail
}

type RawData = Record<string, unknown>

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function VoidedLines({ lines, t }: { lines: RawData[]; t: TFunction<'billing-documents'> }) {
  if (lines.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{t('detail.voidedLinesTitle')}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colVoidedType')}</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colVoidedSeries')}</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colVoidedNumber')}</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colVoidedReason')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-3 py-2 font-mono text-xs">{str(line.doc_type_code)}</td>
                <td className="px-3 py-2 font-mono text-xs">{str(line.series)}</td>
                <td className="px-3 py-2 font-mono text-xs">{str(line.number)}</td>
                <td className="px-3 py-2 text-xs">{str(line.void_reason)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryLines({ lines, t }: { lines: RawData[]; t: TFunction<'billing-documents'> }) {
  if (lines.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{t('detail.summaryLinesTitle')}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colSummaryDoc')}</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colSummaryType')}</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colSummaryStatus')}</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">{t('detail.colSummaryTotal')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-3 py-2 font-mono text-xs">{str(line.document_id)}</td>
                <td className="px-3 py-2 font-mono text-xs">{str(line.doc_type_code)}</td>
                <td className="px-3 py-2 text-xs">{str(line.status_code)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-xs">
                  {str(line.total)} {str(line.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DespatchLines({ lines, t }: { lines: RawData[]; t: TFunction<'billing-documents'> }) {
  if (lines.length === 0) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{t('detail.despatchLinesTitle')}</p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">{t('detail.colDespatchQty')}</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">{t('detail.colDespatchDesc')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-3 py-2 text-right tabular-nums text-xs">
                  {str(line.quantity)} {str(line.unit_code)}
                </td>
                <td className="px-3 py-2 text-xs">{str(line.description)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminDocCard({ detail }: AdminDocCardProps) {
  const { t } = useTranslation('billing-documents')
  // raw_data is present in the API response but not yet typed in the generated schema.
  // It becomes fully typed after running pnpm generate:types with the updated backend.
  const raw = ((detail.header as unknown as { raw_data?: RawData })?.raw_data) ?? {}
  const billingDocumentType = detail.billing_document_type

  const referenceDate = str(raw.reference_date)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t('detail.adminDocNotice')}</p>

      {referenceDate && (
        <Field
          label={t('detail.fieldReferenceDate')}
          value={formatCalendarDate(referenceDate)}
        />
      )}

      {billingDocumentType === 'comunicacion_baja' && (
        <VoidedLines lines={(raw.voided_lines as RawData[] | undefined) ?? []} t={t} />
      )}

      {billingDocumentType === 'resumen_diario' && (
        <SummaryLines lines={(raw.summary_lines as RawData[] | undefined) ?? []} t={t} />
      )}

      {billingDocumentType === 'guia_remitente' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label={t('detail.fieldRelatedDocument')} value={str(raw.related_invoice)} mono />
            <Field label={t('detail.fieldTransportMode')} value={str(raw.transport_mode)} mono />
            <Field
              label={t('detail.fieldGrossWeight')}
              value={raw.gross_weight ? `${str(raw.gross_weight)} ${str(raw.weight_unit)}` : null}
            />
            <Field label={t('detail.fieldTransitDate')} value={str(raw.transit_date) ? formatCalendarDate(str(raw.transit_date)) : null} />
            <Field label={t('detail.fieldCarrier')} value={str(raw.carrier_name)} />
            <Field label={t('detail.fieldOriginAddress')} value={str(raw.origin_address)} />
            <Field label={t('detail.fieldDeliveryAddress')} value={str(raw.delivery_address)} />
          </div>
          <DespatchLines lines={(raw.despatch_lines as RawData[] | undefined) ?? []} t={t} />
        </div>
      )}
    </div>
  )
}
