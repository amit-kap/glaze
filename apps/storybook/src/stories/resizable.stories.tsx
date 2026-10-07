import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@amitka/glaze/components/resizable"

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  subcomponents: { ResizableHandle, ResizablePanel },
  parameters: {
    docs: {
      description: {
        component:
          "Accessible resizable panel groups and layouts with keyboard support.",
      },
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-64 max-w-md rounded-lg border md:min-w-md"
    >
      <ResizablePanel defaultSize="50%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
