import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "Email", type: "email" },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } }
export const File: Story = { args: { type: "file", placeholder: undefined } }
