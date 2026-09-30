import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@workspace/ui/components/bubble"

const variants = ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const

const meta = {
  title: "Components/Bubble",
  component: Bubble,
  argTypes: {
    variant: { control: "select", options: variants },
    align: { control: "radio", options: ["start", "end"] },
  },
  decorators: [(Story) => <div className="w-md"><Story /></div>],
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Bubble {...args}>
      <BubbleContent>Hey! Did you get a chance to review the design?</BubbleContent>
    </Bubble>
  ),
}

export const Variants: Story = {
  render: () => (
    <BubbleGroup>
      {variants.map((variant, i) => (
        <Bubble key={variant} variant={variant} align={i % 2 ? "end" : "start"}>
          <BubbleContent className="capitalize">{variant}</BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  ),
}

export const Conversation: Story = {
  render: () => (
    <BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>Can you send over the latest mockups?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Sure, uploading them now.</BubbleContent>
      </Bubble>
      <Bubble align="end" className="mb-4">
        <BubbleContent>Done — they&apos;re in the shared folder.</BubbleContent>
        <BubbleReactions align="start">👍 🎉</BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent render={<button type="button" />}>
          Tap to reply
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
}
