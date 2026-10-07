import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amit-kap/glaze/components/button"
import { Kbd } from "@amit-kap/glaze/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

type Side = React.ComponentProps<typeof TooltipContent>["side"]

function TooltipDemo({
  side = "top",
  label = "Add to library",
}: {
  side?: Side
  label?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="outline" className="capitalize" />}
      >
        {side}
      </TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  )
}

const meta = {
  title: "Components/Tooltip",
  component: TooltipContent,
  subcomponents: { Tooltip, TooltipTrigger },
  parameters: {
    docs: {
      description: {
        component:
          "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      },
    },
  },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
  },
  render: (args) => <TooltipDemo side={args.side} />,
} satisfies Meta<typeof TooltipContent>

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
      <TooltipTrigger render={<Button variant="outline" />}>
        Save
      </TooltipTrigger>
      <TooltipContent>
        Save changes <Kbd>⌘S</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
}
