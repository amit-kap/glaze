import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { RefreshCwIcon } from "lucide-react"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@amit-kap/glaze/components/input-otp"

// Stories follow the upstream shadcn/ui (base-nova) Input OTP examples:
// https://ui.shadcn.com/docs/components/base/input-otp
const meta = {
  title: "Components/Input OTP",
  component: InputOTP,
  subcomponents: { InputOTPGroup, InputOTPSeparator, InputOTPSlot },
  parameters: {
    docs: {
      description: {
        component:
          "Accessible one-time password component with copy paste functionality. Built on [input-otp](https://github.com/guilhermerodz/input-otp); compose `InputOTPGroup`, `InputOTPSlot` and `InputOTPSeparator` inside it.",
      },
    },
  },
  // Slots are composed in each render function; children is a required prop.
  args: { maxLength: 6, children: null },
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

// `count` consecutive slots starting at `from`; `invalid` marks each slot.
function SlotGroup({
  from,
  count,
  invalid,
  className,
}: {
  from: number
  count: number
  invalid?: boolean
  className?: string
}) {
  return (
    <InputOTPGroup className={className}>
      {Array.from({ length: count }, (_, i) => (
        <InputOTPSlot key={from + i} index={from + i} aria-invalid={invalid} />
      ))}
    </InputOTPGroup>
  )
}

// --- Basic ----------------------------------------------------------------

// Upstream passes `defaultValue`, but input-otp already controls its <input>,
// so React warns about both props; seed state instead.
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState("123456")

    return (
      <InputOTP
        maxLength={6}
        value={value}
        onChange={setValue}
        disabled={args.disabled}
      >
        <SlotGroup from={0} count={6} />
      </InputOTP>
    )
  },
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <InputOTP id="disabled" maxLength={6} disabled value="123456">
      <SlotGroup from={0} count={3} />
      <InputOTPSeparator />
      <SlotGroup from={3} count={3} />
    </InputOTP>
  ),
}

// Set `aria-invalid` on each slot to show an error state.
export const Invalid: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("000000")

    return (
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <SlotGroup from={0} count={2} invalid />
        <InputOTPSeparator />
        <SlotGroup from={2} count={2} invalid />
        <InputOTPSeparator />
        <SlotGroup from={4} count={2} invalid />
      </InputOTP>
    )
  },
}

// --- Variants -------------------------------------------------------------

// Use `pattern` to restrict input; input-otp exports common regexes.
export const Pattern: Story = {
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
      <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <SlotGroup from={0} count={6} />
      </InputOTP>
    </Field>
  ),
}

export const Separator: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <SlotGroup from={0} count={2} />
      <InputOTPSeparator />
      <SlotGroup from={2} count={2} />
      <InputOTPSeparator />
      <SlotGroup from={4} count={2} />
    </InputOTP>
  ),
}

export const FourDigits: Story = {
  render: () => (
    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
      <SlotGroup from={0} count={4} />
    </InputOTP>
  ),
}

export const Alphanumeric: Story = {
  render: () => (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
      <SlotGroup from={0} count={3} />
      <InputOTPSeparator />
      <SlotGroup from={3} count={3} />
    </InputOTP>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("")

    return (
      <div className="space-y-2">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <SlotGroup from={0} count={6} />
        </InputOTP>
        <div className="text-center text-body">
          {value === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
      </div>
    )
  },
}

const largeSlots =
  "*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-title"

export const Form: Story = {
  render: () => (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{" "}
          <span className="font-medium">m@example.com</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">
              Verification code
            </FieldLabel>
            <Button variant="outline" size="xs">
              <RefreshCwIcon />
              Resend Code
            </Button>
          </div>
          <InputOTP maxLength={6} id="otp-verification" required>
            <SlotGroup from={0} count={3} className={largeSlots} />
            {/* InputOTPSeparator replaces (not merges) its base classes, so restate them. */}
            <InputOTPSeparator className="mx-2 flex items-center" />
            <SlotGroup from={3} count={3} className={largeSlots} />
          </InputOTP>
          <FieldDescription>
            <a href="#">I no longer have access to this email address.</a>
          </FieldDescription>
        </Field>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="submit" className="w-full">
            Verify
          </Button>
          <div className="text-body text-muted-foreground">
            Having trouble signing in?{" "}
            <a
              href="#"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact support
            </a>
          </div>
        </Field>
      </CardFooter>
    </Card>
  ),
}
