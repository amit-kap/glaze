import type { Meta, StoryObj } from "@storybook/react-vite"
import { SaveIcon } from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import { Kbd } from "@amit-kap/glaze/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

// Stories follow the upstream shadcn/ui (base-nova) Tooltip examples:
// https://ui.shadcn.com/docs/components/base/tooltip
// The Storybook preview wraps every story in a TooltipProvider.
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
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  render: (args) => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover
      </TooltipTrigger>
      <TooltipContent {...args}>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
} satisfies Meta<typeof TooltipContent>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

export const Side: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["left", "top", "bottom", "right"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger
            render={<Button variant="outline" className="w-fit capitalize" />}
          >
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithKeyboardShortcut: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Save changes" />
        }
      >
        <SaveIcon />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  ),
}

// Disabled buttons don't fire pointer events, so wrap them in a span trigger.
export const DisabledButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-block w-fit" />}>
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This feature is currently unavailable</p>
      </TooltipContent>
    </Tooltip>
  ),
}
