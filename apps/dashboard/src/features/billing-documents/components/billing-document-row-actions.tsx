import { useTranslation } from 'react-i18next'
import { RiDeleteBinLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { useBillingDocumentsContext } from '../context/billing-documents.context'
import type { BillingDocument } from '../api/billing-documents.api'

interface BillingDocumentRowActionsProps {
  billingDocument: BillingDocument
}

export function BillingDocumentRowActions({ billingDocument }: BillingDocumentRowActionsProps) {
  const { t } = useTranslation('billing-documents')
  const { deletion: { setDeleteBillingDocument } } = useBillingDocumentsContext()
  return (
    // Stop clicks from bubbling to the row, which would open the detail sheet.
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={t('deleteDialog.ariaLabel')}
        onClick={() => setDeleteBillingDocument(billingDocument)}
      >
        <RiDeleteBinLine className="size-4 text-muted-foreground" />
      </Button>
    </div>
  )
}
