import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"

// Stories follow the upstream shadcn/ui (base-nova) Table examples:
// https://ui.shadcn.com/docs/components/base/table
const meta = {
  title: "Components/Table",
  component: Table,
  subcomponents: {
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  },
  parameters: {
    docs: {
      description: { component: "A responsive table component." },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const invoices = [
  ["INV001", "Paid", "$250.00", "Credit Card"],
  ["INV002", "Pending", "$150.00", "PayPal"],
  ["INV003", "Unpaid", "$350.00", "Bank Transfer"],
  ["INV004", "Paid", "$450.00", "Credit Card"],
  ["INV005", "Paid", "$550.00", "PayPal"],
  ["INV006", "Pending", "$200.00", "Bank Transfer"],
  ["INV007", "Unpaid", "$300.00", "Credit Card"],
]

function InvoiceTable({ rows }: { rows: number }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, rows).map(([invoice, status, amount, method]) => (
          <TableRow key={invoice}>
            <TableCell className="font-medium">{invoice}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{method}</TableCell>
            <TableCell className="text-right">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: () => <InvoiceTable rows={invoices.length} />,
}

// --- Compositions ---------------------------------------------------------

export const Footer: Story = {
  render: () => <InvoiceTable rows={3} />,
}

export const Actions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["Wireless Mouse", "$29.99"],
          ["Mechanical Keyboard", "$129.99"],
          ["USB-C Hub", "$49.99"],
        ].map(([product, price]) => (
          <TableRow key={product}>
            <TableCell className="font-medium">{product}</TableCell>
            <TableCell>{price}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="size-8" />
                  }
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
