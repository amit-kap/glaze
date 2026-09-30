import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable" {...args}>
      {["default", "comfortable", "compact"].map((value) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem value={value} id={`density-${value}`} />
          <Label htmlFor={`density-${value}`} className="capitalize">
            {value}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}
