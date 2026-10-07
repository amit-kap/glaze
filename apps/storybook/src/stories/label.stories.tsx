import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@amitka/glaze/components/checkbox"
import { Input } from "@amitka/glaze/components/input"
import { Label } from "@amitka/glaze/components/label"

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          "Renders an accessible label associated with controls. Accepts all native `<label>` attributes.",
      },
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Jane Doe" />
    </div>
  ),
}
