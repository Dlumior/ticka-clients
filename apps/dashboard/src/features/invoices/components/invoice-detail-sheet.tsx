import {
  RiArrowRightUpLine,
  RiBuilding2Line,
  RiErrorWarningLine,
  RiFileTextLine,
  RiMailLine,
  RiUploadCloud2Line,
} from '@remixicon/react'
import { Link, useParams } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { formatCalendarDate, formatDatetimeInTz } from '@/lib/date'
import { useInvoiceDetail } from '../api/invoices.api'
import type { Invoice, InvoiceDetail } from '../api/invoices.api'
import {
  formatMoney,
  formatNumber,
  statusLabel,
  statusVariant,
  typeLabel,
} from '../invoices.lib'

interface InvoiceDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  workspaceId: string
  timezone: string
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
      {children}
    </p>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className={`text-sm text-foreground ${mono ? 'font-mono tabular-nums' : ''}`}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function AmountsCard({ detail }: { detail: InvoiceDetail }) {
  const header = detail.header
  if (!header) return null
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">
            {formatMoney(header.subtotal, header.currency)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">IGV</span>
          <span className="tabular-nums">
            {formatMoney(header.igv_amount, header.currency)}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">
            {formatMoney(header.total, header.currency)}
          </span>
        </div>
      </div>
    </div>
  )
}

function SupplierCard({ detail }: { detail: InvoiceDetail }) {
  const supplier = detail.supplier
  const header = detail.header
  const name = supplier?.name || header?.supplier_name
  const ruc = supplier?.ruc || header?.supplier_ruc

  if (!name && !ruc) return null

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <RiBuilding2Line className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{name || '—'}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="RUC" value={ruc} mono />
        {supplier?.phone && <Field label="Phone" value={supplier.phone} />}
        {supplier?.email && <Field label="Email" value={supplier.email} />}
        {supplier?.address && <Field label="Address" value={supplier.address} />}
      </div>
    </div>
  )
}

function LineItemsTable({ detail }: { detail: InvoiceDetail }) {
  const items = detail.line_items ?? []
  const currency = detail.header?.currency

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
        <p className="text-sm text-muted-foreground">No line items.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2 font-semibold">#</th>
            <th className="px-3 py-2 font-semibold">Description</th>
            <th className="px-3 py-2 text-right font-semibold">Qty</th>
            <th className="px-3 py-2 text-right font-semibold">Unit price</th>
            <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2 tabular-nums text-muted-foreground">
                {item.line_number}
              </td>
              <td className="px-3 py-2">{item.description || '—'}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatNumber(item.quantity)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatMoney(item.unit_price, currency)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {formatMoney(item.subtotal, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Links the invoice back to the email or manual upload it came from, so a
// failure can be traced to its origin. Falls back to a dash when the source
// attachment is no longer available.
function SourceField({ detail }: { detail: InvoiceDetail }) {
  const params = useParams({ strict: false })
  const orgSlug = params.orgSlug
  const workspaceSlug = params.workspaceSlug

  const linkClass =
    'inline-flex items-center gap-1 text-sm text-primary hover:underline'

  if (orgSlug && workspaceSlug && detail.source_attachment_id) {
    if (detail.source_origin === 'email' && detail.inbound_email_id) {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-muted-foreground">Source</span>
          <Link
            to="/orgs/$orgSlug/workspaces/$workspaceSlug/inbox"
            params={{ orgSlug, workspaceSlug }}
            search={{ tab: 'email', emailId: detail.inbound_email_id }}
            className={linkClass}
          >
            <RiMailLine className="size-3.5 shrink-0" />
            Source email
            <RiArrowRightUpLine className="size-3.5 shrink-0" />
          </Link>
        </div>
      )
    }

    if (detail.source_origin === 'manual_upload') {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-muted-foreground">Source</span>
          <Link
            to="/orgs/$orgSlug/workspaces/$workspaceSlug/inbox"
            params={{ orgSlug, workspaceSlug }}
            search={{ tab: 'upload', attachmentId: detail.source_attachment_id }}
            className={linkClass}
          >
            <RiUploadCloud2Line className="size-3.5 shrink-0" />
            Uploaded file
            <RiArrowRightUpLine className="size-3.5 shrink-0" />
          </Link>
        </div>
      )
    }
  }

  return <Field label="Source" value="—" />
}

export function InvoiceDetailSheet({
  open,
  onOpenChange,
  invoice,
  workspaceId,
  timezone,
}: InvoiceDetailSheetProps) {
  const { data: detail, isFetching } = useInvoiceDetail(
    workspaceId,
    invoice?.id ?? '',
  )

  // Fall back to the list row while the detail request is in flight.
  const status = detail?.status ?? invoice?.status
  const invoiceType = detail?.invoice_type ?? invoice?.invoice_type
  const header = detail?.header
  const invoiceNumber =
    header?.invoice_number || invoice?.invoice_number || '(unparsed)'
  const loading = isFetching && !detail

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0"
        style={{ maxWidth: 'min(900px, 90vw)' }}
      >
        {/* Header strip */}
        <div className="shrink-0 border-b bg-muted/20">
          <div className="flex items-start justify-between gap-4 px-6 py-4">
            <SheetHeader className="gap-1 text-left">
              <SheetTitle className="flex items-center gap-2 text-base leading-snug">
                <RiFileTextLine className="size-4 text-muted-foreground" />
                <span className="font-mono">{invoiceNumber}</span>
              </SheetTitle>
              <SheetDescription className="text-sm">
                {header?.supplier_name ||
                  detail?.supplier?.name ||
                  invoice?.supplier_name ||
                  'Supplier not identified'}
              </SheetDescription>
            </SheetHeader>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <Badge variant={statusVariant(status)}>
                {statusLabel(status)}
              </Badge>
              <Badge variant="outline">{typeLabel(invoiceType)}</Badge>
            </div>
          </div>

          {detail?.failure_reason && (
            <div className="mx-6 mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
              <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-xs leading-relaxed text-destructive">
                {detail.failure_reason}
              </p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          ) : !detail ? (
            <p className="text-sm text-muted-foreground">
              Unable to load invoice details.
            </p>
          ) : (
            <>
              {/* Summary */}
              <div className="flex flex-col gap-3">
                <SectionLabel>Details</SectionLabel>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <Field
                    label="Issue date"
                    value={
                      header?.issue_date
                        ? formatCalendarDate(header.issue_date)
                        : null
                    }
                  />
                  <Field
                    label="Due date"
                    value={
                      header?.due_date
                        ? formatCalendarDate(header.due_date)
                        : null
                    }
                  />
                  <Field label="Currency" value={header?.currency} />
                  <Field
                    label="Received"
                    value={
                      detail.received_at
                        ? formatDatetimeInTz(detail.received_at, timezone)
                        : null
                    }
                  />
                  <Field label="Format" value={detail.source_type?.toUpperCase()} />
                  <Field label="Sender" value={detail.sender_email} />
                  <SourceField detail={detail} />
                </div>
                {detail.tags && detail.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {detail.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        style={{
                          borderColor: tag.color,
                          color: tag.color,
                        }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Amounts + Supplier */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <SectionLabel>Amounts</SectionLabel>
                  {header ? (
                    <AmountsCard detail={detail} />
                  ) : (
                    <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/10 py-8">
                      <p className="text-sm text-muted-foreground">
                        Not parsed yet.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <SectionLabel>Supplier</SectionLabel>
                  <SupplierCard detail={detail} />
                </div>
              </div>

              {/* Line items */}
              <div className="flex flex-col gap-3">
                <SectionLabel>Line items</SectionLabel>
                <LineItemsTable detail={detail} />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
