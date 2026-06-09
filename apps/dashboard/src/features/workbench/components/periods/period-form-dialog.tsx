import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { useCreatePeriod } from '../../api/workbench.api'
import { periodFormSchema } from '../../api/workbench.schema'

interface PeriodFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

export function PeriodFormDialog({
  open,
  onOpenChange,
  workspaceId,
}: PeriodFormDialogProps) {
  const { t } = useTranslation('common')
  const createPeriod = useCreatePeriod(workspaceId)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setError(null)
    const parsed = periodFormSchema.safeParse({
      name,
      start_date: startDate,
      end_date: endDate,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid period')
      return
    }
    try {
      await createPeriod.mutateAsync(parsed.data)
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create period')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New period</DialogTitle>
          <DialogDescription>
            A named date range you can reuse as a quick filter preset.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="period-name">{t('name')}</FieldLabel>
            <Input
              id="period-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. June 2026"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="period-start">Start date</FieldLabel>
              <Input
                id="period-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="period-end">End date</FieldLabel>
              <Input
                id="period-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button type="button" disabled={createPeriod.isPending} onClick={handleSubmit}>
            {createPeriod.isPending ? t('creating') : 'Create period'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
