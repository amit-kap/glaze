import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@workspace/ui/components/button"
import { DirectionProvider } from "@workspace/ui/components/direction"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"
import { ArrowRightIcon } from "lucide-react"

function DirectionDemo({ direction = "rtl" }: { direction?: "ltr" | "rtl" }) {
  return (
    <DirectionProvider direction={direction}>
      <div dir={direction} className="grid w-80 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="direction-name">שם מלא</Label>
          <Input id="direction-name" placeholder="ישראל ישראלי" />
        </div>
        <Slider defaultValue={[30]} />
        <Button className="w-fit">
          המשך
          <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
        </Button>
      </div>
    </DirectionProvider>
  )
}

const meta = {
  title: "Components/Direction",
  component: DirectionDemo,
  argTypes: { direction: { control: "radio", options: ["ltr", "rtl"] } },
} satisfies Meta<typeof DirectionDemo>

export default meta
type Story = StoryObj<typeof meta>

export const RightToLeft: Story = { args: { direction: "rtl" } }
export const LeftToRight: Story = { args: { direction: "ltr" } }
