import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
import { Textarea } from "@amit-kap/glaze/components/textarea"

// Stories follow the upstream shadcn/ui (base-nova) Textarea examples:
// https://ui.shadcn.com/docs/components/base/textarea
const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          "Displays a form textarea or a component that looks like a textarea. Accepts all native `<textarea>` attributes. Compose it with `Field` for a label, description and validation state.",
      },
    },
  },
  args: { placeholder: "Type your message here." },
  decorators: [
    (Story) => (
      <div className="w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
      <Textarea
        id="textarea-disabled"
        placeholder="Type your message here."
        disabled
      />
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="textarea-invalid">Message</FieldLabel>
      <Textarea
        id="textarea-invalid"
        placeholder="Type your message here."
        aria-invalid
      />
      <FieldDescription>Please enter a valid message.</FieldDescription>
    </Field>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithField: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea id="textarea-message" placeholder="Type your message here." />
    </Field>
  ),
}

export const WithButton: Story = {
  render: () => (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  ),
}
