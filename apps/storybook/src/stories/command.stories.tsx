import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { LucideIcon } from "lucide-react"
import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  SmileIcon,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@amit-kap/glaze/components/command"

// Stories follow the upstream shadcn/ui (base-nova) Command examples:
// https://ui.shadcn.com/docs/components/base/command
const meta = {
  title: "Components/Command",
  component: Command,
  subcomponents: {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Fast, composable command menu. Built on [cmdk](https://cmdk.paco.me); wrap it in `CommandDialog` for a command palette.",
      },
    },
  },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

// One row: icon, label, optional shortcut. Most items below use this shape.
function Entry({
  icon: Icon,
  label,
  keys,
  disabled,
}: {
  icon: LucideIcon
  label: string
  keys?: string
  disabled?: boolean
}) {
  return (
    <CommandItem disabled={disabled}>
      <Icon />
      <span>{label}</span>
      {keys && <CommandShortcut>{keys}</CommandShortcut>}
    </CommandItem>
  )
}

const suggestions: Parameters<typeof Entry>[0][] = [
  { icon: CalendarIcon, label: "Calendar" },
  { icon: SmileIcon, label: "Search Emoji" },
  { icon: CalculatorIcon, label: "Calculator" },
]
const settings: Parameters<typeof Entry>[0][] = [
  { icon: UserIcon, label: "Profile", keys: "⌘P" },
  { icon: CreditCardIcon, label: "Billing", keys: "⌘B" },
  { icon: SettingsIcon, label: "Settings", keys: "⌘S" },
]

function SuggestionsGroup() {
  return (
    <CommandGroup heading="Suggestions">
      {suggestions.map((item) => (
        <Entry key={item.label} {...item} />
      ))}
    </CommandGroup>
  )
}

function SettingsGroup() {
  return (
    <CommandGroup heading="Settings">
      {settings.map((item) => (
        <Entry key={item.label} {...item} />
      ))}
    </CommandGroup>
  )
}

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <Command className="w-sm border" {...args}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {suggestions.map((item, i) => (
            // Calculator is disabled upstream.
            <Entry key={item.label} {...item} disabled={i === 2} />
          ))}
        </CommandGroup>
        <CommandSeparator />
        <SettingsGroup />
      </CommandList>
    </Command>
  ),
}

// The remaining upstream examples open the menu in a `CommandDialog`.
function CommandMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {children}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

export const Basic: Story = {
  render: () => (
    <CommandMenu>
      <CommandGroup heading="Suggestions">
        <CommandItem>Calendar</CommandItem>
        <CommandItem>Search Emoji</CommandItem>
        <CommandItem>Calculator</CommandItem>
      </CommandGroup>
    </CommandMenu>
  ),
}

// --- Variants -------------------------------------------------------------

export const Shortcuts: Story = {
  render: () => (
    <CommandMenu>
      <SettingsGroup />
    </CommandMenu>
  ),
}

export const Groups: Story = {
  render: () => (
    <CommandMenu>
      <SuggestionsGroup />
      <CommandSeparator />
      <SettingsGroup />
    </CommandMenu>
  ),
}

const scrollableGroups: [string, Parameters<typeof Entry>[0][]][] = [
  [
    "Navigation",
    [
      { icon: HomeIcon, label: "Home", keys: "⌘H" },
      { icon: InboxIcon, label: "Inbox", keys: "⌘I" },
      { icon: FileTextIcon, label: "Documents", keys: "⌘D" },
      { icon: FolderIcon, label: "Folders", keys: "⌘F" },
    ],
  ],
  [
    "Actions",
    [
      { icon: PlusIcon, label: "New File", keys: "⌘N" },
      { icon: FolderPlusIcon, label: "New Folder", keys: "⇧⌘N" },
      { icon: CopyIcon, label: "Copy", keys: "⌘C" },
      { icon: ScissorsIcon, label: "Cut", keys: "⌘X" },
      { icon: ClipboardPasteIcon, label: "Paste", keys: "⌘V" },
      { icon: TrashIcon, label: "Delete", keys: "⌫" },
    ],
  ],
  [
    "View",
    [
      { icon: LayoutGridIcon, label: "Grid View" },
      { icon: ListIcon, label: "List View" },
      { icon: ZoomInIcon, label: "Zoom In", keys: "⌘+" },
      { icon: ZoomOutIcon, label: "Zoom Out", keys: "⌘-" },
    ],
  ],
  [
    "Account",
    [
      ...settings,
      { icon: BellIcon, label: "Notifications" },
      { icon: HelpCircleIcon, label: "Help & Support" },
    ],
  ],
  [
    "Tools",
    [
      { icon: CalculatorIcon, label: "Calculator" },
      { icon: CalendarIcon, label: "Calendar" },
      { icon: ImageIcon, label: "Image Editor" },
      { icon: CodeIcon, label: "Code Editor" },
    ],
  ],
]

// `CommandList` caps its height and scrolls past that.
export const Scrollable: Story = {
  render: () => (
    <CommandMenu>
      {scrollableGroups.map(([heading, items], i) => (
        <React.Fragment key={heading}>
          {i > 0 && <CommandSeparator />}
          <CommandGroup heading={heading}>
            {items.map((item) => (
              <Entry key={item.label} {...item} />
            ))}
          </CommandGroup>
        </React.Fragment>
      ))}
    </CommandMenu>
  ),
}
