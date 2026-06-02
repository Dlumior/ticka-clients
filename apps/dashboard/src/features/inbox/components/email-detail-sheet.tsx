import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatDatetimeInTz } from "@/lib/date"
import { useInboxAttachments } from "../api/inbox.api"
import type { InboundEmail, InboundAttachment } from "../api/inbox.api"
import { RiAttachmentLine } from "@remixicon/react"

interface EmailDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: InboundEmail | null
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
  queued: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  duplicate: "Duplicate",
}

function formatBytes(n: bigint | number): string {
  const bytes = typeof n === "bigint" ? Number(n) : n
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentRow({ attachment }: { attachment: InboundAttachment }) {
  const status = attachment.status ?? "stored"
  return (
    <div className="flex items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/50">
      <RiAttachmentLine className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {attachment.original_filename}
        </p>
        <p className="text-xs text-muted-foreground">
          {attachment.content_type} · {formatBytes(attachment.file_size_bytes)}
        </p>
      </div>
      <Badge
        variant={ATTACHMENT_STATUS_VARIANT[status] ?? "outline"}
        className="shrink-0"
      >
        {ATTACHMENT_STATUS_LABEL[status] ?? status}
      </Badge>
    </div>
  )
}

export function EmailDetailSheet({
  open,
  onOpenChange,
  email,
  workspaceId,
  timezone,
}: EmailDetailSheetProps) {
  const { data: attachments, isFetching: attachmentsFetching } =
    useInboxAttachments(workspaceId, email?.id ?? "")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="pb-0">
          <SheetTitle className="pr-8 leading-snug">
            {email?.subject || "(no subject)"}
          </SheetTitle>
          <SheetDescription>{email?.sender_email}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-3 px-4 pb-2">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {email?.sender_name && (
              <>
                <span className="text-muted-foreground">From</span>
                <span>{email.sender_name}</span>
              </>
            )}
            <span className="text-muted-foreground">Received</span>
            <span>
              {email ? formatDatetimeInTz(email.received_at, timezone) : "—"}
            </span>
            <span className="text-muted-foreground">Status</span>
            <span>
              {email?.status && (
                <Badge
                  variant={
                    email.status === "completed"
                      ? "default"
                      : email.status === "failed"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {email.status.replace(/_/g, " ")}
                </Badge>
              )}
            </span>
          </div>

          {email?.failure_reason && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {email.failure_reason}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-2 px-4 pb-4">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Attachments
          </p>

          {attachmentsFetching ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : attachments && attachments.length > 0 ? (
            <div className="-mx-2 flex flex-col">
              {attachments.map((a) => (
                <AttachmentRow key={a.id} attachment={a} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No attachments found.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
