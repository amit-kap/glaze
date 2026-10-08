import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon, BookmarkIcon, ItalicIcon } from "lucide-react"
import { Toggle } from "@amit-kap/glaze/components/toggle"

// Stories follow the upstream shadcn/ui (base-nova) Toggle examples:
// https://ui.shadcn.com/docs/components/base/toggle
const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component: "A two-state button that can be either on or off.",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
    defaultPressed: { control: "boolean" },
  },
  args: { "aria-label": "Toggle bookmark", size: "sm", variant: "outline" },
  render: (args) => (
    <Toggle {...args}>
      <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  ),
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

export const Pressed: Story = {
  args: { defaultPressed: true },
}

// --- Variants -------------------------------------------------------------

export const Outline: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <ItalicIcon />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <BoldIcon />
        Bold
      </Toggle>
    </div>
  ),
}

// --- Sizes ----------------------------------------------------------------

export const Size: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle small" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle default" size="default">
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle large" size="lg">
        Large
      </Toggle>
    </div>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle aria-label="Toggle disabled" disabled>
        Disabled
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle disabled outline" disabled>
        Disabled
      </Toggle>
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithText: Story = {
  render: () => (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  ),
}
