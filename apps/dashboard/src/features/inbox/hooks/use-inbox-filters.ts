import { useCallback, useState } from 'react'
import { useInboxEmails } from '../api/inbox.api'

interface UseInboxFiltersOptions {
  workspaceId: string
}

export function useInboxFilters({ workspaceId }: UseInboxFiltersOptions) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading, isFetching } = useInboxEmails(workspaceId, {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    status: statusFilter || undefined,
    search: search || undefined,
  })

  const onSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [])

  const onStatusChange = useCallback((value: string) => {
    setStatusFilter(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [])

  return {
    search,
    statusFilter,
    onSearchChange,
    onStatusChange,
    data,
    isLoading,
    isFetching,
    pagination,
    setPagination,
  }
}
