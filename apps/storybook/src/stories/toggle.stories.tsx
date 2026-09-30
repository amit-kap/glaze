import type { Meta, StoryObj } from "@storybook/react-vite"
import { Toggle } from "@workspace/ui/components/toggle"
import { BoldIcon, ItalicIcon } from "lucide-react"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component: "A two-state button that can be either on or off.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "outline"] },
    size: { control: "radio", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
  },
  args: { "aria-label": "Toggle bold" },
  render: (args) => (
    <Toggle {...args}>
      <BoldIcon />
    </Toggle>
  ),
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Outline: Story = { args: { variant: "outline" } }
export const Pressed: Story = { args: { defaultPressed: true } }
export const Disabled: Story = { args: { disabled: true } }

export const WithText: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  ),
}
