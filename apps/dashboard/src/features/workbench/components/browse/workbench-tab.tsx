import { WorkbenchContext } from '../../context/workbench.context'
import { useWorkbench } from '../../hooks/use-workbench'
import { WorkbenchToolbar } from './workbench-toolbar'
import { WorkbenchTableHead } from './workbench-table/workbench-table-head'
import { WorkbenchTableBody } from './workbench-table/workbench-table-body'
import { WorkbenchTablePagination } from './workbench-table/workbench-table-pagination'
import { SelectionBar } from './selection-bar'
import { InvoiceLinesDrawer } from './invoice-lines-drawer'
import { ExportDialog } from './export-dialog'

interface WorkbenchTabProps {
  workspaceId: string
  timezone: string
  onExported: () => void
}

export function WorkbenchTab({
  workspaceId,
  timezone,
  onExported,
}: WorkbenchTabProps) {
  const ctx = useWorkbench({ workspaceId, timezone, onExported })

  return (
    <WorkbenchContext.Provider value={ctx}>
      <div className="flex flex-col gap-3">
        <WorkbenchToolbar />
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <WorkbenchTableHead />
            <WorkbenchTableBody />
          </table>
        </div>
        <WorkbenchTablePagination />
        <SelectionBar />
        <InvoiceLinesDrawer />
        <ExportDialog />
      </div>
    </WorkbenchContext.Provider>
  )
}
