import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  zInboundEmailStatusEnum,
  zBillingDocumentDetailOutputStatusEnum,
  zBillingDocumentTypeEnum,
  zWorkspaceStatsOutput,
} from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'

export type BillingDocumentStatus = z.infer<typeof zBillingDocumentDetailOutputStatusEnum>
export type BillingDocumentType = z.infer<typeof zBillingDocumentTypeEnum>
export type InboundEmailStatus = z.infer<typeof zInboundEmailStatusEnum>

// The backend returns these as DictField, which openapi-ts emits as an
// untyped `{}`. We know the exact keys (they are zero-filled server-side over
// the enum values), so we narrow them here for safe, exhaustive consumption.
type RawWorkspaceStats = z.infer<typeof zWorkspaceStatsOutput>

export type WorkspaceStats = Omit<RawWorkspaceStats, 'billing_documents' | 'ingestion'> & {
  billing_documents: Omit<RawWorkspaceStats['billing_documents'], 'by_status' | 'by_type'> & {
    by_status: Record<BillingDocumentStatus, number>
    by_type: Record<BillingDocumentType, number>
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
