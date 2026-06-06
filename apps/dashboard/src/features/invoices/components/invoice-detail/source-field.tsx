import {
  RiArrowRightUpLine,
  RiMailLine,
  RiUploadCloud2Line,
} from '@remixicon/react'
import { Link, useParams } from '@tanstack/react-router'
import type { InvoiceDetail } from '../../api/invoices.api'
import { Field } from './field'

interface SourceFieldProps {
  detail: InvoiceDetail
}

// Links the invoice back to the email or manual upload it came from, so a
// failure can be traced to its origin.
export function SourceField({ detail }: SourceFieldProps) {
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
