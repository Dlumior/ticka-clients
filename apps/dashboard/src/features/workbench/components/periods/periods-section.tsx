import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAddLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import {
  useDeletePeriod,
  useExportPeriods,
  type ExportPeriod,
} from '../../api/workbench.api'
import { PeriodFormDialog } from './period-form-dialog'

interface PeriodsSectionProps {
  workspaceId: string
}

export function PeriodsSection({ workspaceId }: PeriodsSectionProps) {
  const { t } = useTranslation('workbench')
  const { data: periods } = useExportPeriods(workspaceId)
  const deletePeriod = useDeletePeriod(workspaceId)
  const [formOpen, setFormOpen] = useState(false)

  function handleDelete(period: ExportPeriod) {
    if (window.confirm(t('periods.deleteConfirm', { name: period.name }))) {
      deletePeriod.mutate(period.id)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">{t('periods.title')}</h2>
          <p className="text-xs text-muted-foreground">
            {t('periods.subtitle')}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
          <RiAddLine />
          {t('periods.newPeriod')}
        </Button>
      </div>

      {!periods || periods.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {t('periods.noPeriods')}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {periods.map((period) => (
            <li
              key={period.id}
              className="flex items-center justify-between rounded-md border px-4 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{period.name}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {period.start_date} → {period.end_date}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(period)}
              >
                {t('periods.delete')}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <PeriodFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          workspaceId={workspaceId}
        />
      )}
    </div>
  )
}
