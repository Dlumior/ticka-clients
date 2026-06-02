import { queryOptions, useQuery, useMutation } from "@tanstack/react-query"
import {
  zInboundEmailListOutput,
  zInboundAttachmentListOutput,
  zInboundEmailDetailOutput,
} from "@repo/api-types"
import type { z } from "zod"
import { apiClient } from "@/lib/api-client"

export type InboundEmail = z.infer<typeof zInboundEmailListOutput>
export type InboundAttachment = z.infer<typeof zInboundAttachmentListOutput>
export type InboundEmailDetail = z.infer<typeof zInboundEmailDetailOutput>

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
  })

export function useInboxEmails(workspaceId: string, params: InboxEmailsParams) {
  return useQuery(inboxEmailsQueryOptions(workspaceId, params))
}

export function useInboxAttachments(workspaceId: string, emailId: string) {
  return useQuery(inboxAttachmentsQueryOptions(workspaceId, emailId))
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
