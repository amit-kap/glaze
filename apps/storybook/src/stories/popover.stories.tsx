import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          {[
            ["width", "100%"],
            ["height", "25px"],
          ].map(([id, value]) => (
            <div key={id} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={`popover-${id}`} className="capitalize">{id}</Label>
              <Input id={`popover-${id}`} defaultValue={value} className="col-span-2 h-8" />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  ),
}
