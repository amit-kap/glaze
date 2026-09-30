import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  subcomponents: { KbdGroup },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a keyboard key or shortcut. Accepts all native `<kbd>` attributes.",
      },
    },
  },
  args: { children: "K" },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Group: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 text-sm">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <p className="text-muted-foreground">
        Press{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar.
      </p>
    </div>
  ),
}
