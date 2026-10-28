import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AudioWaveformIcon,
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  BotIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CommandIcon,
  CreditCardIcon,
  FolderIcon,
  ForwardIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  LogOutIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  PlusIcon,
  Settings2Icon,
  SparklesIcon,
  SquareTerminalIcon,
  Trash2Icon,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@amit-kap/glaze/components/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@amit-kap/glaze/components/sidebar"
import { cn } from "@amit-kap/glaze/lib/utils"

// Stories follow the upstream shadcn/ui (base-nova) Sidebar demo:
// https://ui.shadcn.com/docs/components/base/sidebar
// Radix leftovers in the demo are mapped to Base UI: `data-[state=open]`
// becomes `data-popup-open` / `data-open`, and the trigger-width variable
// becomes `--anchor-width`.

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEndIcon, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveformIcon, plan: "Startup" },
    { name: "Evil Corp.", logo: CommandIcon, plan: "Free" },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminalIcon,
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: BotIcon,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpenIcon,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: FrameIcon },
    { name: "Sales & Marketing", url: "#", icon: PieChartIcon },
    { name: "Travel", url: "#", icon: MapIcon },
  ],
}

const openMenuButton =
  "data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"

function TeamSwitcher({ teams }: { teams: typeof data.teams }) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className={openMenuButton} />}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-control bg-sidebar-primary text-sidebar-primary-foreground">
              <activeTeam.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-start text-body leading-tight">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-caption">{activeTeam.plan}</span>
            </div>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-control"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-caption text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-item border">
                    <team.logo className="size-3.5 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-item border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavMain({ items }: { items: typeof data.navMain }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} />}
              >
                <item.icon />
                <span>{item.title}</span>
                <ChevronRightIcon className="ms-auto transition-transform duration-(--duration-moderate) group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton render={<a href={subItem.url} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavProjects({ projects }: { projects: typeof data.projects }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton render={<a href={item.url} />}>
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
                <MoreHorizontalIcon />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-control"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <FolderIcon className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ForwardIcon className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2Icon className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function UserLabel({ user }: { user: typeof data.user }) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-control">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-control">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-body leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="truncate text-caption">{user.email}</span>
      </div>
    </>
  )
}

function NavUser({ user }: { user: typeof data.user }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className={openMenuButton} />}
          >
            <UserLabel user={user} />
            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-control"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-body">
                  <UserLabel user={user} />
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  subcomponents: {
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A composable, themeable and customizable sidebar component. Toggle it with the trigger, the rail, or ⌘B / Ctrl+B.",
      },
      story: { inline: false, iframeHeight: 640 },
    },
  },
  args: { collapsible: "icon" },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    variant: {
      control: "inline-radio",
      options: ["sidebar", "floating", "inset"],
    },
    collapsible: {
      control: "inline-radio",
      options: ["offcanvas", "icon", "none"],
    },
  },
  render: function Render(args) {
    const isRight = args.side === "right"
    const sidebar = (
      <Sidebar {...args}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )

    // A right sidebar comes after the inset, and the trigger moves with it.
    return (
      <SidebarProvider>
        {!isRight && sidebar}
        <SidebarInset>
          <header
            className={cn(
              "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
              isRight && "justify-end"
            )}
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger
                className={isRight ? "-me-1 rotate-180" : "-ms-1"}
              />
            </div>
          </header>
        </SidebarInset>
        {isRight && sidebar}
      </SidebarProvider>
    )
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

// Glaze-only: the demo with each `variant` and `side` option.
export const Floating: Story = { args: { variant: "floating" } }

export const Inset: Story = { args: { variant: "inset" } }

export const Right: Story = { args: { side: "right" } }

export const Offcanvas: Story = { args: { collapsible: "offcanvas" } }

// --- Contained ------------------------------------------------------------

// `contained` on the provider lays the sidebar out inside its parent instead of
// the window, and turns it into a drawer when the parent is narrow. Use it for
// previews and embedded apps. The frame below is 420px wide, so it shows the
// drawer; open it with the trigger.
export const Contained: Story = {
  render: () => (
    <div className="m-6 h-[420px] w-[420px] overflow-hidden rounded-lg border border-border">
      <SidebarProvider contained>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 px-3">
            <SidebarTrigger />
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
}
