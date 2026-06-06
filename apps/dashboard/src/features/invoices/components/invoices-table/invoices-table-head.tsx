import { flexRender } from '@tanstack/react-table'
import { useInvoicesContext } from '../../context/invoices.context'

export function InvoicesTableHead() {
  const { table: { instance } } = useInvoicesContext()
  return (
    <thead className="bg-muted/40">
      {instance.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
