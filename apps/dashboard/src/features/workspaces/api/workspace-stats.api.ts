import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  zInboundEmailStatusEnum,
  zInvoiceDetailOutputStatusEnum,
  zInvoiceTypeEnum,
  zWorkspaceStatsOutput,
} from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'

export type InvoiceStatus = z.infer<typeof zInvoiceDetailOutputStatusEnum>
export type InvoiceType = z.infer<typeof zInvoiceTypeEnum>
export type InboundEmailStatus = z.infer<typeof zInboundEmailStatusEnum>

// The backend returns these as DictField, which openapi-ts emits as an
// untyped `{}`. We know the exact keys (they are zero-filled server-side over
// the enum values), so we narrow them here for safe, exhaustive consumption.
type RawWorkspaceStats = z.infer<typeof zWorkspaceStatsOutput>

export type WorkspaceStats = Omit<RawWorkspaceStats, 'invoices' | 'ingestion'> & {
  invoices: Omit<RawWorkspaceStats['invoices'], 'by_status' | 'by_type'> & {
    by_status: Record<InvoiceStatus, number>
    by_type: Record<InvoiceType, number>
  }
  ingestion: Omit<RawWorkspaceStats['ingestion'], 'emails_by_status'> & {
    emails_by_status: Record<InboundEmailStatus, number>
  }
}

export const workspaceStatsQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ['workspace-stats', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<WorkspaceStats>(`/api/v1/workspaces/${workspaceId}/stats/`, {
          signal,
        })
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })

export function useWorkspaceStats(workspaceId: string) {
  return useQuery(workspaceStatsQueryOptions(workspaceId))
}
