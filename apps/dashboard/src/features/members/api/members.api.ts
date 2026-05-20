import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zWorkspaceMemberListOutput, zOrganizationInvitationListOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { InviteMemberFormValues } from './members.schema'

export type WorkspaceMember = z.infer<typeof zWorkspaceMemberListOutput>
export type OrgInvitation = z.infer<typeof zOrganizationInvitationListOutput>

export interface WorkspaceMembership {
  workspace_role: string | null
  org_role: string | null
}

export const workspaceMembersQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ['workspace-members', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<WorkspaceMember[]>(`/api/v1/identities/workspaces/${workspaceId}/members/`, { signal })
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })

export const orgInvitationsQueryOptions = (orgId: string) =>
  queryOptions({
    queryKey: ['org-invitations', orgId],
    queryFn: ({ signal }) =>
      apiClient
        .get<OrgInvitation[]>(`/api/v1/identities/organizations/${orgId}/invitations/`, { signal })
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!orgId,
  })

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery(workspaceMembersQueryOptions(workspaceId))
}

export function useOrgInvitations(orgId: string) {
  return useQuery(orgInvitationsQueryOptions(orgId))
}

export function useWorkspaceMembership(workspaceId: string) {
  return useQuery({
    queryKey: ['workspace-membership', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<WorkspaceMembership>(`/api/v1/identities/workspaces/${workspaceId}/me/`, { signal })
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })
}

export function useResendWorkspaceInvitation(workspaceId: string, orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invitationId: string) =>
      apiClient
        .post(
          `/api/v1/identities/workspaces/${workspaceId}/members/invitations/${invitationId}/resend/`,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-invitations', orgId] })
    },
  })
}

export function useInviteWorkspaceMember(workspaceId: string, orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InviteMemberFormValues) =>
      apiClient
        .post(`/api/v1/identities/workspaces/${workspaceId}/members/invite/`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
      queryClient.invalidateQueries({ queryKey: ['org-invitations', orgId] })
    },
  })
}
