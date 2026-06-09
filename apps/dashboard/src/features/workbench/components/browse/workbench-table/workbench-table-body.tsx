import { flexRender } from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '../../../context/workbench.context'

export function WorkbenchTableBody() {
  const {
    table: { instance, columns, isLoading, isFetching },
    lines,
  } = useWorkbenchContext()

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
            No approved invoices match these filters.
          </td>
        </tr>
      ) : (
        instance.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="cursor-pointer transition-colors hover:bg-muted/30"
            onClick={() => lines.open(row.original.id)}
            title="Click to pick individual line items"
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
