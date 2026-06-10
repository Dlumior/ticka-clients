import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { InvoicesContextValue } from '../context/invoices.context'
import { getInvoicesColumns } from '../components/invoices-columns'
import { useInvoicesPermissions } from './use-invoices-permissions'
import { useInvoicesFilters } from './use-invoices-filters'
import { useInvoicesDetail } from './use-invoices-detail'
import { useInvoicesDeletion } from './use-invoices-deletion'

interface UseInvoicesTableOptions {
  workspaceId: string
  timezone: string
  supplierId?: string
}

export function useInvoicesTable({
  workspaceId,
  timezone,
  supplierId,
}: UseInvoicesTableOptions): InvoicesContextValue {
  const { t } = useTranslation('invoices')
  const permissions = useInvoicesPermissions(workspaceId)
  const filtersState = useInvoicesFilters({ workspaceId, supplierId })
  const detail = useInvoicesDetail()
  const deletion = useInvoicesDeletion()

  const columns = getInvoicesColumns({ canManage: permissions.canManage, t })

  const tableInstance = useReactTable({
    data: filtersState.data?.results ?? [],
    columns,
    pageCount: filtersState.data
      ? Math.ceil(filtersState.data.count / filtersState.pagination.pageSize)
      : -1,
    state: { pagination: filtersState.pagination },
    onPaginationChange: filtersState.setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return {
    workspaceId,
    timezone,
    permissions,
    filters: {
      search: filtersState.search,
      statusFilter: filtersState.statusFilter,
      typeFilter: filtersState.typeFilter,
      onSearchChange: filtersState.onSearchChange,
      onStatusChange: filtersState.onStatusChange,
      onTypeChange: filtersState.onTypeChange,
    },
    table: {
      instance: tableInstance,
      columns,
      isLoading: filtersState.isLoading,
      isFetching: filtersState.isFetching,
      totalCount: filtersState.data?.count ?? 0,
    },
    detail,
    deletion,
  }
}
