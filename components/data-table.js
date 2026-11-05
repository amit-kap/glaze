"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { columnFilteringFeature, columnVisibilityFeature, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel, filterFn_includesString, flexRender, rowPaginationFeature, rowSelectionFeature, rowSortingFeature, sortFn_alphanumeric, sortFn_basic, sortFn_datetime, sortFn_text, tableFeatures, useTable, } from "@tanstack/react-table";
import { cn } from "../lib/utils.js";
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, ChevronsUpDownIcon, Columns3Icon, } from "lucide-react";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger, } from "./dropdown-menu.js";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle, } from "./empty.js";
import { Input } from "./input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./select.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./table.js";
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
});
/** A sortable column header: click to cycle ascending, descending, off. */
function DataTableColumnHeader({ column, title, className, ...props }) {
    if (!column.getCanSort()) {
        return (_jsx("div", { "data-slot": "data-table-column-header", className: cn(className), ...props, children: title }));
    }
    const sorted = column.getIsSorted();
    const Icon = sorted === "asc"
        ? ArrowUpIcon
        : sorted === "desc"
            ? ArrowDownIcon
            : ChevronsUpDownIcon;
    return (_jsx("div", { "data-slot": "data-table-column-header", className: cn("flex items-center", className), ...props, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "-ms-2 data-[sorted=true]:text-foreground", "data-sorted": sorted !== false, onClick: column.getToggleSortingHandler(), "aria-label": sorted === "asc"
                ? "Sorted ascending, click to sort descending"
                : sorted === "desc"
                    ? "Sorted descending, click to clear sorting"
                    : "Not sorted, click to sort ascending", children: [title, _jsx(Icon, { "data-icon": "inline-end", className: cn(!sorted && "text-muted-foreground") })] }) }));
}
/** A leading checkbox column: select one row, or all rows on the page. */
function dataTableSelectColumn() {
    return {
        id: "select",
        enableSorting: false,
        enableHiding: false,
        header: ({ table }) => (_jsx(Checkbox, { "aria-label": "Select all rows on this page", checked: table.getIsAllPageRowsSelected(), indeterminate: table.getIsSomePageRowsSelected(), onCheckedChange: (checked) => table.toggleAllPageRowsSelected(checked) })),
        cell: ({ row }) => (_jsx(Checkbox, { "aria-label": "Select row", checked: row.getIsSelected(), disabled: !row.getCanSelect(), onCheckedChange: (checked) => row.toggleSelected(checked) })),
    };
}
/** A menu of checkboxes that shows and hides columns. */
function DataTableViewOptions({ table, className, }) {
    const columns = table.getAllColumns().filter((column) => column.getCanHide());
    return (_jsxs(DropdownMenu, { children: [_jsxs(DropdownMenuTrigger, { render: _jsx(Button, { variant: "outline", size: "sm", className: className, "data-slot": "data-table-view-options" }), children: [_jsx(Columns3Icon, { "data-icon": "inline-start" }), "Columns"] }), _jsx(DropdownMenuContent, { align: "end", className: "w-44", children: _jsxs(DropdownMenuGroup, { children: [_jsx(DropdownMenuLabel, { children: "Toggle columns" }), columns.map((column) => (_jsx(DropdownMenuCheckboxItem, { checked: column.getIsVisible(), onCheckedChange: (value) => column.toggleVisibility(!!value), className: "capitalize", children: typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id }, column.id)))] }) })] }));
}
/** Rows-per-page, the page position and first/previous/next/last buttons. */
function DataTablePagination({ table, pageSizes = [5, 10, 20, 50], className, }) {
    const { pageIndex, pageSize } = table.state.pagination;
    const selectable = table.options.enableRowSelection !== false;
    const items = pageSizes.map((size) => ({
        label: String(size),
        value: String(size),
    }));
    return (_jsxs("div", { "data-slot": "data-table-pagination", className: cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-body", className), children: [_jsx("div", { className: "text-muted-foreground tabular-nums", children: selectable
                    ? `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
                    : `${table.getFilteredRowModel().rows.length} row(s).` }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-muted-foreground", children: "Rows per page" }), _jsxs(Select, { items: items, value: String(pageSize), onValueChange: (value) => table.setPageSize(Number(value)), children: [_jsx(SelectTrigger, { size: "sm", "aria-label": "Rows per page", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: items.map((item) => (_jsx(SelectItem, { value: item.value, children: item.label }, item.value))) })] })] }), _jsxs("div", { className: "min-w-24 text-center tabular-nums", children: ["Page ", pageIndex + 1, " of ", Math.max(table.getPageCount(), 1)] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "outline", size: "icon-sm", "aria-label": "First page", onClick: () => table.setPageIndex(0), disabled: !table.getCanPreviousPage(), children: _jsx(ChevronsLeftIcon, {}) }), _jsx(Button, { variant: "outline", size: "icon-sm", "aria-label": "Previous page", onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), children: _jsx(ChevronLeftIcon, {}) }), _jsx(Button, { variant: "outline", size: "icon-sm", "aria-label": "Next page", onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), children: _jsx(ChevronRightIcon, {}) }), _jsx(Button, { variant: "outline", size: "icon-sm", "aria-label": "Last page", onClick: () => table.setPageIndex(table.getPageCount() - 1), disabled: !table.getCanNextPage(), children: _jsx(ChevronsRightIcon, {}) })] })] })] }));
}
function DataTable({ columns, data, filterColumn, filterPlaceholder = "Filter...", enableRowSelection = false, enableColumnVisibility = true, enablePagination = true, pageSize = 10, pageSizes, compact = false, emptyState, toolbar, onSelectionChange, getRowId, initialSorting = [], initialColumnFilters = [], initialColumnVisibility = {}, className, }) {
    const allColumns = React.useMemo(() => enableRowSelection
        ? [dataTableSelectColumn(), ...columns]
        : columns, [columns, enableRowSelection]);
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
    });
    const { rowSelection } = table.state;
    React.useEffect(() => {
        onSelectionChange?.(table.getSelectedRowModel().rows.map((row) => row.original));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);
    const filterable = filterColumn ? table.getColumn(filterColumn) : undefined;
    const showToolbar = filterable || enableColumnVisibility || toolbar;
    const visibleColumns = table.getVisibleLeafColumns().length;
    return (_jsxs("div", { "data-slot": "data-table", "data-compact": compact || undefined, className: cn("flex w-full flex-col gap-3", className), children: [showToolbar && (_jsxs("div", { "data-slot": "data-table-toolbar", className: "flex flex-wrap items-center gap-2", children: [filterable && (_jsx(Input, { size: "sm", type: "search", "aria-label": filterPlaceholder, placeholder: filterPlaceholder, value: filterable.getFilterValue() ?? "", onChange: (event) => filterable.setFilterValue(event.target.value), className: "max-w-64" })), _jsxs("div", { className: "ms-auto flex items-center gap-2", children: [toolbar, enableColumnVisibility && _jsx(DataTableViewOptions, { table: table })] })] })), _jsx("div", { "data-slot": "data-table-container", className: "overflow-hidden rounded-container border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { className: "hover:bg-transparent", children: headerGroup.headers.map((header) => (_jsx(TableHead, { colSpan: header.colSpan, "aria-sort": header.column.getIsSorted() === "asc"
                                        ? "ascending"
                                        : header.column.getIsSorted() === "desc"
                                            ? "descending"
                                            : undefined, className: cn("bg-muted/50 px-3", compact && "h-control-sm"), children: header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), _jsx(TableBody, { children: table.getRowModel().rows.length ? (table.getRowModel().rows.map((row) => (_jsx(TableRow, { "data-state": row.getIsSelected() ? "selected" : undefined, children: row.getVisibleCells().map((cell) => (_jsx(TableCell, { className: cn("px-3", compact && "py-1"), children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(TableRow, { className: "hover:bg-transparent", children: _jsx(TableCell, { colSpan: visibleColumns, className: "p-0", children: emptyState ?? (_jsx(Empty, { className: "border-0 py-10", children: _jsxs(EmptyHeader, { children: [_jsx(EmptyTitle, { children: "No results" }), _jsx(EmptyDescription, { children: "Nothing matches the current filters." })] }) })) }) })) })] }) }), enablePagination && (_jsx(DataTablePagination, { table: table, pageSizes: pageSizes }))] }));
}
export { DataTable, DataTableColumnHeader, DataTablePagination, DataTableViewOptions, dataTableSelectColumn, };
