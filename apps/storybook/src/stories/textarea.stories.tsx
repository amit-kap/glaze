import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "@workspace/ui/components/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { placeholder: "Type your message here." },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { "aria-invalid": true } }
