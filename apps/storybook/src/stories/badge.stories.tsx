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
        "critical",
        "high",
        "medium",
        "low",
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
          "Severity scale from red to green: `variant=\"critical\" | \"high\" | \"medium\" | \"low\"`, using the severity tokens.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="critical">
        Critical
      </Badge>
      <Badge variant="high">
        High
      </Badge>
      <Badge variant="medium">
        Medium
      </Badge>
      <Badge variant="low">
        Low
      </Badge>
    </div>
  ),
}
