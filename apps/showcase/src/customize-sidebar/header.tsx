import { BookmarkCheckIcon } from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"

import type { StudioActions } from "../control-panel/actions"

// The theme's identity under the panel title: the base it builds on, its
// name, and how far it has drifted from Nova. Labels share the w-20 column
// of the colour rows below so the panel reads as one form.
export function ThemeHeader({
  actions,
  name = "",
}: {
  actions: StudioActions
  /** The draft's name; lives on `Custom`, not on the actions. */
  name?: string
}) {
  const n = actions.changeCount

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-20 shrink-0 text-caption text-muted-foreground">
          Based on
        </span>
        <span className="min-w-0 flex-1">Nova</span>
      </div>
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor="theme-name" className="w-20 shrink-0">
          Name
        </FieldLabel>
        <Input
          id="theme-name"
          value={name}
          placeholder="Untitled theme"
          onChange={(e) => actions.setName(e.target.value)}
          className="min-w-0 flex-1"
        />
        <span className="flex shrink-0 items-center gap-1.5">
          {n === 0 ? (
            <Badge variant="outline" className="text-muted-foreground">
              Unchanged
            </Badge>
          ) : (
            <Badge variant="secondary">
              {n} {n === 1 ? "change" : "changes"}
            </Badge>
          )}
          {actions.savedId && (
            <BookmarkCheckIcon
              role="img"
              aria-label="In your library"
              className="size-4 text-muted-foreground"
            >
              <title>In your library</title>
            </BookmarkCheckIcon>
          )}
        </span>
      </div>
    </div>
  )
}
