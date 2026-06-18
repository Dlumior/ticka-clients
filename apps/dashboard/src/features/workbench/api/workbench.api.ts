import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  zExportFieldOutput,
  zExportPeriodOutput,
  zExportTemplateOutput,
  zBillingDocumentExportOutput,
} from '@repo/api-types'
import type { z } from 'zod'
import { apiClient } from '@/lib/api-client'
import type { BillingDocument } from '@/features/billing-documents/api/billing-documents.api'

export type ExportField = z.infer<typeof zExportFieldOutput>
export type ExportTemplate = z.infer<typeof zExportTemplateOutput>
export type ExportColumn = ExportTemplate['columns'][number]
export type ExportPeriod = z.infer<typeof zExportPeriodOutput>
export type BillingDocumentExport = z.infer<typeof zBillingDocumentExportOutput>

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// --- selection payload (mirrors the backend export create contract) --------

export interface ExportFilters {
  supplier_ids?: string[]
  date_from?: string
  date_to?: string
  status?: string
}

export interface ExportSelection {
  mode: 'filter' | 'explicit'
  filters?: ExportFilters
  billing_document_ids?: string[]
  line_item_ids?: string[]
}

export interface CreateExportInput extends ExportSelection {
  template_id: string
  period_id?: string | null
}

// --- workbench browse (reuses the billing documents list endpoint) ----------

export interface WorkbenchBrowseParams {
  limit: number
  offset: number
  supplier_ids?: string[]
  date_from?: string
  date_to?: string
  status?: string
}

export const workbenchBillingDocumentsQueryOptions = (
  workspaceId: string,
  params: WorkbenchBrowseParams,
) =>
  queryOptions({
    queryKey: ['workbench-billing-documents', workspaceId, params],
    queryFn: ({ signal }) =>
      apiClient
        .get<PaginatedResponse<BillingDocument>>(
          `/api/v1/workspaces/${workspaceId}/billing-documents/`,
          {
            signal,
            params: {
              limit: params.limit,
              offset: params.offset,
              supplier_ids: params.supplier_ids?.length
                ? params.supplier_ids
                : undefined,
              date_from: params.date_from || undefined,
              date_to: params.date_to || undefined,
              status: params.status || undefined,
            },
            // Repeat array params as ?supplier_ids=a&supplier_ids=b so the
            // backend's getlist('supplier_ids') picks them up.
            paramsSerializer: { indexes: null },
          },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })

export function useWorkbenchBillingDocuments(
  workspaceId: string,
  params: WorkbenchBrowseParams,
) {
  return useQuery(workbenchBillingDocumentsQueryOptions(workspaceId, params))
}

// --- field registry --------------------------------------------------------

export function useExportFields(workspaceId: string) {
  return useQuery({
    queryKey: ['export-fields', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<ExportField[]>(
          `/api/v1/workspaces/${workspaceId}/export-fields/`,
          { signal },
        )
        .then((r) => r.data),
    staleTime: 5 * 60_000,
    enabled: !!workspaceId,
  })
}

// --- templates -------------------------------------------------------------

export interface TemplateInput {
  name: string
  columns: ExportColumn[]
}

export function useExportTemplates(workspaceId: string) {
  return useQuery({
    queryKey: ['export-templates', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<ExportTemplate[]>(
          `/api/v1/workspaces/${workspaceId}/export-templates/`,
          { signal },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })
}

export function useCreateTemplate(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TemplateInput) =>
      apiClient
        .post<ExportTemplate>(
          `/api/v1/workspaces/${workspaceId}/export-templates/`,
          data,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-templates', workspaceId] })
    },
  })
}

export function useUpdateTemplate(workspaceId: string, templateId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TemplateInput) =>
      apiClient
        .patch<ExportTemplate>(
          `/api/v1/workspaces/${workspaceId}/export-templates/${templateId}/`,
          data,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-templates', workspaceId] })
    },
  })
}

export function useDeleteTemplate(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (templateId: string) =>
      apiClient
        .delete(`/api/v1/workspaces/${workspaceId}/export-templates/${templateId}/`)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-templates', workspaceId] })
    },
  })
}

// --- periods ---------------------------------------------------------------

export interface PeriodInput {
  name: string
  start_date: string
  end_date: string
}

export function useExportPeriods(workspaceId: string) {
  return useQuery({
    queryKey: ['export-periods', workspaceId],
    queryFn: ({ signal }) =>
      apiClient
        .get<ExportPeriod[]>(
          `/api/v1/workspaces/${workspaceId}/export-periods/`,
          { signal },
        )
        .then((r) => r.data),
    staleTime: 30_000,
    enabled: !!workspaceId,
  })
}

export function useCreatePeriod(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PeriodInput) =>
      apiClient
        .post<ExportPeriod>(
          `/api/v1/workspaces/${workspaceId}/export-periods/`,
          data,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-periods', workspaceId] })
    },
  })
}

export function useDeletePeriod(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (periodId: string) =>
      apiClient
        .delete(`/api/v1/workspaces/${workspaceId}/export-periods/${periodId}/`)
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-periods', workspaceId] })
    },
  })
}

// --- exports (history + trigger + download) --------------------------------

export interface ExportsParams {
  limit: number
  offset: number
}

export function useExports(workspaceId: string, params: ExportsParams) {
  return useQuery({
    queryKey: ['billing-document-exports', workspaceId, params],
    queryFn: ({ signal }) =>
      apiClient
        .get<PaginatedResponse<BillingDocumentExport>>(
          `/api/v1/workspaces/${workspaceId}/exports/`,
          {
            signal,
            params: { limit: params.limit, offset: params.offset },
          },
        )
        .then((r) => r.data),
    staleTime: 10_000,
    enabled: !!workspaceId,
    // Keep polling while any export is still generating.
    refetchInterval: (query) => {
      const data = query.state.data as
        | PaginatedResponse<BillingDocumentExport>
        | undefined
      const pending = data?.results?.some(
        (e) => e.status === 'pending' || e.status === 'processing',
      )
      return pending ? 3000 : false
    },
  })
}

export function useCreateExport(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExportInput) =>
      apiClient
        .post<BillingDocumentExport>(
          `/api/v1/workspaces/${workspaceId}/exports/`,
          data,
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-document-exports', workspaceId] })
    },
  })
}

export function useDownloadExport(workspaceId: string) {
  return useMutation({
    mutationFn: (exportId: string) =>
      apiClient
        .get<{ url: string }>(
          `/api/v1/workspaces/${workspaceId}/exports/${exportId}/download-url/`,
        )
        .then((r) => r.data),
  })
}
