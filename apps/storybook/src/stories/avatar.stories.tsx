import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@workspace/ui/components/avatar"

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
          "An image element with a fallback for representing the user.",
      },
    },
  },
  argTypes: { size: { control: "radio", options: ["sm", "default", "lg"] } },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const WithBadge: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
      <AvatarBadge className="bg-success" />
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      {["shadcn", "maxleiter", "evilrabbit"].map((user) => (
        <Avatar key={user}>
          <AvatarImage
            src={`https://github.com/${user}.png`}
            alt={`@${user}`}
          />
          <AvatarFallback>{user.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
}
