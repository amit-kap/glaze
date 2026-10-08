import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@amit-kap/glaze/components/label"
import { Slider } from "@amit-kap/glaze/components/slider"

// Stories follow the upstream shadcn/ui (base-nova) Slider examples:
// https://ui.shadcn.com/docs/components/base/slider
const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          "An input where the user selects a value from within a given range. Pass an array to `defaultValue` or `value`; one entry per thumb.",
      },
    },
  },
  args: { defaultValue: [75], max: 100, step: 1, "aria-label": "Volume" },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

export const Range: Story = {
  args: { defaultValue: [25, 50], step: 5, "aria-label": "Range" },
}

export const MultipleThumbs: Story = {
  args: { defaultValue: [10, 20, 70], step: 10, "aria-label": "Stops" },
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-6">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40"
        aria-label="Bass"
      />
      <Slider
        defaultValue={[25]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40"
        aria-label="Treble"
      />
    </div>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  args: { defaultValue: [50], disabled: true },
}

// --- Compositions ---------------------------------------------------------

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = React.useState([0.3, 0.7])

    return (
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="slider-demo-temperature">Temperature</Label>
          <span className="text-body text-muted-foreground">
            {value.join(", ")}
          </span>
        </div>
        <Slider
          id="slider-demo-temperature"
          value={value}
          onValueChange={(value) => setValue(value as number[])}
          min={0}
          max={1}
          step={0.1}
        />
      </div>
    )
  },
}
