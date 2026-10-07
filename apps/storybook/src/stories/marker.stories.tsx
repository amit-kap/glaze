import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@amitka/glaze/components/marker"
import { ClockIcon } from "lucide-react"

const meta = {
  title: "Components/Marker",
  component: Marker,
  subcomponents: { MarkerContent, MarkerIcon },
  parameters: {
    docs: {
      description: {
        component:
          "An inline annotation — such as a timestamp or divider — for feeds and conversations.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "separator", "border"] },
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Marker {...args}>
      <MarkerIcon>
        <ClockIcon />
      </MarkerIcon>
      <MarkerContent>Conversation resumed 2 hours ago</MarkerContent>
    </Marker>
  ),
}

export const Separator: Story = {
  args: { variant: "separator" },
  render: (args) => (
    <Marker {...args}>
      <MarkerContent>Today</MarkerContent>
    </Marker>
  ),
}

export const Border: Story = {
  args: { variant: "border" },
  render: (args) => (
    <Marker {...args}>
      <MarkerContent>
        Thread started by Jane. <a href="#">View original</a>
      </MarkerContent>
    </Marker>
  ),
}
