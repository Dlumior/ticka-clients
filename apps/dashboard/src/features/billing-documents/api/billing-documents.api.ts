import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { zBillingDocumentListOutput, zBillingDocumentDetailOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'

export type BillingDocument = z.infer<typeof zBillingDocumentListOutput>
export type BillingDocumentDetail = z.infer<typeof zBillingDocumentDetailOutput>
export type BillingDocumentHeader = NonNullable<BillingDocumentDetail['header']>
export type BillingDocumentLineItem = BillingDocumentDetail['line_items'][number]
export type BillingDocumentSupplier = BillingDocumentDetail['supplier']

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface BillingDocumentsParams {
  limit: number
  offset: number
  status?: string
  invoice_type?: string
  search?: string
  supplier_id?: string
}

export const billingDocumentsQueryOptions = (
  workspaceId: string,
  params: BillingDocumentsParams,
) =>
  queryOptions({
    queryKey: ['billing-documents', workspaceId, params],
    queryFn: ({ signal }) =>
      apiClient
        .get<PaginatedResponse<BillingDocument>>(
          `/api/v1/workspaces/${workspaceId}/billing-documents/`,
          {
            signal,
            params: {
              limit: params.limit,
              offset: params.offset,
              status: params.status || undefined,
              invoice_type: params.invoice_type || undefined,
              search: params.search || undefined,
              supplier_id: params.supplier_id || undefined,
            },
          },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })

export const billingDocumentDetailQueryOptions = (
  workspaceId: string,
  billingDocumentId: string,
) =>
  queryOptions({
    queryKey: ['billing-document-detail', workspaceId, billingDocumentId],
    queryFn: ({ signal }) =>
      apiClient
        .get<BillingDocumentDetail>(
          `/api/v1/workspaces/${workspaceId}/billing-documents/${billingDocumentId}/`,
          { signal },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId && !!billingDocumentId,
  })

export function useBillingDocuments(workspaceId: string, params: BillingDocumentsParams) {
  return useQuery(billingDocumentsQueryOptions(workspaceId, params))
}

export function useBillingDocumentDetail(workspaceId: string, billingDocumentId: string) {
  return useQuery(billingDocumentDetailQueryOptions(workspaceId, billingDocumentId))
}

export function useDeleteBillingDocument(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (billingDocumentId: string) =>
      apiClient
        .delete(`/api/v1/workspaces/${workspaceId}/billing-documents/${billingDocumentId}/`)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-documents', workspaceId] })
    },
  })
}
