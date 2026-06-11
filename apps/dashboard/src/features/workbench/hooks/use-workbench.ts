import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useSuppliers } from '@/features/suppliers/api/suppliers.api'
import { useExportPeriods } from '../api/workbench.api'
import type { WorkbenchContextValue } from '../context/workbench.context'
import { getWorkbenchColumns } from '../components/browse/workbench-columns'
import { useWorkbenchBrowse } from './use-workbench-browse'
import { useWorkbenchSelection } from './use-workbench-selection'

interface UseWorkbenchOptions {
  workspaceId: string
  timezone: string
  onExported: () => void
}

export function useWorkbench({
  workspaceId,
  timezone,
  onExported,
}: UseWorkbenchOptions): WorkbenchContextValue {
  const { t } = useTranslation('workbench')
  const browse = useWorkbenchBrowse({ workspaceId })
  const selection = useWorkbenchSelection()

  const { data: suppliersData } = useSuppliers(workspaceId, {
    limit: 100,
    offset: 0,
  })
  const { data: periods } = useExportPeriods(workspaceId)

  const [linesInvoiceId, setLinesInvoiceId] = useState<string | null>(null)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const columns = getWorkbenchColumns({ selection, t })

  const tableInstance = useReactTable({
    data: browse.data?.results ?? [],
    columns,
    pageCount: browse.data
      ? Math.ceil(browse.data.count / browse.pagination.pageSize)
      : -1,
    state: { pagination: browse.pagination },
    onPaginationChange: browse.setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return {
    workspaceId,
    timezone,
    filters: {
      supplierIds: browse.supplierIds,
      dateFrom: browse.dateFrom,
      dateTo: browse.dateTo,
      status: browse.status,
      periodId: browse.periodId,
      suppliers: suppliersData?.results ?? [],
      periods: periods ?? [],
      onSupplierIdsChange: browse.onSupplierIdsChange,
      onStatusChange: browse.onStatusChange,
      onPeriodChange: browse.onPeriodChange,
      onDateFromChange: browse.onDateFromChange,
      onDateToChange: browse.onDateToChange,
    },
    table: {
      instance: tableInstance,
      columns,
      isLoading: browse.isLoading,
      isFetching: browse.isFetching,
      totalCount: browse.data?.count ?? 0,
    },
    selection,
    lines: {
      invoiceId: linesInvoiceId,
      open: (id: string) => setLinesInvoiceId(id),
      close: () => setLinesInvoiceId(null),
    },
    exportDialogOpen,
    openExportDialog: () => setExportDialogOpen(true),
    closeExportDialog: () => setExportDialogOpen(false),
    onExported,
  }
}
