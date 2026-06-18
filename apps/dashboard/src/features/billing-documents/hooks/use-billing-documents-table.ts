import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { BillingDocumentsContextValue } from '../context/billing-documents.context'
import { getBillingDocumentsColumns } from '../components/billing-documents-columns'
import { useBillingDocumentsPermissions } from './use-billing-documents-permissions'
import { useBillingDocumentsFilters } from './use-billing-documents-filters'
import { useBillingDocumentsDetail } from './use-billing-documents-detail'
import { useBillingDocumentsDeletion } from './use-billing-documents-deletion'

interface UseBillingDocumentsTableOptions {
  workspaceId: string
  timezone: string
  supplierId?: string
}

export function useBillingDocumentsTable({
  workspaceId,
  timezone,
  supplierId,
}: UseBillingDocumentsTableOptions): BillingDocumentsContextValue {
  const { t } = useTranslation('billing-documents')
  const permissions = useBillingDocumentsPermissions(workspaceId)
  const filtersState = useBillingDocumentsFilters({ workspaceId, supplierId })
  const detail = useBillingDocumentsDetail()
  const deletion = useBillingDocumentsDeletion()

  const columns = getBillingDocumentsColumns({ canManage: permissions.canManage, t })

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
