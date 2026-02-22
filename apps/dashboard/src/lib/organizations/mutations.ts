import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orgKeys } from './keys'
import { createWorkspace } from '@/lib/api/workspaces'

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      organizationId,
      name,
    }: {
      organizationId: string
      name: string
    }) => createWorkspace(organizationId, { name }),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: orgKeys.workspace(organizationId),
      })
      queryClient.invalidateQueries({ queryKey: orgKeys.all })
    },
  })
}
