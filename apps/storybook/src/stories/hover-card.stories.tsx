import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amit-kap/glaze/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@amit-kap/glaze/components/hover-card"

// Stories follow the upstream shadcn/ui (base-nova) Hover Card examples:
// https://ui.shadcn.com/docs/components/base/hover-card
const meta = {
  title: "Components/Hover Card",
  component: HoverCardContent,
  subcomponents: { HoverCard, HoverCardTrigger },
  parameters: {
    docs: {
      description: {
        component:
          "For sighted users to preview content available behind a link. Set `delay` and `closeDelay` on the trigger to tune when it opens and closes.",
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
    <HoverCard>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={<Button variant="link" />}
      >
        Hover Here
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5" {...args}>
        <div className="font-semibold">@nextjs</div>
        <div>The React Framework – created and maintained by @vercel.</div>
        <div className="mt-1 text-caption text-muted-foreground">
          Joined December 2021
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCardContent>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

const HOVER_CARD_SIDES = ["left", "top", "bottom", "right"] as const

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-2">
      {HOVER_CARD_SIDES.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger
            delay={100}
            closeDelay={100}
            render={<Button variant="outline" className="capitalize" />}
          >
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side}>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Hover Card</h4>
              <p>This hover card appears on the {side} side of the trigger.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
}
