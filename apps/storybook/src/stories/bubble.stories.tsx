import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, ChevronDownIcon, InfoIcon } from "lucide-react"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@amit-kap/glaze/components/bubble"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@amit-kap/glaze/components/popover"
import { Toaster, createToastManager } from "@amit-kap/glaze/components/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

// Stories follow the upstream shadcn/ui (base-nova) Bubble examples:
// https://ui.shadcn.com/docs/components/base/bubble
// Upstream's sonner toasts use Glaze's toast, with a manager per story so the
// Docs page doesn't show each toast twice.
const meta = {
  title: "Components/Bubble",
  component: Bubble,
  subcomponents: { BubbleContent, BubbleGroup, BubbleReactions },
  parameters: {
    docs: {
      description: {
        component:
          'A chat bubble for a single message. `align="end"` puts it on the user\'s side, `BubbleGroup` stacks consecutive messages, and `BubbleReactions` pins reactions or actions to an edge.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-sm flex-col">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "muted",
        "tinted",
        "outline",
        "ghost",
        "destructive",
      ],
    },
    align: { control: "inline-radio", options: ["start", "end"] },
  },
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Bubble align="end">
        <BubbleContent>Hey there! what&apos;s up?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Hey! Want to see chat bubbles?</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            I can group messages, switch sides, and keep the whole thread easy
            to scan.
          </BubbleContent>
          <BubbleReactions role="img" aria-label="Reaction: thumbs up">
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <Bubble align="end">
        <BubbleContent>Sure. Hit me with your best demo.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Yes. You are reading a demo that is demoing itself. Very meta. Very
          on-brand.
        </BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reactions: thumbs up, fire, eyes, and 2 more"
        >
          <span>👍</span>
          <span>🔥</span>
          <span>👀</span>
          <span>+2</span>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

// --- Variants -------------------------------------------------------------

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <Bubble>
        <BubbleContent>This is the default primary bubble.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>This is the secondary variant.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          This one is muted. It uses a lower emphasis color for the chat bubble.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>
          This one is tinted. The tint is a softer color derived from the
          primary color.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>We can also use an outlined variant.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>Or a destructive variant with a reaction.</BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      {/* Upstream renders this text through a Markdown component. */}
      <Bubble variant="ghost">
        <BubbleContent className="space-y-3">
          <p>
            Ghost bubbles work for assistant text, <strong>markdown</strong>,
            and other content that should not be framed.
          </p>
          <p>
            This is perfect for assistant messages that should not have a frame
            and can take the full width of the container. You can also render{" "}
            <code>code</code> in it.
          </p>
          <p>
            Ghost bubbles are full width and can take the full width of the
            container.
          </p>
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Bubble variant="muted">
        <BubbleContent>
          This bubble is aligned to the start. This is the default alignment.
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          This bubble is aligned to the end. Use this for user messages.
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Bubble variant="muted">
        <BubbleContent>Can you tell me what&apos;s the issue?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>You tell me!</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>It worked yesterday. You broke it!</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>Find the bug and fix it.</BubbleContent>
          <BubbleReactions aria-label="Reactions: eyes" align="start">
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
      </BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>
          Want me to diff yesterday&apos;s you against today&apos;s you?
          It&apos;s a bit embarrassing.
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

const linkToast = createToastManager()

// Render `BubbleContent` as a button or link to make the bubble actionable.
export const LinksAndButtons: Story = {
  render: () => (
    <Toaster toastManager={linkToast}>
      <div className="flex flex-col gap-8">
        <Bubble variant="muted">
          <BubbleContent>How can I help you today?</BubbleContent>
        </Bubble>
        <BubbleGroup>
          {[
            ["I forgot my password", "You clicked forgot password"],
            [
              "I need help with my subscription",
              "You clicked help with subscription",
            ],
            [
              "Something else. Talk to a human.",
              "You clicked something else. Talk to a human.",
            ],
          ].map(([label, message]) => (
            <Bubble key={label} variant="tinted" align="end">
              <BubbleContent
                render={
                  <button onClick={() => linkToast.add({ title: message })} />
                }
              >
                {label}
              </BubbleContent>
            </Bubble>
          ))}
        </BubbleGroup>
      </div>
    </Toaster>
  ),
}

const reactionToast = createToastManager()

// `side` and `align` pin reactions to a corner; they can hold buttons too.
export const Reactions: Story = {
  render: () => (
    <Toaster toastManager={reactionToast}>
      <div className="flex flex-col gap-12">
        <Bubble variant="muted" align="end">
          <BubbleContent>
            I don&apos;t need tests, I know my code works.
          </BubbleContent>
          <BubbleReactions
            align="start"
            role="img"
            aria-label="Reactions: thumbs up, surprised"
          >
            <span>👍</span>
            <span>😮</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            Bold. Fine I&apos;ll add some tests. I&apos;ll let you know when
            they&apos;re done.
          </BubbleContent>
          <BubbleReactions
            role="img"
            aria-label="Reactions: eyes, rocket, and 2 more"
          >
            <span>👀</span>
            <span>🚀</span>
            <span>+2</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="default" align="end">
          <BubbleContent>
            Tests passed on the first try. All 142 of them. Looking good!
          </BubbleContent>
          <BubbleReactions
            side="top"
            align="start"
            role="img"
            aria-label="Reactions: party popper, clapping hands"
          >
            <span>🎉</span>
            <span>👏</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="destructive">
          <BubbleContent>Are you sure I can run this command?</BubbleContent>
          <BubbleReactions>
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                reactionToast.add({
                  type: "success",
                  title: "You clicked yes, running command...",
                })
              }
            >
              Yes, run it
            </Button>
          </BubbleReactions>
        </Bubble>
      </div>
    </Toaster>
  ),
}

const longText = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`

const previewLength = 180

export const ShowMore: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    const isLong = longText.length > previewLength
    const preview = `${longText.slice(0, previewLength)}...`

    return (
      <div className="flex flex-col gap-8">
        <Bubble variant="muted">
          <BubbleContent>How can I help you today?</BubbleContent>
        </Bubble>
        <Bubble variant="muted" align="end">
          <BubbleContent className="whitespace-pre-line">
            <Collapsible open={open} onOpenChange={setOpen}>
              <div>{open || !isLong ? longText : preview}</div>
              {isLong ? (
                <CollapsibleTrigger
                  render={
                    <Button
                      variant="link"
                      className="gap-1 p-0 text-muted-foreground"
                    />
                  }
                >
                  {open ? "Show less" : "Show more"}
                  <ChevronDownIcon
                    data-icon="inline-end"
                    className="group-data-panel-open/button:rotate-180"
                  />
                </CollapsibleTrigger>
              ) : null}
            </Collapsible>
          </BubbleContent>
        </Bubble>
      </div>
    )
  },
}

export const WithTooltip: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Bubble variant="secondary">
        <BubbleContent>Did you remove the stale route?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, removed it from the registry.</BubbleContent>
        <BubbleReactions>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-xs" aria-label="Read" />
              }
            >
              <CheckIcon />
            </TooltipTrigger>
            <TooltipContent>Read on Jan 5, 2026 at 4:32 PM</TooltipContent>
          </Tooltip>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const WithPopover: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Bubble align="end">
        <BubbleContent>Run the build script.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>Failed to run the command.</BubbleContent>
        <BubbleReactions>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Show error details"
                  className="aria-expanded:text-destructive"
                />
              }
            >
              <InfoIcon />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle className="text-body">
                  Command failed with exit code 1
                </PopoverTitle>
                <PopoverDescription className="text-body">
                  ENOENT: no such file or directory, open pnpm-lock.yaml
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}
