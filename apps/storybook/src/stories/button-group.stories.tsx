import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amit-kap/glaze/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@amit-kap/glaze/components/button-group"
import { Input } from "@amit-kap/glaze/components/input"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"

const meta = {
  title: "Components/Button Group",
  component: ButtonGroup,
  subcomponents: { ButtonGroupSeparator, ButtonGroupText },
  parameters: {
    docs: {
      description: {
        component:
          "A container that groups related buttons together with consistent styling.",
      },
    },
  },
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Go back">
        <ArrowLeftIcon />
      </Button>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline" size="icon" aria-label="Go forward">
        <ArrowRightIcon />
      </Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon" aria-label="Increase">
        <PlusIcon />
      </Button>
      <Button variant="outline" size="icon" aria-label="Decrease">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  ),
}

export const Split: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Deploy</Button>
      <ButtonGroupSeparator />
      <Button size="icon" aria-label="More options">
        <ChevronDownIcon />
      </Button>
    </ButtonGroup>
  ),
}

export const WithInput: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>https://</ButtonGroupText>
      <Input placeholder="example.com" className="w-48" />
      <Button variant="outline">Go</Button>
    </ButtonGroup>
  ),
}
