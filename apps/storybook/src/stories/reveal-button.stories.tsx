import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CopyIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react"

import { RevealButton } from "@amit-kap/glaze/components/reveal-button"

const meta = {
  title: "Components/RevealButton",
  component: RevealButton,
  parameters: {
    docs: {
      description: {
        component:
          "A square icon button that opens sideways on hover or keyboard focus to reveal its label, then folds back. The label is also the button's accessible name, so no `aria-label` is needed. `iconSide=\"end\"` reveals the label to the icon's other side. Use for dense toolbars and action rows where icons alone would be cryptic.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "default", "lg"],
    },
    iconSide: {
      control: "inline-radio",
      options: ["start", "end"],
    },
    label: { control: "text" },
  },
} satisfies Meta<typeof RevealButton>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  args: { label: "Create" },
  render: (args) => (
    <RevealButton {...args}>
      <PlusIcon />
    </RevealButton>
  ),
}

// --- Variants and sizes ----------------------------------------------------

export const Variants: Story = {
  args: { label: "Action" },
  render: () => (
    <div className="flex items-center gap-3">
      <RevealButton variant="default" label="Create">
        <PlusIcon />
      </RevealButton>
      <RevealButton variant="outline" label="Search">
        <SearchIcon />
      </RevealButton>
      <RevealButton variant="secondary" label="Copy">
        <CopyIcon />
      </RevealButton>
      <RevealButton variant="ghost" label="Share">
        <ShareIcon />
      </RevealButton>
      <RevealButton variant="destructive" label="Delete">
        <Trash2Icon />
      </RevealButton>
    </div>
  ),
}

export const Sizes: Story = {
  args: { label: "Action" },
  render: () => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <RevealButton key={size} variant="outline" size={size} label={size}>
          <SettingsIcon />
        </RevealButton>
      ))}
    </div>
  ),
}

// Icon at the end: the label reveals to its side and pushes it outward.
export const IconEnd: Story = {
  args: { label: "Action" },
  render: () => (
    <div className="flex items-center gap-3">
      <RevealButton variant="default" iconSide="end" label="Create">
        <PlusIcon />
      </RevealButton>
      <RevealButton variant="outline" iconSide="end" label="Search">
        <SearchIcon />
      </RevealButton>
      <RevealButton variant="secondary" iconSide="end" label="Copy">
        <CopyIcon />
      </RevealButton>
      <RevealButton variant="ghost" iconSide="end" label="Share">
        <ShareIcon />
      </RevealButton>
      <RevealButton variant="destructive" iconSide="end" label="Delete">
        <Trash2Icon />
      </RevealButton>
    </div>
  ),
}

// --- Compositions ----------------------------------------------------------

// A toolbar row: the icons stay compact until each is hovered or focused.
export const InToolbar: Story = {
  args: { label: "Action" },
  render: () => (
    <div className="flex items-center gap-1 rounded-container border bg-popover p-1.5 shadow-floating">
      <RevealButton variant="ghost" size="sm" label="Edit">
        <PencilIcon />
      </RevealButton>
      <RevealButton variant="ghost" size="sm" label="Copy">
        <CopyIcon />
      </RevealButton>
      <RevealButton variant="ghost" size="sm" label="Download">
        <DownloadIcon />
      </RevealButton>
      <RevealButton variant="ghost" size="sm" label="Delete">
        <Trash2Icon />
      </RevealButton>
    </div>
  ),
}
