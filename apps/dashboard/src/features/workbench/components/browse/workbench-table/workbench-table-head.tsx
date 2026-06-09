import { flexRender } from '@tanstack/react-table'
import { useWorkbenchContext } from '../../../context/workbench.context'

export function WorkbenchTableHead() {
  const {
    table: { instance },
  } = useWorkbenchContext()

  return (
    <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
      {instance.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} className="px-3 py-2 font-medium">
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
