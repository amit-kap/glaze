import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@amit-kap/glaze/components/alert"
import { Button } from "@amit-kap/glaze/components/button"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"

const meta = {
  title: "Components/Alert",
  component: Alert,
  subcomponents: { AlertAction, AlertDescription, AlertTitle },
  parameters: {
    docs: {
      description: {
        component: "Displays a callout for user attention.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "destructive"] },
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <CheckCircle2Icon />
      <AlertTitle>Success! Your changes have been saved</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <AlertCircleIcon />
      <AlertTitle>Unable to process your payment.</AlertTitle>
      <AlertDescription>
        Please verify your billing information and try again.
      </AlertDescription>
    </Alert>
  ),
}

export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>A new version is available</AlertTitle>
      <AlertDescription>Reload to get the latest features.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Reload
        </Button>
      </AlertAction>
    </Alert>
  ),
}
