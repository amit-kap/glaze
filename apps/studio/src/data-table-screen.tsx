import { DownloadIcon, SearchXIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumnDef,
} from "@amit-kap/glaze/components/data-table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"

import { invoices, type Invoice } from "./dashboard-data"

const priorityVariant = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "secondary",
} as const

const statusVariant = {
  Paid: "low",
  Pending: "medium",
  Overdue: "destructive",
  Draft: "secondary",
} as const

const money = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

const columns: DataTableColumnDef<Invoice>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <span className="flex items-center gap-2 font-medium">
        <Avatar size="sm">
          <AvatarFallback className="text-micro">
            {row.original.initials}
          </AvatarFallback>
        </Avatar>
        {row.original.customer}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice ID" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge variant={priorityVariant[row.original.priority]}>
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount"
        className="justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-end font-medium tabular-nums">
        {money(row.original.amount)}
      </div>
    ),
  },
]

/** The invoice list as a full-height data table, built from Glaze's DataTable. */
export function DataTableScreen() {
  return (
    <div className="h-full bg-background p-4">
      <DataTable
        columns={columns}
        data={invoices}
        getRowId={(invoice) => invoice.id}
        filterColumn="customer"
        filterPlaceholder="Search customers..."
        enableRowSelection
        enableColumnVisibility
        pageSize={10}
        // The table fills the screen: the bordered body takes the space the
        // toolbar and pagination leave, and scrolls if the rows outgrow it.
        className="h-full min-h-0 [&_[data-slot=data-table-container]]:min-h-0 [&_[data-slot=data-table-container]]:flex-1 [&_[data-slot=data-table-container]]:overflow-auto"
        toolbar={
          <Button variant="outline" size="sm">
            <DownloadIcon />
            Export
          </Button>
        }
        emptyState={
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchXIcon />
              </EmptyMedia>
              <EmptyTitle>No invoices found</EmptyTitle>
              <EmptyDescription>
                Try a different customer name.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        }
      />
    </div>
  )
}
