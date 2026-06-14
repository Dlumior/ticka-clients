import { useTranslation } from 'react-i18next'
import { RiUploadCloud2Line } from '@remixicon/react'

interface DropZoneProps {
  isDragOver: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function DropZone({
  isDragOver,
  inputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onInputChange,
}: DropZoneProps) {
  const { t } = useTranslation('inbox')

  return (
    <div
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-12 text-center transition-colors ${
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/30'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label={t('dropZone.ariaLabel')}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <RiUploadCloud2Line className="size-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">
          {t('dropZone.dropText')}{' '}
          <span className="text-primary underline underline-offset-2">{t('dropZone.browseText')}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('dropZone.constraints')}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xml,.pdf"
        multiple
        className="sr-only"
        onChange={onInputChange}
      />
    </div>
  )
}
