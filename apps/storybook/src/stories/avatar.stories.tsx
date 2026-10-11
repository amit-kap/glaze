import type { Meta, StoryObj } from "@storybook/react-vite"
import { PlusIcon } from "lucide-react"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"

// Stories follow the upstream shadcn/ui (base-nova) Avatar examples:
// https://ui.shadcn.com/docs/components/base/avatar
const meta = {
  title: "Components/Avatar",
  component: Avatar,
  subcomponents: {
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
  },
  parameters: {
    docs: {
      description: {
        component:
          "An image element with a fallback for representing the user. Add `AvatarBadge` for status, or stack avatars in an `AvatarGroup`.",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const people = [
  { handle: "shadcn", initials: "CN" },
  { handle: "maxleiter", initials: "LR" },
  { handle: "evilrabbit", initials: "ER" },
]

function Person({ handle, initials }: (typeof people)[number]) {
  return (
    <Avatar>
      <AvatarImage
        src={`https://github.com/${handle}.png`}
        alt={`@${handle}`}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
      <Avatar {...args}>
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="grayscale"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
      </Avatar>
      <AvatarGroup className="grayscale">
        {people.map((person) => (
          <Person key={person.handle} {...person} />
        ))}
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
}

export const Basic: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="@shadcn"
        className="grayscale"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

// --- Sizes ----------------------------------------------------------------

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 grayscale">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

// --- Variants -------------------------------------------------------------

export const Badge: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-green-600 dark:bg-green-800" />
    </Avatar>
  ),
}

export const BadgeWithIcon: Story = {
  render: () => (
    <Avatar className="grayscale">
      <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />
      <AvatarFallback>PP</AvatarFallback>
      <AvatarBadge>
        <PlusIcon />
      </AvatarBadge>
    </Avatar>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Group: Story = {
  render: () => (
    <AvatarGroup className="grayscale">
      {people.map((person) => (
        <Person key={person.handle} {...person} />
      ))}
    </AvatarGroup>
  ),
}

export const GroupCount: Story = {
  render: () => (
    <AvatarGroup className="grayscale">
      {people.map((person) => (
        <Person key={person.handle} {...person} />
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const GroupWithIcon: Story = {
  render: () => (
    <AvatarGroup className="grayscale">
      {people.map((person) => (
        <Person key={person.handle} {...person} />
      ))}
      <AvatarGroupCount>
        <PlusIcon />
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const WithDropdown: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Open account menu"
          />
        }
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
