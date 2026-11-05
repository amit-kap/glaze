import * as React from "react"
import {
  ChevronDownIcon,
  DownloadIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { Input } from "@amit-kap/glaze/components/input"
import { Kbd } from "@amit-kap/glaze/components/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@amit-kap/glaze/components/popover"
import { Separator } from "@amit-kap/glaze/components/separator"

import { age, type SavedTheme } from "./library"
import { Logo } from "./logo"

export function TopBar({
  name,
  onNameChange,
  changes,
  onResetAll,
  saved,
  onSave,
  onExport,
  library,
  activeId,
  onOpen,
  onCreate,
  onImport,
  importError,
  onDelete,
}: {
  name: string
  onNameChange: (value: string) => void
  changes: number
  onResetAll: () => void
  saved: boolean
  onSave: () => void
  onExport: () => void
  library: SavedTheme[]
  activeId: string | null
  onOpen: (theme: SavedTheme) => void
  onCreate: () => void
  onImport: (file: File) => void
  importError: string | null
  onDelete: (id: string) => void
}) {
  const fileInput = React.useRef<HTMLInputElement>(null)
  return (
    <header className="flex h-15 shrink-0 items-center gap-3.5 px-8">
      <div className="flex items-center gap-4">
        <Logo />
        <div className="flex items-center gap-1">
          <Input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="ThemeName"
            aria-label="Theme name"
            className="h-7 w-60 rounded-control border-input bg-background px-2.5"
          />
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onImport(file)
              event.target.value = ""
            }}
          />
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Switch theme"
                />
              }
            >
              <ChevronDownIcon />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 gap-1 p-1">
              {library.length === 0 ? (
                <p className="px-2 py-3 text-center text-caption text-muted-foreground">
                  No saved themes. Save one to find it here.
                </p>
              ) : (
                library.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex items-center gap-1 rounded-control hover:bg-muted"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(theme)}
                      className="flex min-w-0 flex-1 flex-col items-start rounded-control px-2 py-1.5 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="w-full truncate text-body font-medium">
                        {theme.name}
                        {theme.id === activeId && (
                          <span className="ms-1.5 font-normal text-muted-foreground">
                            open
                          </span>
                        )}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {age(theme.savedAt)}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${theme.name}`}
                      onClick={() => onDelete(theme.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                ))
              )}
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={onCreate}
              >
                <PlusIcon />
                New theme
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => fileInput.current?.click()}
              >
                <UploadIcon />
                Import theme file
              </Button>
              {importError && (
                <p
                  role="alert"
                  className="px-2 py-1 text-caption text-destructive"
                >
                  {importError}
                </p>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="ms-auto flex min-w-0 flex-1 items-center justify-end gap-2">
        {__GLAZE_VERSION__ && (
          <span className="me-1 text-caption text-muted-foreground tabular-nums">
            Glaze {__GLAZE_VERSION__}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={changes === 0}
          title={`${changes} ${changes === 1 ? "setting" : "settings"} changed since the last save`}
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
          Export
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
