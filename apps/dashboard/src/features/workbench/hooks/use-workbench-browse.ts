import { useCallback, useState } from 'react'
import { useWorkbenchInvoices } from '../api/workbench.api'

interface UseWorkbenchBrowseOptions {
  workspaceId: string
}

// Only approved invoices are exportable; default the browse filter to it.
export const DEFAULT_BROWSE_STATUS = 'approved'

export function useWorkbenchBrowse({ workspaceId }: UseWorkbenchBrowseOptions) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [supplierIds, setSupplierIds] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [status, setStatus] = useState(DEFAULT_BROWSE_STATUS)
  const [periodId, setPeriodId] = useState('')

  const { data, isLoading, isFetching } = useWorkbenchInvoices(workspaceId, {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    supplier_ids: supplierIds,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    status: status || undefined,
  })

  const resetPage = useCallback(
    () => setPagination((p) => ({ ...p, pageIndex: 0 })),
    [],
  )

  const onSupplierIdsChange = useCallback(
    (ids: string[]) => {
      setSupplierIds(ids)
      resetPage()
    },
    [resetPage],
  )

  const onStatusChange = useCallback(
    (value: string) => {
      setStatus(value)
      resetPage()
    },
    [resetPage],
  )

  // Selecting a saved period fills the date range; clearing it leaves the range
  // untouched so the user can keep tweaking by hand.
  const onPeriodChange = useCallback(
    (id: string, range?: { start: string; end: string }) => {
      setPeriodId(id)
      if (range) {
        setDateFrom(range.start)
        setDateTo(range.end)
      }
      resetPage()
    },
    [resetPage],
  )

  const onDateFromChange = useCallback(
    (value: string) => {
      setDateFrom(value)
      setPeriodId('')
      resetPage()
    },
    [resetPage],
  )

  const onDateToChange = useCallback(
    (value: string) => {
      setDateTo(value)
      setPeriodId('')
      resetPage()
    },
    [resetPage],
  )

  return {
    pagination,
    setPagination,
    supplierIds,
    dateFrom,
    dateTo,
    status,
    periodId,
    onSupplierIdsChange,
    onStatusChange,
    onPeriodChange,
    onDateFromChange,
    onDateToChange,
    data,
    isLoading,
    isFetching,
  }
}
