import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@amit-kap/glaze/components/chart"

// Stories follow the upstream shadcn/ui (base-nova) Chart examples:
// https://ui.shadcn.com/docs/components/base/chart
// The "Your first chart" steps use Glaze's --chart-* tokens instead of
// upstream's hard-coded blues, so they follow the theme. Skipped: the
// tooltip illustration, which is a static drawing rather than a chart.
const meta = {
  title: "Components/Chart",
  component: ChartContainer,
  subcomponents: {
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Beautiful charts built using [Recharts](https://recharts.org). Describe series in a `ChartConfig`; each key becomes a `--color-<key>` variable inside `ChartContainer`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-xl">
        <Story />
      </div>
    ),
  ],
  // Charts are composed in each render function; these are required props.
  args: { config: {}, children: null },
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

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

// Pick a series in the header to swap the bars.
export const Default: Story = {
  render: function Render() {
    const [activeChart, setActiveChart] = React.useState<Device>("desktop")

    const total = React.useMemo(
      () => ({
        desktop: visitors.reduce((acc, curr) => acc + curr.desktop, 0),
        mobile: visitors.reduce((acc, curr) => acc + curr.mobile, 0),
      }),
      []
    )

    return (
      <Card className="py-0 pb-4">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
            <CardTitle>Bar Chart - Interactive</CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
          <div className="flex">
            {(["desktop", "mobile"] as const).map((chart) => (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-caption text-muted-foreground">
                  {visitorsConfig[chart].label}
                </span>
                <span className="text-title leading-none font-bold sm:text-heading">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            ))}
          </div>
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
                      new Date(value).toLocaleDateString("en-US", {
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
  },
}

// --- Compositions ---------------------------------------------------------
// Upstream's "Your first chart" walkthrough, one step per story.

const months = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const monthsConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

function FirstChart({
  grid,
  axis,
  tooltip,
  legend,
}: {
  grid?: boolean
  axis?: boolean
  tooltip?: boolean
  legend?: boolean
}) {
  return (
    <ChartContainer config={monthsConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={months}>
        {grid && <CartesianGrid vertical={false} />}
        {axis && (
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
        )}
        {tooltip && <ChartTooltip content={<ChartTooltipContent />} />}
        {legend && <ChartLegend content={<ChartLegendContent />} />}
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export const FirstChartBars: Story = {
  name: "First Chart: Bars",
  render: () => <FirstChart />,
}

export const FirstChartGrid: Story = {
  name: "First Chart: Grid",
  render: () => <FirstChart grid />,
}

export const FirstChartAxis: Story = {
  name: "First Chart: Axis",
  render: () => <FirstChart grid axis />,
}

export const FirstChartTooltip: Story = {
  name: "First Chart: Tooltip",
  render: () => <FirstChart grid axis tooltip />,
}

export const FirstChartLegend: Story = {
  name: "First Chart: Legend",
  render: () => <FirstChart grid axis tooltip legend />,
}
