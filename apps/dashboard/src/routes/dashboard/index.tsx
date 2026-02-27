import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Organization } from '@/lib/api/organizations'
import { orgKeys } from '@/lib/organizations'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: ({ context }) => {
    // Data is already in cache from the parent dashboard route loader
    const organizations =
      context.queryClient.getQueryData<Array<Organization>>(orgKeys.all) ?? []
    const firstActive = organizations.find((o) => o.is_active)

    if (firstActive) {
      throw redirect({
        to: '/dashboard/$organizationId',
        params: { organizationId: firstActive.id },
      })
    }
  },
  // Only rendered when there are genuinely no active organizations
  component: NoOrganizations,
})

function NoOrganizations() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <div className="text-center">
        <h2 className="text-xl font-serif font-bold">No Organizations</h2>
        <p className="text-muted-foreground mt-2">
          Create an organization to get started.
        </p>
      </div>
    </div>
  )
}
