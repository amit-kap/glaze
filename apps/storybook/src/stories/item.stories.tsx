import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@workspace/ui/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@workspace/ui/components/item"
import { BadgeCheckIcon, ChevronRightIcon, ShieldAlertIcon } from "lucide-react"

const meta = {
  title: "Components/Item",
  component: Item,
  subcomponents: {
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A versatile row for displaying content with media, title, description and actions.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "outline", "muted"] },
    size: { control: "radio", options: ["default", "sm", "xs"] },
  },
  args: { variant: "outline" },
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Item {...args}>
      <ItemContent>
        <ItemTitle>Basic item</ItemTitle>
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
  ),
}

export const WithMedia: Story = {
  render: (args) => (
    <Item {...args}>
      <ItemMedia variant="icon">
        <ShieldAlertIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Security alert</ItemTitle>
        <ItemDescription>
          New login detected from an unknown device.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </ItemActions>
    </Item>
  ),
}

export const AsLink: Story = {
  render: (args) => (
    <Item {...args} render={<a href="#" />}>
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
  ),
}

export const Group: Story = {
  render: () => (
    <ItemGroup className="rounded-lg border">
      {["shadcn", "maxleiter", "evilrabbit"].map((name, i) => (
        <div key={name}>
          {i > 0 && <ItemSeparator />}
          <Item>
            <ItemMedia variant="image">
              <img src={`https://github.com/${name}.png`} alt={name} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{name}</ItemTitle>
              <ItemDescription>{name}@example.com</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ))}
    </ItemGroup>
  ),
}
