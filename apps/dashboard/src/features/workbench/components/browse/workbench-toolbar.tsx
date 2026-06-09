import { RiArrowDownSLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWorkbenchContext } from '../../context/workbench.context'

export function WorkbenchToolbar() {
  const { filters, selection, table } = useWorkbenchContext()

  const supplierLabel =
    filters.supplierIds.length > 0
      ? `Suppliers (${filters.supplierIds.length})`
      : 'All suppliers'

  function toggleSupplier(id: string) {
    const next = filters.supplierIds.includes(id)
      ? filters.supplierIds.filter((s) => s !== id)
      : [...filters.supplierIds, id]
    filters.onSupplierIdsChange(next)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="h-8">
              {supplierLabel}
              <RiArrowDownSLine />
            </Button>
          }
        />
        <DropdownMenuContent className="max-h-72 w-64">
          {filters.suppliers.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              No suppliers yet.
            </p>
          ) : (
            filters.suppliers.map((supplier) => (
              <DropdownMenuCheckboxItem
                key={supplier.id}
                checked={filters.supplierIds.includes(supplier.id)}
                onCheckedChange={() => toggleSupplier(supplier.id)}
                closeOnClick={false}
              >
                <span className="truncate">
                  {supplier.name || supplier.ruc}
                </span>
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        value={filters.periodId}
        onValueChange={(value) => {
          const period = filters.periods.find((p) => p.id === value)
          filters.onPeriodChange(
            value,
            period
              ? { start: period.start_date, end: period.end_date }
              : undefined,
          )
        }}
      >
        <SelectTrigger size="sm" className="w-44">
          <SelectValue placeholder="No period">
            {(value: string) =>
              filters.periods.find((p) => p.id === value)?.name ?? 'No period'
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">No period</SelectItem>
          {filters.periods.map((period) => (
            <SelectItem key={period.id} value={period.id}>
              {period.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          From
        </span>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => filters.onDateFromChange(e.target.value)}
          className="h-8 w-36"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          To
        </span>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => filters.onDateToChange(e.target.value)}
          className="h-8 w-36"
        />
      </div>

      <Select value={filters.status} onValueChange={filters.onStatusChange}>
        <SelectTrigger size="sm" className="w-36">
          <SelectValue placeholder="All eligible">
            {(value: string) =>
              value === 'approved'
                ? 'Approved'
                : value === 'exported'
                  ? 'Exported'
                  : 'All eligible'
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All eligible</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="exported">Exported</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto">
        {selection.selectAllMatching ? (
          <Button variant="outline" size="sm" onClick={selection.clear}>
            Clear selection
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={table.totalCount === 0}
            onClick={selection.enableSelectAllMatching}
          >
            Select all {table.totalCount} matching
          </Button>
        )}
      </div>
    </div>
  )
}
