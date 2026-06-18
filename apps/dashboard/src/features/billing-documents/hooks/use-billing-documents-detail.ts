import { useCallback, useState } from 'react'
import type { BillingDocument } from '../api/billing-documents.api'

export function useBillingDocumentsDetail() {
  const [selectedBillingDocument, setSelectedBillingDocument] = useState<BillingDocument | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const openDetail = useCallback((billingDocument: BillingDocument) => {
    setSelectedBillingDocument(billingDocument)
    setSheetOpen(true)
  }, [])

  const closeDetail = useCallback(() => {
    setSheetOpen(false)
    setSelectedBillingDocument(null)
  }, [])

  return { selectedBillingDocument, sheetOpen, openDetail, closeDetail }
}
