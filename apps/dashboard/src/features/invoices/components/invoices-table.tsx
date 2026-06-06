import { InvoicesContext } from '../context/invoices.context'
import { useInvoicesTable } from '../hooks/use-invoices-table'
import { InvoicesToolbar } from './invoices-toolbar'
import { InvoicesTableHead } from './invoices-table/invoices-table-head'
import { InvoicesTableBody } from './invoices-table/invoices-table-body'
import { InvoicesTablePagination } from './invoices-table/invoices-table-pagination'
import { InvoiceDetailSheet } from './invoice-detail/index'
import { InvoiceDeleteDialog } from './invoice-delete-dialog'

interface InvoicesTableProps {
  workspaceId: string
  timezone: string
  // When set, the list is scoped to a single supplier (used by the supplier
  // detail page).
  supplierId?: string
}

export function InvoicesTable({
  workspaceId,
  timezone,
  supplierId,
}: InvoicesTableProps) {
  const ctx = useInvoicesTable({ workspaceId, timezone, supplierId })

  return (
    <InvoicesContext.Provider value={ctx}>
      <div className="flex flex-col gap-3">
        <InvoicesToolbar />
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <InvoicesTableHead />
            <InvoicesTableBody />
          </table>
        </div>
        <InvoicesTablePagination />
        <InvoiceDetailSheet />
        <InvoiceDeleteDialog />
      </div>
    </InvoicesContext.Provider>
  )
}
