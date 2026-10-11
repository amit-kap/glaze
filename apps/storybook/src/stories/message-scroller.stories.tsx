import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@amit-kap/glaze/components/message-scroller"
import { MessageScrollerAnchoring } from "./examples/message-scroller/message-scroller-anchoring"
import { MessageScrollerAnimation } from "./examples/message-scroller/message-scroller-animation"
import { MessageScrollerCommands } from "./examples/message-scroller/message-scroller-commands"
import { MessageScrollerDemo } from "./examples/message-scroller/message-scroller-demo"
import { MessageScrollerGroupChat } from "./examples/message-scroller/message-scroller-group-chat"
import { MessageScrollerLoadHistory } from "./examples/message-scroller/message-scroller-load-history"
import { MessageScrollerOpeningPosition } from "./examples/message-scroller/message-scroller-opening-position"
import { MessageScrollerPreviousContext } from "./examples/message-scroller/message-scroller-previous-context"
import { MessageScrollerScrollable } from "./examples/message-scroller/message-scroller-scrollable"
import { MessageScrollerStreaming } from "./examples/message-scroller/message-scroller-streaming"
import { MessageScrollerVisibility } from "./examples/message-scroller/message-scroller-visibility"
import { ExampleToaster } from "./examples/toast"

// Stories follow the upstream shadcn/ui Message Scroller examples:
// https://ui.shadcn.com/docs/components/base/message-scroller
// The examples live in ./examples/message-scroller as copies of upstream with
// Glaze imports. They stream from a fake chat built on the AI SDK
// (`ai`, `@ai-sdk/react`, `@shadcn/helpers`), as upstream does.
const meta = {
  title: "Components/Message Scroller",
  component: MessageScroller,
  subcomponents: {
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A scroll container for chat threads: anchors new turns, follows streaming output, keeps context visible when history loads, and exposes scroll and visibility state.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-lg">
        <Story />
        <ExampleToaster />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageScroller>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = { render: () => <MessageScrollerDemo /> }

// --- Variants -------------------------------------------------------------

export const AnchoringTurns: Story = {
  render: () => <MessageScrollerAnchoring />,
}

export const GroupChat: Story = { render: () => <MessageScrollerGroupChat /> }

export const KeepingContextVisible: Story = {
  render: () => <MessageScrollerPreviousContext />,
}

export const FollowingTheLiveEdge: Story = {
  render: () => <MessageScrollerStreaming />,
}

export const OpeningSavedThreads: Story = {
  render: () => <MessageScrollerOpeningPosition />,
}

// --- Compositions ---------------------------------------------------------

export const LoadingEarlierMessages: Story = {
  render: () => <MessageScrollerLoadHistory />,
}

export const AnimatingNewMessages: Story = {
  render: () => <MessageScrollerAnimation />,
}

export const JumpingToMessages: Story = {
  render: () => <MessageScrollerCommands />,
}

export const TrackingReaderPosition: Story = {
  render: () => <MessageScrollerVisibility />,
}

export const ReadingScrollState: Story = {
  render: () => <MessageScrollerScrollable />,
}
