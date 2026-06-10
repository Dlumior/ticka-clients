import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useSuppliers } from '../api/suppliers.api'
import type { Supplier } from '../api/suppliers.api'
import { getSuppliersColumns } from './suppliers-columns'
import { SuppliersToolbar } from './suppliers-toolbar'

interface SuppliersTableProps {
  workspaceId: string
}

export function SuppliersTable({ workspaceId }: SuppliersTableProps) {
  const { t } = useTranslation('suppliers')
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as {
    orgSlug?: string
    workspaceSlug?: string
  }
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [search, setSearch] = useState('')

  const { data, isLoading, isFetching } = useSuppliers(workspaceId, {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: search || undefined,
  })

  const columns = getSuppliersColumns(t)

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

  function handleRowClick(supplier: Supplier) {
    if (!params.orgSlug || !params.workspaceSlug) return
    navigate({
      to: '/orgs/$orgSlug/workspaces/$workspaceSlug/suppliers/$supplierId',
      params: {
        orgSlug: params.orgSlug,
        workspaceSlug: params.workspaceSlug,
        supplierId: supplier.id,
      },
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <SuppliersToolbar search={search} onSearchChange={handleSearchChange} />

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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
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
                  {t('table.noResults')}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
            {data
              ? ` of ${Math.max(1, Math.ceil(data.count / pagination.pageSize))}`
              : ''}
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
    </div>
  )
}
