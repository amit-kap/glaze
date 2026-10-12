import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Clock2Icon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Calendar,
  CalendarDayButton,
} from "@amit-kap/glaze/components/calendar"
import { Card, CardContent, CardFooter } from "@amit-kap/glaze/components/card"
import { Field, FieldGroup, FieldLabel } from "@amit-kap/glaze/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"

// Stories follow the upstream shadcn/ui (base-nova) Calendar examples:
// https://ui.shadcn.com/docs/components/base/calendar
// Skipped: the Persian/Hijri example, which needs the component itself to
// import from `react-day-picker/persian`.
const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: {
    docs: {
      description: {
        component:
          "A date field component that allows users to enter and edit dates. Built on [React DayPicker](https://react-day-picker.js.org); all DayPicker props are supported.",
      },
    },
  },
  argTypes: {
    captionLayout: {
      control: "inline-radio",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
    showWeekNumber: { control: "boolean" },
    numberOfMonths: { control: { type: "number", min: 1, max: 3 } },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

// Upstream imports addDays from date-fns, which Storybook doesn't depend on.
function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const year = new Date().getFullYear()

// Chrome's native time-input picker icon clashes with the input group addon.
const timeInputClassName =
  "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"

// Unpadded card wrapping a calendar — shared by WeekNumbers, BookedDates and
// CustomCellSize.
function CalendarCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  args: { captionLayout: "dropdown" },
  render: function Render(args) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
      <Calendar
        {...args}
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-control border"
      />
    )
  },
}

export const Basic: Story = {
  render: () => <Calendar mode="single" className="rounded-control border" />,
}

// --- Variants -------------------------------------------------------------

export const Range: Story = {
  render: function Render() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: new Date(year, 0, 12),
      to: addDays(new Date(year, 0, 12), 30),
    })

    return (
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        className="rounded-control border"
      />
    )
  },
}

// Use `captionLayout="dropdown"` to pick the month and year from selects.
export const MonthAndYearSelector: Story = {
  render: () => (
    <Calendar
      mode="single"
      captionLayout="dropdown"
      className="rounded-control border"
    />
  ),
}

export const WeekNumbers: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(year, 0, 12)
    )

    return (
      <CalendarCard>
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          showWeekNumber
        />
      </CalendarCard>
    )
  },
}

// --- Compositions ---------------------------------------------------------

const presets = [
  { label: "Today", value: 0 },
  { label: "Tomorrow", value: 1 },
  { label: "In 3 days", value: 3 },
  { label: "In a week", value: 7 },
  { label: "In 2 weeks", value: 14 },
]

export const Presets: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(year, 1, 12)
    )
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      new Date(year, new Date().getMonth(), 1)
    )

    return (
      <Card className="mx-auto w-fit max-w-[300px]" size="sm">
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fixedWeeks
            className="p-0 [--cell-size:--spacing(9.5)]"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const newDate = addDays(new Date(), preset.value)
                setDate(newDate)
                setCurrentMonth(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1)
                )
              }}
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    )
  },
}

function TimeField({
  id,
  label,
  defaultValue,
}: {
  id: string
  label: string
  defaultValue: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type="time"
          step="1"
          defaultValue={defaultValue}
          className={timeInputClassName}
        />
        <InputGroupAddon>
          <Clock2Icon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export const DateAndTimePicker: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(year, new Date().getMonth(), 12)
    )

    return (
      <Card size="sm" className="mx-auto w-fit">
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-0"
          />
        </CardContent>
        <CardFooter className="border-t bg-card">
          <FieldGroup>
            <TimeField
              id="time-from"
              label="Start Time"
              defaultValue="10:30:00"
            />
            <TimeField id="time-to" label="End Time" defaultValue="12:30:00" />
          </FieldGroup>
        </CardFooter>
      </Card>
    )
  },
}

// Disable dates with `disabled` and style them with `modifiers`.
export const BookedDates: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(year, 0, 6)
    )
    const bookedDates = Array.from(
      { length: 15 },
      (_, i) => new Date(year, 0, 12 + i)
    )

    return (
      <CalendarCard>
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={setDate}
          disabled={bookedDates}
          modifiers={{
            booked: bookedDates,
          }}
          modifiersClassNames={{
            booked: "[&>button]:line-through opacity-100",
          }}
        />
      </CalendarCard>
    )
  },
}

// Set `--cell-size` to resize cells and render a custom DayButton.
export const CustomCellSize: Story = {
  render: function Render() {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(year, 11, 8),
      to: addDays(new Date(year, 11, 8), 10),
    })

    return (
      <CalendarCard>
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          captionLayout="dropdown"
          className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          formatters={{
            formatMonthDropdown: (date) => {
              return date.toLocaleString("default", { month: "long" })
            },
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const isWeekend =
                day.date.getDay() === 0 || day.date.getDay() === 6

              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {children}
                  {!modifiers.outside && (
                    <span>{isWeekend ? "$120" : "$100"}</span>
                  )}
                </CalendarDayButton>
              )
            },
          }}
        />
      </CalendarCard>
    )
  },
}
