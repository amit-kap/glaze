import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { Label } from "@amit-kap/glaze/components/label"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "A control that allows the user to toggle between checked and not checked.",
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { defaultChecked: true } }
export const Disabled: Story = { args: { disabled: true } }

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-start gap-3">
      <Checkbox id="notifications" defaultChecked {...args} />
      <div className="grid gap-1.5">
        <Label htmlFor="notifications">Enable notifications</Label>
        <p className="text-sm text-muted-foreground">
          You can change this at any time.
        </p>
      </div>
    </div>
  ),
}
