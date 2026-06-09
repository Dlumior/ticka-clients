import { useMemo, useState } from 'react'
import { RiArrowDownLine, RiArrowUpLine, RiCloseLine } from '@remixicon/react'
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
import {
  useCreateTemplate,
  useExportFields,
  useUpdateTemplate,
  type ExportColumn,
  type ExportField,
  type ExportTemplate,
} from '../../api/workbench.api'
import { templateFormSchema } from '../../api/workbench.schema'
import { FieldPicker } from './field-picker'

interface TemplateBuilderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  template?: ExportTemplate
}

export function TemplateBuilderDialog({
  open,
  onOpenChange,
  workspaceId,
  template,
}: TemplateBuilderDialogProps) {
  const { data: fields } = useExportFields(workspaceId)
  const createTemplate = useCreateTemplate(workspaceId)
  const updateTemplate = useUpdateTemplate(workspaceId, template?.id ?? '')

  const [name, setName] = useState(template?.name ?? '')
  const [columns, setColumns] = useState<ExportColumn[]>(
    template?.columns ?? [],
  )
  const [error, setError] = useState<string | null>(null)

  const selectedKeys = useMemo(
    () => new Set(columns.map((c) => c.field)),
    [columns],
  )

  function toggleField(field: ExportField) {
    setColumns((prev) =>
      prev.some((c) => c.field === field.key)
        ? prev.filter((c) => c.field !== field.key)
        : [...prev, { field: field.key, label: field.label }],
    )
  }

  function updateLabel(index: number, label: string) {
    setColumns((prev) =>
      prev.map((c, i) => (i === index ? { ...c, label } : c)),
    )
  }

  function move(index: number, direction: -1 | 1) {
    setColumns((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function removeColumn(index: number) {
    setColumns((prev) => prev.filter((_, i) => i !== index))
  }

  const isPending = createTemplate.isPending || updateTemplate.isPending

  async function handleSubmit() {
    setError(null)
    const parsed = templateFormSchema.safeParse({ name, columns })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid template')
      return
    }
    try {
      if (template) {
        await updateTemplate.mutateAsync(parsed.data)
      } else {
        await createTemplate.mutateAsync(parsed.data)
      }
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save template')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-4 overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit template' : 'New template'}</DialogTitle>
          <DialogDescription>
            Pick the fields to export and rename their column headers. Including
            any line-item field expands the export to one row per line item.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="template-name">Template name</FieldLabel>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monthly ERP feed"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Available fields</p>
            {fields ? (
              <FieldPicker
                fields={fields}
                selectedKeys={selectedKeys}
                onToggle={toggleField}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Loading fields…</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Columns ({columns.length})
            </p>
            {columns.length === 0 ? (
              <p className="rounded-md border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                Select fields on the left to build your columns.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {columns.map((column, index) => (
                  <li
                    key={column.field}
                    className="flex items-center gap-1.5 rounded-md border px-2 py-1.5"
                  >
                    <div className="flex flex-col">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        aria-label="Move up"
                      >
                        <RiArrowUpLine className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={index === columns.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label="Move down"
                      >
                        <RiArrowDownLine className="size-3.5" />
                      </button>
                    </div>
                    <Input
                      value={column.label}
                      onChange={(e) => updateLabel(index, e.target.value)}
                      className="h-8 flex-1"
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeColumn(index)}
                      aria-label="Remove column"
                    >
                      <RiCloseLine className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? 'Saving…' : template ? 'Save changes' : 'Create template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
