import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ClipboardPasteIcon,
  CopyIcon,
  PencilIcon,
  ScissorsIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@amit-kap/glaze/components/context-menu"

// Stories follow the upstream shadcn/ui (base-nova) Context Menu examples:
// https://ui.shadcn.com/docs/components/base/context-menu
const meta = {
  title: "Components/Context Menu",
  component: ContextMenu,
  subcomponents: {
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a menu to the user — such as a set of actions or functions — triggered by a right click or long press.",
      },
    },
  },
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

// The dashed area every upstream example right-clicks on.
function Area({ label = "here" }: { label?: string }) {
  return (
    <ContextMenuTrigger className="flex aspect-video w-xs items-center justify-center rounded-container border border-dashed text-body">
      <span className="hidden pointer-fine:inline-block">
        Right click {label}
      </span>
      <span className="hidden pointer-coarse:inline-block">
        Long press {label}
      </span>
    </ContextMenuTrigger>
  )
}

// A menu item with its keyboard shortcut — the most repeated shape here.
function ShortcutItem({
  label,
  keys,
  disabled,
  destructive,
}: {
  label: string
  keys: string
  disabled?: boolean
  destructive?: boolean
}) {
  return (
    <ContextMenuItem
      disabled={disabled}
      variant={destructive ? "destructive" : undefined}
    >
      {label}
      <ContextMenuShortcut>{keys}</ContextMenuShortcut>
    </ContextMenuItem>
  )
}

// The "More Tools" submenu, shared by the Default and Submenu stories.
function MoreToolsSub({ className }: { className?: string }) {
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
      <ContextMenuSubContent className={className}>
        <ContextMenuGroup>
          <ContextMenuItem>Save Page...</ContextMenuItem>
          <ContextMenuItem>Create Shortcut...</ContextMenuItem>
          <ContextMenuItem>Name Window...</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>Developer Tools</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>
  )
}

// --- Basic ----------------------------------------------------------------

// Upstream passes `checked` and `value` without handlers, which freezes the
// items; `defaultChecked` and `defaultValue` keep them interactive.
export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <Area />
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ShortcutItem label="Back" keys="⌘[" />
          <ShortcutItem label="Forward" keys="⌘]" disabled />
          <ShortcutItem label="Reload" keys="⌘R" />
          <MoreToolsSub className="w-44" />
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup defaultValue="pedro">
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem disabled>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

// --- Variants -------------------------------------------------------------

export const Submenu: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ShortcutItem label="Copy" keys="⌘C" />
          <ShortcutItem label="Cut" keys="⌘X" />
        </ContextMenuGroup>
        <MoreToolsSub />
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Shortcuts: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ShortcutItem label="Back" keys="⌘[" />
          <ShortcutItem label="Forward" keys="⌘]" disabled />
          <ShortcutItem label="Reload" keys="⌘R" />
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ShortcutItem label="Save" keys="⌘S" />
          <ShortcutItem label="Save As..." keys="⇧⌘S" />
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

const menuGroups: {
  label?: string
  items: { label: string; keys: string; destructive?: boolean }[]
}[] = [
  {
    label: "File",
    items: [
      { label: "New File", keys: "⌘N" },
      { label: "Open File", keys: "⌘O" },
      { label: "Save", keys: "⌘S" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", keys: "⌘Z" },
      { label: "Redo", keys: "⇧⌘Z" },
    ],
  },
  {
    items: [
      { label: "Cut", keys: "⌘X" },
      { label: "Copy", keys: "⌘C" },
      { label: "Paste", keys: "⌘V" },
    ],
  },
  { items: [{ label: "Delete", keys: "⌫", destructive: true }] },
]

export const Groups: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        {menuGroups.map((group, i) => (
          <React.Fragment key={group.label ?? i}>
            {i > 0 && <ContextMenuSeparator />}
            <ContextMenuGroup>
              {group.label && (
                <ContextMenuLabel>{group.label}</ContextMenuLabel>
              )}
              {group.items.map((item) => (
                <ShortcutItem key={item.label} {...item} />
              ))}
            </ContextMenuGroup>
          </React.Fragment>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Icons: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <CopyIcon />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <ScissorsIcon />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <ClipboardPasteIcon />
            Paste
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Checkboxes: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem defaultChecked>
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const Radio: Story = {
  render: function Render() {
    const [user, setUser] = React.useState("pedro")
    const [theme, setTheme] = React.useState("light")

    return (
      <ContextMenu>
        <Area />
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioGroup value={user} onValueChange={setUser}>
              <ContextMenuRadioItem value="pedro">
                Pedro Duarte
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="colm">
                Colm Tuite
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Theme</ContextMenuLabel>
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
              <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
              <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    )
  },
}

export const Destructive: Story = {
  render: () => (
    <ContextMenu>
      <Area />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <PencilIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <ShareIcon />
            Share
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

const SIDES = ["top", "right", "bottom", "left"] as const

// Use `side` on the content to open the menu away from the pointer.
export const Sides: Story = {
  render: () => (
    <div className="grid w-2xl grid-cols-2 gap-4">
      {SIDES.map((side) => (
        <ContextMenu key={side}>
          <Area label={`(${side})`} />
          <ContextMenuContent side={side}>
            <ContextMenuGroup>
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem>Forward</ContextMenuItem>
              <ContextMenuItem>Reload</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  ),
}
