import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Calendar } from "@amit-kap/glaze/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@amit-kap/glaze/components/chart"
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@amit-kap/glaze/components/toggle-group"

const invoices = [
  ["INV001", "Paid", "$250.00", "Credit Card"],
  ["INV002", "Pending", "$150.00", "PayPal"],
  ["INV003", "Unpaid", "$350.00", "Bank Transfer"],
  ["INV004", "Paid", "$450.00", "Credit Card"],
  ["INV005", "Paid", "$550.00", "PayPal"],
  ["INV006", "Pending", "$200.00", "Bank Transfer"],
  ["INV007", "Unpaid", "$300.00", "Credit Card"],
]

// Story: Default.
export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(([invoice, status, amount, method]) => (
          <TableRow key={invoice}>
            <TableCell className="font-medium">{invoice}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{method}</TableCell>
            <TableCell className="text-end">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

// Story: Default.
export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Calendar
      captionLayout="dropdown"
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-container border"
    />
  )
}

const visitors = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
]

const visitorsConfig = {
  views: { label: "Page Views" },
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-1)" },
} satisfies ChartConfig

type Device = "desktop" | "mobile"

const formatDay = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

// Story: Default (interactive bar chart).
export function ChartDemo() {
  const [activeChart, setActiveChart] = React.useState<Device>("desktop")
  const total = React.useMemo(
    () => ({
      desktop: visitors.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: visitors.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )
  return (
    <Card className="w-full py-0 pb-4">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <ToggleGroup
          aria-label="Chart device"
          value={[activeChart]}
          onValueChange={([chart]) => chart && setActiveChart(chart as Device)}
          className="flex rounded-none"
        >
          {(["desktop", "mobile"] as const).map((chart) => (
            <ToggleGroupItem
              key={chart}
              value={chart}
              className="relative z-30 flex h-auto flex-1 flex-col justify-center gap-1 rounded-none border-t px-6 py-4 text-start data-[pressed]:bg-muted/50 sm:border-s sm:border-t-0 sm:px-8 sm:py-6"
            >
              <span className="text-caption text-muted-foreground">
                {visitorsConfig[chart].label}
              </span>
              <span className="text-title leading-none font-strong sm:text-heading">
                {total[chart].toLocaleString()}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={visitorsConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={visitors}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDay}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    typeof value !== "string" && typeof value !== "number"
                      ? value
                      : new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
