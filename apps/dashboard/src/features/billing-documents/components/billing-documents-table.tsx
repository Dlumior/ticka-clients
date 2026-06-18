import { BillingDocumentsContext } from '../context/billing-documents.context'
import { useBillingDocumentsTable } from '../hooks/use-billing-documents-table'
import { BillingDocumentsToolbar } from './billing-documents-toolbar'
import { BillingDocumentsTableHead } from './billing-documents-table/billing-documents-table-head'
import { BillingDocumentsTableBody } from './billing-documents-table/billing-documents-table-body'
import { BillingDocumentsTablePagination } from './billing-documents-table/billing-documents-table-pagination'
import { BillingDocumentDetailSheet } from './billing-document-detail/index'
import { BillingDocumentDeleteDialog } from './billing-document-delete-dialog'

interface BillingDocumentsTableProps {
  workspaceId: string
  timezone: string
  // When set, the list is scoped to a single supplier (used by the supplier
  // detail page).
  supplierId?: string
}

export function BillingDocumentsTable({
  workspaceId,
  timezone,
  supplierId,
}: BillingDocumentsTableProps) {
  const ctx = useBillingDocumentsTable({ workspaceId, timezone, supplierId })

  return (
    <BillingDocumentsContext.Provider value={ctx}>
      <div className="flex flex-col gap-3">
        <BillingDocumentsToolbar />
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <BillingDocumentsTableHead />
            <BillingDocumentsTableBody />
          </table>
        </div>
        <BillingDocumentsTablePagination />
        <BillingDocumentDetailSheet />
        <BillingDocumentDeleteDialog />
      </div>
    </BillingDocumentsContext.Provider>
  )
}
