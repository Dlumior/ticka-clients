import { InboxTableContext } from '../context/inbox-table.context'
import { useInboxTable } from '../hooks/use-inbox-table'
import { EmailDetailSheet } from './email-detail/index'
import { InboxTableBody } from './inbox-table/inbox-table-body'
import { InboxTableHead } from './inbox-table/inbox-table-head'
import { InboxTablePagination } from './inbox-table/inbox-table-pagination'
import { InboxToolbar } from './inbox-toolbar'

interface InboxTableProps {
  workspaceId: string
  timezone: string
  // When set (via the ?emailId deep-link), opens that email's detail on mount.
  initialEmailId?: string
}

export function InboxTable({ workspaceId, timezone, initialEmailId }: InboxTableProps) {
  const ctx = useInboxTable({ workspaceId, timezone, initialEmailId })

  return (
    <InboxTableContext.Provider value={ctx}>
      <div className="flex flex-col gap-3">
        <InboxToolbar />
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <InboxTableHead />
            <InboxTableBody />
          </table>
        </div>
        <InboxTablePagination />
        <EmailDetailSheet />
      </div>
    </InboxTableContext.Provider>
  )
}
