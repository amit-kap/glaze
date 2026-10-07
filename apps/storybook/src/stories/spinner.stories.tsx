import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amitka/glaze/components/button"
import { Spinner } from "@amitka/glaze/components/spinner"

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          "An indicator that can be used to show a loading state. Accepts all native `<svg>` attributes.",
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner data-icon="inline-start" />
      Loading…
    </Button>
  ),
}
