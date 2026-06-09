import { useState } from 'react'
import { RiAddLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useDeleteTemplate,
  useExportTemplates,
  type ExportTemplate,
} from '../../api/workbench.api'
import { TemplateBuilderDialog } from './template-builder-dialog'
import { PeriodsSection } from '../periods/periods-section'

interface TemplatesTabProps {
  workspaceId: string
}

export function TemplatesTab({ workspaceId }: TemplatesTabProps) {
  const { data: templates, isLoading } = useExportTemplates(workspaceId)
  const deleteTemplate = useDeleteTemplate(workspaceId)

  const [builderOpen, setBuilderOpen] = useState(false)
  const [editing, setEditing] = useState<ExportTemplate | undefined>()

  function openNew() {
    setEditing(undefined)
    setBuilderOpen(true)
  }

  function openEdit(template: ExportTemplate) {
    setEditing(template)
    setBuilderOpen(true)
  }

  function handleDelete(template: ExportTemplate) {
    if (window.confirm(`Delete template "${template.name}"?`)) {
      deleteTemplate.mutate(template.id)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Templates</h2>
            <p className="text-xs text-muted-foreground">
              Reusable column layouts for your exports.
            </p>
          </div>
          <Button size="sm" onClick={openNew}>
            <RiAddLine />
            New template
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        ) : !templates || templates.length === 0 ? (
          <p className="rounded-md border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            No templates yet. Create one to start exporting.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {templates.map((template) => (
              <li
                key={template.id}
                className="flex items-center justify-between rounded-md border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {template.columns.length} column
                    {template.columns.length === 1 ? '' : 's'} ·{' '}
                    {template.columns.map((c) => c.label).join(', ')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PeriodsSection workspaceId={workspaceId} />

      {builderOpen && (
        <TemplateBuilderDialog
          key={editing?.id ?? 'new'}
          open={builderOpen}
          onOpenChange={setBuilderOpen}
          workspaceId={workspaceId}
          template={editing}
        />
      )}
    </div>
  )
}
