import { RiDownloadLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { useDownloadExport, type InvoiceExport } from '../../api/workbench.api'

interface ExportRowActionsProps {
  workspaceId: string
  export: InvoiceExport
}

export function ExportRowActions({
  workspaceId,
  export: exportRow,
}: ExportRowActionsProps) {
  const download = useDownloadExport(workspaceId)

  if (exportRow.status !== 'completed') {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  async function handleDownload() {
    const { url } = await download.mutateAsync(exportRow.id)
    window.open(url, '_blank', 'noopener')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={download.isPending}
      onClick={handleDownload}
    >
      <RiDownloadLine />
      {download.isPending ? 'Preparing…' : 'Download'}
    </Button>
  )
}
