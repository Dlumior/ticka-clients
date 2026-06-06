import { Button } from '@/components/ui/button'
import { useInboxTableContext } from '../../context/inbox-table.context'

export function InboxTablePagination() {
  const { table: { instance, totalCount } } = useInboxTableContext()
  const { pageIndex, pageSize } = instance.getState().pagination
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {totalCount > 0 ? `${totalCount} total` : ''}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Page {pageIndex + 1} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
