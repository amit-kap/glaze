import type { Meta, StoryObj } from "@storybook/react-vite"
import { AspectRatio } from "@amit-kap/glaze/components/aspect-ratio"

// Stories follow the upstream shadcn/ui (base-nova) Aspect Ratio examples:
// https://ui.shadcn.com/docs/components/base/aspect-ratio
// Upstream fills the frame with `next/image`; an absolutely positioned
// <img> does the same here.
const meta = {
  title: "Components/Aspect Ratio",
  component: AspectRatio,
  parameters: {
    docs: {
      description: {
        component: "Displays content within a desired ratio.",
      },
    },
  },
  args: { ratio: 16 / 9 },
  argTypes: {
    ratio: { control: { type: "number", min: 0.25, max: 4, step: 0.05 } },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

function Photo() {
  return (
    <img
      src="https://avatar.vercel.sh/shadcn1"
      alt="Photo"
      className="absolute inset-0 size-full rounded-lg object-cover grayscale dark:brightness-20"
    />
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <AspectRatio {...args} className="w-sm rounded-lg bg-muted">
      <Photo />
    </AspectRatio>
  ),
}

// --- Variants -------------------------------------------------------------

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1 / 1} className="w-[12rem] rounded-lg bg-muted">
      <Photo />
    </AspectRatio>
  ),
}

export const Portrait: Story = {
  render: () => (
    <AspectRatio ratio={9 / 16} className="w-[10rem] rounded-lg bg-muted">
      <Photo />
    </AspectRatio>
  ),
}
