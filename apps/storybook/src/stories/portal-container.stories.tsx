import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import { PortalContainer } from "@amit-kap/glaze/components/portal-container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

const meta = {
  title: "Components/Portal Container",
  component: PortalContainer,
  parameters: {
    docs: {
      description: {
        component:
          "Popups mount on the document body by default, outside any theme scope around their trigger. Wrap a themed region in `PortalContainer` and they mount inside it, so they inherit its tokens and dark mode. Hold the element in state, not a ref.",
      },
    },
  },
} satisfies Meta<typeof PortalContainer>

export default meta
type Story = StoryObj<typeof meta>

// A dark region on a light page: the dialog and the select open inside it, so
// they are dark too. Without the wrapper they would open light, on the body.
export const InsideADarkRegion: Story = {
  args: { container: null, children: null },
  render: function Render() {
    const [region, setRegion] = React.useState<HTMLElement | null>(null)
    return (
      <div
        ref={setRegion}
        className="dark relative flex h-72 items-center justify-center gap-3 overflow-hidden rounded-lg bg-background text-foreground [contain:layout]"
      >
        <PortalContainer container={region}>
          <Select items={[{ value: "a", label: "Option A" }]} defaultValue="a">
            <SelectTrigger aria-label="Example" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inside the region</DialogTitle>
                <DialogDescription>
                  This dialog is dark and stays within the frame.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </PortalContainer>
      </div>
    )
  },
}
