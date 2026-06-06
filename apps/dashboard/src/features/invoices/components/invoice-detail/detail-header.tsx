import { RiDeleteBinLine, RiErrorWarningLine, RiFileTextLine } from '@remixicon/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useInvoicesContext } from '../../context/invoices.context'
import type { Invoice, InvoiceDetail } from '../../api/invoices.api'
import { statusLabel, statusVariant, typeLabel } from '../../invoices.lib'

interface DetailHeaderProps {
  invoice: Invoice | null
  detail: InvoiceDetail | undefined
  invoiceNumber: string
}

export function DetailHeader({ invoice, detail, invoiceNumber }: DetailHeaderProps) {
  const { permissions: { canManage }, deletion: { setDeleteInvoice } } = useInvoicesContext()

  const status = detail?.status ?? invoice?.status
  const invoiceType = detail?.invoice_type ?? invoice?.invoice_type

  return (
    <div className="shrink-0 border-b bg-muted/20">
      <div className="flex items-start justify-between gap-4 px-6 py-4">
        <SheetHeader className="gap-1 text-left">
          <SheetTitle className="flex items-center gap-2 text-base leading-snug">
            <RiFileTextLine className="size-4 text-muted-foreground" />
            <span className="font-mono">{invoiceNumber}</span>
          </SheetTitle>
          <SheetDescription className="text-sm">
            {detail?.header?.supplier_name ||
              detail?.supplier?.name ||
              invoice?.supplier_name ||
              'Supplier not identified'}
          </SheetDescription>
        </SheetHeader>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
            <Badge variant="outline">{typeLabel(invoiceType)}</Badge>
          </div>
          {invoice && canManage && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteInvoice(invoice)}
            >
              <RiDeleteBinLine />
              Delete
            </Button>
          )}
        </div>
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
