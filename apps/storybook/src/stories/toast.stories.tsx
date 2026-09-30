import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@workspace/ui/components/button"
import { Toaster, toast } from "@workspace/ui/components/toast"

function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Event has been created",
            description: "Sunday, December 03, 2023 at 9:00 AM",
          })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.add({ type: "success", title: "Changes saved" })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            type: "error",
            title: "Upload failed",
            description: "The file exceeds the 10 MB limit.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Message archived",
            actionProps: {
              children: "Undo",
              onClick: () => toast.add({ title: "Restored" }),
            },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: "Deploying…",
            success: "Deployed",
            error: "Deploy failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  )
}

const meta = {
  title: "Components/Toast",
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          "A succinct message that is displayed temporarily. Render `<Toaster />` once, then call `toast.add()` from anywhere.",
      },
    },
  },
  render: (args) => (
    <>
      <ToastDemo />
      <Toaster {...args} />
    </>
  ),
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
