import * as React from "react"
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@amit-kap/glaze/components/accordion"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@amit-kap/glaze/components/avatar"
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import { Kbd, KbdGroup } from "@amit-kap/glaze/components/kbd"
import {
  NativeSelect,
  NativeSelectOption,
} from "@amit-kap/glaze/components/native-select"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import { Separator } from "@amit-kap/glaze/components/separator"
import { Switch } from "@amit-kap/glaze/components/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@amit-kap/glaze/components/table"
import { cn } from "@amit-kap/glaze/lib/utils"

// A marketing page for a made-up product, built so every theme value shows:
// brand and primary on the buttons, mark and closing band, chart colours in
// the product shot, surfaces and borders in the bands, and the type scale in
// every heading. Large type is derived from the display token (read raw, as
// the section sets it) rather than fixed, so a Studio type edit reaches it.

const display = "font-heading font-medium tracking-tight text-balance"
const h1 = cn(
  display,
  "text-[length:calc(var(--type-display)*1.4)] leading-[1.1] @min-[700px]:text-[length:calc(var(--type-display)*1.9)]"
)
const h2 = cn(
  display,
  "text-[length:calc(var(--type-display)*1.1)] leading-tight @min-[700px]:text-[length:calc(var(--type-display)*1.35)]"
)
const figure =
  "font-heading font-medium tabular-nums text-[length:calc(var(--type-display)*1.1)] leading-none"

const nav = ["Product", "Customers", "Pricing", "Docs"]
const logos = ["Northwind", "Lumen", "Foundry", "Parcel", "Meridian"]

const growth = [
  { month: "Jan", revenue: 18, orders: 12, refunds: 2 },
  { month: "Feb", revenue: 24, orders: 16, refunds: 3 },
  { month: "Mar", revenue: 22, orders: 19, refunds: 2 },
  { month: "Apr", revenue: 31, orders: 21, refunds: 4 },
  { month: "May", revenue: 29, orders: 26, refunds: 3 },
  { month: "Jun", revenue: 42, orders: 30, refunds: 3 },
]
const growthConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  orders: { label: "Orders", color: "var(--chart-2)" },
  refunds: { label: "Refunds", color: "var(--chart-3)" },
} satisfies ChartConfig

const sellers = [
  { name: "Earbuds", units: 82 },
  { name: "Watch", units: 64 },
  { name: "Shoes", units: 47 },
  { name: "Jacket", units: 38 },
  { name: "Case", units: 29 },
]
const sellersConfig = {
  units: { label: "Units", color: "var(--chart-2)" },
} satisfies ChartConfig

const movers = [
  { name: "Wireless Earbuds", delta: "+24%", up: true },
  { name: "Smart Watch", delta: "+11%", up: true },
  { name: "Winter Jacket", delta: "−8%", up: false },
]

const stats = [
  { value: "$2.1B", label: "Orders processed" },
  { value: "4.9/5", label: "Average rating" },
  { value: "38%", label: "Faster month-end close" },
  { value: "99.99%", label: "Uptime, last 12 months" },
]

const orders: { customer: string; total: string; status: string }[] = [
  { customer: "Olivia Martin", total: "$1,999", status: "Paid" },
  { customer: "Jackson Lee", total: "$39", status: "Pending" },
  { customer: "Sofia Davis", total: "$299", status: "Paid" },
]
const statusVariant = {
  Paid: "low",
  Pending: "medium",
  Refunded: "secondary",
} as const

const plans = [
  {
    name: "Starter",
    blurb: "For a shop that's just getting going.",
    price: { month: 0, year: 0 },
    features: ["Up to 100 orders a month", "One dashboard", "Email support"],
    cta: "Start free",
  },
  {
    name: "Growth",
    blurb: "For teams that live in their numbers.",
    price: { month: 29, year: 24 },
    popular: true,
    features: [
      "Unlimited orders",
      "Revenue, pipeline and traffic views",
      "Weekly digests and alerts",
      "Invite your whole team",
    ],
    cta: "Start 14-day trial",
  },
  {
    name: "Scale",
    blurb: "For operations with many hands.",
    price: { month: 99, year: 82 },
    features: [
      "Everything in Growth",
      "Roles, audit trail and SSO",
      "Priority support",
      "Custom data retention",
    ],
    cta: "Talk to sales",
  },
]

const faqs = [
  {
    q: "How long does setup take?",
    a: "Most teams connect their store and see their first dashboard in under ten minutes. There's nothing to install.",
  },
  {
    q: "Can I try it before I pay?",
    a: "Yes. Starter is free for your first 100 orders a month, and Growth comes with a 14-day trial. No card needed.",
  },
  {
    q: "Where does my data live?",
    a: "In encrypted storage in the region you choose. You can export everything, or delete it, at any time.",
  },
  {
    q: "Do you offer discounts?",
    a: "Paying yearly takes about 17% off every plan, and we offer free Growth seats to registered non-profits.",
  },
]

const footer: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Overview", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Customers", "Careers"] },
  { title: "Resources", links: ["Docs", "Guides", "Status"] },
]

const team = [
  { name: "Maya Chen", role: "Owner", initials: "M" },
  { name: "Jackson Lee", role: "Editor", initials: "J" },
  { name: "Rajesh Bhatt", role: "Viewer", initials: "R" },
]

const results = [
  { label: "Order #1042", note: "Jackson Lee · $39" },
  { label: "Maya Chen", note: "Customer since 2023" },
]

/** A link drawn as a kit button, so it is focusable and announced as one. */
function LinkButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button render={<a href="#" />} nativeButton={false} {...props}>
      {children}
    </Button>
  )
}

function Mark() {
  return (
    <div className="flex size-8 items-center justify-center rounded-control bg-brand text-caption font-medium text-brand-ink">
      A
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-caption font-medium text-muted-foreground">{children}</p>
  )
}

function Stars({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="5 out of 5 stars"
      className={cn("flex items-center gap-0.5 text-brand", className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className="size-3.5 fill-current" />
      ))}
    </span>
  )
}

function FeatureIcon({ icon: Icon }: { icon: typeof BarChart3Icon }) {
  return (
    <div className="mb-1 flex size-8 items-center justify-center rounded-item bg-muted [&_svg]:size-4">
      <Icon />
    </div>
  )
}

/** A page section: full-bleed when it carries a surface, content held to 64rem. */
function Band({
  muted,
  className,
  children,
}: {
  muted?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "px-5 @min-[700px]:px-8",
        muted && "border-y border-border bg-muted"
      )}
    >
      <div
        className={cn("mx-auto max-w-5xl py-14 @min-[700px]:py-20", className)}
      >
        {children}
      </div>
    </section>
  )
}

function ProductShot() {
  return (
    <div
      aria-label="Product preview"
      role="img"
      className="grid overflow-hidden rounded-container border border-border bg-background text-start shadow-floating @min-[700px]:grid-cols-[9.5rem_1fr]"
    >
      <aside className="hidden flex-col gap-1 border-e border-border bg-sidebar p-3 @min-[700px]:flex">
        <div className="mb-2 flex items-center gap-2 px-1.5">
          <Mark />
          <span className="text-caption font-medium">Acme</span>
        </div>
        {[
          [LayoutDashboardIcon, "Overview", true],
          [ShoppingCartIcon, "Orders", false],
          [UsersIcon, "Customers", false],
          [PackageIcon, "Products", false],
        ].map(([Icon, label, active]) => {
          const I = Icon as typeof BarChart3Icon
          return (
            <div
              key={label as string}
              className={cn(
                "flex items-center gap-2 rounded-item px-2 py-1.5 text-caption text-sidebar-foreground [&_svg]:size-3.5",
                active
                  ? "bg-sidebar-accent font-medium"
                  : "text-sidebar-foreground/70"
              )}
            >
              <I />
              {label as string}
            </div>
          )
        })}
      </aside>

      <div className="flex min-w-0 flex-col gap-3 p-3 @min-[700px]:p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Revenue", "$48,210", "+12.4%"],
            ["Orders", "1,284", "+3.1%"],
            ["Customers", "9,540", "+8.7%"],
          ].map(([label, value, delta]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col gap-1.5 rounded-item border border-border p-2.5"
            >
              <span className="truncate text-micro text-muted-foreground">
                {label}
              </span>
              <span className="truncate font-heading text-body leading-none font-medium tabular-nums @min-[700px]:text-title">
                {value}
              </span>
              <Badge variant="low" className="w-fit">
                {delta}
              </Badge>
            </div>
          ))}
        </div>

        <div className="rounded-item border border-border p-3">
          <p className="text-micro font-medium">Revenue, orders and refunds</p>
          <ChartContainer
            config={growthConfig}
            className="mt-2 aspect-auto h-36 w-full @min-[700px]:h-44"
          >
            <AreaChart data={growth} margin={{ left: 0, right: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                interval={0}
                padding={{ left: 8, right: 8 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {(["revenue", "orders", "refunds"] as const).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={`var(--color-${key})`}
                  fill={`var(--color-${key})`}
                  fillOpacity={0.14}
                  isAnimationActive={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="rounded-item border border-border">
          <Table>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.customer}>
                  <TableCell className="text-caption">
                    {order.customer}
                  </TableCell>
                  <TableCell className="w-px whitespace-nowrap">
                    <Badge
                      variant={
                        statusVariant[
                          order.status as keyof typeof statusVariant
                        ]
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end text-caption tabular-nums">
                    {order.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

/** A marketing page: hero with a product shot, proof, features, pricing, FAQ and a closing call. */
export function Landing() {
  const [billing, setBilling] = React.useState<"month" | "year">("year")

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center gap-6 border-b border-border bg-background/90 px-5 py-3 backdrop-blur @min-[700px]:px-8">
        <div className="flex items-center gap-2.5">
          <Mark />
          <span className="font-heading text-body font-medium">Acme</span>
        </div>
        <nav
          aria-label="Site"
          className="hidden items-center gap-1 @min-[700px]:flex"
        >
          {nav.map((item) => (
            <LinkButton key={item} variant="ghost" size="sm">
              {item}
            </LinkButton>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1.5">
          <LinkButton
            variant="ghost"
            size="sm"
            className="hidden @min-[500px]:inline-flex"
          >
            Sign in
          </LinkButton>
          <Button size="sm">Get started</Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="@min-[700px]:hidden"
          >
            <MenuIcon />
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <Band muted className="flex flex-col gap-14 @min-[700px]:gap-16">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge variant="outline" className="gap-1.5 py-3 ps-2.5 pe-2">
              <SparklesIcon className="text-brand" />
              New: weekly digests
              <ArrowRightIcon />
            </Badge>
            <h1 className={cn(h1, "max-w-3xl")}>
              The calm way to run an{" "}
              <span className="text-brand">online shop</span>
            </h1>
            <p className="max-w-xl text-body text-pretty text-muted-foreground @min-[700px]:text-title">
              Acme brings orders, customers and revenue into one clear view, so
              every morning starts with answers instead of tabs.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="lg">
                Start free
                <ArrowRightIcon />
              </Button>
              <Button size="lg" variant="outline">
                Book a demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-caption text-muted-foreground">
              <AvatarGroup>
                {["M", "J", "R", "S"].map((initial) => (
                  <Avatar key={initial} size="sm">
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <Stars />
              <span>Loved by shops in 40 countries</span>
            </div>
          </div>

          <ProductShot />

          <div className="flex flex-col items-center gap-4">
            <Eyebrow>Trusted by the teams behind</Eyebrow>
            <ul className="flex flex-wrap justify-center gap-x-10 gap-y-2 font-heading text-title font-medium text-muted-foreground">
              {logos.map((logo) => (
                <li key={logo}>{logo}</li>
              ))}
            </ul>
          </div>
        </Band>

        {/* Features */}
        <Band className="flex flex-col gap-8">
          <div className="flex max-w-xl flex-col gap-2">
            <Eyebrow>What you get</Eyebrow>
            <h2 className={h2}>Everything about your shop, one place</h2>
            <p className="text-body text-muted-foreground">
              Fewer tools, fewer tabs, and numbers you can trust at a glance.
            </p>
          </div>

          <div className="grid gap-3 @min-[700px]:grid-cols-6">
            <Card className="@min-[700px]:col-span-4">
              <CardHeader>
                <FeatureIcon icon={BarChart3Icon} />
                <CardTitle role="heading" aria-level={3}>
                  See what&apos;s selling
                </CardTitle>
                <CardDescription>
                  Live units by product, with the movers flagged for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 @min-[700px]:grid-cols-2">
                <ChartContainer
                  config={sellersConfig}
                  className="aspect-auto h-36 w-full"
                >
                  <BarChart data={sellers}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={6}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="units"
                      fill="var(--color-units)"
                      radius={3}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ChartContainer>
                <ItemGroup className="justify-center gap-1">
                  <p className="text-micro font-medium text-muted-foreground">
                    Top movers this week
                  </p>
                  {movers.map((mover) => (
                    <Item key={mover.name} size="xs" className="px-0">
                      <ItemContent>
                        <ItemTitle className="text-caption">
                          {mover.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant={mover.up ? "low" : "high"}>
                          {mover.delta}
                        </Badge>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>

            <Card className="@min-[700px]:col-span-2">
              <CardHeader>
                <FeatureIcon icon={ZapIcon} />
                <CardTitle role="heading" aria-level={3}>
                  Alerts that matter
                </CardTitle>
                <CardDescription>
                  Pick what&apos;s worth an interruption.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-caption">
                {[
                  ["Low stock", true],
                  ["Refund over $200", true],
                  ["Failed payment", true],
                  ["New review", false],
                ].map(([label, on]) => (
                  <label
                    key={label as string}
                    className="flex items-center justify-between gap-3"
                  >
                    {label}
                    <Switch size="sm" defaultChecked={on as boolean} />
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card className="@min-[700px]:col-span-3">
              <CardHeader>
                <FeatureIcon icon={UsersIcon} />
                <CardTitle role="heading" aria-level={3}>
                  Built for teams
                </CardTitle>
                <CardDescription>
                  Roles, comments and a shared history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemGroup className="gap-1">
                  {team.map((member) => (
                    <Item key={member.name} size="xs" className="px-0">
                      <ItemMedia>
                        <Avatar size="sm">
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="text-caption">
                          {member.name}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Badge variant="secondary">{member.role}</Badge>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>

            <Card className="@min-[700px]:col-span-3">
              <CardHeader>
                <FeatureIcon icon={SearchIcon} />
                <CardTitle role="heading" aria-level={3}>
                  Search everything
                </CardTitle>
                <CardDescription>
                  Jump to any order or customer from the keyboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-control border border-border bg-muted/50 px-3 py-2 text-caption text-muted-foreground">
                  <SearchIcon className="size-4" />
                  Find an order or a customer
                  <KbdGroup className="ms-auto">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                </div>
                <ItemGroup className="gap-0">
                  {results.map((result) => (
                    <Item
                      key={result.label}
                      size="xs"
                      className={cn(
                        "px-2",
                        result === results[0] && "bg-muted"
                      )}
                    >
                      <ItemContent>
                        <ItemTitle className="text-caption">
                          {result.label}
                        </ItemTitle>
                        <ItemDescription>{result.note}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
          </div>
        </Band>

        {/* Proof */}
        <Band
          muted
          className="grid items-center gap-10 @min-[900px]:grid-cols-[1.2fr_1fr] @min-[900px]:gap-14"
        >
          <figure className="flex flex-col gap-5">
            <Stars />
            <blockquote
              className={cn(
                display,
                "text-[length:calc(var(--type-display)*0.95)] leading-snug @min-[700px]:text-[length:calc(var(--type-display)*1.15)]"
              )}
            >
              &ldquo;We closed the books two days faster in the first month. The
              whole team opens Acme before they open email.&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-caption font-medium">Maya Chen</p>
                <p className="text-micro text-muted-foreground">
                  Head of Operations, Northwind
                </p>
              </div>
            </figcaption>
          </figure>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-container border border-border bg-border @min-[500px]:grid-cols-4 @min-[900px]:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end gap-1.5 bg-background p-5"
              >
                <dt className="text-caption text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className={figure}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Band>

        {/* Pricing */}
        <Band className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className={h2}>Simple plans that grow with you</h2>
            <SegmentedControl
              label="Billing period"
              value={billing}
              onValueChange={setBilling}
              options={[
                { value: "month", label: "Monthly" },
                { value: "year", label: "Yearly · save 17%" },
              ]}
            />
          </div>

          <div className="grid gap-3 @min-[700px]:grid-cols-3">
            {plans.map((plan) => {
              const price = plan.price[billing]
              return (
                <Card
                  key={plan.name}
                  className={cn(
                    "relative overflow-visible",
                    plan.popular &&
                      "order-first border-primary shadow-floating ring-1 ring-primary @min-[700px]:order-none"
                  )}
                >
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="absolute start-5 -top-2.5">
                        Most popular
                      </Badge>
                    )}
                    <CardTitle role="heading" aria-level={3}>
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="@min-[700px]:min-h-9">
                      {plan.blurb}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5">
                    <div>
                      <p className="flex items-baseline gap-1.5">
                        <span className={figure}>${price}</span>
                        <span className="text-caption text-muted-foreground">
                          /month
                        </span>
                        {billing === "year" && price > 0 && (
                          <s className="text-caption text-muted-foreground">
                            ${plan.price.month}
                          </s>
                        )}
                      </p>
                      <p className="mt-1 h-4 text-micro text-muted-foreground">
                        {billing === "year" && price > 0
                          ? `$${price * 12} billed yearly`
                          : price === 0
                            ? "Free forever"
                            : "Billed monthly"}
                      </p>
                    </div>
                    <Separator />
                    <ul className="flex flex-1 flex-col gap-2.5 text-caption">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant={plan.popular ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Band>

        {/* FAQ */}
        <Band muted className="mx-auto flex max-w-2xl flex-col gap-6">
          <h2 className={cn(h2, "text-center")}>Questions, answered</h2>
          <Accordion defaultValue={[faqs[0].q]}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Band>

        {/* Closing call */}
        <Band className="!py-10 @min-[700px]:!py-16">
          <div className="flex flex-col items-center gap-5 rounded-container bg-primary px-6 py-12 text-center text-primary-foreground @min-[700px]:py-16">
            <h2 className={cn(h2, "max-w-lg")}>
              Start your next morning with answers
            </h2>
            <p className="max-w-md text-body">
              Free for your first 100 orders a month. No card, no catch.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="lg" variant="secondary">
                Start free
                <ArrowRightIcon />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Book a demo
              </Button>
            </div>
            <div className="flex items-center gap-3 text-caption">
              <AvatarGroup>
                {["M", "J", "R"].map((initial) => (
                  <Avatar key={initial} size="sm">
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span>Join 12,000+ teams</span>
            </div>
          </div>
        </Band>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-10 @min-[700px]:grid-cols-[1.6fr_1fr_1fr_1fr] @min-[700px]:px-8">
          <div className="col-span-full flex flex-col gap-4 @min-[700px]:col-span-1">
            <div className="flex items-center gap-2.5">
              <Mark />
              <span className="font-heading text-body font-medium">Acme</span>
            </div>
            <p className="max-w-xs text-caption text-muted-foreground">
              The calm way to run an online shop. One email a month, no spam.
            </p>
            <InputGroup className="max-w-xs">
              <InputGroupInput
                type="email"
                aria-label="Email address"
                placeholder="you@acme.co"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="default" size="xs">
                  Subscribe
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="col-span-full grid grid-cols-3 gap-6 @min-[700px]:col-span-3">
            {footer.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className="flex flex-col gap-0.5"
              >
                <p className="text-caption font-medium">{column.title}</p>
                {column.links.map((link) => (
                  <LinkButton
                    key={link}
                    variant="link"
                    size="sm"
                    className="h-7 w-fit justify-start px-0 text-muted-foreground"
                  >
                    {link}
                  </LinkButton>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="border-t border-border px-5 py-3 @min-[700px]:px-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-micro text-muted-foreground">
            <span>© 2026 Acme Inc. All rights reserved.</span>
            <NativeSelect aria-label="Language" size="sm" defaultValue="en">
              <NativeSelectOption value="en">English</NativeSelectOption>
              <NativeSelectOption value="de">Deutsch</NativeSelectOption>
              <NativeSelectOption value="fr">Français</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </footer>
    </div>
  )
}
