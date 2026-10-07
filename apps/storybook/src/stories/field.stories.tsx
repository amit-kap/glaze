import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amitka/glaze/components/button"
import { Checkbox } from "@amitka/glaze/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@amitka/glaze/components/field"
import { Input } from "@amitka/glaze/components/input"
import { Switch } from "@amitka/glaze/components/switch"
import { Textarea } from "@amitka/glaze/components/textarea"

const meta = {
  title: "Components/Field",
  component: Field,
  subcomponents: {
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Composes labels, controls, descriptions and errors into accessible form fields.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="field-username">Username</FieldLabel>
      <Input id="field-username" placeholder="shadcn" />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="field-email">Email</FieldLabel>
      <Input id="field-email" aria-invalid defaultValue="not-an-email" />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="field-marketing">Marketing emails</FieldLabel>
        <FieldDescription>
          Receive emails about new products and features.
        </FieldDescription>
      </FieldContent>
      <Switch id="field-marketing" />
    </Field>
  ),
}

export const Form: Story = {
  render: () => (
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>
            This information will be displayed publicly.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="form-name">Full name</FieldLabel>
              <Input id="form-name" placeholder="Jane Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="form-bio">Bio</FieldLabel>
              <Textarea
                id="form-bio"
                placeholder="Tell us a little about yourself"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend variant="label">Notifications</FieldLegend>
          <FieldGroup className="gap-3">
            <Field orientation="horizontal">
              <Checkbox id="form-comments" defaultChecked />
              <FieldLabel htmlFor="form-comments" className="font-normal">
                Comments
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="form-mentions" />
              <FieldLabel htmlFor="form-mentions" className="font-normal">
                Mentions
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit">Save</Button>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  ),
}

export const ChoiceCard: Story = {
  render: () => (
    <FieldLabel htmlFor="field-2fa">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Two-factor authentication</FieldTitle>
          <FieldDescription>
            Add an extra layer of security to your account.
          </FieldDescription>
        </FieldContent>
        <Switch id="field-2fa" defaultChecked />
      </Field>
    </FieldLabel>
  ),
}
