import { useEffect, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useInboxEmails } from '../api/inbox.api'
import type { InboundEmail } from '../api/inbox.api'
import { getInboxColumns } from './inbox-columns'
import { InboxToolbar } from './inbox-toolbar'
import { EmailDetailSheet } from './email-detail-sheet'

interface InboxTableProps {
  workspaceId: string
  timezone: string
  // When set (via the ?emailId deep-link), opens that email's detail on mount.
  initialEmailId?: string
}

export function InboxTable({
  workspaceId,
  timezone,
  initialEmailId,
}: InboxTableProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Open the deep-linked email sheet when arriving with an ?emailId param.
  useEffect(() => {
    if (initialEmailId) {
      setSelectedEmailId(initialEmailId)
      setSheetOpen(true)
    }
  }, [initialEmailId])

  const { data, isLoading, isFetching } = useInboxEmails(workspaceId, {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    status: statusFilter || undefined,
    search: search || undefined,
  })

  const columns = getInboxColumns(timezone)

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    pageCount: data ? Math.ceil(data.count / pagination.pageSize) : -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  function handleRowClick(email: InboundEmail) {
    setSelectedEmailId(email.id)
    setSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <InboxToolbar
        search={search}
        onSearchChange={handleSearchChange}
        status={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className={cn(
              'divide-y transition-opacity',
              isFetching && !isLoading && 'opacity-60',
            )}
          >
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-3 py-3">
                      <Skeleton className="h-4 w-full rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-12 text-center text-sm text-muted-foreground"
                >
                  No emails found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {data ? `${data.count} total` : ''}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1}
            {data ? ` of ${Math.max(1, Math.ceil(data.count / pagination.pageSize))}` : ''}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <EmailDetailSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setSelectedEmailId(null)
        }}
        emailId={selectedEmailId}
        workspaceId={workspaceId}
        timezone={timezone}
      />
    </div>
  )
}
