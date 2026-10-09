import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpIcon, LoaderIcon } from "lucide-react"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@amit-kap/glaze/components/input-group"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import { Spinner } from "@amit-kap/glaze/components/spinner"
import { cn } from "@amit-kap/glaze/lib/utils"

// Stories follow the upstream shadcn/ui (base-nova) Spinner examples:
// https://ui.shadcn.com/docs/components/base/spinner
// Upstream's `[--radius:…]` overrides are dropped; Glaze has its own radius
// tokens.
const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          "An indicator that can be used to show a loading state. Size it with `size-*` classes.",
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <div className="flex w-xs flex-col gap-4">
      <Item variant="muted">
        <ItemMedia>
          <Spinner {...args} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-body tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
    </div>
  ),
}

// --- Sizes ----------------------------------------------------------------

export const Size: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}

// --- Variants -------------------------------------------------------------

function CustomSpinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

// Build your own spinner from any icon with `animate-spin`.
export const Customization: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <CustomSpinner />
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const InButton: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
      <Button variant="outline" disabled size="sm">
        <Spinner data-icon="inline-start" />
        Please wait
      </Button>
      <Button variant="secondary" disabled size="sm">
        <Spinner data-icon="inline-start" />
        Processing
      </Button>
    </div>
  ),
}

export const InBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge>
        <Spinner data-icon="inline-start" />
        Syncing
      </Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        Updating
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        Processing
      </Badge>
    </div>
  ),
}

export const InInputGroup: Story = {
  render: () => (
    <div className="flex w-md flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          placeholder="Send a message..."
          aria-label="Message"
          disabled
        />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea
          placeholder="Send a message..."
          aria-label="Message"
          disabled
        />
        <InputGroupAddon align="block-end">
          <Spinner /> Validating...
          <InputGroupButton className="ml-auto" variant="default">
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const InEmpty: Story = {
  render: () => (
    <Empty className="w-xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Processing your request</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  ),
}
