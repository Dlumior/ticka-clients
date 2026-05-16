import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { lastActive } from '@/features/layout/last-active'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug',
)({
  beforeLoad: ({ context, params }) => {
    const workspace = context.organizationDetail?.workspaces.find(
      (ws) => ws.slug === params.workspaceSlug,
    )
    if (!workspace) throw notFound()
    return { workspace }
  },
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  const { orgSlug, workspaceSlug } = Route.useParams()

  useEffect(() => {
    lastActive.write({ orgSlug, workspaceSlug })
  }, [orgSlug, workspaceSlug])

  return <Outlet />
}
