import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
  WorkbenchPage,
  type WorkbenchTabKey,
} from '@/features/workbench/components/workbench-page'

export const Route = createFileRoute(
  '/_authenticated/orgs/$orgSlug/workspaces/$workspaceSlug/workbench',
)({
  validateSearch: z.object({
    tab: z.enum(['workbench', 'templates', 'exports']).default('workbench'),
  }),
  component: WorkbenchRoute,
})

function WorkbenchRoute() {
  const { workspace, organizationDetail } = Route.useRouteContext()
  const { tab } = Route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Workbench</h1>
        <p className="text-sm text-muted-foreground">
          Browse approved invoices, pick what to export, and generate CSV files
          from your templates.
        </p>
      </div>

      <WorkbenchPage
        workspaceId={workspace.id}
        timezone={organizationDetail.timezone}
        tab={tab}
        onTabChange={(next: WorkbenchTabKey) =>
          navigate({ search: { tab: next }, replace: true })
        }
      />
    </div>
  )
}
