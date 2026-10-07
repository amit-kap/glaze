import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "@amitka/glaze/components/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          "Displays a form textarea or a component that looks like a textarea. Accepts all native `<textarea>` attributes.",
      },
    },
  },
  args: { placeholder: "Type your message here." },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { "aria-invalid": true } }
