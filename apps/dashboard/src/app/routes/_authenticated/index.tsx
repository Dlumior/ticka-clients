import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  organizationDetailQueryOptions,
  organizationsQueryOptions,
} from '@/features/organizations/api/organizations.api'
import { lastActive } from '@/features/layout/last-active'
import { Button } from '@/components/ui/button'
import { CreateOrganizationDialog } from '@/features/organizations/components/create-organization-dialog'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: async ({ context }) => {
    const organizations = await context.queryClient.ensureQueryData(
      organizationsQueryOptions,
    )

    if (organizations.length === 0) {
      // No orgs yet — render the empty state below.
      return
    }

    const stored = lastActive.read()
    const targetOrg =
      organizations.find((o) => o.slug === stored.orgSlug) ?? organizations[0]

    const detail = await context.queryClient.ensureQueryData(
      organizationDetailQueryOptions(targetOrg.id),
    )

    if (detail.workspaces.length === 0) {
      throw redirect({
        to: '/orgs/$orgSlug',
        params: { orgSlug: targetOrg.slug },
      })
    }

    const targetWorkspace =
      detail.workspaces.find((ws) => ws.slug === stored.workspaceSlug) ??
      detail.workspaces[0]

    throw redirect({
      to: '/orgs/$orgSlug/workspaces/$workspaceSlug',
      params: {
        orgSlug: targetOrg.slug,
        workspaceSlug: targetWorkspace.slug,
      },
    })
  },
  component: NoOrganizationsPlaceholder,
})

function NoOrganizationsPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-muted-foreground/40"
        >
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-semibold">No organizations yet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create an organization to get started with Ticka.
        </p>
      </div>
      <CreateOrganizationDialog
        trigger={
          <Button variant="default" size="sm">
            Create organization
          </Button>
        }
      />
    </div>
  )
}
