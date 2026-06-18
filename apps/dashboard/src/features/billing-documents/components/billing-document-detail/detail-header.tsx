import { useTranslation } from 'react-i18next'
import { RiCloseLine, RiDeleteBinLine, RiErrorWarningLine, RiFileTextLine } from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useBillingDocumentsContext } from '../../context/billing-documents.context'
import type { BillingDocument, BillingDocumentDetail } from '../../api/billing-documents.api'
import { statusVariant } from '../../billing-documents.lib'

interface DetailHeaderProps {
  billingDocument: BillingDocument | null
  detail: BillingDocumentDetail | undefined
  billingDocumentNumber: string
}

export function DetailHeader({ billingDocument, detail, billingDocumentNumber }: DetailHeaderProps) {
  const { t } = useTranslation('billing-documents')
  const { permissions: { canManage }, deletion: { setDeleteBillingDocument } } = useBillingDocumentsContext()

  const status = detail?.status ?? billingDocument?.status
  const billingDocumentType = detail?.billing_document_type ?? billingDocument?.billing_document_type
  const operationType = detail?.operation_type as string | null | undefined

  return (
    <div className="shrink-0 border-b bg-muted/20">
      <div className="flex items-start gap-4 px-6 pb-3 pt-4">
        <SheetHeader className="min-w-0 flex-1 gap-1 text-left">
          <SheetTitle className="flex items-center gap-2 text-base leading-snug">
            <RiFileTextLine className="size-4 shrink-0 text-muted-foreground" />
            <span className="font-mono">{billingDocumentNumber}</span>
          </SheetTitle>
          <SheetDescription className="text-sm">
            {detail?.header?.supplier_name ||
              detail?.supplier?.name ||
              billingDocument?.supplier_name ||
              t('detail.supplierNotIdentified')}
          </SheetDescription>
        </SheetHeader>
        <SheetClose
          render={<Button variant="ghost" size="icon-sm" className="shrink-0" />}
        >
          <RiCloseLine />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant(status)}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {status ? t(`status.${status}` as any, { defaultValue: status }) : '—'}
          </Badge>
          <Badge variant="outline">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {billingDocumentType ? t(`type.${billingDocumentType}` as any, { defaultValue: billingDocumentType }) : '—'}
          </Badge>
          {operationType && operationType !== 'gravada' && (
            <Badge variant="secondary">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(`operationType.${operationType}` as any, { defaultValue: operationType })}
            </Badge>
          )}
        </div>
        {billingDocument && canManage && (
          <Button
            variant="destructive"
            size="sm"
            className="shrink-0"
            onClick={() => setDeleteBillingDocument(billingDocument)}
          >
            <RiDeleteBinLine />
            {t('detail.deleteBtn')}
          </Button>
        )}
      </div>

      {detail?.failure_reason && (
        <div className="mx-6 mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-xs leading-relaxed text-destructive">
            {detail.failure_reason}
          </p>
        </div>
      )}
    </div>
  )
}
