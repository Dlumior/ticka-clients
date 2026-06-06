import { useCallback, useState } from 'react'
import type { Invoice } from '../api/invoices.api'

export function useInvoicesDetail() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const openDetail = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setSheetOpen(true)
  }, [])

  const closeDetail = useCallback(() => {
    setSheetOpen(false)
    setSelectedInvoice(null)
  }, [])

  return { selectedInvoice, sheetOpen, openDetail, closeDetail }
}
