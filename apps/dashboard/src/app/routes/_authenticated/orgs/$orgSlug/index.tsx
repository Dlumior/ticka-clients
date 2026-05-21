import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { lastActive } from '@/features/layout/last-active'
import { Button } from '@/components/ui/button'
import { CreateWorkspaceDialog } from '@/features/workspaces/components/create-workspace-dialog'

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
  const { orgSlug } = Route.useParams()
  const { organizationDetail } = Route.useRouteContext()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-muted-foreground/40"
            >
              <rect
                x="2"
                y="7"
                width="20"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold">No workspaces yet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a workspace to start organizing your projects and team.
          </p>
        </div>

        {/* Steps */}
        <ol className="mb-6 space-y-3">
          <li className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-4 opacity-60">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-[11px] font-bold text-emerald-600">
              ✓
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Organization created</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your organization is ready to go.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              2
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">Create a workspace</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Workspaces hold your projects and team members in one focused place.
              </p>
            </div>
          </li>
        </ol>

        <Button
          variant="default"
          className="w-full"
          onClick={() => setCreateOpen(true)}
        >
          Create your first workspace
        </Button>

        {organizationDetail && (
          <CreateWorkspaceDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            organizationId={organizationDetail.id}
            orgSlug={orgSlug}
          />
        )}
      </div>
    </div>
  )
}
