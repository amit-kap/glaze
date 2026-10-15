import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import {
  BotIcon,
  CodeIcon,
  EyeIcon,
  LockIcon,
  MoonIcon,
  PencilIcon,
  SunIcon,
  UnlockIcon,
  UserIcon,
} from "lucide-react"

import { IconSwitch } from "@amit-kap/glaze/components/icon-switch"

const meta = {
  title: "Components/IconSwitch",
  component: IconSwitch,
  parameters: {
    docs: {
      description: {
        component:
          "A switch that toggles between two icons — both stay visible in a pill track while a thumb slides behind the active one. Use when a toggle has two distinct named states (e.g. person/bot, light/dark, lock/unlock) rather than plain on/off. Same state API as Switch (`checked`, `defaultChecked`, `onCheckedChange`); give it an `aria-label` naming what it switches.",
      },
    },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default"],
    },
  },
} satisfies Meta<typeof IconSwitch>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  args: {
    icon: <UserIcon />,
    checkedIcon: <BotIcon />,
    "aria-label": "Switch between human and agent mode",
  },
}

// --- Sizes -----------------------------------------------------------------

export const Sizes: Story = {
  args: {
    icon: <SunIcon />,
    checkedIcon: <MoonIcon />,
    "aria-label": "Toggle color mode",
  },
  render: () => (
    <div className="flex items-center gap-3">
      <IconSwitch
        size="sm"
        icon={<SunIcon />}
        checkedIcon={<MoonIcon />}
        aria-label="Toggle color mode"
      />
      <IconSwitch
        icon={<SunIcon />}
        checkedIcon={<MoonIcon />}
        aria-label="Toggle color mode"
      />
    </div>
  ),
}

// --- Controlled ------------------------------------------------------------

export const Controlled: Story = {
  args: {
    icon: <UnlockIcon />,
    checkedIcon: <LockIcon />,
    "aria-label": "Toggle lock",
  },
  render: () => {
    const [locked, setLocked] = useState(false)
    return (
      <div className="flex items-center gap-3">
        <IconSwitch
          checked={locked}
          onCheckedChange={setLocked}
          icon={<UnlockIcon />}
          checkedIcon={<LockIcon />}
          aria-label="Toggle lock"
        />
        <span className="text-body text-muted-foreground">
          {locked ? "Locked" : "Unlocked"}
        </span>
      </div>
    )
  },
}

// --- Compositions ----------------------------------------------------------

// Common pairings: mode, visibility, edit state.
export const Pairs: Story = {
  args: {
    icon: <UserIcon />,
    checkedIcon: <BotIcon />,
    "aria-label": "Switch between human and agent mode",
  },
  render: () => (
    <div className="flex items-center gap-3">
      <IconSwitch
        icon={<UserIcon />}
        checkedIcon={<BotIcon />}
        aria-label="Switch between human and agent mode"
      />
      <IconSwitch
        icon={<SunIcon />}
        checkedIcon={<MoonIcon />}
        defaultChecked
        aria-label="Toggle color mode"
      />
      <IconSwitch
        icon={<EyeIcon />}
        checkedIcon={<PencilIcon />}
        aria-label="Switch between preview and edit"
      />
      <IconSwitch
        icon={<CodeIcon />}
        checkedIcon={<EyeIcon />}
        aria-label="Switch between code and preview"
      />
    </div>
  ),
}
