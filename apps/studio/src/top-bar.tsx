import { DownloadIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import { Input } from "@amit-kap/glaze/components/input"
import { Kbd } from "@amit-kap/glaze/components/kbd"

import { Logo } from "./logo"

export function TopBar({
  name,
  onNameChange,
  changes,
  saved,
  copied,
  onSave,
  onExport,
}: {
  name: string
  onNameChange: (value: string) => void
  changes: number
  saved: boolean
  copied: boolean
  onSave: () => void
  onExport: () => void
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
        {changes > 0 && (
          <span
            title={`${changes} ${changes === 1 ? "setting" : "settings"} changed from Nova`}
            className="me-1 flex h-5 min-w-5 items-center justify-center rounded-pill bg-muted px-2 text-caption font-medium text-muted-foreground tabular-nums"
          >
            {changes}
          </span>
        )}

        <Button variant="outline" size="sm" onClick={onSave}>
          {saved ? "Saved" : "Save"}
          <Kbd>⌘S</Kbd>
        </Button>
        <Button size="sm" onClick={onExport}>
          <DownloadIcon />
          {copied ? "Copied" : "Export"}
        </Button>
        <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-border" />
      </div>

      <Avatar>
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
    </header>
  )
}
