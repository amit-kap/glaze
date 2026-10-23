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
import { Button } from "@amit-kap/glaze/components/button"
import { cn } from "@amit-kap/glaze/lib/utils"

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
  { label: "Jan", online: 11200, retail: 7400 },
  { label: "Feb", online: 8800, retail: 10900 },
  { label: "Mar", online: 6200, retail: 9600 },
  { label: "Apr", online: 12300, retail: 7100 },
  { label: "May", online: 10400, retail: 11900 },
]

type Status = "Paid" | "Pending" | "Refunded"

const orders: { customer: string; status: Status; total: string }[] = [
  { customer: "Olivia Martin", status: "Paid", total: "$1,999" },
  { customer: "Jackson Lee", status: "Pending", total: "$39" },
  { customer: "Isabella Nguyen", status: "Paid", total: "$299" },
  { customer: "Sofia Davis", status: "Paid", total: "$39" },
  { customer: "William Kim", status: "Refunded", total: "$99" },
]

const statusColor: Record<Status, string> = {
  Paid: "var(--severity-low)",
  Pending: "var(--severity-medium)",
  Refunded: "var(--muted-foreground)",
}

/** A miniature product, built from Glaze tokens, so the theme shows through. */
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
            <div
              key={label}
              className={cn(
                "flex h-8 items-center gap-2.5 rounded-control px-2.5 text-caption",
                active ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
              {badge && (
                <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-pill bg-primary px-1 text-micro text-primary-foreground tabular-nums">
                  {badge}
                </span>
              )}
            </div>
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

          <div className="grid min-h-[280px] flex-1 grid-cols-1 gap-3 @min-[720px]:grid-cols-[minmax(0,1fr)_286px]">
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
    <div className="rounded-container border border-border bg-card p-3.5">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-heading leading-none font-medium tabular-nums">
        {value}
      </p>
      <p className="mt-2.5 truncate text-micro">{children}</p>
    </div>
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

const gridlines = ["$15k", "$10k", "$5k", "0"]
const chartMax = 15000

function RevenueChart() {
  return (
    <section className="flex min-h-0 flex-col rounded-container border border-border bg-card p-4">
      <h2 className="text-caption font-medium">Revenue by month</h2>
      <p className="mt-1 text-micro text-muted-foreground">
        Gross, before refunds
      </p>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex w-9 shrink-0 flex-col justify-between text-right text-micro text-muted-foreground tabular-nums">
            {gridlines.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            <div className="absolute inset-0 flex flex-col justify-between">
              {gridlines.map((label) => (
                <span key={label} className="border-t border-border" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-cols-5">
              {months.map((month) => (
                <div
                  key={month.label}
                  className="flex h-full items-end justify-center gap-1.5"
                >
                  <span
                    className="w-5 rounded-t-[2px] bg-chart-2"
                    style={{ height: `${(month.online / chartMax) * 100}%` }}
                    title={`Online · $${month.online.toLocaleString()}`}
                  />
                  <span
                    className="w-5 rounded-t-[2px] bg-chart-1"
                    style={{ height: `${(month.retail / chartMax) * 100}%` }}
                    title={`Retail · $${month.retail.toLocaleString()}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <span className="w-9 shrink-0" />
          <div className="grid flex-1 grid-cols-5 border-b border-border pb-2 text-center text-micro text-muted-foreground">
            {months.map((month) => (
              <span key={month.label}>{month.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-4 text-micro text-muted-foreground">
        <Legend className="bg-chart-2">Online</Legend>
        <Legend className="bg-chart-1">Retail</Legend>
      </div>

      <p className="mt-2.5 border-t border-border pt-2.5 text-micro">
        Online up 18% since January
      </p>
    </section>
  )
}

function Legend({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-[2px]", className)} />
      {children}
    </span>
  )
}

function RecentOrders() {
  return (
    <section className="flex min-h-0 flex-col rounded-container border border-border bg-card p-4">
      <h2 className="text-caption font-medium">Recent orders</h2>
      <p className="mt-1 text-micro text-muted-foreground">
        5 of 1,284 this period
      </p>

      <table className="mt-3 w-full text-caption">
        <thead>
          <tr className="border-b border-border text-left text-micro text-muted-foreground">
            <th className="pb-2 font-normal">Customer</th>
            <th className="pb-2 font-normal">Status</th>
            <th className="pb-2 text-right font-normal">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.customer} className="border-b border-border/70">
              <td className="py-2 pe-2">{order.customer}</td>
              <td className="py-2">
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-border px-1.5 py-0.5 text-micro">
                  <span
                    className="size-1.5 rounded-pill"
                    style={{ background: statusColor[order.status] }}
                  />
                  {order.status}
                </span>
              </td>
              <td className="py-2 text-right tabular-nums">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-auto border-t border-border pt-3 text-micro text-muted-foreground">
        View all orders
      </p>
    </section>
  )
}
