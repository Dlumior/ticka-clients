import { RiLoaderLine } from '@remixicon/react'
import type { UploadState } from '../../hooks/use-manual-upload'

interface UploadProgressProps {
  pendingUploads: UploadState[]
}

export function UploadProgress({ pendingUploads }: UploadProgressProps) {
  if (pendingUploads.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      {pendingUploads.map((s, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
          <RiLoaderLine className="size-4 shrink-0 animate-spin text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm">{s.filename}</span>
          <span className="text-xs text-muted-foreground">Uploading…</span>
        </div>
      ))}
    </div>
  )
}
