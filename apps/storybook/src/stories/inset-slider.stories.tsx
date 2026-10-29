import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { InsetSlider } from "@amit-kap/glaze/components/inset-slider"
import { Label } from "@amit-kap/glaze/components/label"

const meta = {
  title: "Custom/InsetSlider",
  component: InsetSlider,
  parameters: {
    docs: {
      description: {
        component:
          "A slider whose track is a capsule that wraps the thumb. Pass an array to `defaultValue` or `value` for one thumb per entry. `ticks` draws a dot under every step, so the thumb always lands on a dot; keep it to about 20 stops. Horizontal only; use Slider for vertical.",
      },
    },
  },
  args: { defaultValue: [40], min: 0, max: 100, step: 1, "aria-label": "Volume" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    ticks: { control: "boolean" },
    showMinMax: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InsetSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="grid gap-6">
      <InsetSlider {...args} />
      <InsetSlider
        {...args}
        step={10}
        ticks
        aria-label={`${args["aria-label"]} with ticks`}
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <InsetSlider size="sm" defaultValue={[50]} aria-label="Small" />
      <InsetSlider defaultValue={[50]} aria-label="Default" />
      <InsetSlider size="lg" defaultValue={[50]} aria-label="Large" />
    </div>
  ),
}

export const Range: Story = {
  args: { defaultValue: [25, 70], "aria-label": "Price range" },
}

export const Ticks: Story = {
  args: { defaultValue: [40], step: 10, ticks: true, "aria-label": "Opacity" },
}

export const MinMax: Story = {
  args: { defaultValue: [40], showMinMax: true },
}

export const TicksAndMinMax: Story = {
  args: {
    defaultValue: [40],
    step: 10,
    ticks: true,
    showMinMax: true,
    "aria-label": "Opacity",
  },
}

export const Disabled: Story = {
  args: { defaultValue: [50], disabled: true },
}

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = React.useState([30, 80])

    return (
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="inset-slider-demo-price">Price range</Label>
          <span className="text-body text-muted-foreground">
            €{value[0]} – €{value[1]}
          </span>
        </div>
        <InsetSlider
          id="inset-slider-demo-price"
          value={value}
          onValueChange={(v) => setValue(v as number[])}
          step={5}
        />
      </div>
    )
  },
}
