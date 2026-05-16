import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/',
)({
  component: WorkspaceOverview,
})

function WorkspaceOverview() {
  const { organization, workspace } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-2 p-6">
      <h1 className="text-xl font-semibold">{workspace.name}</h1>
      <p className="text-sm text-muted-foreground">
        Workspace in <span className="font-medium">{organization.name}</span>.
      </p>
    </div>
  )
}
