import { flexRender } from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useInvoicesContext } from '../../context/invoices.context'

export function InvoicesTableBody() {
  const {
    table: { instance, columns, isLoading, isFetching },
    detail: { openDetail },
  } = useInvoicesContext()

  return (
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
      ) : instance.getRowModel().rows.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length}
            className="px-3 py-12 text-center text-sm text-muted-foreground"
          >
            No invoices found.
          </td>
        </tr>
      ) : (
        instance.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="cursor-pointer transition-colors hover:bg-muted/30"
            onClick={() => openDetail(row.original)}
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
  )
}
