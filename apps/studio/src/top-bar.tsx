import { DownloadIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { Input } from "@amit-kap/glaze/components/input"
import { Kbd } from "@amit-kap/glaze/components/kbd"
import { Separator } from "@amit-kap/glaze/components/separator"

import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"

import { Logo } from "./logo"
import type { Mode } from "./theme"

const modes: { value: Mode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
]

export function TopBar({
  name,
  onNameChange,
  changes,
  onResetAll,
  saved,
  copied,
  onSave,
  onExport,
  mode,
  onModeChange,
}: {
  name: string
  onNameChange: (value: string) => void
  changes: number
  onResetAll: () => void
  saved: boolean
  copied: boolean
  onSave: () => void
  onExport: () => void
  mode: Mode
  onModeChange: (mode: Mode) => void
}) {
  return (
    <header className="flex h-15 shrink-0 items-center gap-3.5 px-8">
      <div className="flex items-center gap-4">
        <Logo />
        <Input
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="ThemeName"
          aria-label="Theme name"
          className="h-7 w-60 rounded-control border-input bg-background px-2.5"
        />
      </div>

      <div className="ms-auto flex min-w-0 flex-1 items-center justify-end gap-2">
        <SegmentedControl
          size="sm"
          label="Mode being previewed"
          options={modes}
          value={mode}
          onValueChange={onModeChange}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={changes === 0}
          title={`${changes} ${changes === 1 ? "setting" : "settings"} changed from Nova`}
          onClick={onResetAll}
        >
          Reset all
          <Badge variant="secondary" className="tabular-nums">
            {changes}
          </Badge>
        </Button>

        <Button variant="outline" size="sm" onClick={onSave}>
          {saved ? "Saved" : "Save"}
          <Kbd>⌘S</Kbd>
        </Button>
        <Button size="sm" onClick={onExport}>
          <DownloadIcon />
          {copied ? "Copied" : "Export"}
        </Button>
        <div className="mx-0.5 flex h-4 items-center">
          <Separator orientation="vertical" />
        </div>
      </div>

      <Avatar>
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
    </header>
  )
}
