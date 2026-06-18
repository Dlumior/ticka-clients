import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateExport,
  useExportFields,
  useExportTemplates,
  type ExportFilters,
} from '../../api/workbench.api'
import { useWorkbenchContext } from '../../context/workbench.context'

export function ExportDialog() {
  const { t } = useTranslation('workbench')
  const { t: tc } = useTranslation('common')
  const {
    workspaceId,
    filters,
    selection,
    exportDialogOpen,
    closeExportDialog,
    onExported,
  } = useWorkbenchContext()

  const { data: templates } = useExportTemplates(workspaceId)
  const { data: fields } = useExportFields(workspaceId)
  const createExport = useCreateExport(workspaceId)
  const [templateId, setTemplateId] = useState('')

  const lineFieldKeys = useMemo(
    () =>
      new Set(
        (fields ?? []).filter((f) => f.grain === 'line').map((f) => f.key),
      ),
    [fields],
  )

  const selectedTemplate = templates?.find((tmpl) => tmpl.id === templateId)
  const isLineGrain = selectedTemplate?.columns.some((c) =>
    lineFieldKeys.has(c.field),
  )

  async function handleGenerate() {
    if (!templateId) return
    const filterPayload: ExportFilters = {
      supplier_ids: filters.supplierIds.length ? filters.supplierIds : undefined,
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
      status: filters.status || undefined,
    }
    const sel = selection.buildSelection(filterPayload)
    await createExport.mutateAsync({
      template_id: templateId,
      period_id: filters.periodId || null,
      ...sel,
    })
    setTemplateId('')
    selection.clear()
    closeExportDialog()
    onExported()
  }

  return (
    <Dialog open={exportDialogOpen} onOpenChange={(o) => !o && closeExportDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exportDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('exportDialog.description')}
          </DialogDescription>
        </DialogHeader>

        {templates && templates.length === 0 ? (
          <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            {t('exportDialog.noTemplatesYet')}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <Select value={templateId} onValueChange={(v) => setTemplateId(v ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('exportDialog.selectTemplate')}>
                  {(value: string) =>
                    templates?.find((tmpl) => tmpl.id === value)?.name ??
                    t('exportDialog.selectTemplate')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(templates ?? []).map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTemplate && (
              <p className="text-xs text-muted-foreground">
                {isLineGrain
                  ? t('exportDialog.lineGrainHint')
                  : t('exportDialog.billingDocumentGrainHint')}
              </p>
            )}
          </div>
        )}

        {createExport.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
            <p className="text-xs text-destructive" role="alert">
              {createExport.error.message}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeExportDialog}>
            {tc('cancel')}
          </Button>
          <Button
            type="button"
            disabled={!templateId || createExport.isPending}
            onClick={handleGenerate}
          >
            {createExport.isPending ? tc('generating') : t('exportDialog.generateCsv')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
