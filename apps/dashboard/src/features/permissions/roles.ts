import { z } from 'zod'
import { zOrganizationRoleEnum, zWorkspaceRoleEnum } from '@repo/api-types'

export type OrgRole = z.infer<typeof zOrganizationRoleEnum>
export type WorkspaceRole = z.infer<typeof zWorkspaceRoleEnum>

export const ORG_ROLES = zOrganizationRoleEnum.options
export const WORKSPACE_ROLES = zWorkspaceRoleEnum.options

export function asOrgRole(role: string): OrgRole | undefined {
  const result = zOrganizationRoleEnum.safeParse(role)
  return result.success ? result.data : undefined
}

export function asWorkspaceRole(role: string): WorkspaceRole | undefined {
  const result = zWorkspaceRoleEnum.safeParse(role)
  return result.success ? result.data : undefined
}
