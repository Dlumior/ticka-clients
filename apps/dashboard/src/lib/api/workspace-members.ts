import { apiRequest } from './client'

export type WorkspaceRole = 'admin' | 'member' | 'viewer'

export interface WorkspaceMember {
  id: string
  workspace: string
  workspace_name: string
  user: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
  }
  role: WorkspaceRole
  joined_at: string
}

export async function listWorkspaceMembers(
  workspaceId: string,
): Promise<Array<WorkspaceMember>> {
  return apiRequest(
    {
      method: 'GET',
      url: `/identities/workspaces/${workspaceId}/members/`,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (z: any) => z.any(),
  )
}

export async function inviteToWorkspace(
  workspaceId: string,
  email: string,
  role: WorkspaceRole,
): Promise<{
  id: string
  email: string
  workspace_role: WorkspaceRole
  status: string
}> {
  return apiRequest(
    {
      method: 'POST',
      url: `/identities/workspaces/${workspaceId}/members/invite/`,
      data: { email, role },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (z: any) => z.any(),
  )
}

export async function removeWorkspaceMember(
  workspaceId: string,
  memberId: string,
): Promise<void> {
  await apiRequest(
    {
      method: 'DELETE',
      url: `/identities/workspaces/${workspaceId}/members/${memberId}/`,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (z: any) => z.any(),
  )
}

export async function updateWorkspaceMemberRole(
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole,
): Promise<WorkspaceMember> {
  return apiRequest(
    {
      method: 'PATCH',
      url: `/identities/workspaces/${workspaceId}/members/${memberId}/update-role/`,
      data: { role },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (z: any) => z.any(),
  )
}
