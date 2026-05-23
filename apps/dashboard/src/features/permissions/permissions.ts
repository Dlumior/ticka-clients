import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/badge'
import type { OrgRole, WorkspaceRole } from './roles'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

// ─── Organization permissions (mirrors permissions.py) ────────────────────────

export function isOrgAdmin(role: OrgRole): boolean {
  return role === 'admin' || role === 'owner'
}

export function isOrgOwner(role: OrgRole): boolean {
  return role === 'owner'
}

export function canManageOrgMembers(role: OrgRole): boolean {
  return isOrgAdmin(role)
}

export function canManageWorkspaces(role: OrgRole): boolean {
  return isOrgAdmin(role)
}

export function canWriteOrganization(role: OrgRole): boolean {
  return isOrgAdmin(role)
}

export function canViewAllWorkspaces(role: OrgRole): boolean {
  return isOrgAdmin(role)
}

// ─── Workspace permissions (mirrors permissions.py) ───────────────────────────

export function isWorkspaceAdmin(role: WorkspaceRole): boolean {
  return role === 'admin'
}

export function canManageWorkspaceMembers(
  wsRole: WorkspaceRole,
  orgRole?: OrgRole,
): boolean {
  return isWorkspaceAdmin(wsRole) || (orgRole != null && isOrgAdmin(orgRole))
}

export function canInviteToWorkspace(
  wsRole: WorkspaceRole,
  orgRole?: OrgRole,
): boolean {
  return isWorkspaceAdmin(wsRole) || (orgRole != null && isOrgAdmin(orgRole))
}

// ─── Display helpers ──────────────────────────────────────────────────────────
// Exhaustive Record<OrgRole, ...> causes a TypeScript error if a new role is
// added to zOrganizationRoleEnum but not mapped here.

export const ORG_ROLE_BADGE_VARIANT: Record<OrgRole, BadgeVariant> = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
  viewer: 'outline',
}

export const ORG_ROLE_LABEL: Record<OrgRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
}

export const WORKSPACE_ROLE_BADGE_VARIANT: Record<WorkspaceRole, BadgeVariant> = {
  admin:  'default',
  member: 'secondary',
  viewer: 'outline',
}

export const WORKSPACE_ROLE_LABEL: Record<WorkspaceRole, string> = {
  admin:  'Admin',
  member: 'Member',
  viewer: 'Viewer',
}
