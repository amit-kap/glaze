import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRightIcon, BadgeCheckIcon, BookmarkIcon } from "lucide-react"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Spinner } from "@amit-kap/glaze/components/spinner"

// Stories follow the upstream shadcn/ui (base-nova) Badge examples:
// https://ui.shadcn.com/docs/components/base/badge
const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          "Displays a badge or a component that looks like a badge. Mark icons with `data-icon=\"inline-start\"` or `data-icon=\"inline-end\"` so the padding adjusts. Use the `render` prop to render it as a link.",
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

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}

// Glaze-only: replaces upstream's "Custom Colors", which hard-codes Tailwind
// palette classes instead of theme tokens.
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
    <div className="flex flex-wrap gap-2">
      <Badge variant="critical">Critical</Badge>
      <Badge variant="high">High</Badge>
      <Badge variant="medium">Medium</Badge>
      <Badge variant="low">Low</Badge>
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <BadgeCheckIcon data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <BookmarkIcon data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

export const WithSpinner: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="destructive">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge variant="secondary">
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

export const AsLink: Story = {
  render: () => (
    <Badge render={<a href="#link" />}>
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </Badge>
  ),
}
