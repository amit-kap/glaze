import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@workspace/ui/components/message"

const meta = {
  title: "Components/Message",
  component: Message,
  subcomponents: {
    MessageAvatar,
    MessageContent,
    MessageFooter,
    MessageGroup,
    MessageHeader,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Lays out a chat message with avatar, header, content and footer.",
      },
    },
  },
  argTypes: { align: { control: "radio", options: ["start", "end"] } },
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Message {...args}>
      <MessageAvatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>shadcn</MessageHeader>
        <Bubble variant="muted">
          <BubbleContent>
            The new release is out. Let me know what you think!
          </BubbleContent>
        </Bubble>
        <MessageFooter>9:41 AM</MessageFooter>
      </MessageContent>
    </Message>
  ),
}

export const Thread: Story = {
  render: () => (
    <MessageGroup className="gap-4">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="ghost">
            <BubbleContent>
              Here&apos;s a summary of the three open pull requests and what
              each one changes.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Which one should I review first?</BubbleContent>
          </Bubble>
          <MessageFooter>Read</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  ),
}
