import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ColorPicker,
  ColorPickerPopover,
} from "@amit-kap/glaze/components/color-picker"

// Glaze's own component; the format switcher and eyedropper follow the colour
// picker at https://www.fluidfunctionalism.com/docs/color-picker.
const meta = {
  title: "Custom/Color Picker",
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component:
          "Pick a colour from a saturation and brightness area, a hue slider and an opacity slider, or type it in HEX, RGB, HSL or OKLCH. `value` and `defaultValue` take any of those CSS colour strings; `onValueChange` returns the colour written in the current format, with its sRGB channels.",
      },
    },
  },
  args: { defaultValue: "#6B97FF", defaultFormat: "hex" },
  argTypes: {
    defaultFormat: {
      control: "inline-radio",
      options: ["hex", "rgb", "hsl", "oklch"],
    },
    hideEyedropper: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

export const Formats: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ColorPicker defaultValue="rgb(107 151 255)" defaultFormat="rgb" />
      <ColorPicker defaultValue="hsl(222 100% 71%)" defaultFormat="hsl" />
      <ColorPicker
        defaultValue="oklch(69.3% 0.161 265.2)"
        defaultFormat="oklch"
      />
    </div>
  ),
}

export const WithOpacity: Story = {
  args: { defaultValue: "#6B97FF80" },
}

export const Swatches: Story = {
  args: {
    swatches: [
      "#171717",
      "#E7000B",
      "#A65F00",
      "#008236",
      "#155DFC",
      "#6B97FF",
    ],
  },
}

export const Popover: Story = {
  render: () => (
    <ColorPickerPopover
      triggerLabel="Brand"
      defaultValue="oklch(20.5% 0 0)"
      defaultFormat="oklch"
    />
  ),
}

// --- Controlled -----------------------------------------------------------

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("#171717")
    return (
      <div className="flex flex-col gap-4">
        <ColorPicker value={value} onValueChange={setValue} />
        <p className="text-body text-muted-foreground">
          Value: <code className="font-mono text-caption">{value}</code>
        </p>
      </div>
    )
  },
}
