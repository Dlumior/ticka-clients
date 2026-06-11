import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useWorkbenchContext } from '../../../context/workbench.context'

export function WorkbenchTablePagination() {
  const { t } = useTranslation('workbench')
  const {
    table: { instance, totalCount },
  } = useWorkbenchContext()
  const { pageIndex, pageSize } = instance.getState().pagination
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {totalCount > 0 ? t('pagination.total', { count: totalCount }) : ''}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {t('pagination.page', { current: pageIndex + 1, pageCount })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => instance.previousPage()}
          disabled={!instance.getCanPreviousPage()}
        >
          {t('pagination.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => instance.nextPage()}
          disabled={!instance.getCanNextPage()}
        >
          {t('pagination.next')}
        </Button>
      </div>
    </div>
  )
}
