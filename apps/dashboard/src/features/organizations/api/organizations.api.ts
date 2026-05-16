import { useMutation, queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { zOrganizationCreateOutput, zOrganizationDetailOutput, zOrganizationListOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { CreateOrganizationFormValues } from './organizations.schema'

export type Organization = z.infer<typeof zOrganizationListOutput>
export type OrganizationDetail = z.infer<typeof zOrganizationDetailOutput>
export type Workspace = OrganizationDetail['workspaces'][number]
export type CreatedOrganization = z.infer<typeof zOrganizationCreateOutput>

export const organizationsQueryOptions = queryOptions({
  queryKey: ['organizations'],
  queryFn: ({ signal }) =>
    apiClient
      .get<Organization[]>('/api/v1/identities/organizations/', { signal })
      .then((r) => r.data),
  staleTime: 60_000,
})

export const organizationDetailQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ['organizations', organizationId],
    queryFn: ({ signal }) =>
      apiClient
        .get<OrganizationDetail>(`/api/v1/identities/organizations/${organizationId}/`, {
          signal,
        })
        .then((r) => r.data),
    staleTime: 60_000,
  })

export function useOrganizations() {
  return useQuery(organizationsQueryOptions)
}

export function useOrganizationDetail(organizationId: string) {
  return useQuery(organizationDetailQueryOptions(organizationId))
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrganizationFormValues) =>
      apiClient
        .post<CreatedOrganization>('/api/v1/identities/organizations/create/', data)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    },
  })
}
