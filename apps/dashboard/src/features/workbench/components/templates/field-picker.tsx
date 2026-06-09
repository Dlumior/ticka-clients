import { useMemo } from 'react'
import type { ExportField } from '../../api/workbench.api'

interface FieldPickerProps {
  fields: ExportField[]
  selectedKeys: Set<string>
  onToggle: (field: ExportField) => void
}

// Groups the registry by `group` and renders a checkbox per field. Selecting a
// field adds it as a column in the builder.
export function FieldPicker({ fields, selectedKeys, onToggle }: FieldPickerProps) {
  const groups = useMemo(() => {
    const map = new Map<string, ExportField[]>()
    for (const field of fields) {
      const list = map.get(field.group) ?? []
      list.push(field)
      map.set(field.group, list)
    }
    return [...map.entries()]
  }, [fields])

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([group, groupFields]) => (
        <div key={group} className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group}
          </p>
          <div className="grid grid-cols-2 gap-1">
            {groupFields.map((field) => (
              <label
                key={field.key}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  className="size-4 cursor-pointer accent-primary"
                  checked={selectedKeys.has(field.key)}
                  onChange={() => onToggle(field)}
                />
                <span className="truncate">{field.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
