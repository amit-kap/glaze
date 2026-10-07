import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@amit-kap/glaze/components/progress"

const meta = {
  title: "Components/Progress",
  component: Progress,
  subcomponents: { ProgressLabel, ProgressValue },
  parameters: {
    docs: {
      description: {
        component:
          "Displays an indicator showing the completion progress of a task.",
      },
    },
  },
  args: { value: 60 },
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

export const Indeterminate: Story = { args: { value: null } }
