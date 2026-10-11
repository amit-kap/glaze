import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@amit-kap/glaze/components/button"
import { Toaster, toast } from "@amit-kap/glaze/components/toast"

// Stories follow the upstream shadcn/ui (base-nova) Toast examples:
// https://ui.shadcn.com/docs/components/base/toast

// The Docs page renders every story at once; mounting a Toaster per story
// would show each toast several times, so only the first one renders it.
const mounted: symbol[] = []
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function SingleToaster() {
  const [id] = React.useState(() => Symbol("toaster"))
  const owner = React.useSyncExternalStore(
    subscribe,
    () => mounted[0] ?? null,
    () => null
  )

  React.useEffect(() => {
    mounted.push(id)
    listeners.forEach((listener) => listener())
    return () => {
      mounted.splice(mounted.indexOf(id), 1)
      listeners.forEach((listener) => listener())
    }
  }, [id])

  return owner === id ? <Toaster /> : null
}

const meta = {
  title: "Components/Toast",
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          "A succinct message that is displayed temporarily. Render `<Toaster />` once, then call `toast.add()` from anywhere. Built on the Base UI Toast.",
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <SingleToaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

// Pass button props with `actionProps` to render an action.
export const Default: Story = {
  render: () => {
    function showToast() {
      const id = toast.add({
        title: "Event created",
        description: "Sunday, December 3 at 9:00 AM",
        actionProps: {
          children: "Undo",
          onClick() {
            toast.close(id)
          },
        },
      })
    }

    return (
      <Button variant="outline" onClick={showToast}>
        Show Toast
      </Button>
    )
  },
}

// --- Variants -------------------------------------------------------------

// `type` adds a status icon: success, info, warning, error or loading.
export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => toast.add({ description: "Event has been created." })}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "success",
            description: "Event has been created.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "info",
            description: "Arrive 10 minutes before the event.",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "warning",
            description: "The event cannot start before 8:00 AM.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "error",
            description: "The event could not be created.",
            priority: "high",
          })
        }
      >
        Error
      </Button>
    </div>
  ),
}

// `toast.promise` moves one toast through loading, success and error.
export const WithPromise: Story = {
  render: () => {
    function showToast() {
      toast.promise(
        new Promise<{ name: string }>((resolve) => {
          window.setTimeout(() => resolve({ name: "Event" }), 2000)
        }),
        {
          loading: "Creating event…",
          success: (data) => `${data.name} created.`,
          error: "Could not create event.",
        }
      )
    }

    return (
      <Button variant="outline" onClick={showToast}>
        Create Event
      </Button>
    )
  },
}
