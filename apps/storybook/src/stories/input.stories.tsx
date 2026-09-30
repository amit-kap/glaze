import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "Displays a form input field or a component that looks like an input field. Accepts all native `<input>` attributes.",
      },
    },
  },
  args: { placeholder: "Email", type: "email" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
}
export const File: Story = { args: { type: "file", placeholder: undefined } }
