import * as React from "react"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  BellIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  CreditCardIcon,
  DownloadIcon,
  FilterIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  RotateCcwIcon,
  SearchIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  BarChart3Icon,
  type LucideIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@amit-kap/glaze/components/chart"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@amit-kap/glaze/components/pagination"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@amit-kap/glaze/components/sidebar"
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

import {
  categories,
  invoices,
  orderStatus,
  pipeline,
  stats,
  traffic,
  week,
  type Invoice,
} from "./dashboard-data"

type NavItem = {
  label: string
  icon: LucideIcon
  active?: boolean
  children?: string[]
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboardIcon, active: true },
      { label: "Orders", icon: ShoppingCartIcon },
      { label: "Returns", icon: RotateCcwIcon },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        label: "Products",
        icon: PackageIcon,
        children: ["All Products", "Categories", "Inventory"],
      },
      { label: "Shipping", icon: TruckIcon },
    ],
  },
  {
    label: "Customers",
    items: [
      { label: "All Customers", icon: UsersIcon },
      { label: "Messages", icon: MessageSquareIcon },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Overview", icon: GlobeIcon },
      { label: "Reports", icon: BarChart3Icon },
      { label: "Finances", icon: CreditCardIcon },
    ],
  },
]

/** A miniature sales product, built from Glaze components, so the theme shows through. */
export function Dashboard() {
  return (
    <SidebarProvider
      contained
      style={{ "--sidebar-width": "13.5rem" } as React.CSSProperties}
      className="bg-background text-foreground"
    >
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto bg-muted/40 p-4">
          <div className="grid grid-cols-2 gap-3 @min-[900px]:grid-cols-4">
            {stats.map((stat) => (
              <Stat key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 @min-[900px]:grid-cols-[3fr_2fr]">
            <RevenueChart />
            <PipelineChart />
          </div>

          <div className="grid grid-cols-1 gap-3 @min-[900px]:grid-cols-3">
            <CategoryRadar />
            <TrafficHeatmap />
            <OrderStatus />
          </div>

          <RecentInvoices />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-control bg-brand text-caption font-medium text-brand-ink">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-caption leading-tight font-medium">
              Acme Store
            </p>
            <p className="truncate text-micro text-muted-foreground">
              Ecommerce
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavItemRow key={item.label} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2.5 p-1">
          <Avatar size="sm">
            <AvatarFallback className="text-micro">JW</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-caption leading-tight">Jack Walsh</p>
            <p className="truncate text-micro text-muted-foreground">
              jack@acme.co
            </p>
          </div>
          <ChevronDownIcon className="ms-auto size-4 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function NavItemRow({ item }: { item: NavItem }) {
  const { label, icon: Icon, active, children } = item

  if (!children)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={active}>
          <Icon />
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )

  return (
    <Collapsible defaultOpen render={<SidebarMenuItem />}>
      <CollapsibleTrigger render={<SidebarMenuButton />}>
        <Icon />
        <span>{label}</span>
        <ChevronDownIcon className="ms-auto" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {children.map((child) => (
            <SidebarMenuSubItem key={child}>
              <SidebarMenuSubButton render={<button type="button" />}>
                <span>{child}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function Header() {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-4 py-3">
      <SidebarTrigger aria-label="Toggle sidebar" />
      <div className="min-w-0">
        <h2 className="text-body leading-tight font-medium">
          Dashboard Overview
        </h2>
        <p className="text-micro text-muted-foreground">
          A summary for all the purchases, sales etc.
        </p>
      </div>
      <div className="ms-auto flex items-center gap-1.5">
        <span className="hidden text-micro text-muted-foreground @min-[1000px]:block">
          Jan 1 – 31, 2025
        </span>
        <Button variant="outline" size="sm">
          <GlobeIcon />
          All Platforms
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hidden @min-[1000px]:inline-flex"
        >
          All Products
        </Button>
        <Button size="sm">
          <DownloadIcon />
          Export
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Notifications">
          <BellIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Help">
          <CircleHelpIcon />
        </Button>
      </div>
    </header>
  )
}

function Stat({
  label,
  value,
  delta,
  tone,
  base,
}: {
  label: string
  value: string
  delta: string
  tone: "up" | "down"
  base: string
}) {
  return (
    <Card size="sm" className="gap-0 py-3">
      <CardContent>
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-heading leading-none font-medium tabular-nums">
          {value}
        </p>
        <p
          className="mt-3 flex items-center gap-1 text-micro"
          style={{
            color: tone === "up" ? "var(--severity-low)" : "var(--destructive)",
          }}
        >
          {delta} vs last month
          {tone === "up" ? (
            <ArrowUpRightIcon className="size-3" />
          ) : (
            <ArrowDownIcon className="size-3" />
          )}
        </p>
        <p className="mt-0.5 truncate text-micro text-muted-foreground">
          {base}
        </p>
      </CardContent>
    </Card>
  )
}

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig

function RevenueChart() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-caption">Revenue</CardTitle>
        <CardDescription className="text-micro">
          This week vs last week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-heading leading-none font-medium tabular-nums">
          $8,900.00
        </p>
        <ChartContainer
          config={revenueConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={week}
            margin={{ top: 8, right: 4 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width={36}
              domain={[0, 4000]}
              ticks={[0, 1000, 2000, 3000]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                value === 0 ? "0" : `$${value / 1000}k`
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="expenses"
              stackId="week"
              fill="var(--color-expenses)"
              maxBarSize={32}
              isAnimationActive={false}
            />
            <Bar
              dataKey="revenue"
              stackId="week"
              fill="var(--color-revenue)"
              radius={[2, 2, 0, 0]}
              maxBarSize={32}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const quarters = [
  { value: "q3", label: "Quarter 3" },
  { value: "q2", label: "Quarter 2" },
  { value: "q1", label: "Quarter 1" },
]

const pipelineConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
  sales: { label: "Sales", color: "var(--chart-2)" },
} satisfies ChartConfig

function PipelineChart() {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-caption">Sales pipeline</CardTitle>
        <Select items={quarters} defaultValue="q3">
          <SelectTrigger size="sm" aria-label="Quarter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end">
            {quarters.map((quarter) => (
              <SelectItem key={quarter.value} value={quarter.value}>
                {quarter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {(["orders", "sales"] as const).map((key) => (
          <div key={key} className="min-w-0">
            <p className="text-heading leading-none font-medium tabular-nums">
              {key === "orders" ? "3,980" : "$94.7K"}
            </p>
            <p className="mt-1 text-micro text-muted-foreground uppercase">
              Total {key}
            </p>
            <ChartContainer
              config={pipelineConfig}
              className="mt-3 aspect-auto h-[140px] w-full"
            >
              <AreaChart accessibilityLayer data={pipeline}>
                <XAxis
                  dataKey="month"
                  padding={{ left: 12, right: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  fill={`var(--color-${key})`}
                  fillOpacity={0.15}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const categoryConfig = {
  sales: { label: "Sales", color: "var(--chart-1)" },
} satisfies ChartConfig

function CategoryRadar() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-caption">Sales by category</CardTitle>
        <CardDescription className="text-micro">
          Income by product group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={categoryConfig}
          className="mx-auto aspect-square h-[200px]"
        >
          <RadarChart data={categories} outerRadius="62%">
            <ChartTooltip content={<ChartTooltipContent />} />
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <Radar
              dataKey="sales"
              stroke="var(--color-sales)"
              fill="var(--color-sales)"
              fillOpacity={0.3}
              isAnimationActive={false}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function TrafficHeatmap() {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <CardTitle className="text-caption">Traffic sources</CardTitle>
        <Badge variant="low">+30%</Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-3 text-micro text-muted-foreground">
          {[
            ["High", 1],
            ["Medium", 0.55],
            ["Low", 0.2],
          ].map(([name, level]) => (
            <span key={name} className="flex items-center gap-1">
              <span
                className="size-2 rounded-pill bg-foreground"
                style={{ opacity: Number(level) }}
              />
              {name}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-[auto_repeat(4,1fr)] items-center gap-1">
          {traffic.map((row) => (
            <React.Fragment key={row.level}>
              <span className="pe-1 text-micro text-muted-foreground tabular-nums">
                {row.level}
              </span>
              {row.weeks.map((value, week) => (
                <span
                  key={week}
                  className="h-5 rounded-item bg-foreground"
                  style={{ opacity: 0.12 + value * 0.88 }}
                />
              ))}
            </React.Fragment>
          ))}
          <span />
          {[1, 2, 3, 4].map((week) => (
            <span
              key={week}
              className="pt-1 text-center text-micro text-muted-foreground"
            >
              Week {week}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const statusConfig = {
  online: { label: "Online", color: "var(--chart-1)" },
  retail: { label: "Retail", color: "var(--chart-2)" },
  wholesale: { label: "Wholesale", color: "var(--chart-3)" },
  marketplace: { label: "Marketplace", color: "var(--chart-4)" },
  social: { label: "Social", color: "var(--chart-5)" },
} satisfies ChartConfig

function OrderStatus() {
  const total = orderStatus.reduce((sum, item) => sum + item.orders, 0)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-caption">Orders by channel</CardTitle>
        <CardDescription className="text-micro">
          Orders by channel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={statusConfig}
          className="mx-auto aspect-auto h-[240px] w-full"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={orderStatus.map((item) => ({
                ...item,
                fill: `var(--color-${item.status})`,
              }))}
              dataKey="orders"
              nameKey="status"
              innerRadius="62%"
              strokeWidth={2}
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        dy="-0.6em"
                        className="fill-muted-foreground text-micro"
                      >
                        ORDERS
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        dy="1.5em"
                        className="fill-foreground text-heading font-medium"
                      >
                        {total.toLocaleString()}
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
            <ChartLegend
              content={
                <ChartLegendContent nameKey="status" className="flex-wrap" />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

type SortKey = "customer" | "id" | "date" | "amount"

const priorityVariant = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "secondary",
} as const

const invoiceVariant = {
  Paid: "low",
  Pending: "medium",
  Overdue: "destructive",
  Draft: "secondary",
} as const

const money = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

const sizes = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
]

function RecentInvoices() {
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 } | null>(
    null
  )
  const [page, setPage] = React.useState(1)
  const [size, setSize] = React.useState("5")

  const rows = invoices
    .filter((invoice) =>
      `${invoice.customer} ${invoice.id}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (!sort) return 0
      const x = a[sort.key]
      const y = b[sort.key]
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir
    })

  const pageSize = Number(size)
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pages)
  const visible = rows.slice((current - 1) * pageSize, current * pageSize)

  const toggle = (key: SortKey) => {
    setSort((now) =>
      now?.key === key ? { key, dir: now.dir === 1 ? -1 : 1 } : { key, dir: 1 }
    )
  }

  return (
    <Card size="sm">
      <CardHeader className="flex flex-row flex-wrap items-center gap-2">
        <div className="me-auto min-w-0">
          <CardTitle className="flex items-center gap-2 text-caption">
            Recent invoices <Badge variant="secondary">{invoices.length}</Badge>
          </CardTitle>
          <CardDescription className="text-micro">
            The latest invoices across every platform.
          </CardDescription>
        </div>
        <InputGroup className="w-48">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search invoices"
            placeholder="Search invoices..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </InputGroup>
        <Button variant="outline" size="sm">
          <FilterIcon />
          Filter
        </Button>
        <Button variant="link" size="sm">
          See All
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead sort={sort} name="customer" onSort={toggle}>
                Customer
              </SortHead>
              <SortHead sort={sort} name="id" onSort={toggle}>
                Invoice ID
              </SortHead>
              <SortHead sort={sort} name="date" onSort={toggle}>
                Date
              </SortHead>
              <SortHead sort={sort} name="amount" onSort={toggle}>
                Amount
              </SortHead>
              <TableHead className="text-micro font-normal">Priority</TableHead>
              <TableHead className="text-micro font-normal">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-caption text-muted-foreground"
                >
                  No invoices match &ldquo;{query}&rdquo;.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-micro text-muted-foreground">
          <div className="flex items-center gap-2">
            Rows per page
            <Select
              items={sizes}
              value={size}
              onValueChange={(next) => {
                if (next) {
                  setSize(next)
                  setPage(1)
                }
              }}
            >
              <SelectTrigger size="sm" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {sizes.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rows.length === 0
              ? "0 of 0"
              : `${(current - 1) * pageSize + 1}-${Math.min(
                  current * pageSize,
                  rows.length
                )} of ${rows.length}`}
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              {Array.from({ length: pages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={current === index + 1}
                    onClick={(event) => {
                      event.preventDefault()
                      setPage(index + 1)
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}

function SortHead({
  sort,
  name,
  onSort,
  children,
}: {
  sort: { key: SortKey; dir: 1 | -1 } | null
  name: SortKey
  onSort: (key: SortKey) => void
  children: React.ReactNode
}) {
  const active = sort?.key === name
  const Icon = !active
    ? ArrowUpDownIcon
    : sort.dir === 1
      ? ArrowUpIcon
      : ArrowDownIcon

  return (
    <TableHead
      aria-sort={
        active ? (sort.dir === 1 ? "ascending" : "descending") : "none"
      }
      className="text-micro font-normal"
    >
      <Button
        variant="ghost"
        size="xs"
        className="-ms-2 text-micro font-normal"
        onClick={() => onSort(name)}
      >
        {children}
        <Icon />
      </Button>
    </TableHead>
  )
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <TableRow>
      <TableCell>
        <span className="flex items-center gap-2 text-caption font-medium">
          <Avatar size="sm">
            <AvatarFallback className="text-micro">
              {invoice.initials}
            </AvatarFallback>
          </Avatar>
          {invoice.customer}
        </span>
      </TableCell>
      <TableCell className="text-caption text-muted-foreground">
        {invoice.id}
      </TableCell>
      <TableCell className="text-caption text-muted-foreground">
        {new Date(invoice.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })}
      </TableCell>
      <TableCell className="text-caption font-medium tabular-nums">
        {money(invoice.amount)}
      </TableCell>
      <TableCell>
        <Badge variant={priorityVariant[invoice.priority]}>
          {invoice.priority}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={invoiceVariant[invoice.status]}>{invoice.status}</Badge>
      </TableCell>
    </TableRow>
  )
}
