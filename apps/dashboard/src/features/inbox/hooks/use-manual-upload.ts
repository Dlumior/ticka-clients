import { useCallback, useRef, useState } from 'react'
import { isApiError } from '@/lib/api-error'
import { useUploadInvoiceFile } from '../api/inbox.api'

export interface UploadState {
  filename: string
  uploading: boolean
  error: string | null
}

interface UseManualUploadOptions {
  workspaceId: string
}

export function useManualUpload({ workspaceId }: UseManualUploadOptions) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStates, setUploadStates] = useState<UploadState[]>([])

  const upload = useUploadInvoiceFile(workspaceId)

  const pendingUploads = uploadStates.filter((s) => s.uploading)
  const pendingErrors = uploadStates.filter((s) => !s.uploading && s.error)

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files)
      const allowed = list.filter((f) => {
        const ext = f.name.split('.').pop()?.toLowerCase()
        return ext === 'xml' || ext === 'pdf'
      })

      if (allowed.length === 0) return

      const newStates: UploadState[] = allowed.map((f) => ({
        filename: f.name,
        uploading: true,
        error: null,
      }))
      setUploadStates((prev) => [...prev, ...newStates])

      allowed.forEach((file) => {
        upload.mutate(file, {
          onSuccess: () => {
            setUploadStates((prev) =>
              prev.filter((s) => !(s.filename === file.name && s.uploading)),
            )
          },
          onError: (err) => {
            const message = isApiError(err) ? err.message : 'Upload failed.'
            setUploadStates((prev) =>
              prev.map((s) =>
                s.filename === file.name && s.uploading
                  ? { ...s, uploading: false, error: message }
                  : s,
              ),
            )
          },
        })
      })
    },
    [upload],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const onDragLeave = () => setIsDragOver(false)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  const dismissError = useCallback((index: number) => {
    setUploadStates((prev) => {
      const errors = prev.filter((s) => !s.uploading && s.error)
      const target = errors[index]
      if (!target) return prev
      const targetIdx = prev.indexOf(target)
      return prev.filter((_, i) => i !== targetIdx)
    })
  }, [])

  return {
    inputRef,
    isDragOver,
    uploadStates,
    pendingUploads,
    pendingErrors,
    handleFiles,
    onDrop,
    onDragOver,
    onDragLeave,
    onInputChange,
    dismissError,
  }
}
