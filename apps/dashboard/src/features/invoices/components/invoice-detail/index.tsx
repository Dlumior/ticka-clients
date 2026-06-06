import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useInvoicesContext } from '../../context/invoices.context'
import { useInvoiceDetail } from '../../api/invoices.api'
import { DetailBody } from './detail-body'
import { DetailHeader } from './detail-header'

export function InvoiceDetailSheet() {
  const { workspaceId, detail: { selectedInvoice, sheetOpen, closeDetail } } = useInvoicesContext()

  const { data: invoiceDetail, isFetching } = useInvoiceDetail(
    workspaceId,
    selectedInvoice?.id ?? '',
  )

  const header = invoiceDetail?.header
  const invoiceNumber =
    header?.invoice_number || selectedInvoice?.invoice_number || '(unparsed)'
  const loading = isFetching && !invoiceDetail

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) closeDetail() }}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0"
        style={{ maxWidth: 'min(900px, 90vw)' }}
      >
        <DetailHeader
          invoice={selectedInvoice}
          detail={invoiceDetail}
          invoiceNumber={invoiceNumber}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ) : !invoiceDetail ? (
            <p className="text-sm text-muted-foreground">
              Unable to load invoice details.
            </p>
          ) : (
            <DetailBody detail={invoiceDetail} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
