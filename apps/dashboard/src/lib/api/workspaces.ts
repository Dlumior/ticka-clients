import {
  zOrganizationWorkspaceCreateOutput,
  zOrganizationWorkspaceListOutput,
  zWorkspaceDetailOutput,
  zWorkspaceListOutput,
  zWorkspaceUpdateOutput,
} from '@repo/api-types'
import { apiRequest } from './client'
import type z from 'zod'
import type { zOrganizationWorkspaceCreateInputRequest } from '@repo/api-types'

export type Workspace = z.infer<typeof zWorkspaceListOutput>
export type WorkspaceBrief = z.infer<typeof zOrganizationWorkspaceListOutput>
export type WorkspaceDetail = z.infer<typeof zWorkspaceDetailOutput>
export type WorkspaceCreateInput = z.infer<
  typeof zOrganizationWorkspaceCreateInputRequest
>

export async function listWorkspaces(): Promise<Array<Workspace>> {
  return apiRequest(
    {
      method: 'GET',
      url: '/identities/workspaces/',
    },
    zWorkspaceListOutput.array(),
  )
}

export async function getWorkspace(id: string): Promise<WorkspaceDetail> {
  return apiRequest(
    {
      method: 'GET',
      url: `/identities/workspaces/${id}/`,
    },
    zWorkspaceDetailOutput,
  )
}

export async function listOrganizationWorkspaces(
  organizationId: string,
): Promise<Array<WorkspaceBrief>> {
  return apiRequest(
    {
      method: 'GET',
      url: `/identities/organizations/${organizationId}/workspaces/`,
    },
    zOrganizationWorkspaceListOutput.array(),
  )
}

export async function createWorkspace(
  organizationId: string,
  data: WorkspaceCreateInput,
): Promise<z.infer<typeof zOrganizationWorkspaceCreateOutput>> {
  return apiRequest(
    {
      method: 'POST',
      url: `/identities/organizations/${organizationId}/workspaces/create/`,
      data,
    },
    zOrganizationWorkspaceCreateOutput,
  )
}

export async function updateWorkspace(
  id: string,
  data: { name?: string; is_active?: boolean },
): Promise<z.infer<typeof zWorkspaceUpdateOutput>> {
  return apiRequest(
    {
      method: 'PATCH',
      url: `/identities/workspaces/${id}/update/`,
      data,
    },
    zWorkspaceUpdateOutput,
  )
}

export async function deleteWorkspace(id: string): Promise<void> {
  await apiRequest(
    {
      method: 'DELETE',
      url: `/identities/workspaces/${id}/delete/`,
    },
    zWorkspaceUpdateOutput,
  )
}
