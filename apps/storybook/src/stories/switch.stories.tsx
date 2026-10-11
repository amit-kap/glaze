import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@amit-kap/glaze/components/field"
import { Label } from "@amit-kap/glaze/components/label"
import { Switch } from "@amit-kap/glaze/components/switch"

// Stories follow the upstream shadcn/ui (base-nova) Switch examples:
// https://ui.shadcn.com/docs/components/base/switch
const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          "A control that allows the user to toggle between checked and not checked. Compose it with `Field` and `FieldLabel` for a label, description and validation state.",
      },
    },
  },
  args: { "aria-label": "Airplane Mode" },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

// --- Sizes ----------------------------------------------------------------

export const Size: Story = {
  render: () => (
    <FieldGroup className="w-40">
      <Field orientation="horizontal">
        <Switch id="switch-size-sm" size="sm" />
        <FieldLabel htmlFor="switch-size-sm">Small</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="switch-size-default" size="default" />
        <FieldLabel htmlFor="switch-size-default">Default</FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <Field orientation="horizontal" data-disabled className="w-fit">
      <Switch id="switch-disabled-unchecked" disabled />
      <FieldLabel htmlFor="switch-disabled-unchecked">Disabled</FieldLabel>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-sm" data-invalid>
      <FieldContent>
        <FieldLabel htmlFor="switch-terms">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          You must accept the terms and conditions to continue.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-terms" aria-invalid />
    </Field>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-sm">
      <FieldContent>
        <FieldLabel htmlFor="switch-focus-mode">
          Share across devices
        </FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-focus-mode" />
    </Field>
  ),
}

// Wrap Field in FieldLabel to make the whole card a toggle target.
export const WithChoiceCard: Story = {
  render: () => (
    <FieldGroup className="w-sm">
      <FieldLabel htmlFor="switch-share">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Share across devices</FieldTitle>
            <FieldDescription>
              Focus is shared across devices, and turns off when you leave the
              app.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-share" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="switch-notifications">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              Receive notifications when focus mode is enabled or disabled.
            </FieldDescription>
          </FieldContent>
          <Switch id="switch-notifications" defaultChecked />
        </Field>
      </FieldLabel>
    </FieldGroup>
  ),
}
