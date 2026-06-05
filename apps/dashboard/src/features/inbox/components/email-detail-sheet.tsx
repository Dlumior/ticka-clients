import {
  RiAttachmentLine,
  RiDownloadLine,
  RiEyeLine,
  RiEyeOffLine,
  RiMailLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiLoaderLine,
  RiRefreshLine,
} from "@remixicon/react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatDatetimeInTz } from "@/lib/date"
import {
  useInboxAttachments,
  useInboxEmailDetail,
  useAttachmentPreviewUrl,
  useDownloadAttachment,
  useInvoiceForAttachment,
  useReprocessAttachment,
} from "../api/inbox.api"
import type { InboundAttachment } from "../api/inbox.api"
import {
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_VARIANT,
} from "@/features/invoices/invoices.lib"

interface EmailDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  emailId: string | null
  workspaceId: string
  timezone: string
}

const ATTACHMENT_STATUS_VARIANT: Record<
  string,
  "default" | "destructive" | "secondary" | "outline"
> = {
  stored: "outline",
  queued: "secondary",
  processing: "outline",
  completed: "default",
  failed: "destructive",
  duplicate: "secondary",
}

const ATTACHMENT_STATUS_LABEL: Record<string, string> = {
  stored: "Stored",
  queued: "Queued for invoice",
  processing: "Processing as invoice",
  completed: "Invoiced",
  failed: "Failed",
  duplicate: "Duplicate",
}

function formatBytes(n: bigint | number): string {
  const bytes = typeof n === "bigint" ? Number(n) : n
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed")
    return <RiCheckboxCircleLine className="size-3.5 text-emerald-500" />
  if (status === "failed")
    return <RiErrorWarningLine className="size-3.5 text-destructive" />
  if (status === "processing" || status === "queued")
    return (
      <RiLoaderLine className="size-3.5 animate-spin text-muted-foreground" />
    )
  return null
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
      {children}
    </p>
  )
}

// ── Email body (left column) ──────────────────────────────────────────────────

function EmailBody({
  bodyHtml,
  bodyText,
  isLoading,
}: {
  bodyHtml: string
  bodyText: string
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 rounded-lg border bg-muted/20 p-4">
        {[3 / 4, 1, 5 / 6, 2 / 3, 4 / 5, 1, 3 / 4].map((w, i) => (
          <Skeleton
            key={i}
            className="h-3 rounded"
            style={{ width: `${w * 100}%` }}
          />
        ))}
      </div>
    )
  }

  if (bodyHtml) {
    return (
      <div className="flex-1 overflow-hidden rounded-lg border bg-white shadow-sm">
        <iframe
          srcDoc={bodyHtml}
          sandbox=""
          title="Email body"
          className="size-full"
        />
      </div>
    )
  }

  if (bodyText) {
    return (
      <pre className="flex-1 overflow-y-auto rounded-lg border bg-muted/20 p-4 font-sans text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground">
        {bodyText}
      </pre>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/10">
      <p className="text-sm text-muted-foreground">No message body.</p>
    </div>
  )
}

// ── Attachment list + per-file PDF preview (right column) ─────────────────────

function AttachmentRow({
  attachment,
  workspaceId,
  isSelected,
  onSelect,
}: {
  attachment: InboundAttachment
  workspaceId: string
  isSelected: boolean
  onSelect: () => void
}) {
  const status = attachment.status ?? "stored"
  const isPdf = attachment.content_type === "application/pdf"
  const canDownload = !!attachment.storage_path && status !== "duplicate"

  const download = useDownloadAttachment(workspaceId)
  const reprocess = useReprocessAttachment(workspaceId)

  const { data: invoice, isFetching: invoiceFetching } = useInvoiceForAttachment(
    workspaceId,
    status === "completed" ? attachment.id : null
  )

  const {
    data: previewUrl,
    isFetching: urlFetching,
    isError: urlError,
  } = useAttachmentPreviewUrl(workspaceId, isSelected ? attachment.id : null)

  return (
    <div className="flex flex-col gap-0">
      {/* Row */}
      <div
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
          isSelected ? "bg-muted/60" : "hover:bg-muted/30"
        }`}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <RiAttachmentLine className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-tight font-medium">
            {attachment.original_filename}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatBytes(attachment.file_size_bytes)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5">
            <StatusIcon status={status} />
            <Badge
              variant={ATTACHMENT_STATUS_VARIANT[status] ?? "outline"}
              className="text-[10px]"
            >
              {ATTACHMENT_STATUS_LABEL[status] ?? status}
            </Badge>
            {/* Invoice status badge — visible once attachment processing is done */}
            {status === "completed" && (
              invoiceFetching ? (
                <RiLoaderLine className="size-3 animate-spin text-muted-foreground" />
              ) : invoice ? (
                <Badge
                  variant={INVOICE_STATUS_VARIANT[invoice.status] ?? "outline"}
                  className="text-[10px]"
                >
                  {INVOICE_STATUS_LABEL[invoice.status] ?? invoice.status}
                </Badge>
              ) : null
            )}
          </div>

          {/* Retry button for failed attachments */}
          {status === "failed" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={() => reprocess.mutate(attachment.id)}
              disabled={reprocess.isPending}
              aria-label="Retry processing as invoice"
            >
              {reprocess.isPending ? (
                <RiLoaderLine className="size-3.5 animate-spin" />
              ) : (
                <RiRefreshLine className="size-3.5" />
              )}
              Retry
            </Button>
          )}

          {canDownload && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={() => download.mutate(attachment.id)}
              disabled={download.isPending}
              aria-label="Download attachment"
            >
              {download.isPending ? (
                <RiLoaderLine className="size-3.5 animate-spin" />
              ) : (
                <RiDownloadLine className="size-3.5" />
              )}
            </Button>
          )}

          {isPdf && (
            <Button
              variant={isSelected ? "secondary" : "ghost"}
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs font-medium"
              onClick={onSelect}
              aria-label={isSelected ? "Hide PDF preview" : "Show PDF preview"}
            >
              {isSelected ? (
                <>
                  <RiEyeOffLine className="size-3.5" />
                </>
              ) : (
                <>
                  <RiEyeLine className="size-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Inline PDF viewer — shown below selected row */}
      {isSelected && (
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
          {urlFetching && !previewUrl ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : urlError ? (
            <div className="flex items-center gap-2 px-4 py-3">
              <RiErrorWarningLine className="size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">
                Failed to load preview.
              </p>
            </div>
          ) : previewUrl ? (
            <>
              <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2">
                <span className="truncate text-xs font-medium text-muted-foreground">
                  {attachment.original_filename}
                </span>
                <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                  {formatBytes(attachment.file_size_bytes)}
                </span>
              </div>
              <iframe
                src={previewUrl}
                title={attachment.original_filename}
                className="w-full flex-1"
                style={{ minHeight: "520px" }}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

function AttachmentsPanel({
  attachments,
  isFetching,
  workspaceId,
}: {
  attachments: InboundAttachment[] | undefined
  isFetching: boolean
  workspaceId: string
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function toggle(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  if (isFetching) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    )
  }

  if (!attachments || attachments.length === 0) {
    return (
      <div className="mx-4 flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/10">
        <p className="text-sm text-muted-foreground">No attachments</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 px-2">
      {attachments.map((a) => (
        <AttachmentRow
          key={a.id}
          attachment={a}
          workspaceId={workspaceId}
          isSelected={selectedId === a.id}
          onSelect={() => toggle(a.id)}
        />
      ))}
    </div>
  )
}

// ── Root component ────────────────────────────────────────────────────────────

export function EmailDetailSheet({
  open,
  onOpenChange,
  emailId,
  workspaceId,
  timezone,
}: EmailDetailSheetProps) {
  // The detail query carries every header field (subject, sender, status,
  // failure_reason, received_at) the strip needs, so the sheet can open from an
  // id alone — no list-row object required. This is what makes deep-linking work.
  const { data: detail, isFetching: detailFetching } = useInboxEmailDetail(
    workspaceId,
    emailId ?? ""
  )
  const { data: attachments, isFetching: attachmentsFetching } =
    useInboxAttachments(workspaceId, emailId ?? "")

  const emailStatus = detail?.status
  const statusVariant =
    emailStatus === "completed"
      ? "default"
      : emailStatus === "failed"
        ? "destructive"
        : "secondary"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/*
        Use a very wide drawer — roughly 85 vw capped at 1200px.
        Tailwind doesn't ship a class this wide so we override via style.
      */}
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0"
        style={{ maxWidth: "min(1200px, 85vw)" }}
      >
        {/* ── Top strip: header + metadata ──────────────────── */}
        <div className="shrink-0 border-b bg-muted/20">
          {/* Subject / sender */}
          <div className="flex items-start justify-between gap-4 px-6 py-4">
            <SheetHeader className="gap-0.5 text-left">
              <SheetTitle className="text-base leading-snug">
                {detail?.subject || "(no subject)"}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {detail?.sender_email}
              </SheetDescription>
            </SheetHeader>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t px-6 py-3">
            {detail?.sender_name && (
              <div className="flex items-center gap-1.5">
                <RiMailLine className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">From</span>
                <span className="text-xs font-medium">{detail.sender_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <RiTimeLine className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Received</span>
              <span className="text-xs tabular-nums">
                {detail ? formatDatetimeInTz(detail.received_at, timezone) : "—"}
              </span>
            </div>
            {emailStatus && (
              <Badge variant={statusVariant} className="text-[10px]">
                {emailStatus.replace(/_/g, " ")}
              </Badge>
            )}
            {detail?.failure_reason && (
              <div className="flex w-full items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
                <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-xs leading-relaxed text-destructive">
                  {detail.failure_reason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Two-column body ───────────────────────────────── */}
        <div className="flex min-h-0 flex-1 divide-x">
          {/* Left — email body */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
            <SectionLabel>Message</SectionLabel>
            <EmailBody
              bodyHtml={detail?.body_html ?? ""}
              bodyText={detail?.body_text ?? ""}
              isLoading={detailFetching && !detail}
            />
          </div>

          {/* Right — attachments + PDF viewer */}
          <div className="flex w-[520px] shrink-0 flex-col gap-3 overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <SectionLabel>Attachments</SectionLabel>
              {attachments && attachments.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {attachments.length} file{attachments.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <AttachmentsPanel
              attachments={attachments}
              isFetching={attachmentsFetching}
              workspaceId={workspaceId}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
