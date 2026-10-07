import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@amit-kap/glaze/components/badge"
import { BadgeCheckIcon } from "lucide-react"

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component: "Displays a badge or a component that looks like a badge.",
      },
    },
  },
  args: { children: "Badge" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Badge variant="secondary">
      <BadgeCheckIcon />
      Verified
    </Badge>
  ),
}

export const Severity: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Severity scale from red to green, using the severity tokens: `bg-severity-*/10 text-severity-*`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="bg-severity-critical/10 text-severity-critical dark:bg-severity-critical/20">
        Critical
      </Badge>
      <Badge className="bg-severity-high/10 text-severity-high dark:bg-severity-high/20">
        High
      </Badge>
      <Badge className="bg-severity-medium/10 text-severity-medium dark:bg-severity-medium/20">
        Medium
      </Badge>
      <Badge className="bg-severity-low/10 text-severity-low dark:bg-severity-low/20">
        Low
      </Badge>
    </div>
  ),
}
