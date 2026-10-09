import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon } from "lucide-react"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import { Input } from "@amit-kap/glaze/components/input"
import { Label } from "@amit-kap/glaze/components/label"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@amit-kap/glaze/components/toggle-group"

// Stories follow the upstream shadcn/ui (base-nova) Card examples:
// https://ui.shadcn.com/docs/components/base/card
const meta = {
  title: "Components/Card",
  component: Card,
  subcomponents: {
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Displays a card with header, content, and footer. `size="sm"` tightens the spacing; override `--card-spacing` for custom padding.',
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

function LoginForm({ id }: { id: string }) {
  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor={`email-${id}`}>Email</Label>
          <Input
            id={`email-${id}`}
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor={`password-${id}`}>Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-body underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id={`password-${id}`} type="password" required />
        </div>
      </div>
    </form>
  )
}

function LoginCard({
  id,
  ...props
}: React.ComponentProps<typeof Card> & { id: string }) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LoginForm id={id} />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => <LoginCard id="demo" className="w-sm" {...args} />,
}

// --- Sizes ----------------------------------------------------------------

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-xs">
      <CardHeader>
        <CardTitle>Scheduled reports</CardTitle>
        <CardDescription>
          Weekly snapshots. No more manual exports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 py-2 text-body">
          {[
            "Choose a schedule (daily, or weekly).",
            "Send to channels or specific teammates.",
            "Include charts, tables, and key metrics.",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="sm" className="w-full">
          Set up scheduled reports
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          See what&apos;s new
        </Button>
      </CardFooter>
    </Card>
  ),
}

const spacingOptions = [
  { className: "[--card-spacing:--spacing(4)]", label: "16px", value: "4" },
  { className: "[--card-spacing:--spacing(5)]", label: "20px", value: "5" },
  { className: "[--card-spacing:--spacing(6)]", label: "24px", value: "6" },
  { className: "[--card-spacing:--spacing(8)]", label: "32px", value: "8" },
]

// Set `--card-spacing` to change the padding and gaps together.
export const Spacing: Story = {
  render: function Render() {
    const [spacing, setSpacing] = React.useState("4")
    const selectedSpacing = spacingOptions.find(
      (option) => option.value === spacing
    )

    return (
      <div className="grid w-sm gap-4">
        <ToggleGroup
          value={[spacing]}
          onValueChange={(value) => {
            if (value[0]) {
              setSpacing(value[0])
            }
          }}
          variant="outline"
          size="sm"
          className="justify-center"
        >
          {spacingOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <LoginCard id="spacing" className={selectedSpacing?.className} />
      </div>
    )
  },
}

// Negative `--card-spacing` margins let content run to the card's edges.
export const EdgeToEdge: Story = {
  render: () => (
    <Card className="w-sm">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>
          Review the terms before accepting the agreement.
        </CardDescription>
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) max-h-48 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-body leading-relaxed">
          <p>
            These terms govern your use of the workspace, including access to
            shared documents, project files, and collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring that
            your team has the appropriate permissions to view or edit it.
          </p>
          <p>
            We may update features or limits as the service evolves. When those
            changes materially affect your workflow, we will notify your
            workspace administrators.
          </p>
          <p>
            By continuing, you agree to keep your account credentials secure and
            to follow your organization&apos;s acceptable use policies.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </CardFooter>
    </Card>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Image: Story = {
  render: () => (
    <Card className="relative w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  ),
}
