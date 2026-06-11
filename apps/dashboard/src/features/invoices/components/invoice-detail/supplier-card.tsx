import { useTranslation } from 'react-i18next'
import { RiBuilding2Line } from '@remixicon/react'
import type { InvoiceDetail } from '../../api/invoices.api'
import { Field } from './field'

interface SupplierCardProps {
  detail: InvoiceDetail
}

export function SupplierCard({ detail }: SupplierCardProps) {
  const { t } = useTranslation('invoices')
  const supplier = detail.supplier
  const header = detail.header
  const name = supplier?.name || header?.supplier_name
  const ruc = supplier?.ruc || header?.supplier_ruc

  if (!name && !ruc) return null

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <RiBuilding2Line className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{name || '—'}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('detail.fieldRuc')} value={ruc} mono />
        {supplier?.phone && <Field label={t('detail.fieldPhone')} value={supplier.phone} />}
        {supplier?.email && <Field label={t('detail.fieldEmail')} value={supplier.email} />}
        {supplier?.address && <Field label={t('detail.fieldAddress')} value={supplier.address} />}
      </div>
    </div>
  )
}
