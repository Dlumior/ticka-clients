import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/$organizationId/workspaces/$workspaceId',
)({
  component: WorkspaceLayout,
  beforeLoad: ({ params }) => ({
    breadcrumb: 'Workspace',
    workspaceId: params.workspaceId,
  }),
})

function WorkspaceLayout() {
  return <Outlet />
}
