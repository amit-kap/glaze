import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@amitka/glaze/components/toggle-group"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  subcomponents: { ToggleGroupItem },
  parameters: {
    docs: {
      description: {
        component: "A set of two-state buttons that can be toggled on or off.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "outline"] },
    size: { control: "radio", options: ["sm", "default", "lg"] },
    spacing: { control: { type: "number", min: 0, max: 4 } },
  },
  args: { variant: "outline" },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Single: Story = {
  args: { defaultValue: ["left"], spacing: 0 },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}
