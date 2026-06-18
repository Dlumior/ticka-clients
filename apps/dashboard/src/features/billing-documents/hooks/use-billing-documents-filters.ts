import { useCallback, useState } from 'react'
import { useBillingDocuments } from '../api/billing-documents.api'

interface UseBillingDocumentsFiltersOptions {
  workspaceId: string
  supplierId?: string
}

export function useBillingDocumentsFilters({ workspaceId, supplierId }: UseBillingDocumentsFiltersOptions) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading, isFetching } = useBillingDocuments(workspaceId, {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    status: statusFilter || undefined,
    invoice_type: typeFilter || undefined,
    search: search || undefined,
    supplier_id: supplierId || undefined,
  })

  const onSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [])

  const onStatusChange = useCallback((value: string) => {
    setStatusFilter(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [])

  const onTypeChange = useCallback((value: string) => {
    setTypeFilter(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [])

  return {
    search,
    statusFilter,
    typeFilter,
    onSearchChange,
    onStatusChange,
    onTypeChange,
    data,
    isLoading,
    isFetching,
    pagination,
    setPagination,
  }
}
