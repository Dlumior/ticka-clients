import { useState } from 'react'
import type { Invoice } from '../api/invoices.api'

export function useInvoicesDeletion() {
  const [deleteInvoice, setDeleteInvoice] = useState<Invoice | null>(null)
  return { deleteInvoice, setDeleteInvoice }
}
