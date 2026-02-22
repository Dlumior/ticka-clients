import { useParams } from '@tanstack/react-router'
import {
  getOrgNavItems,
  getWorkspaceListItems,
  getWorkspaceNavItems,
} from './nav-config'
import { NavSubItem } from './NavSubItem'
import { NavSection } from './NavSection'
import { NavPlaceholder } from './NavPlaceholder'
import { SidebarMenuSub } from '@/components/ui/sidebar'
import { useOrganization } from '@/hooks/useOrganization'

export function SidebarNavigation() {
  const params = useParams({ strict: false })
  const { currentOrganization, currentWorkspace, workspacesByOrg, isLoading } =
    useOrganization()

  const { organizationId, workspaceId } = params

  const workspaces = currentOrganization
    ? (workspacesByOrg[currentOrganization.id] ?? [])
    : []
  const activeWorkspaces = workspaces.filter((w) => w.is_active)

  if (isLoading) return <NavPlaceholder message="Loading..." />
  if (!organizationId || !currentOrganization)
    return (
      <NavPlaceholder message="Select an organization to view navigation" />
    )

  const orgItems = getOrgNavItems(organizationId)
  const workspaceListItems = getWorkspaceListItems(
    organizationId,
    activeWorkspaces,
  )
  const workspaceItems = workspaceId
    ? getWorkspaceNavItems(organizationId, workspaceId)
    : []

  return (
    <>
      <NavSection label="Organization" name={currentOrganization.name}>
        {orgItems.map((item) => (
          <NavSubItem key={item.label} {...item} />
        ))}
        {workspaceListItems.length > 0 && (
          <SidebarMenuSub>
            {workspaceListItems.map((item) => (
              <NavSubItem key={item.to + item.params.workspaceId} {...item} />
            ))}
          </SidebarMenuSub>
        )}
      </NavSection>

      {workspaceId && currentWorkspace && (
        <NavSection label="Workspace" name={currentWorkspace.name}>
          {workspaceItems.map((item) => (
            <NavSubItem key={item.label} {...item} />
          ))}
        </NavSection>
      )}
    </>
  )
}
