"use client"

import * as React from "react"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type CellData,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
  type ReactTable,
} from "@tanstack/react-table"
import { cn } from "@amit-kap/glaze/lib/utils"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  Columns3Icon,
} from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"
import { Input } from "@amit-kap/glaze/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"

// A data table: TanStack Table (headless state) rendered with the Glaze Table
// primitives. Sorting, filtering, pagination, row selection and column
// visibility are all on by default and can be switched off by prop. The parts
// (header, toolbar, view options, pagination) are exported so a table can be
// composed by hand around `useReactTable` when the all-in-one does not fit.

// Registered once at module scope: TanStack Table v9 only bundles the
// features a table asks for, and needs a stable `features` object.
const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnVisibilityFeature,
})

type DataTableFeatures = typeof dataTableFeatures

/** A column definition for `DataTable`. */
type DataTableColumnDef<
  TData extends RowData,
  TValue extends CellData = unknown,
> = ColumnDef<DataTableFeatures, TData, TValue>

type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>

type DataTableColumnHeaderProps<
  TData extends RowData,
  TValue extends CellData,
> = Omit<React.ComponentProps<"div">, "title"> & {
  column: Column<DataTableFeatures, TData, TValue>
  title: React.ReactNode
}

/** A sortable column header: click to cycle ascending, descending, off. */
function DataTableColumnHeader<TData extends RowData, TValue extends CellData>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        data-slot="data-table-column-header"
        className={cn(className)}
        {...props}
      >
        {title}
      </div>
    )
  }

  const sorted = column.getIsSorted()
  const Icon =
    sorted === "asc"
      ? ArrowUpIcon
      : sorted === "desc"
        ? ArrowDownIcon
        : ChevronsUpDownIcon

  return (
    <div
      data-slot="data-table-column-header"
      className={cn("flex items-center", className)}
      {...props}
    >
      <Button
        variant="ghost"
        size="sm"
        className="-ms-2 data-[sorted=true]:text-foreground"
        data-sorted={sorted !== false}
        onClick={column.getToggleSortingHandler()}
        aria-label={
          sorted === "asc"
            ? "Sorted ascending, click to sort descending"
            : sorted === "desc"
              ? "Sorted descending, click to clear sorting"
              : "Not sorted, click to sort ascending"
        }
      >
        {title}
        <Icon
          data-icon="inline-end"
          className={cn(!sorted && "text-muted-foreground")}
        />
      </Button>
    </div>
  )
}

/** A leading checkbox column: select one row, or all rows on the page. */
function dataTableSelectColumn<
  TData extends RowData,
>(): DataTableColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  }
}

/** A menu of checkboxes that shows and hides columns. */
function DataTableViewOptions<TData extends RowData>({
  table,
  className,
}: {
  table: DataTableInstance<TData>
  className?: string
}) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide())

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={className}
            data-slot="data-table-view-options"
          />
        }
      >
        <Columns3Icon data-icon="inline-start" />
        Columns
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              className="capitalize"
            >
              {typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Rows-per-page, the page position and first/previous/next/last buttons. */
function DataTablePagination<TData extends RowData>({
  table,
  pageSizes = [5, 10, 20, 50],
  className,
}: {
  table: DataTableInstance<TData>
  pageSizes?: number[]
  className?: string
}) {
  const { pageIndex, pageSize } = table.state.pagination
  const selectable = table.options.enableRowSelection !== false
  const items = pageSizes.map((size) => ({
    label: String(size),
    value: String(size),
  }))

  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-body",
        className
      )}
    >
      <div className="text-muted-foreground tabular-nums">
        {selectable
          ? `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
          : `${table.getFilteredRowModel().rows.length} row(s).`}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select
            items={items}
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-24 text-center tabular-nums">
          Page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="First page"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Last page"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

type DataTableProps<TData extends RowData, TValue extends CellData> = {
  columns: DataTableColumnDef<TData, TValue>[]
  data: TData[]
  /** Column id the search box filters. Omit for no search box. */
  filterColumn?: string
  filterPlaceholder?: string
  /** Prepend a checkbox column and track selected rows. */
  enableRowSelection?: boolean
  /** Show the Columns menu. */
  enableColumnVisibility?: boolean
  /** Show the pagination bar. Off shows every row. */
  enablePagination?: boolean
  /** Rows per page. */
  pageSize?: number
  pageSizes?: number[]
  /** Tighter rows and header, for dense lists. */
  compact?: boolean
  /** Shown when there are no rows. */
  emptyState?: React.ReactNode
  /** Extra controls placed at the end of the toolbar. */
  toolbar?: React.ReactNode
  /** Called with the selected rows whenever the selection changes. */
  onSelectionChange?: (rows: TData[]) => void
  /** Stable row id. Defaults to the row index. */
  getRowId?: (row: TData, index: number) => string
  initialSorting?: SortingState
  initialColumnFilters?: ColumnFiltersState
  initialColumnVisibility?: ColumnVisibilityState
  className?: string
}

function DataTable<TData extends RowData, TValue extends CellData>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
  enableRowSelection = false,
  enableColumnVisibility = true,
  enablePagination = true,
  pageSize = 10,
  pageSizes,
  compact = false,
  emptyState,
  toolbar,
  onSelectionChange,
  getRowId,
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
  className,
}: DataTableProps<TData, TValue>) {
  const allColumns = React.useMemo(
    () =>
      enableRowSelection
        ? ([dataTableSelectColumn<TData>(), ...columns] as DataTableColumnDef<
            TData,
            unknown
          >[])
        : (columns as DataTableColumnDef<TData, unknown>[]),
    [columns, enableRowSelection]
  )

  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    getRowId,
    enableRowSelection,
    defaultColumn: { filterFn: "includesString" },
    initialState: {
      sorting: initialSorting,
      columnFilters: initialColumnFilters,
      columnVisibility: initialColumnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize: enablePagination ? pageSize : data.length || 1,
      },
    },
  })

  const { rowSelection } = table.state
  React.useEffect(() => {
    onSelectionChange?.(
      table.getSelectedRowModel().rows.map((row) => row.original)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  const filterable = filterColumn ? table.getColumn(filterColumn) : undefined
  const showToolbar = filterable || enableColumnVisibility || toolbar
  const visibleColumns = table.getVisibleLeafColumns().length

  return (
    <div
      data-slot="data-table"
      data-compact={compact || undefined}
      className={cn("flex w-full flex-col gap-3", className)}
    >
      {showToolbar && (
        <div
          data-slot="data-table-toolbar"
          className="flex flex-wrap items-center gap-2"
        >
          {filterable && (
            <Input
              size="sm"
              type="search"
              aria-label={filterPlaceholder}
              placeholder={filterPlaceholder}
              value={(filterable.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                filterable.setFilterValue(event.target.value)
              }
              className="max-w-64"
            />
          )}
          <div className="ms-auto flex items-center gap-2">
            {toolbar}
            {enableColumnVisibility && <DataTableViewOptions table={table} />}
          </div>
        </div>
      )}
      <div
        data-slot="data-table-container"
        className="overflow-hidden rounded-container border"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                    className={cn(
                      "bg-muted/50 px-3",
                      compact && "h-control-sm"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn("px-3", compact && "py-1")}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={visibleColumns} className="p-0">
                  {emptyState ?? (
                    <Empty className="border-0 py-10">
                      <EmptyHeader>
                        <EmptyTitle>No results</EmptyTitle>
                        <EmptyDescription>
                          Nothing matches the current filters.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <DataTablePagination table={table} pageSizes={pageSizes} />
      )}
    </div>
  )
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableViewOptions,
  dataTableSelectColumn,
}
export type { DataTableColumnDef, DataTableProps }
