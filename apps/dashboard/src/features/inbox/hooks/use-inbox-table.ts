import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { InboxTableContextValue } from '../context/inbox-table.context'
import { getInboxColumns } from '../components/inbox-columns'
import { useInboxFilters } from './use-inbox-filters'
import { useInboxDetail } from './use-inbox-detail'

interface UseInboxTableOptions {
  workspaceId: string
  timezone: string
  initialEmailId?: string
}

export function useInboxTable({
  workspaceId,
  timezone,
  initialEmailId,
}: UseInboxTableOptions): InboxTableContextValue {
  const { t } = useTranslation('inbox')
  const filtersState = useInboxFilters({ workspaceId })
  const detail = useInboxDetail({ initialEmailId })

  const columns = getInboxColumns(timezone, t)

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
    filters: {
      search: filtersState.search,
      statusFilter: filtersState.statusFilter,
      onSearchChange: filtersState.onSearchChange,
      onStatusChange: filtersState.onStatusChange,
    },
    table: {
      instance: tableInstance,
      columns,
      isLoading: filtersState.isLoading,
      isFetching: filtersState.isFetching,
      totalCount: filtersState.data?.count ?? 0,
    },
    detail,
  }
}
