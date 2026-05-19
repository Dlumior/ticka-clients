import { useMemo } from 'react'
import type { OrgRole, WorkspaceRole } from './roles'
import {
  isOrgAdmin,
  isOrgOwner,
  canManageOrgMembers,
  canManageWorkspaces,
  canWriteOrganization,
  canViewAllWorkspaces,
  isWorkspaceAdmin,
  canManageWorkspaceMembers,
  canInviteToWorkspace,
} from './permissions'

export interface OrgPermissions {
  isAdmin: boolean
  isOwner: boolean
  canManageMembers: boolean
  canManageWorkspaces: boolean
  canWriteOrganization: boolean
  canViewAllWorkspaces: boolean
}

export interface WorkspacePermissions {
  isAdmin: boolean
  canManageMembers: boolean
  canInvite: boolean
}

export function useOrgPermissions(orgRole: OrgRole): OrgPermissions {
  return useMemo(
    () => ({
      isAdmin: isOrgAdmin(orgRole),
      isOwner: isOrgOwner(orgRole),
      canManageMembers: canManageOrgMembers(orgRole),
      canManageWorkspaces: canManageWorkspaces(orgRole),
      canWriteOrganization: canWriteOrganization(orgRole),
      canViewAllWorkspaces: canViewAllWorkspaces(orgRole),
    }),
    [orgRole],
  )
}

export function useWorkspacePermissions(
  wsRole: WorkspaceRole,
  orgRole?: OrgRole,
): WorkspacePermissions {
  return useMemo(
    () => ({
      isAdmin: isWorkspaceAdmin(wsRole),
      canManageMembers: canManageWorkspaceMembers(wsRole, orgRole),
      canInvite: canInviteToWorkspace(wsRole, orgRole),
    }),
    [wsRole, orgRole],
  )
}
