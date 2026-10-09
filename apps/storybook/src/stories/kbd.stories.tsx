import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchIcon } from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import { ButtonGroup } from "@amit-kap/glaze/components/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import { Kbd, KbdGroup } from "@amit-kap/glaze/components/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

// Stories follow the upstream shadcn/ui (base-nova) Kbd examples:
// https://ui.shadcn.com/docs/components/base/kbd
const meta = {
  title: "Components/Kbd",
  component: Kbd,
  subcomponents: { KbdGroup },
  parameters: {
    docs: {
      description: {
        component:
          "Used to display textual user input from keyboard. Wrap several keys in a `KbdGroup`.",
      },
    },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <p className="text-body text-muted-foreground">
      Use{" "}
      <KbdGroup>
        <Kbd>Ctrl + B</Kbd>
        <Kbd>Ctrl + K</Kbd>
      </KbdGroup>{" "}
      to open the command palette
    </p>
  ),
}

// --- Compositions ---------------------------------------------------------

export const InButton: Story = {
  render: () => (
    <Button variant="outline">
      Accept{" "}
      <Kbd data-icon="inline-end" className="translate-x-0.5">
        ⏎
      </Kbd>
    </Button>
  ),
}

export const InTooltip: Story = {
  render: () => (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Save
        </TooltipTrigger>
        <TooltipContent>
          Save Changes <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Print
        </TooltipTrigger>
        <TooltipContent>
          Print Document{" "}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>P</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </ButtonGroup>
  ),
}

export const InInputGroup: Story = {
  render: () => (
    <div className="flex w-xs flex-col gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." aria-label="Search" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
