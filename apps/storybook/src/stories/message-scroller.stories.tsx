import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { Message, MessageContent } from "@workspace/ui/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@workspace/ui/components/message-scroller"

const messages = Array.from({ length: 30 }, (_, i) => ({
  id: `m${i}`,
  mine: i % 3 === 0,
  text:
    i % 3 === 0
      ? `Question ${i / 3 + 1}: how does this part work?`
      : `Reply ${i}: here's some detail about how it works, with enough text to wrap onto another line.`,
}))

function MessageScrollerDemo({ autoScroll = true }: { autoScroll?: boolean }) {
  return (
    <div className="h-96 w-md rounded-xl border">
      <MessageScrollerProvider
        autoScroll={autoScroll}
        defaultScrollPosition="end"
      >
        <MessageScroller>
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {messages.map((m) => (
                <MessageScrollerItem
                  key={m.id}
                  messageId={m.id}
                  scrollAnchor={m.mine}
                >
                  <Message align={m.mine ? "end" : "start"}>
                    <MessageContent>
                      <Bubble
                        variant={m.mine ? "default" : "muted"}
                        align={m.mine ? "end" : "start"}
                      >
                        <BubbleContent>{m.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

const meta = {
  title: "Components/Message Scroller",
  component: MessageScrollerProvider,
  subcomponents: {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerViewport,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A scroll container for chat transcripts that handles auto-scroll, anchoring and a jump-to-latest button.",
      },
    },
  },
  args: { autoScroll: true, defaultScrollPosition: "end" },
  render: (args) => <MessageScrollerDemo autoScroll={args.autoScroll} />,
} satisfies Meta<typeof MessageScrollerProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
