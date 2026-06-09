import { Button } from '@/components/ui/button'
import { useWorkbenchContext } from '../../context/workbench.context'

export function SelectionBar() {
  const { selection, table, openExportDialog } = useWorkbenchContext()

  if (!selection.hasSelection) return null

  const summary = selection.selectAllMatching
    ? `All ${table.totalCount} matching invoices selected`
    : [
        selection.invoiceIds.size > 0 &&
          `${selection.invoiceIds.size} invoice${selection.invoiceIds.size === 1 ? '' : 's'}`,
        selection.lineItemIds.size > 0 &&
          `${selection.lineItemIds.size} line item${selection.lineItemIds.size === 1 ? '' : 's'}`,
      ]
        .filter(Boolean)
        .join(' · ')

  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border bg-popover px-4 py-3 shadow-lg ring-1 ring-foreground/10">
      <span className="text-sm font-medium">{summary} selected</span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={selection.clear}>
          Clear
        </Button>
        <Button size="sm" onClick={openExportDialog}>
          Export…
        </Button>
      </div>
    </div>
  )
}
