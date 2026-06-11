import { useTranslation } from 'react-i18next'
import { RiDeleteBinLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { useInvoicesContext } from '../context/invoices.context'
import type { Invoice } from '../api/invoices.api'

interface InvoiceRowActionsProps {
  invoice: Invoice
}

export function InvoiceRowActions({ invoice }: InvoiceRowActionsProps) {
  const { t } = useTranslation('invoices')
  const { deletion: { setDeleteInvoice } } = useInvoicesContext()
  return (
    // Stop clicks from bubbling to the row, which would open the detail sheet.
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={t('deleteDialog.ariaLabel')}
        onClick={() => setDeleteInvoice(invoice)}
      >
        <RiDeleteBinLine className="size-4 text-muted-foreground" />
      </Button>
    </div>
  )
}
