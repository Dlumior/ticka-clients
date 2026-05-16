import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zOrganizationWorkspaceCreateOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { CreateWorkspaceFormValues } from './workspaces.schema'

export type CreatedWorkspace = z.infer<typeof zOrganizationWorkspaceCreateOutput>

export function useCreateWorkspace(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkspaceFormValues) =>
      apiClient
        .post<CreatedWorkspace>(
          `/api/v1/identities/organizations/${organizationId}/workspaces/create/`,
          data,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', organizationId] })
    },
  })
}
