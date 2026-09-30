import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"

type Side = "top" | "right" | "bottom" | "left"

function SheetDemo({ side = "right" }: { side?: Side }) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" className="capitalize" />}
      >
        Open {side}
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor={`sheet-name-${side}`}>Name</Label>
            <Input id={`sheet-name-${side}`} defaultValue="Pedro Duarte" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const meta = {
  title: "Components/Sheet",
  component: SheetContent,
  subcomponents: {
    Sheet,
    SheetClose,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Extends the Dialog component to display content that complements the main content of the screen.",
      },
    },
  },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
  },
  render: (args) => <SheetDemo side={args.side} />,
} satisfies Meta<typeof SheetContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { side: "right" } }

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <SheetDemo key={side} side={side} />
      ))}
    </div>
  ),
}
