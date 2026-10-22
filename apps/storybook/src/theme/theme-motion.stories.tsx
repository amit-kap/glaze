import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenPage } from "./token-page"

const meta = {
  title: "Theme",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true, hideNoControlsWarning: true },
    options: { showPanel: false },
  },
  tags: ["!autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Motion: Story = {
  render: () => <TokenPage sectionId="motion" />,
}
