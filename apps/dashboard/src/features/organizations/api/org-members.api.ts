import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zOrganizationMemberListOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { OrgRole } from '@/features/permissions'

export type OrgMember = z.infer<typeof zOrganizationMemberListOutput>

export const orgMembersQueryOptions = (orgId: string) =>
  queryOptions({
    queryKey: ['org-members', orgId],
    queryFn: ({ signal }) =>
      apiClient
        .get<OrgMember[]>(`/api/v1/identities/organizations/${orgId}/members/`, { signal })
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!orgId,
  })

export function useOrgMembers(orgId: string) {
  return useQuery(orgMembersQueryOptions(orgId))
}

export function useInviteOrgMember(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { email: string; role: OrgRole }) =>
      apiClient
        .post(`/api/v1/identities/organizations/${orgId}/members/invite/`, data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members', orgId] })
      queryClient.invalidateQueries({ queryKey: ['org-invitations', orgId] })
    },
  })
}

export function useUpdateOrgMemberRole(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: OrgRole }) =>
      apiClient
        .patch(`/api/v1/identities/organizations/${orgId}/members/${memberId}/update-role/`, {
          role,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members', orgId] })
    },
  })
}

export function useRemoveOrgMember(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient
        .post(`/api/v1/identities/organizations/${orgId}/members/${memberId}/remove/`)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-members', orgId] })
    },
  })
}
