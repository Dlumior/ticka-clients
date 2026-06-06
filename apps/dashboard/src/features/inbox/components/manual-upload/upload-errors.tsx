import { RiErrorWarningLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import type { UploadState } from '../../hooks/use-manual-upload'

interface UploadErrorsProps {
  pendingErrors: UploadState[]
  onDismiss: (index: number) => void
}

export function UploadErrors({ pendingErrors, onDismiss }: UploadErrorsProps) {
  if (pendingErrors.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      {pendingErrors.map((s, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3"
        >
          <RiErrorWarningLine className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{s.filename}</p>
            <p className="text-xs text-destructive">{s.error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => onDismiss(i)}
          >
            Dismiss
          </Button>
        </div>
      ))}
    </div>
  )
}
