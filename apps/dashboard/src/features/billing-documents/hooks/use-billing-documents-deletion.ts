import { useState } from 'react'
import type { BillingDocument } from '../api/billing-documents.api'

export function useBillingDocumentsDeletion() {
  const [deleteBillingDocument, setDeleteBillingDocument] = useState<BillingDocument | null>(null)
  return { deleteBillingDocument, setDeleteBillingDocument }
}
