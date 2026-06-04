import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { zSupplierDetailOutput, zSupplierListOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { SupplierFormValues } from './suppliers.schema'

export type Supplier = z.infer<typeof zSupplierListOutput>
export type SupplierDetail = z.infer<typeof zSupplierDetailOutput>

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface SuppliersParams {
  limit: number
  offset: number
  search?: string
}

export const suppliersQueryOptions = (
  workspaceId: string,
  params: SuppliersParams,
) =>
  queryOptions({
    queryKey: ['suppliers', workspaceId, params],
    queryFn: ({ signal }) =>
      apiClient
        .get<PaginatedResponse<Supplier>>(
          `/api/v1/workspaces/${workspaceId}/suppliers/`,
          {
            signal,
            params: {
              limit: params.limit,
              offset: params.offset,
              search: params.search || undefined,
            },
          },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })

export const supplierDetailQueryOptions = (
  workspaceId: string,
  supplierId: string,
) =>
  queryOptions({
    queryKey: ['supplier-detail', workspaceId, supplierId],
    queryFn: ({ signal }) =>
      apiClient
        .get<SupplierDetail>(
          `/api/v1/workspaces/${workspaceId}/suppliers/${supplierId}/`,
          { signal },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId && !!supplierId,
  })

export function useSuppliers(workspaceId: string, params: SuppliersParams) {
  return useQuery(suppliersQueryOptions(workspaceId, params))
}

export function useSupplierDetail(workspaceId: string, supplierId: string) {
  return useQuery(supplierDetailQueryOptions(workspaceId, supplierId))
}

export function useUpdateSupplier(workspaceId: string, supplierId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SupplierFormValues) =>
      apiClient
        .patch<SupplierDetail>(
          `/api/v1/workspaces/${workspaceId}/suppliers/${supplierId}/`,
          data,
        )
        .then((r) => r.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['supplier-detail', workspaceId, supplierId],
      })
      await queryClient.invalidateQueries({ queryKey: ['suppliers', workspaceId] })
    },
  })
}
