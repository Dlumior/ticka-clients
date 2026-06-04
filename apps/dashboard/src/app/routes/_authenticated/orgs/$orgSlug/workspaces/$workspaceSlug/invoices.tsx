import { createFileRoute } from '@tanstack/react-router'
import { InvoicesTable } from '@/features/invoices/components/invoices-table'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/invoices',
)({
  component: InvoicesPage,
})

function InvoicesPage() {
  const { workspace, organizationDetail } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Invoices processed for this workspace.
        </p>
      </div>

      <InvoicesTable
        workspaceId={workspace.id}
        timezone={organizationDetail.timezone}
      />
    </div>
  )
}
