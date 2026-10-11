import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  InboxIcon,
  PlusIcon,
  ShieldAlertIcon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@amit-kap/glaze/components/item"

// Stories follow the upstream shadcn/ui (base-nova) Item examples:
// https://ui.shadcn.com/docs/components/base/item
// Upstream's `next/image` images are plain <img> elements here.
const meta = {
  title: "Components/Item",
  component: Item,
  subcomponents: {
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A versatile component for displaying content with media, title, description, and actions. Use `render` to turn it into a link.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "outline", "muted"],
    },
    size: { control: "inline-radio", options: ["default", "sm", "xs"] },
  },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
]

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  args: { variant: "outline" },
  render: (args) => (
    <div className="flex w-md flex-col gap-6">
      <Item {...args}>
        <ItemContent>
          <ItemTitle>Basic Item</ItemTitle>
          <ItemDescription>
            A simple item with title and description.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm" render={<a href="#" />}>
        <ItemMedia>
          <BadgeCheckIcon className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your profile has been verified.</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Item>
    </div>
  ),
}

// --- Variants -------------------------------------------------------------

export const Variant: Story = {
  render: () => (
    <div className="flex w-md flex-col gap-6">
      {(
        [
          [
            "default",
            "Default Variant",
            "Transparent background with no border.",
          ],
          [
            "outline",
            "Outline Variant",
            "Outlined style with a visible border.",
          ],
          ["muted", "Muted Variant", "Muted background for secondary content."],
        ] as const
      ).map(([variant, title, description]) => (
        <Item key={variant} variant={variant}>
          <ItemMedia variant="icon">
            <InboxIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
}

// --- Sizes ----------------------------------------------------------------

export const Size: Story = {
  render: () => (
    <div className="flex w-md flex-col gap-6">
      {(
        [
          ["default", "Default Size", "The standard size for most use cases."],
          ["sm", "Small Size", "A compact size for dense layouts."],
          ["xs", "Extra Small Size", "The most compact size available."],
        ] as const
      ).map(([size, title, description]) => (
        <Item key={size} variant="outline" size={size}>
          <ItemMedia variant="icon">
            <InboxIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const Icon: Story = {
  render: () => (
    <div className="flex w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <ShieldAlertIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Security Alert</ItemTitle>
          <ItemDescription>
            New login detected from unknown device.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Review
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}

export const WithAvatar: Story = {
  render: () => (
    <div className="flex w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/evilrabbit.png" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Evil Rabbit</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full"
            aria-label="Invite"
          >
            <PlusIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            {people.map((person, index) => (
              <Avatar
                key={person.username}
                className={index < 2 ? "hidden sm:flex" : undefined}
              >
                <AvatarImage src={person.avatar} alt={`@${person.username}`} />
                <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>No Team Members</ItemTitle>
          <ItemDescription>
            Invite your team to collaborate on this project.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
}

const music = [
  {
    title: "Midnight City Lights",
    artist: "Neon Dreams",
    album: "Electric Nights",
    duration: "3:45",
  },
  {
    title: "Coffee Shop Conversations",
    artist: "The Morning Brew",
    album: "Urban Stories",
    duration: "4:05",
  },
  {
    title: "Digital Rain",
    artist: "Cyber Symphony",
    album: "Binary Beats",
    duration: "3:30",
  },
]

export const Image: Story = {
  render: () => (
    <div className="flex w-md flex-col gap-6">
      <ItemGroup className="gap-4">
        {music.map((song) => (
          <Item
            key={song.title}
            variant="outline"
            render={<a href="#" />}
            role="listitem"
          >
            <ItemMedia variant="image">
              <img
                src={`https://avatar.vercel.sh/${song.title}`}
                alt={song.title}
                width={32}
                height={32}
                className="object-cover grayscale"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="line-clamp-1">
                {song.title} -{" "}
                <span className="text-muted-foreground">{song.album}</span>
              </ItemTitle>
              <ItemDescription>{song.artist}</ItemDescription>
            </ItemContent>
            <ItemContent className="flex-none text-center">
              <ItemDescription>{song.duration}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <ItemGroup className="w-sm">
      {people.map((person) => (
        <Item key={person.username} variant="outline">
          <ItemMedia>
            <Avatar>
              <AvatarImage src={person.avatar} className="grayscale" />
              <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{person.username}</ItemTitle>
            <ItemDescription>{person.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label={`Add ${person.username}`}
            >
              <PlusIcon />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  ),
}

const models = [
  {
    name: "v0-1.5-sm",
    description: "Everyday tasks and UI generation.",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
  },
  {
    name: "v0-2.0-mini",
    description: "Open Source model for everyone.",
    image:
      "https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop",
  },
]

export const Header: Story = {
  render: () => (
    <div className="flex w-xl flex-col gap-6">
      <ItemGroup className="grid grid-cols-3 gap-4">
        {models.map((model) => (
          <Item key={model.name} variant="outline">
            <ItemHeader>
              <img
                src={model.image}
                alt={model.name}
                width={128}
                height={128}
                className="aspect-square w-full rounded-sm object-cover"
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{model.name}</ItemTitle>
              <ItemDescription>{model.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  ),
}

export const Link: Story = {
  render: () => (
    <div className="flex w-md flex-col gap-4">
      <Item render={<a href="#" />}>
        <ItemContent>
          <ItemTitle>Visit our documentation</ItemTitle>
          <ItemDescription>
            Learn how to get started with our components.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Item>
      <Item
        variant="outline"
        render={<a href="#" target="_blank" rel="noopener noreferrer" />}
      >
        <ItemContent>
          <ItemTitle>External resource</ItemTitle>
          <ItemDescription>
            Opens in a new tab with security attributes.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ExternalLinkIcon className="size-4" />
        </ItemActions>
      </Item>
    </div>
  ),
}

export const WithDropdown: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Select <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          {people.map((person) => (
            <DropdownMenuItem key={person.username}>
              <Item size="xs" className="w-full p-2">
                <ItemMedia>
                  <Avatar className="size-[--spacing(6.5)]">
                    <AvatarImage src={person.avatar} className="grayscale" />
                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="gap-0">
                  <ItemTitle>{person.username}</ItemTitle>
                  <ItemDescription className="leading-none">
                    {person.email}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
