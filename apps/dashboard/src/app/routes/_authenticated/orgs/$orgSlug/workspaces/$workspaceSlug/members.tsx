import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceMembersList } from '@/features/members/components/workspace-members-list'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/members',
)({
  component: MembersPage,
})

function MembersPage() {
  const { organization, workspace } = Route.useRouteContext()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Members</h1>
        <p className="text-sm text-muted-foreground">
          Manage who has access to{' '}
          <span className="font-medium text-foreground">{workspace.name}</span>.
        </p>
      </div>

      <WorkspaceMembersList
        workspaceId={workspace.id}
        orgId={organization.id}
        orgRole={organization.user_role}
      />
    </div>
  )
}
