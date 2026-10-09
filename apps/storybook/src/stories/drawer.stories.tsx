import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useIsMobile } from "@amit-kap/glaze/hooks/use-mobile"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@amit-kap/glaze/components/drawer"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import { Label } from "@amit-kap/glaze/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@amit-kap/glaze/components/radio-group"
import { Toaster, toast } from "@amit-kap/glaze/components/toast"
import { cn } from "@amit-kap/glaze/lib/utils"

// Stories follow the upstream shadcn/ui Drawer examples (published for the
// base-rhea style only; the API matches Glaze):
// https://ui.shadcn.com/docs/components/base/drawer
// Upstream's sonner toast is swapped for Glaze's toast, and its
// `useMediaQuery("(min-width: 768px)")` for Glaze's `useIsMobile`.
const meta = {
  title: "Components/Drawer",
  component: Drawer,
  subcomponents: {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A panel that slides in from an edge of the screen, with swipe-to-dismiss, nesting and optional snap points. Built on the Base UI Drawer.",
      },
    },
  },
  argTypes: {
    swipeDirection: {
      control: "inline-radio",
      options: ["down", "up", "left", "right"],
    },
    showSwipeHandle: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

const placeholder =
  "rounded-container bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full"

// --- Basic ----------------------------------------------------------------

const deliveryTimes = [
  {
    value: "asap",
    id: "delivery-asap",
    label: "Standard delivery",
    description: "25–35 min · Driver assigned now",
    badge: "Fastest",
  },
  {
    value: "5-00",
    id: "delivery-5-00",
    label: "5:00 PM – 5:15 PM",
    description: "Prep starts at 4:45 PM",
  },
  {
    value: "5-30",
    id: "delivery-5-30",
    label: "5:30 PM – 5:45 PM",
    description: "Good if you're heading home",
  },
  {
    value: "6-00",
    id: "delivery-6-00",
    label: "6:00 PM – 6:15 PM",
    description: "Most popular · High demand",
  },
  {
    value: "6-30",
    id: "delivery-6-30",
    label: "6:30 PM – 6:45 PM",
    description: "Last slot before kitchen closes",
  },
]

// Bottom sheet with a handle on mobile, right panel on desktop. The controls
// override that choice.
export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false)
    const [deliveryTime, setDeliveryTime] = React.useState("asap")
    const isMobile = useIsMobile()

    function handleConfirm() {
      const selected = deliveryTimes.find((time) => time.value === deliveryTime)

      if (!selected) {
        return
      }

      setOpen(false)
      toast.add({
        title: "Delivery time confirmed",
        description: selected.label,
      })
    }

    return (
      <Toaster>
        <Drawer
          showSwipeHandle={isMobile}
          swipeDirection={isMobile ? "down" : "right"}
          {...args}
          open={open}
          onOpenChange={setOpen}
        >
          <DrawerTrigger render={<Button variant="secondary" />}>
            Open Drawer
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Pick a delivery time</DrawerTitle>
              <DrawerDescription>
                We&apos;ll prepare your order as soon as possible.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <RadioGroup
                value={deliveryTime}
                onValueChange={setDeliveryTime}
                className="gap-2"
              >
                {deliveryTimes.map((time) => (
                  <FieldLabel key={time.value} htmlFor={time.id}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex items-center gap-2">
                          {time.label}
                          {time.badge ? (
                            <Badge variant="secondary">{time.badge}</Badge>
                          ) : null}
                        </FieldTitle>
                        <FieldDescription>{time.description}</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={time.value} id={time.id} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </div>
            <DrawerFooter>
              <Button onClick={handleConfirm}>Confirm Delivery Time</Button>
              <DrawerClose render={<Button variant="outline" />}>
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Toaster>
    )
  },
}

// --- Variants -------------------------------------------------------------

const SWIPE_DIRECTIONS = ["down", "up", "left", "right"] as const

// `swipeDirection` sets the edge the drawer slides from and is dismissed
// towards. Upstream shows only "left".
export const Position: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {SWIPE_DIRECTIONS.map((direction) => (
        <Drawer key={direction} swipeDirection={direction}>
          <DrawerTrigger
            render={<Button variant="secondary" className="capitalize" />}
          >
            {direction}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 p-4">
              <div className={placeholder} />
            </div>
            <DrawerFooter>
              <DrawerClose render={<Button />}>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
}

export const SwipeHandle: Story = {
  render: () => (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="secondary" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
          <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className={placeholder} />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

// `modal={false}` keeps the page interactive; `disablePointerDismissal`
// stops outside clicks from closing it.
export const NonModal: Story = {
  render: () => (
    <Drawer modal={false} disablePointerDismissal swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" />}>
        Non Modal
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Non Modal Drawer</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className={placeholder} />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

const SNAP_POINTS = ["31rem", 1]

export const SnapPoints: Story = {
  render: () => (
    <Drawer snapPoints={SNAP_POINTS} showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Snap Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Snap points</DrawerTitle>
          <DrawerDescription>
            Drag the drawer to snap between a compact peek and a near
            full-height view.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className={placeholder} />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

// --- Compositions ---------------------------------------------------------

const nestedLevels = [
  {
    trigger: "Open Drawer",
    title: "Drawer",
    description: "Open another drawer from the same direction.",
  },
  {
    trigger: "Open Nested Drawer",
    title: "Nested Drawer",
    description: "The parent drawer stays mounted behind this one.",
  },
  {
    trigger: "Open Third Drawer",
    title: "Third Drawer",
    description: "Two drawers are stacked behind this one.",
  },
  {
    trigger: "Open Fourth Drawer",
    title: "Fourth Drawer",
    description: "This is the frontmost drawer in the stack.",
  },
]

// Upstream nests four drawers inline; this renders the same tree recursively.
function NestedDrawer({ level = 0 }: { level?: number }) {
  const isMobile = useIsMobile()
  const { trigger, title, description } = nestedLevels[level]
  const next = level + 1 < nestedLevels.length

  return (
    <Drawer
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
        render={<Button variant={level === 0 ? "secondary" : "outline"} />}
      >
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />
        </div>
        <DrawerFooter>
          {next && <NestedDrawer level={level + 1} />}
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const Nested: Story = {
  render: () => <NestedDrawer />,
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}

// A Dialog on desktop and a Drawer on mobile, sharing one open state.
export const Responsive: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    if (!isMobile) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button variant="outline" />}>
            Edit Profile
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <ProfileForm />
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger render={<Button variant="outline" />}>
          Edit Profile
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm className="p-4" />
        </DrawerContent>
      </Drawer>
    )
  },
}
