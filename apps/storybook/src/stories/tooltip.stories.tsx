import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@workspace/ui/components/button"
import { Kbd } from "@workspace/ui/components/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

type Side = "top" | "right" | "bottom" | "left"

function TooltipDemo({ side = "top", label = "Add to library" }: { side?: Side; label?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" className="capitalize" />}>
        {side}
      </TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}

const meta = {
  title: "Components/Tooltip",
  component: TooltipDemo,
  argTypes: { side: { control: "radio", options: ["top", "right", "bottom", "left"] } },
} satisfies Meta<typeof TooltipDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { side: "top" } }

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <TooltipDemo key={side} side={side} />
      ))}
    </div>
  ),
}

export const WithKbd: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>Save</TooltipTrigger>
      <TooltipContent>
        Save changes <Kbd>⌘S</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
}
