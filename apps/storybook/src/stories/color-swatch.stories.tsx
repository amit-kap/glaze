import type { Meta, StoryObj } from "@storybook/react-vite"

import { ColorSwatch } from "@amit-kap/glaze/components/color-swatch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

// Glaze's own component: the library's way of showing a colour without
// editing it. The picker is for changing one.
const meta = {
  title: "Custom/Color Swatch",
  component: ColorSwatch,
  parameters: {
    docs: {
      description: {
        component:
          "A colour, drawn. Use `size` for the three stops Glaze needs (xs 16px in drill-downs, sm 24px in list rows, md 36px in a header) and `label` when the swatch is the only clue to what the colour is. Transparency shows over a checkerboard. Pass `render` to turn it into a button; the picker is still the right control for editing.",
      },
    },
  },
  args: { value: "oklch(20.5% 0 0)", size: "sm" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md"] },
  },
} satisfies Meta<typeof ColorSwatch>

export default meta
type Story = StoryObj<typeof meta>

// --- Sizes ----------------------------------------------------------------

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ColorSwatch value="oklch(55% 0.2 260)" size={size} />
          <span className="text-caption text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
}

// --- Any CSS colour -------------------------------------------------------

export const Formats: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ColorSwatch value="#6B97FF" label="Hex" />
      <ColorSwatch value="rgb(107 151 255)" label="RGB" />
      <ColorSwatch value="hsl(222 100% 71%)" label="HSL" />
      <ColorSwatch value="oklch(68% 0.16 258)" label="OKLCH" />
      <ColorSwatch value="not a colour" label="Unreadable" />
    </div>
  ),
}

// --- Transparency ---------------------------------------------------------

export const Translucent: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-control bg-muted p-3">
      <ColorSwatch value="oklch(100% 0 0 / 10%)" label="10% white" />
      <ColorSwatch value="oklch(100% 0 0 / 15%)" label="15% white" />
      <ColorSwatch value="oklch(0% 0 0 / 50%)" label="50% black" />
      <ColorSwatch value="oklch(60% 0.2 20 / 40%)" label="40% red" />
    </div>
  ),
}

// --- In a swatch row ------------------------------------------------------

export const InARow: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1">
      {[
        ["Brand", "oklch(20.5% 0 0)"],
        ["Card", "oklch(100% 0 0)"],
        ["Muted", "oklch(97% 0 0)"],
        ["Border", "oklch(92.2% 0 0 / 60%)"],
      ].map(([label, value]) => (
        <div key={label} className="flex h-9 items-center gap-2">
          <ColorSwatch value={value} />
          <span className="flex-1 text-body">{label}</span>
          <span className="font-mono text-caption text-muted-foreground">
            {value}
          </span>
        </div>
      ))}
    </div>
  ),
}

// --- As a button ----------------------------------------------------------

export const Interactive: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <ColorSwatch
            value="oklch(55% 0.2 260)"
            size="md"
            render={<button type="button" />}
            className="cursor-pointer hover:opacity-80"
          />
        }
      />
      <TooltipContent>Change colour</TooltipContent>
    </Tooltip>
  ),
}
