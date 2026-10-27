import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ColorSelector,
  type ColorSelectorDependent,
} from "@amit-kap/glaze/components/color-selector"

// Glaze's own control: one colour per card, with its values and what it feeds.
// The picker inside is `ColorPicker` in its compact form.
const dependents: ColorSelectorDependent[] = [
  { label: "muted", value: "oklch(97% 0 0)" },
  { label: "subtle-foreground", value: "oklch(71.1% 0 0)" },
  { label: "sidebar", value: "oklch(98.5% 0 0)" },
  { label: "ring", value: "oklch(70.8% 0 0)" },
  { label: "border", value: "oklch(92.2% 0 0)" },
]

const meta = {
  title: "Custom/Color Selector",
  component: ColorSelector,
  parameters: {
    docs: {
      description: {
        component:
          "One colour as a card: swatch, name and its OKLCH channels, collapsed to a 38px row. Opening it shows the description, a compact picker — with the contrast level at the end of its control row — and every token that follows the colour. `edited` adds the reset beside the name; `dependents` is read-only, so a theme is edited where its consequences are visible.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 351 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Brand",
    value: "oklch(20.5% 0 0)",
    description:
      "Identity color for branded surfaces; set independently of Primary.",
  },
} satisfies Meta<typeof ColorSelector>

export default meta
type Story = StoryObj<typeof meta>

// The picker writes back to the card, so every open story holds its value.
function Playground({
  start = "oklch(20.5% 0 0)",
  ...props
}: Omit<
  React.ComponentProps<typeof ColorSelector>,
  "value" | "onValueChange"
> & { start?: string }) {
  const [value, setValue] = React.useState(start)
  return <ColorSelector {...props} value={value} onValueChange={setValue} />
}

// --- States ---------------------------------------------------------------

// Collapsed: the 38px row that a list of tokens is made of.
export const Collapsed: Story = {}

// Open: description, compact picker, and the tokens this colour writes.
export const Expanded: Story = {
  render: () => (
    <Playground
      label="Brand"
      description="Identity color for branded surfaces; set independently of Primary."
      defaultOpen
      dependents={dependents}
    />
  ),
}

// An edited colour carries its reset beside the name, where it belongs.
export const Edited: Story = {
  args: {
    value: "oklch(55% 0.2 260)",
    edited: true,
    onReset: () => {},
  },
}

// One dependent, the shape the studio frame is drawn in.
export const OneDependent: Story = {
  render: () => (
    <Playground
      label="Primary"
      description="Identity color for branded surfaces; set independently of Primary."
      defaultOpen
      dependents={[{ label: "sidebar-primary", value: "oklch(20.5% 0 0)" }]}
    />
  ),
}

// Nothing follows this colour yet: the list simply isn't there.
export const NoDependents: Story = {
  render: () => <Playground label="Brand" defaultOpen dependents={[]} />,
}

// --- Contrast -------------------------------------------------------------

// Readability is judged on the pair that meets in the interface, not the colour
// alone: AAA, AA and Fail, sitting at the end of the picker's control row.
export const Contrast: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Playground
        label="Foreground"
        start="oklch(14.5% 0 0)"
        defaultOpen
        contrast={{ foreground: "oklch(14.5% 0 0)", background: "#ffffff" }}
      />
      <Playground
        label="Muted foreground"
        start="#767676"
        defaultOpen
        contrast={{ foreground: "#767676", background: "#ffffff" }}
      />
      <Playground
        label="Border"
        start="#999999"
        defaultOpen
        contrast={{ foreground: "#999999", background: "#ffffff" }}
      />
      <Playground label="Overlay" start="rgb(0 0 0 / 10%)" defaultOpen />
    </div>
  ),
}

// --- Values ---------------------------------------------------------------

// Transparency, hex and OKLCH all read the same way: as channels.
export const Values: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <ColorSelector label="Overlay" value="rgb(0 0 0 / 10%)" />
      <ColorSelector label="Brand" value="#2663EB" />
      <ColorSelector label="Card" value="oklch(100% 0 0)" />
      <ColorSelector label="Unreadable" value="not a colour" />
    </div>
  ),
}

// A long token name truncates; the row keeps its height and its lanes.
export const LongLabel: Story = {
  args: { label: "Muted foreground on inverse surface" },
}

// 300px is the narrowest the card should ever be drawn.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Playground label="Background" defaultOpen dependents={dependents} />
  ),
}

// --- Dark -----------------------------------------------------------------

// Channel rules and the swatch ring both come from the theme, so dark needs no
// special case.
export const Dark: Story = {
  render: () => (
    <div className="dark rounded-lg bg-background p-3">
      <div className="flex flex-col gap-1">
        <ColorSelector
          label="Brand"
          value="oklch(98.5% 0 0)"
          edited
          onReset={() => {}}
        />
        <Playground
          label="Background"
          start="oklch(14.5% 0 0)"
          description="Kind of surface pages sit on."
          defaultOpen
          dependents={dependents}
        />
      </div>
    </div>
  ),
}

// --- Everything at once ----------------------------------------------------

// The whole set on one board, for reviewing the states against each other.
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <ColorSelector label="Brand" value="oklch(20.5% 0 0)" />
      <ColorSelector
        label="Brand"
        value="oklch(55% 0.2 260)"
        edited
        onReset={() => {}}
      />
      <Playground
        label="Background"
        start="oklch(100% 0 0)"
        description="The surface pages and app shells sit on."
        defaultOpen
        contrast={{ foreground: "oklch(14.5% 0 0)", background: "#ffffff" }}
        dependents={dependents}
      />
      <Playground
        label="Primary"
        defaultOpen
        edited
        onReset={() => {}}
        contrast={{
          foreground: "oklch(98.5% 0 0)",
          background: "oklch(20.5% 0 0)",
        }}
      />
    </div>
  ),
}
