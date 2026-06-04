import { queryOptions, useQuery } from '@tanstack/react-query'
import { zInvoiceListOutput, zInvoiceDetailOutput } from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'

export type Invoice = z.infer<typeof zInvoiceListOutput>
export type InvoiceDetail = z.infer<typeof zInvoiceDetailOutput>
export type InvoiceHeader = NonNullable<InvoiceDetail['header']>
export type InvoiceLineItem = InvoiceDetail['line_items'][number]
export type InvoiceSupplier = InvoiceDetail['supplier']

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface InvoicesParams {
  limit: number
  offset: number
  status?: string
  invoice_type?: string
  search?: string
  supplier_id?: string
}

export const invoicesQueryOptions = (
  workspaceId: string,
  params: InvoicesParams,
) =>
  queryOptions({
    queryKey: ['invoices', workspaceId, params],
    queryFn: ({ signal }) =>
      apiClient
        .get<PaginatedResponse<Invoice>>(
          `/api/v1/workspaces/${workspaceId}/invoices/`,
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

export const invoiceDetailQueryOptions = (
  workspaceId: string,
  invoiceId: string,
) =>
  queryOptions({
    queryKey: ['invoice-detail', workspaceId, invoiceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<InvoiceDetail>(
          `/api/v1/workspaces/${workspaceId}/invoices/${invoiceId}/`,
          { signal },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId && !!invoiceId,
  })

export function useInvoices(workspaceId: string, params: InvoicesParams) {
  return useQuery(invoicesQueryOptions(workspaceId, params))
}

export function useInvoiceDetail(workspaceId: string, invoiceId: string) {
  return useQuery(invoiceDetailQueryOptions(workspaceId, invoiceId))
}
