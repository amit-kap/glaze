import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@workspace/ui/components/native-select"

const meta = {
  title: "Components/Native Select",
  component: NativeSelect,
  argTypes: {
    size: { control: "radio", options: ["default", "sm"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOption value="">Select status</NativeSelectOption>
      <NativeSelectOption value="todo">Todo</NativeSelectOption>
      <NativeSelectOption value="in-progress">In progress</NativeSelectOption>
      <NativeSelectOption value="done">Done</NativeSelectOption>
    </NativeSelect>
  ),
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = { args: { size: "sm" } }
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { "aria-invalid": true } }

export const Groups: Story = {
  render: (args) => (
    <NativeSelect {...args}>
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Design">
        <NativeSelectOption value="product">Product design</NativeSelectOption>
        <NativeSelectOption value="brand">Brand</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}
