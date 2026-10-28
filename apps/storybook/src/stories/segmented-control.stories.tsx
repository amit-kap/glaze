import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"

const viewports = [
  { value: "fit", label: "Fit" },
  { value: "768", label: "768" },
  { value: "390", label: "390" },
]

const meta = {
  title: "Custom/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    docs: {
      description: {
        component:
          "One choice from a short, always-visible set. A muted track with a pill that slides behind the active option, drawn with Tabs so it keeps the same indicator motion, focus ring and keyboard behaviour. Use it for view state (mode, density, viewport); use ToggleGroup when options can be combined, and Select when the list is too long to show at once. Give it a `label` — it names the choice for assistive tech and is not drawn.",
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  args: {
    label: "Preview width",
    value: "fit",
    options: viewports,
    onValueChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

// --- Sizes -----------------------------------------------------------------

export const Sizes: Story = {
  args: { ...Default.args },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return (
      <div className="flex flex-col items-center gap-3">
        <SegmentedControl
          {...args}
          size="mini"
          value={value}
          onValueChange={setValue}
        />
        <SegmentedControl
          {...args}
          size="sm"
          value={value}
          onValueChange={setValue}
        />
        <SegmentedControl
          {...args}
          size="default"
          value={value}
          onValueChange={setValue}
        />
      </div>
    )
  },
}

// --- Icons in the label ----------------------------------------------------

export const WithIcons: Story = {
  args: {
    label: "Mode",
    value: "light",
    options: [
      { value: "light", label: <SunIcon /> },
      { value: "dark", label: <MoonIcon /> },
    ],
    onValueChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}

// --- A disabled option -----------------------------------------------------

export const DisabledOption: Story = {
  args: {
    label: "Density",
    value: "comfortable",
    options: [
      { value: "comfortable", label: "Comfortable" },
      { value: "compact", label: "Compact" },
      { value: "tight", label: "Tight", disabled: true },
    ],
    onValueChange: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <SegmentedControl {...args} value={value} onValueChange={setValue} />
  },
}
