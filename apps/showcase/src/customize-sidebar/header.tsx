import * as React from "react"
import { BookmarkCheckIcon } from "lucide-react"

import { builtInThemes } from "@amit-kap/glaze/lib/config"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@amit-kap/glaze/components/alert-dialog"
import { Badge } from "@amit-kap/glaze/components/badge"
import { FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

import type { StudioActions } from "../control-panel/actions"
import type { BaseTheme } from "../theme-builder"

// A one-line character sketch per base theme, so the picker reads as a
// choice of look rather than a list of names.
const hints: Record<BaseTheme, string> = {
  nova: "Geist, 10px corners",
  vega: "Inter, tall controls",
  maia: "Figtree, pill controls",
  lyra: "Mono, square",
  mira: "Inter, compact",
  luma: "Inter, round cards",
  sera: "Noto + Playfair, square",
  rhea: "Inter, soft corners",
  gr8r: "Warm neutrals, indigo",
}
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)
const baseItems = builtInThemes.map((value) => ({
  value,
  label: capitalize(value),
}))

// The theme's identity under the panel title: which base it builds on, its
// name, and how far it has drifted from the base. Labels share the w-20
// column of the colour rows below so the panel reads as one form.
export function ThemeHeader({
  actions,
  name = "",
}: {
  actions: StudioActions
  /** The draft's name; lives on `Custom`, not on the actions. */
  name?: string
}) {
  // Switching base clears the overrides, so with changes pending the pick
  // is parked here until the user confirms.
  const [pending, setPending] = React.useState<BaseTheme | null>(null)
  const pick = (base: BaseTheme) => {
    if (base === actions.base) return
    if (actions.changeCount > 0) setPending(base)
    else actions.setBase(base)
  }
  const n = actions.changeCount

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor="theme-base" className="w-20 shrink-0">
          Based on
        </FieldLabel>
        <Select
          items={baseItems}
          value={actions.base}
          onValueChange={(v) => v && pick(v as BaseTheme)}
        >
          <SelectTrigger id="theme-base" className="min-w-0 flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {baseItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <span>{item.label}</span>
                  <span className="text-caption text-muted-foreground">
                    {hints[item.value]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Switch base theme?</AlertDialogTitle>
            <AlertDialogDescription>
              Your {n} {n === 1 ? "change" : "changes"} will be cleared. Save
              the theme first to keep {n === 1 ? "it" : "them"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) actions.setBase(pending)
                setPending(null)
              }}
            >
              Switch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
