import * as React from "react";
import { type CellData, type Column, type ColumnDef, type ColumnFiltersState, type ColumnVisibilityState, type RowData, type SortingState, type ReactTable } from "@tanstack/react-table";
declare const dataTableFeatures: {
    rowSortingFeature: import("@tanstack/table-core").TableFeature;
    sortedRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
    sortFns: {
        alphanumeric: import("@tanstack/table-core").CreatedSortFn<any, any>;
        text: import("@tanstack/table-core").CreatedSortFn<any, any>;
        basic: import("@tanstack/table-core").CreatedSortFn<any, any>;
        datetime: import("@tanstack/table-core").CreatedSortFn<any, any>;
    };
    columnFilteringFeature: import("@tanstack/table-core").TableFeature;
    filteredRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
    filterFns: {
        includesString: import("@tanstack/table-core").CreatedFilterFn<any, any>;
    };
    rowPaginationFeature: import("@tanstack/table-core").TableFeature;
    paginatedRowModel: (table: import("@tanstack/table-core").Table<any, any>) => () => import("@tanstack/table-core").RowModel<any, any>;
    rowSelectionFeature: import("@tanstack/table-core").TableFeature;
    columnVisibilityFeature: import("@tanstack/table-core").TableFeature;
};
type DataTableFeatures = typeof dataTableFeatures;
/** A column definition for `DataTable`. */
type DataTableColumnDef<TData extends RowData, TValue extends CellData = unknown> = ColumnDef<DataTableFeatures, TData, TValue>;
type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;
type DataTableColumnHeaderProps<TData extends RowData, TValue extends CellData> = Omit<React.ComponentProps<"div">, "title"> & {
    column: Column<DataTableFeatures, TData, TValue>;
    title: React.ReactNode;
};
/** A sortable column header: click to cycle ascending, descending, off. */
declare function DataTableColumnHeader<TData extends RowData, TValue extends CellData>({ column, title, className, ...props }: DataTableColumnHeaderProps<TData, TValue>): React.JSX.Element;
/** A leading checkbox column: select one row, or all rows on the page. */
declare function dataTableSelectColumn<TData extends RowData>(): DataTableColumnDef<TData>;
/** A menu of checkboxes that shows and hides columns. */
declare function DataTableViewOptions<TData extends RowData>({ table, className, }: {
    table: DataTableInstance<TData>;
    className?: string;
}): React.JSX.Element;
/** Rows-per-page, the page position and first/previous/next/last buttons. */
declare function DataTablePagination<TData extends RowData>({ table, pageSizes, className, }: {
    table: DataTableInstance<TData>;
    pageSizes?: number[];
    className?: string;
}): React.JSX.Element;
type DataTableProps<TData extends RowData, TValue extends CellData> = {
    columns: DataTableColumnDef<TData, TValue>[];
    data: TData[];
    /** Column id the search box filters. Omit for no search box. */
    filterColumn?: string;
    filterPlaceholder?: string;
    /** Prepend a checkbox column and track selected rows. */
    enableRowSelection?: boolean;
    /** Show the Columns menu. */
    enableColumnVisibility?: boolean;
    /** Show the pagination bar. Off shows every row. */
    enablePagination?: boolean;
    /** Rows per page. */
    pageSize?: number;
    pageSizes?: number[];
    /** Tighter rows and header, for dense lists. */
    compact?: boolean;
    /** Shown when there are no rows. */
    emptyState?: React.ReactNode;
    /** Extra controls placed at the end of the toolbar. */
    toolbar?: React.ReactNode;
    /** Called with the selected rows whenever the selection changes. */
    onSelectionChange?: (rows: TData[]) => void;
    /** Stable row id. Defaults to the row index. */
    getRowId?: (row: TData, index: number) => string;
    initialSorting?: SortingState;
    initialColumnFilters?: ColumnFiltersState;
    initialColumnVisibility?: ColumnVisibilityState;
    className?: string;
};
declare function DataTable<TData extends RowData, TValue extends CellData>({ columns, data, filterColumn, filterPlaceholder, enableRowSelection, enableColumnVisibility, enablePagination, pageSize, pageSizes, compact, emptyState, toolbar, onSelectionChange, getRowId, initialSorting, initialColumnFilters, initialColumnVisibility, className, }: DataTableProps<TData, TValue>): React.JSX.Element;
export { DataTable, DataTableColumnHeader, DataTablePagination, DataTableViewOptions, dataTableSelectColumn, };
export type { DataTableColumnDef, DataTableProps };
