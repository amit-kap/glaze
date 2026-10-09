import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@amit-kap/glaze/components/alert"
import { Button } from "@amit-kap/glaze/components/button"

// Stories follow the upstream shadcn/ui (base-nova) Alert examples:
// https://ui.shadcn.com/docs/components/base/alert
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
    variant: { control: "inline-radio", options: ["default", "destructive"] },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <div className="grid w-md items-start gap-4">
      <Alert {...args}>
        <CheckCircle2Icon />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert {...args}>
        <InfoIcon />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const Basic: Story = {
  render: () => (
    <Alert className="w-md">
      <CheckCircle2Icon />
      <AlertTitle>Account updated successfully</AlertTitle>
      <AlertDescription>
        Your profile information has been saved. Changes will be reflected
        immediately.
      </AlertDescription>
    </Alert>
  ),
}

// --- Variants -------------------------------------------------------------

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-md">
      <AlertCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Your payment could not be processed. Please check your payment method
        and try again.
      </AlertDescription>
    </Alert>
  ),
}

// Override the border, background and text colors with classes.
export const CustomColors: Story = {
  render: () => (
    <Alert className="w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon />
      <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
      <AlertDescription>
        Renew now to avoid service interruption or upgrade to a paid plan to
        continue using the service.
      </AlertDescription>
    </Alert>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Action: Story = {
  render: () => (
    <Alert className="w-md">
      <AlertTitle>Dark mode is now available</AlertTitle>
      <AlertDescription>
        Enable it under your profile settings to get started.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="default">
          Enable
        </Button>
      </AlertAction>
    </Alert>
  ),
}
