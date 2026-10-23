import type { ReactNode } from "react"
import {
  ArrowUpRightIcon,
  InboxIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PackageIcon,
  PlusIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@amit-kap/glaze/components/chart"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"
import { cn } from "@amit-kap/glaze/lib/utils"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
  badge?: string
}

const nav: NavItem[] = [
  { label: "Overview", icon: LayoutDashboardIcon, active: true },
  { label: "Customers", icon: UsersIcon },
  { label: "Orders", icon: ShoppingCartIcon, badge: "12" },
  { label: "Products", icon: PackageIcon },
  { label: "Settings", icon: SettingsIcon },
]

const months = [
  { month: "Jan", online: 11200, retail: 7400 },
  { month: "Feb", online: 8800, retail: 10900 },
  { month: "Mar", online: 6200, retail: 9600 },
  { month: "Apr", online: 12300, retail: 7100 },
  { month: "May", online: 10400, retail: 11900 },
]

type Status = "Paid" | "Pending" | "Refunded"

const orders: { customer: string; status: Status; total: string }[] = [
  { customer: "Olivia Martin", status: "Paid", total: "$1,999" },
  { customer: "Jackson Lee", status: "Pending", total: "$39" },
  { customer: "Isabella Nguyen", status: "Paid", total: "$299" },
  { customer: "Sofia Davis", status: "Paid", total: "$39" },
  { customer: "William Kim", status: "Refunded", total: "$99" },
]

const statusVariant = {
  Paid: "low",
  Pending: "medium",
  Refunded: "secondary",
} as const

/** A miniature product, built from Glaze components, so the theme shows through. */
export function Dashboard() {
  return (
    <div className="flex h-full min-h-0 bg-background text-foreground">
      <aside className="hidden w-[216px] shrink-0 flex-col gap-4 border-r border-border bg-sidebar p-3.5 @min-[600px]:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-control bg-brand text-caption font-medium text-brand-ink">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-caption leading-tight font-medium">
              Acme Inc.
            </p>
            <p className="truncate text-micro text-muted-foreground">Pro plan</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button size="sm" className="h-8 flex-1 justify-start">
            <PlusIcon />
            Quick create
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Inbox">
            <InboxIcon />
          </Button>
        </div>

        <nav aria-label="Sections" className="flex flex-col gap-0.5">
          {nav.map(({ label, icon: Icon, active, badge }) => (
            <Button
              key={label}
              variant={active ? "secondary" : "ghost"}
              size="sm"
              aria-current={active ? "page" : undefined}
              className={cn(
                "w-full justify-start gap-2.5 px-2.5",
                !active && "text-muted-foreground",
              )}
            >
              <Icon />
              {label}
              {badge && <Badge className="ms-auto">{badge}</Badge>}
            </Button>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="text-micro">MC</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-caption leading-tight">Maya Chen</p>
            <p className="truncate text-micro text-muted-foreground">
              maya@acme.co
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border px-5">
          <MenuIcon className="size-4 text-muted-foreground" />
          <span className="text-caption font-medium">Dashboard</span>
          <span className="ms-auto flex items-center gap-1 text-micro text-muted-foreground">
            GitHub
            <ArrowUpRightIcon className="size-3" />
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-4">
          <div className="grid grid-cols-2 gap-3 @min-[720px]:grid-cols-4">
            <Stat label="Revenue" value="$48,210">
              <Delta tone="up">+12.4%</Delta>
              <span className="text-muted-foreground"> vs last period</span>
            </Stat>
            <Stat label="Orders" value="1,284">
              <Delta tone="up">+3.1%</Delta>
              <span className="text-muted-foreground"> vs last period</span>
            </Stat>
            <Stat label="Refunds" value="$1,090">
              <Delta tone="down">−0.8%</Delta>
              <span className="text-muted-foreground"> vs last period</span>
            </Stat>
            <Stat label="Active now" value="312">
              <span className="text-muted-foreground">
                18 joined in the last hour
              </span>
            </Stat>
          </div>

          <div className="grid grid-cols-1 gap-3 @min-[720px]:grid-cols-[minmax(0,1fr)_300px]">
            <RevenueChart />
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
}) {
  return (
    <Card size="sm" className="gap-0 py-3">
      <CardContent>
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-heading leading-none font-medium tabular-nums">
          {value}
        </p>
        <p className="mt-2.5 truncate text-micro">{children}</p>
      </CardContent>
    </Card>
  )
}

function Delta({ tone, children }: { tone: "up" | "down"; children: ReactNode }) {
  return (
    <span
      style={{
        color: tone === "up" ? "var(--severity-low)" : "var(--destructive)",
      }}
    >
      {children}
    </span>
  )
}

const chartConfig = {
  online: { label: "Online", color: "var(--chart-2)" },
  retail: { label: "Retail", color: "var(--chart-1)" },
} satisfies ChartConfig

function RevenueChart() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-caption">Revenue by month</CardTitle>
        <CardDescription className="text-micro">
          Gross, before refunds
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={months}
            barGap={4}
            margin={{ top: 8, right: 4 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width={40}
              domain={[0, 15000]}
              ticks={[0, 5000, 10000, 15000]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                value === 0 ? "0" : `$${value / 1000}k`
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="online"
              fill="var(--color-online)"
              radius={2}
              maxBarSize={26}
              isAnimationActive={false}
            />
            <Bar
              dataKey="retail"
              fill="var(--color-retail)"
              radius={2}
              maxBarSize={26}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="py-2.5 text-micro">
        Online up 18% since January
      </CardFooter>
    </Card>
  )
}

function RecentOrders() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-caption">Recent orders</CardTitle>
        <CardDescription className="text-micro">
          5 of 1,284 this period
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-8 px-0 text-micro font-normal">
                Customer
              </TableHead>
              <TableHead className="h-8 px-0 text-micro font-normal">
                Status
              </TableHead>
              <TableHead className="h-8 px-0 text-right text-micro font-normal">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.customer} className="border-border/70">
                <TableCell className="px-0 py-2 text-caption">
                  {order.customer}
                </TableCell>
                <TableCell className="px-0 py-2">
                  <Badge variant={statusVariant[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-0 py-2 text-right text-caption">
                  {order.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="mt-auto py-2">
        <Button variant="link" size="sm" className="px-0">
          View all orders
        </Button>
      </CardFooter>
    </Card>
  )
}
