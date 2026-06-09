import * as React from 'react'
import type { ColumnDef, Table } from '@tanstack/react-table'
import type { Invoice } from '@/features/invoices/api/invoices.api'
import type { ExportPeriod } from '../api/workbench.api'
import type { Supplier } from '@/features/suppliers/api/suppliers.api'
import type { WorkbenchSelection } from '../hooks/use-workbench-selection'

export interface WorkbenchContextValue {
  workspaceId: string
  timezone: string
  filters: {
    supplierIds: string[]
    dateFrom: string
    dateTo: string
    status: string
    periodId: string
    suppliers: Supplier[]
    periods: ExportPeriod[]
    onSupplierIdsChange: (ids: string[]) => void
    onStatusChange: (value: string) => void
    onPeriodChange: (id: string, range?: { start: string; end: string }) => void
    onDateFromChange: (value: string) => void
    onDateToChange: (value: string) => void
  }
  table: {
    instance: Table<Invoice>
    columns: ColumnDef<Invoice>[]
    isLoading: boolean
    isFetching: boolean
    totalCount: number
  }
  selection: WorkbenchSelection
  lines: {
    invoiceId: string | null
    open: (invoiceId: string) => void
    close: () => void
  }
  exportDialogOpen: boolean
  openExportDialog: () => void
  closeExportDialog: () => void
  // Called after a successful export to hand the user to the Exports tab.
  onExported: () => void
}

export const WorkbenchContext = React.createContext<WorkbenchContextValue | null>(
  null,
)

export function useWorkbenchContext(): WorkbenchContextValue {
  const ctx = React.useContext(WorkbenchContext)
  if (!ctx) throw new Error('useWorkbenchContext must be used within WorkbenchTab')
  return ctx
}
