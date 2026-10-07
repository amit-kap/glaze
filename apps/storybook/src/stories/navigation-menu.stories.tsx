import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@amit-kap/glaze/components/navigation-menu"

const components = [
  {
    title: "Alert Dialog",
    description:
      "A modal dialog that interrupts the user with important content.",
  },
  {
    title: "Hover Card",
    description: "Preview content available behind a link.",
  },
  {
    title: "Progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Tabs",
    description: "Layered sections of content displayed one at a time.",
  },
]

const meta = {
  title: "Components/Navigation Menu",
  component: NavigationMenu,
  subcomponents: {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A collection of links for navigating websites.",
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex min-h-80 justify-center">
      <NavigationMenu {...args}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-96 gap-1">
                {["Introduction", "Installation", "Typography"].map((title) => (
                  <li key={title}>
                    <NavigationMenuLink
                      href="#"
                      className="flex-col items-start gap-1"
                    >
                      <div className="font-medium">{title}</div>
                      <div className="text-muted-foreground">
                        Learn how to use {title.toLowerCase()} in your project.
                      </div>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-md grid-cols-2 gap-1">
                {components.map((c) => (
                  <li key={c.title}>
                    <NavigationMenuLink
                      href="#"
                      className="flex-col items-start gap-1"
                    >
                      <div className="font-medium">{c.title}</div>
                      <div className="line-clamp-2 text-muted-foreground">
                        {c.description}
                      </div>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
            >
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
}
