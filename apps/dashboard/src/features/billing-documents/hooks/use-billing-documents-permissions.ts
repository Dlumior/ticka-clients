import { useWorkspaceMembership } from '@/features/members/api/members.api'
import {
  asOrgRole,
  asWorkspaceRole,
  useOrgPermissions,
  useWorkspacePermissions,
} from '@/features/permissions'

export function useBillingDocumentsPermissions(workspaceId: string) {
  const { data: membership } = useWorkspaceMembership(workspaceId)
  const wsRole = asWorkspaceRole(membership?.workspace_role ?? '') ?? 'viewer'
  const orgRole = asOrgRole(membership?.org_role ?? '')
  const wsPerms = useWorkspacePermissions(wsRole, orgRole)
  const orgPerms = useOrgPermissions(orgRole ?? 'viewer')
  return {
    canManage: wsPerms.isAdmin || orgPerms.canWriteOrganization,
  }
}
