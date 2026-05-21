import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceOverviewCards } from '@/features/workspaces/components/workspace-overview-cards'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/',
)({
  component: WorkspaceOverview,
})

function WorkspaceOverview() {
  const { workspace } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">{workspace.name}</h1>
        <p className="text-sm text-muted-foreground">
          Workspace overview and inbox settings.
        </p>
      </div>

      <WorkspaceOverviewCards workspace={workspace} />
    </div>
  )
}
