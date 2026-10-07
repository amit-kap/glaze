import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "@amit-kap/glaze/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@amit-kap/glaze/components/radio-group"

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  subcomponents: { RadioGroupItem },
  parameters: {
    docs: {
      description: {
        component:
          "A set of checkable buttons — known as radio buttons — where no more than one can be checked at a time.",
      },
    },
  },
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
