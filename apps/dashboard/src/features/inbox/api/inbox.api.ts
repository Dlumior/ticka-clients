import { queryOptions, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  zInboundEmailListOutput,
  zInboundAttachmentListOutput,
  zInboundEmailDetailOutput,
  zBillingDocumentListOutput,
} from "@repo/api-types"
import type { z } from "zod"
import { apiClient } from "@/lib/api-client"

export type InboundEmail = z.infer<typeof zInboundEmailListOutput>
export type InboundAttachment = z.infer<typeof zInboundAttachmentListOutput>
export type InboundEmailDetail = z.infer<typeof zInboundEmailDetailOutput>
export type BillingDocumentForAttachment = z.infer<typeof zBillingDocumentListOutput>

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface InboxEmailsParams {
  limit: number
  offset: number
  status?: string
  search?: string
}

export const inboxEmailsQueryOptions = (
  workspaceId: string,
  params: InboxEmailsParams
) =>
  queryOptions({
    queryKey: ["inbox-emails", workspaceId, params],
    queryFn: ({ signal }) =>
      apiClient
        .get<PaginatedResponse<InboundEmail>>(
          `/api/v1/ingestion/workspaces/${workspaceId}/emails/`,
          {
            signal,
            params: {
              limit: params.limit,
              offset: params.offset,
              status: params.status || undefined,
              search: params.search || undefined,
            },
          }
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })

export const inboxEmailDetailQueryOptions = (
  workspaceId: string,
  emailId: string
) =>
  queryOptions({
    queryKey: ["inbox-email-detail", workspaceId, emailId],
    queryFn: ({ signal }) =>
      apiClient
        .get<InboundEmailDetail>(
          `/api/v1/ingestion/workspaces/${workspaceId}/emails/${emailId}/`,
          { signal }
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId && !!emailId,
  })

export function useInboxEmailDetail(workspaceId: string, emailId: string) {
  return useQuery(inboxEmailDetailQueryOptions(workspaceId, emailId))
}

const ACTIVE_ATTACHMENT_STATUSES = new Set(["queued", "processing"])

export const inboxAttachmentsQueryOptions = (
  workspaceId: string,
  emailId: string
) =>
  queryOptions({
    queryKey: ["inbox-attachments", workspaceId, emailId],
    queryFn: ({ signal }) =>
      apiClient
        .get<InboundAttachment[]>(
          `/api/v1/ingestion/workspaces/${workspaceId}/attachments/`,
          {
            signal,
            params: { inbound_email_id: emailId },
          }
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId && !!emailId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      return data.some((a) => ACTIVE_ATTACHMENT_STATUSES.has(a.status ?? ""))
        ? 3_000
        : false
    },
  })

export const manualAttachmentsQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ['manual-attachments', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<InboundAttachment[]>(
          `/api/v1/ingestion/workspaces/${workspaceId}/attachments/`,
          { signal, params: { source: 'manual_upload' } }
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      return data.some((a) => ACTIVE_ATTACHMENT_STATUSES.has(a.status ?? ''))
        ? 3_000
        : false
    },
  })

export function useInboxEmails(workspaceId: string, params: InboxEmailsParams) {
  return useQuery(inboxEmailsQueryOptions(workspaceId, params))
}

export function useInboxAttachments(workspaceId: string, emailId: string) {
  return useQuery(inboxAttachmentsQueryOptions(workspaceId, emailId))
}

export function useManualAttachments(workspaceId: string) {
  return useQuery(manualAttachmentsQueryOptions(workspaceId))
}

export function useUploadInvoiceFile(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const r = await apiClient.post<InboundAttachment>(
        `/api/v1/ingestion/workspaces/${workspaceId}/attachments/upload/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return r.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-attachments', workspaceId] })
    },
  })
}

export function useDownloadAttachment(workspaceId: string) {
  return useMutation({
    mutationFn: async (attachmentId: string) => {
      const r = await apiClient.get<{ url: string }>(
        `/api/v1/ingestion/workspaces/${workspaceId}/attachments/${attachmentId}/download-url/`
      )
      return r.data.url
    },
    onSuccess: (url) => {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
  })
}

export function useAttachmentPreviewUrl(
  workspaceId: string,
  attachmentId: string | null
) {
  return useQuery({
    queryKey: ['attachment-preview-url', workspaceId, attachmentId],
    queryFn: ({ signal }) =>
      apiClient
        .get<{ url: string }>(
          `/api/v1/ingestion/workspaces/${workspaceId}/attachments/${attachmentId}/preview-url/`,
          { signal }
        )
        .then((r) => r.data.url),
    enabled: !!workspaceId && !!attachmentId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBillingDocumentForAttachment(
  workspaceId: string,
  attachmentId: string | null
) {
  return useQuery({
    queryKey: ['invoice-for-attachment', workspaceId, attachmentId],
    queryFn: ({ signal }) =>
      apiClient
        .get<{ results: BillingDocumentForAttachment[] }>(
          `/api/v1/workspaces/${workspaceId}/billing-documents/`,
          { signal, params: { source_attachment_id: attachmentId, limit: 1 } }
        )
        .then((r) => r.data.results[0] ?? null),
    enabled: !!workspaceId && !!attachmentId,
    staleTime: 30_000,
  })
}

export function useReprocessAttachment(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: string) =>
      apiClient
        .post<{ status: string; attachment_id: string }>(
          `/api/v1/ingestion/attachments/${attachmentId}/reprocess/`
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-attachments', workspaceId] })
    },
  })
}
