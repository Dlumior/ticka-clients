import { createFileRoute } from '@tanstack/react-router'
import { SuppliersTable } from '@/features/suppliers/components/suppliers-table'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/suppliers/',
)({
  component: SuppliersPage,
})

function SuppliersPage() {
  const { workspace } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Suppliers</h1>
        <p className="text-sm text-muted-foreground">
          Vendors that have sent invoices to this workspace.
        </p>
      </div>

      <SuppliersTable workspaceId={workspace.id} />
    </div>
  )
}
