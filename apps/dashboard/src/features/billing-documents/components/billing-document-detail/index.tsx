import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useBillingDocumentsContext } from '../../context/billing-documents.context'
import { useBillingDocumentDetail } from '../../api/billing-documents.api'
import { DetailBody } from './detail-body'
import { DetailHeader } from './detail-header'

export function BillingDocumentDetailSheet() {
  const { t } = useTranslation('billing-documents')
  const { workspaceId, detail: { selectedBillingDocument, sheetOpen, closeDetail } } = useBillingDocumentsContext()

  const { data: billingDocumentDetail, isFetching } = useBillingDocumentDetail(
    workspaceId,
    selectedBillingDocument?.id ?? '',
  )

  const header = billingDocumentDetail?.header
  const billingDocumentNumber =
    header?.invoice_number || selectedBillingDocument?.invoice_number || t('detail.unparsed')
  const loading = isFetching && !billingDocumentDetail

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) closeDetail() }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 overflow-hidden p-0"
        style={{ maxWidth: 'min(900px, 90vw)' }}
      >
        <DetailHeader
          billingDocument={selectedBillingDocument}
          detail={billingDocumentDetail}
          billingDocumentNumber={billingDocumentNumber}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ) : !billingDocumentDetail ? (
            <p className="text-sm text-muted-foreground">
              {t('detail.loadError')}
            </p>
          ) : (
            <DetailBody detail={billingDocumentDetail} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
