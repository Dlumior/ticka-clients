import { useQuery } from '@tanstack/react-query'
import { orgKeys } from './keys'
import type { WorkspaceBriefWithOrg } from '@/lib/api/workspaces'
import { listOrganizationWorkspaces } from '@/lib/api/workspaces'
import { isAuthenticated } from '@/lib/api/client'
import { listOrganizations } from '@/lib/api/organizations'

const STALE_TIME = 5 * 60 * 1000

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: orgKeys.all,
    queryFn: listOrganizations,
    enabled: isAuthenticated(),
    staleTime: STALE_TIME,
  })
}

export function useWorkspacesQuery(orgIds: Array<string>) {
  return useQuery({
    queryKey: orgKeys.workspaces(orgIds),
    queryFn: async (): Promise<Array<WorkspaceBriefWithOrg>> => {
      const results = await Promise.all(
        orgIds.map(async (orgId) => {
          const workspaces = await listOrganizationWorkspaces(orgId)
          return workspaces.map((w) => ({ ...w, organizationId: orgId }))
        }),
      )
      return results.flat()
    },
    enabled: orgIds.length > 0 && isAuthenticated(),
    staleTime: STALE_TIME,
  })
}
