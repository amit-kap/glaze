import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "@amit-kap/glaze/components/separator"

// Stories follow the upstream shadcn/ui (base-nova) Separator examples:
// https://ui.shadcn.com/docs/components/base/separator
const meta = {
  title: "Components/Separator",
  component: Separator,
  parameters: {
    docs: {
      description: {
        component: "Visually or semantically separates content.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <div className="flex w-sm flex-col gap-4 text-body">
      <div className="flex flex-col gap-1.5">
        <div className="leading-none font-medium">shadcn/ui</div>
        <div className="text-muted-foreground">
          The Foundation for your Design System
        </div>
      </div>
      <Separator {...args} />
      <div>
        A set of beautifully designed components that you can customize, extend,
        and build on.
      </div>
    </div>
  ),
}

// --- Variants -------------------------------------------------------------

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-body">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Menu: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-body md:gap-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Settings</span>
        <span className="text-caption text-muted-foreground">
          Manage preferences
        </span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-1">
        <span className="font-medium">Account</span>
        <span className="text-caption text-muted-foreground">
          Profile & security
        </span>
      </div>
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="hidden flex-col gap-1 md:flex">
        <span className="font-medium">Help</span>
        <span className="text-caption text-muted-foreground">
          Support & docs
        </span>
      </div>
    </div>
  ),
}

export const List: Story = {
  render: () => (
    <div className="flex w-sm flex-col gap-2 text-body">
      {[1, 2, 3].map((n, index) => (
        <div key={n} className="contents">
          {index > 0 && <Separator />}
          <dl className="flex items-center justify-between">
            <dt>Item {n}</dt>
            <dd className="text-muted-foreground">Value {n}</dd>
          </dl>
        </div>
      ))}
    </div>
  ),
}
