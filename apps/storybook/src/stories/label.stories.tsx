import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import { Label } from "@amit-kap/glaze/components/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

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

// A label can be a tooltip trigger itself via `render`, for hint-on-hover
// text like what a token drives. The dotted underline marks it; the label
// still focuses its control on click.
export const WithTooltip: Story = {
  render: () => (
    <Field className="w-72">
      <Tooltip>
        <TooltipTrigger
          render={
            <FieldLabel
              htmlFor="token-brand"
              className="cursor-help underline decoration-muted-foreground/40 decoration-dotted underline-offset-4"
            />
          }
        >
          Brand
        </TooltipTrigger>
        <TooltipContent side="inline-start" className="font-mono">
          --primary --primary-subtle --primary-border --ring
        </TooltipContent>
      </Tooltip>
      <Input id="token-brand" placeholder="oklch(0.55 0.2 264)" />
    </Field>
  ),
}
