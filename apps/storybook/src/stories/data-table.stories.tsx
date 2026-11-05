import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { InboxIcon } from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
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

type Payment = {
  id: string
  customer: string
  email: string
  status: "paid" | "pending" | "failed" | "refunded"
  amount: number
}

const payments: Payment[] = [
  {
    id: "p01",
    customer: "Ada Lovelace",
    email: "ada@analytical.io",
    status: "paid",
    amount: 420,
  },
  {
    id: "p02",
    customer: "Grace Hopper",
    email: "grace@cobol.dev",
    status: "pending",
    amount: 135.5,
  },
  {
    id: "p03",
    customer: "Alan Turing",
    email: "alan@bombe.uk",
    status: "paid",
    amount: 980,
  },
  {
    id: "p04",
    customer: "Katherine Johnson",
    email: "kj@nasa.gov",
    status: "failed",
    amount: 75,
  },
  {
    id: "p05",
    customer: "Margaret Hamilton",
    email: "margaret@apollo.org",
    status: "paid",
    amount: 1200,
  },
  {
    id: "p06",
    customer: "Linus Torvalds",
    email: "linus@kernel.org",
    status: "refunded",
    amount: 60,
  },
  {
    id: "p07",
    customer: "Barbara Liskov",
    email: "barbara@mit.edu",
    status: "paid",
    amount: 310.25,
  },
  {
    id: "p08",
    customer: "Dennis Ritchie",
    email: "dmr@bell-labs.com",
    status: "pending",
    amount: 88,
  },
  {
    id: "p09",
    customer: "Radia Perlman",
    email: "radia@stp.net",
    status: "paid",
    amount: 540,
  },
  {
    id: "p10",
    customer: "Ken Thompson",
    email: "ken@unix.org",
    status: "failed",
    amount: 22.9,
  },
  {
    id: "p11",
    customer: "Frances Allen",
    email: "frances@ibm.com",
    status: "paid",
    amount: 760,
  },
  {
    id: "p12",
    customer: "Donald Knuth",
    email: "don@tex.org",
    status: "pending",
    amount: 256,
  },
  {
    id: "p13",
    customer: "Hedy Lamarr",
    email: "hedy@spread.io",
    status: "paid",
    amount: 199,
  },
  {
    id: "p14",
    customer: "Tim Berners-Lee",
    email: "tim@w3.org",
    status: "refunded",
    amount: 45,
  },
]

const statusVariant = {
  paid: "default",
  pending: "secondary",
  failed: "destructive",
  refunded: "outline",
} as const

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

// Plain headers: no sorting.
const plainColumns: DataTableColumnDef<Payment>[] = [
  { accessorKey: "customer", header: "Customer", enableSorting: false },
  { accessorKey: "email", header: "Email", enableSorting: false },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-end">Amount</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-end">{money.format(row.original.amount)}</div>
    ),
  },
]

// Sortable headers: click to cycle ascending, descending, off.
const sortableColumns: DataTableColumnDef<Payment>[] = [
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
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
      <div className="text-end">{money.format(row.original.amount)}</div>
    ),
  },
]

const meta = {
  title: "TanStack Table/DataTable",
  component: DataTable,
  args: { columns: plainColumns, data: payments },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A data table built on [TanStack Table](https://tanstack.com/table/latest) and the Glaze Table primitives. Sorting, filtering, pagination, row selection and column visibility are on by default and can each be switched off by prop. Define columns with `DataTableColumnDef`, use `DataTableColumnHeader` for sortable headers, and pass `getRowId` when rows have a stable id so selection survives sorting and paging. Spacing follows the global density switch; `compact` tightens the rows further.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable<Payment, unknown>>

export default meta
type Story = StoryObj<typeof meta>

const base = {
  data: payments,
  getRowId: (row: Payment) => row.id,
}

// --- Basic ----------------------------------------------------------------

export const Basic: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={plainColumns}
      enableColumnVisibility={false}
      enablePagination={false}
      data={payments.slice(0, 5)}
    />
  ),
}

// --- Sorting --------------------------------------------------------------

export const Sorting: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={sortableColumns}
      initialSorting={[{ id: "amount", desc: true }]}
      pageSize={5}
      enableColumnVisibility={false}
    />
  ),
}

// --- Filtering ------------------------------------------------------------

export const Filtering: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={sortableColumns}
      filterColumn="customer"
      filterPlaceholder="Filter customers..."
      initialColumnFilters={[{ id: "customer", value: "a" }]}
      pageSize={5}
    />
  ),
}

// --- Pagination -----------------------------------------------------------

export const Pagination: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={plainColumns}
      pageSize={5}
      pageSizes={[5, 10]}
      enableColumnVisibility={false}
    />
  ),
}

// --- Row selection --------------------------------------------------------

export const RowSelection: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Payment[]>([])
    return (
      <div className="flex flex-col gap-3">
        <DataTable
          {...base}
          columns={sortableColumns}
          enableRowSelection
          pageSize={5}
          onSelectionChange={setSelected}
          enableColumnVisibility={false}
        />
        <p className="text-body text-muted-foreground tabular-nums">
          Selected total:{" "}
          {money.format(selected.reduce((sum, row) => sum + row.amount, 0))}
        </p>
      </div>
    )
  },
}

// --- Column visibility ----------------------------------------------------

export const ColumnVisibility: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={sortableColumns}
      initialColumnVisibility={{ email: false }}
      pageSize={5}
    />
  ),
}

// --- Empty state ----------------------------------------------------------

export const EmptyState: Story = {
  render: () => (
    <DataTable
      {...base}
      data={[]}
      columns={plainColumns}
      enableColumnVisibility={false}
      emptyState={
        <Empty className="border-0 py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No payments yet</EmptyTitle>
            <EmptyDescription>
              Payments appear here as soon as a customer checks out.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      }
    />
  ),
}

/** The default empty message also shows when a filter matches nothing. */
export const NoMatches: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={sortableColumns}
      filterColumn="customer"
      initialColumnFilters={[{ id: "customer", value: "zzz" }]}
      pageSize={5}
      enableColumnVisibility={false}
    />
  ),
}

// --- Compact / dark -------------------------------------------------------

/**
 * Everything on, with tight rows. Use the toolbar's Mode and Density switches
 * to check dark mode and compact density: the table only uses Glaze tokens, so
 * both follow without changes.
 */
export const Compact: Story = {
  render: () => (
    <DataTable
      {...base}
      columns={sortableColumns}
      compact
      enableRowSelection
      filterColumn="customer"
      filterPlaceholder="Filter customers..."
      initialSorting={[{ id: "customer", desc: false }]}
      pageSize={8}
    />
  ),
}
