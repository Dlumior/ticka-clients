import { createFileRoute, redirect } from '@tanstack/react-router'
import { lastActive } from '@/features/layout/last-active'

export const Route = createFileRoute('/_authenticated/orgs/$orgSlug/')({
  beforeLoad: ({ context, params }) => {
    const detail = context.organizationDetail

    if (!detail || detail.workspaces.length === 0) return

    const stored = lastActive.read()
    const targetWorkspace =
      detail.workspaces.find(
        (ws) =>
          stored.orgSlug === params.orgSlug && ws.slug === stored.workspaceSlug,
      ) ?? detail.workspaces[0]

    lastActive.write({ orgSlug: params.orgSlug })

    throw redirect({
      to: '/orgs/$orgSlug/workspaces/$workspaceSlug',
      params: {
        orgSlug: params.orgSlug,
        workspaceSlug: targetWorkspace.slug,
      },
    })
  },
  component: NoWorkspacesPlaceholder,
})

function NoWorkspacesPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-xl font-semibold">No workspaces yet</h1>
      <p className="text-sm text-muted-foreground">
        Create a workspace inside this organization to get started.
      </p>
    </div>
  )
}
