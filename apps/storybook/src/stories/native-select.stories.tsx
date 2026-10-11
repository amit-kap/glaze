import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@amit-kap/glaze/components/native-select"

// Stories follow the upstream shadcn/ui (base-nova) Native Select examples:
// https://ui.shadcn.com/docs/components/base/native-select
const meta = {
  title: "Components/Native Select",
  component: NativeSelect,
  subcomponents: { NativeSelectOptGroup, NativeSelectOption },
  parameters: {
    docs: {
      description: {
        component:
          "A styled native HTML select element with consistent design system integration. Use it for native browser behavior, better performance or mobile-optimized dropdowns; use `Select` for custom styling, animations or complex interactions.",
      },
    },
  },
  args: { "aria-label": "Status" },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value="">Select status</NativeSelectOption>
      <NativeSelectOption value="todo">Todo</NativeSelectOption>
      <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
      <NativeSelectOption value="done">Done</NativeSelectOption>
      <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
    </NativeSelect>
  ),
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Sizes ----------------------------------------------------------------

export const Small: Story = {
  args: { size: "sm" },
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  args: { "aria-label": "Fruit" },
  render: (args) => (
    <NativeSelect {...args} disabled>
      <NativeSelectOption value="">Disabled</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  ),
}

export const Invalid: Story = {
  args: { "aria-label": "Fruit" },
  render: (args) => (
    <NativeSelect {...args} aria-invalid="true">
      <NativeSelectOption value="">Error state</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithGroups: Story = {
  args: { "aria-label": "Department" },
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value="">Select department</NativeSelectOption>
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
        <NativeSelectOption value="devops">DevOps</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Sales">
        <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
        <NativeSelectOption value="account-manager">
          Account Manager
        </NativeSelectOption>
        <NativeSelectOption value="sales-director">
          Sales Director
        </NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Operations">
        <NativeSelectOption value="support">
          Customer Support
        </NativeSelectOption>
        <NativeSelectOption value="product-manager">
          Product Manager
        </NativeSelectOption>
        <NativeSelectOption value="ops-manager">
          Operations Manager
        </NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}
