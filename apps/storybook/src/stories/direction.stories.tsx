import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amitka/glaze/components/button"
import { DirectionProvider } from "@amitka/glaze/components/direction"
import { Input } from "@amitka/glaze/components/input"
import { Label } from "@amitka/glaze/components/label"
import { Slider } from "@amitka/glaze/components/slider"
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
  component: DirectionProvider,
  parameters: {
    docs: {
      description: {
        component:
          "Provides the reading direction (LTR or RTL) to Base UI components below it.",
      },
    },
  },
  argTypes: {
    direction: {
      control: "radio",
      options: ["ltr", "rtl"],
      description: "The reading direction of the text.",
      table: {
        type: { summary: '"ltr" | "rtl"' },
        defaultValue: { summary: '"ltr"' },
      },
    },
  },
  render: (args) => <DirectionDemo direction={args.direction} />,
} satisfies Meta<typeof DirectionProvider>

export default meta
type Story = StoryObj<typeof meta>

export const RightToLeft: Story = { args: { direction: "rtl" } }
export const LeftToRight: Story = { args: { direction: "ltr" } }
