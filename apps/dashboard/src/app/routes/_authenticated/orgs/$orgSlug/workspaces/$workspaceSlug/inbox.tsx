import { createFileRoute } from '@tanstack/react-router'
import { InboxTable } from '@/features/inbox/components/inbox-table'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/inbox',
)({
  component: InboxPage,
})

function InboxPage() {
  const { workspace, organizationDetail } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Emails received at{' '}
          <span className="font-mono text-foreground">{workspace.inbox_email}</span>.
        </p>
      </div>

      <InboxTable workspaceId={workspace.id} timezone={organizationDetail.timezone} />
    </div>
  )
}
