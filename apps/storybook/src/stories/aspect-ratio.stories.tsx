import type { Meta, StoryObj } from "@storybook/react-vite"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"

const meta = {
  title: "Components/Aspect Ratio",
  component: AspectRatio,
  args: { ratio: 16 / 9 },
  argTypes: { ratio: { control: { type: "number", step: 0.1 } } },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-96">
      <AspectRatio {...args} className="overflow-hidden rounded-lg bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = { ...Default, args: { ratio: 1 } }
