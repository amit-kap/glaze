import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import { Label } from "@amit-kap/glaze/components/label"

// Stories follow the upstream shadcn/ui (base-nova) Label examples:
// https://ui.shadcn.com/docs/components/base/label
const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          "Renders an accessible label associated with controls. Accepts all native `<label>` attributes. For form fields, prefer `Field` with `FieldLabel`, which adds description and error handling.",
      },
    },
  },
  args: { children: "Your email address" },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Compositions ---------------------------------------------------------

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Your email address</Label>
      <Input id="email" type="email" />
    </div>
  ),
}

// Upstream "Label in Field": FieldLabel is the Field-aware Label.
export const InField: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="field-email">Your email address</FieldLabel>
      <Input id="field-email" type="email" />
    </Field>
  ),
}
