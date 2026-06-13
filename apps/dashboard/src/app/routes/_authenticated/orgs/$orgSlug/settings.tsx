import { createFileRoute } from '@tanstack/react-router'
import { RiBuilding2Line, RiTeamLine } from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { asOrgRole, useOrgPermissions } from '@/features/permissions'
import { OrgSettingsMembers } from '@/features/organizations/components/org-settings-members'
import { OrgSettingsInfo } from '@/features/organizations/components/org-settings-info'

export const Route = createFileRoute('/_authenticated/orgs/$orgSlug/settings')({
  component: OrgSettingsPage,
})

function OrgSettingsPage() {
  const { organization, organizationDetail } = Route.useRouteContext()
  const orgRole = asOrgRole(organization.user_role) ?? 'viewer'
  const perms = useOrgPermissions(orgRole)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">{organization.name}</h1>
        <p className="text-sm text-muted-foreground">Organization settings</p>
      </div>

      <Tabs orientation="vertical" defaultValue="members" className="flex items-start gap-8">
        <TabsList
          variant="line"
          className="w-44 shrink-0 items-stretch p-0"
        >
          <TabsTrigger value="members" className="gap-2 px-3">
            <RiTeamLine className="size-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2 px-3">
            <RiBuilding2Line className="size-4" />
            Info
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="members">
            <OrgSettingsMembers
              orgId={organization.id}
              orgDetail={organizationDetail}
              perms={perms}
            />
          </TabsContent>
          <TabsContent value="info">
            <OrgSettingsInfo organization={organizationDetail} perms={perms} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
