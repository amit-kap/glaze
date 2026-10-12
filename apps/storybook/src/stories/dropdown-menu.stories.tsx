import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BadgeCheckIcon,
  BellIcon,
  Building2Icon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderSearchIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LanguagesIcon,
  LayoutIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  MonitorIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  PencilIcon,
  SaveIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SunIcon,
  TrashIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"

// Every trigger below is the same outline button, so the stories can stay on
// the menu content rather than the button boilerplate.
function MenuButton(props: React.ComponentProps<typeof Button>) {
  return <Button variant="outline" {...props} />
}

// The "My Account" menu from the upstream docs — the Default story's content.
function AccountMenuContent() {
  return (
    <DropdownMenuContent className="w-40" align="start">
      <DropdownMenuGroup>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>
          New Team
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

// Stories follow the upstream shadcn/ui (base-nova) Dropdown Menu examples:
// https://ui.shadcn.com/docs/components/base/dropdown-menu
const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu,
  subcomponents: {
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a menu to the user — such as a set of actions or functions — triggered by a button.",
      },
    },
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<MenuButton />}>Open</DropdownMenuTrigger>
      <AccountMenuContent />
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

// Shows the menu already open, anchored to an invisible point that stands in
// for the trigger button.
function StaticMenu({
  children,
}: {
  children: React.ReactElement<{
    anchor?: React.RefObject<Element | null>
  }>
}) {
  const anchor = React.useRef<HTMLDivElement>(null)
  return (
    <DropdownMenu open>
      <div ref={anchor} className="size-0" />
      {React.cloneElement(children, { anchor })}
    </DropdownMenu>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

export const Basic: Story = {
  render: () => (
    <StaticMenu>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuContent>
    </StaticMenu>
  ),
}

// --- Variants -------------------------------------------------------------

export const Submenu: Story = {
  render: () => (
    <StaticMenu>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Calendly</DropdownMenuItem>
                      <DropdownMenuItem>Slack</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Webhook</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </StaticMenu>
  ),
}

export const Shortcuts: Story = {
  render: () => (
    <StaticMenu>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </StaticMenu>
  ),
}

export const Icons: Story = {
  render: () => (
    <StaticMenu>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </StaticMenu>
  ),
}

export const Checkboxes: Story = {
  render: function Render() {
    const [showStatusBar, setShowStatusBar] = React.useState(true)
    const [showActivityBar, setShowActivityBar] = React.useState(false)
    const [showPanel, setShowPanel] = React.useState(false)

    return (
      <StaticMenu>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivityBar}
              onCheckedChange={setShowActivityBar}
              disabled
            >
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </StaticMenu>
    )
  },
}

export const CheckboxesIcons: Story = {
  render: function Render() {
    const [notifications, setNotifications] = React.useState({
      email: true,
      sms: false,
      push: true,
    })

    return (
      <StaticMenu>
        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked === true })
              }
            >
              <MailIcon />
              Email notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.sms}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, sms: checked === true })
              }
            >
              <MessageSquareIcon />
              SMS notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, push: checked === true })
              }
            >
              <BellIcon />
              Push notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </StaticMenu>
    )
  },
}

export const RadioGroup: Story = {
  render: function Render() {
    const [position, setPosition] = React.useState("bottom")

    return (
      <StaticMenu>
        <DropdownMenuContent className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </StaticMenu>
    )
  },
}

export const RadioIcons: Story = {
  render: function Render() {
    const [paymentMethod, setPaymentMethod] = React.useState("card")

    return (
      <StaticMenu>
        <DropdownMenuContent className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <DropdownMenuRadioItem value="card">
                <CreditCardIcon />
                Credit Card
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="paypal">
                <WalletIcon />
                PayPal
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bank">
                <Building2Icon />
                Bank Transfer
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </StaticMenu>
    )
  },
}

export const Destructive: Story = {
  render: () => (
    <StaticMenu>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </StaticMenu>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithAvatar: Story = {
  render: () => (
    <StaticMenu>
      <DropdownMenuContent align="end">
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
        <DropdownMenuItem>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </StaticMenu>
  ),
}

type Prefs = { email: boolean; sms: boolean; push: boolean }

// The "File" section: new items plus the nested Open Recent tree.
function FileMenuGroup() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>File</DropdownMenuLabel>
      <DropdownMenuItem>
        <FileIcon />
        New File
        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FolderIcon />
        New Folder
        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderOpenIcon />
          Open Recent
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
              <DropdownMenuItem>
                <FileCodeIcon />
                Project Alpha
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileCodeIcon />
                Project Beta
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MoreHorizontalIcon />
                  More Projects
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <FileCodeIcon />
                      Project Gamma
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileCodeIcon />
                      Project Delta
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <FolderSearchIcon />
                Browse...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SaveIcon />
        Save
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <DownloadIcon />
        Export
        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  )
}

// The "View" section: checkbox items plus the Appearance theme radio submenu.
function ViewMenuGroup({
  notifications,
  setNotifications,
  theme,
  setTheme,
}: {
  notifications: Prefs
  setNotifications: (prefs: Prefs) => void
  theme: string
  setTheme: (theme: string) => void
}) {
  const setPref = (key: keyof Prefs) => (checked: boolean | "indeterminate") =>
    setNotifications({ ...notifications, [key]: checked === true })

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>View</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={notifications.email}
        onCheckedChange={setPref("email")}
      >
        <EyeIcon />
        Show Sidebar
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={notifications.sms}
        onCheckedChange={setPref("sms")}
      >
        <LayoutIcon />
        Show Status Bar
      </DropdownMenuCheckboxItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <PaletteIcon />
          Theme
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <SunIcon />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <MonitorIcon />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )
}

// The "Account" section: profile items plus the nested Settings tree, whose
// Notifications submenu needs the prefs state.
function AccountMenuGroup({
  notifications,
  setNotifications,
}: {
  notifications: Prefs
  setNotifications: (prefs: Prefs) => void
}) {
  const setPref = (key: keyof Prefs) => (checked: boolean | "indeterminate") =>
    setNotifications({ ...notifications, [key]: checked === true })

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem>
        <UserIcon />
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCardIcon />
        Billing
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <SettingsIcon />
          Settings
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Preferences</DropdownMenuLabel>
              <DropdownMenuItem>
                <KeyboardIcon />
                Keyboard Shortcuts
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LanguagesIcon />
                Language
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BellIcon />
                  Notifications
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={notifications.push}
                        onCheckedChange={setPref("push")}
                      >
                        <BellIcon />
                        Push Notifications
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={notifications.email}
                        onCheckedChange={setPref("email")}
                      >
                        <MailIcon />
                        Email Notifications
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ShieldIcon />
                Privacy & Security
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )
}

// Nested submenus mixing icons, shortcuts, checkbox and radio items.
export const Complex: Story = {
  render: function Render() {
    const [notifications, setNotifications] = React.useState<Prefs>({
      email: true,
      sms: false,
      push: true,
    })
    const [theme, setTheme] = React.useState("light")

    return (
      <StaticMenu>
        <DropdownMenuContent className="w-44">
          <FileMenuGroup />
          <DropdownMenuSeparator />
          <ViewMenuGroup
            notifications={notifications}
            setNotifications={setNotifications}
            theme={theme}
            setTheme={setTheme}
          />
          <DropdownMenuSeparator />
          <AccountMenuGroup
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HelpCircleIcon />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileTextIcon />
              Documentation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              Sign Out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </StaticMenu>
    )
  },
}
