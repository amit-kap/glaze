import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "@amit-kap/glaze/components/slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          "An input where the user selects a value from within a given range.",
      },
    },
  },
  args: { defaultValue: [50], max: 100, step: 1 },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Range: Story = { args: { defaultValue: [25, 75] } }
export const Disabled: Story = { args: { disabled: true } }

export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: [40] },
  decorators: [
    (Story) => (
      <div className="h-48">
        <Story />
      </div>
    ),
  ],
}
