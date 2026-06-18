import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useWorkbenchContext } from '../../context/workbench.context'

export function SelectionBar() {
  const { t } = useTranslation('workbench')
  const { selection, table, openExportDialog } = useWorkbenchContext()

  if (!selection.hasSelection) return null

  const summary = selection.selectAllMatching
    ? t('selection.allMatchingSelected', { count: table.totalCount })
    : [
        selection.billingDocumentIds.size > 0 &&
          t('selection.billingDocumentCount', { count: selection.billingDocumentIds.size }),
        selection.lineItemIds.size > 0 &&
          t('selection.lineItemCount', { count: selection.lineItemIds.size }),
      ]
        .filter(Boolean)
        .join(' · ')

  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-lg border bg-popover px-4 py-3 shadow-lg ring-1 ring-foreground/10">
      <span className="text-sm font-medium">
        {t('selection.selected', { summary })}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={selection.clear}>
          {t('selection.clear')}
        </Button>
        <Button size="sm" onClick={openExportDialog}>
          {t('selection.export')}
        </Button>
      </div>
    </div>
  )
}
