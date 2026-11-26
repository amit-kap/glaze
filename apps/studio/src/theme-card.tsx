import * as React from "react"
import { EllipsisIcon, type LucideIcon } from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@amit-kap/glaze/components/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import { cn } from "@amit-kap/glaze/lib/utils"

import { toneComponentVars } from "./dials"
import type { Stored } from "./draft"
import { previewVars } from "./scope"
import type { Mode } from "./theme"

/** A font stack's first family: `"Inter Variable", sans-serif` is "Inter". */
const familyOf = (css: string) =>
  css.match(/^\s*"?([^",]+?)(?: Variable)?"?\s*,/)?.[1] ?? ""

/** The fonts as the card names them: the heading font first, if it differs. */
export function fontNames(stored: Stored) {
  const body = familyOf(stored.type["typeface-sans"])
  const heading = familyOf(stored.type["typeface-heading"])
  return heading && heading !== body ? `${heading} · ${body}` : body
}

export type EntryAction = {
  label: string
  icon: LucideIcon
  run: () => void
  destructive?: boolean
}

/** What a files page shows for one theme or template, in a card or a row. */
export type Entry = {
  key: string
  name: string
  stored: Stored
  /** When it was saved ("3m ago"), or "Template". */
  saved: string
  /** The card's line under the name, when "Saved …" is not the one to show. */
  caption?: string
  testId: string
  template?: string
  /** Absent when the entry is not openable, like an archived theme. */
  onOpen?: () => void
  /** The "more" menu, also the right-click menu. */
  actions?: EntryAction[]
  /** One action shown as a button of its own, like Restore in the archive. */
  primary?: EntryAction
}

const swatches = [
  "bg-brand",
  "bg-primary",
  "bg-background",
  "bg-foreground",
  "bg-muted",
]

/** One half of the preview, wearing the theme in one mode. */
export function Pane({
  stored,
  mode,
  className,
  children,
}: {
  stored: Stored
  mode: Mode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-theme="nova"
      data-density="comfortable"
      style={previewVars({
        theme: stored.theme,
        mode,
        type: stored.type,
        shape: stored.shape,
        motion: stored.motion,
        extraVars: toneComponentVars(stored.dials.tone),
      })}
      className={cn(
        "flex flex-col bg-background font-sans font-normal text-foreground",
        mode === "dark" && "dark",
        className
      )}
    >
      {children}
    </div>
  )
}

/** The entry's own button (Restore), then the "more" button and its menu. */
export function EntryMenu({ entry }: { entry: Entry }) {
  const { primary, actions = [] } = entry
  // The primary action has its button, so the menu holds only the rest.
  const rest = actions.filter((action) => action !== primary)
  return (
    <div className="flex items-center justify-end gap-1">
      {primary && (
        <Button variant="outline" size="sm" onClick={primary.run}>
          <primary.icon />
          {primary.label}
        </Button>
      )}
      {rest.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            data-testid="theme-actions"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${entry.name}`}
              />
            }
          >
            <EllipsisIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            {rest.map(({ label, icon: Icon, run, destructive }) => (
              <DropdownMenuItem
                key={label}
                variant={destructive ? "destructive" : "default"}
                onClick={run}
              >
                <Icon />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

/** A right-click on a card or a row opens the same actions as its menu. */
export function EntryContextMenu({
  entry,
  children,
}: {
  entry: Entry
  children: React.ReactElement
}) {
  if (!entry.actions?.length) return children
  return (
    <ContextMenu>
      <ContextMenuTrigger render={children} />
      <ContextMenuContent className="min-w-40">
        {entry.actions.map(({ label, icon: Icon, run, destructive }) => (
          <ContextMenuItem
            key={label}
            variant={destructive ? "destructive" : "default"}
            onClick={run}
          >
            <Icon />
            {label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}

/**
 * A small tile wearing the theme: its heading font on its page colour. The
 * frame is Studio's, so every tile is one size; a theme's own spacing scale
 * only reaches what is inside the pane.
 */
export function ThemeTile({ stored }: { stored: Stored }) {
  return (
    <span className="flex size-10 shrink-0 overflow-hidden rounded-control border">
      <Pane
        stored={stored}
        mode="light"
        className="size-full items-center justify-center"
      >
        <span className="font-heading text-title leading-none font-strong">
          Aa
        </span>
      </Pane>
    </span>
  )
}

/**
 * A theme as a card: its name and when it was saved, then a live preview in
 * light and dark. Only the two preview panes wear the theme; the card around
 * them is Studio's own.
 */
export function ThemeCard({ entry }: { entry: Entry }) {
  const { name, stored, saved, caption, onOpen, testId, template } = entry
  return (
    <EntryContextMenu entry={entry}>
      <Card
        size="sm"
        className={cn(
          "relative pb-1.5 transition-shadow duration-(--duration-fast) has-focus-visible:ring-2 has-focus-visible:ring-ring",
          onOpen && "hover:shadow-raised"
        )}
        // An archived card has no opener, so the card itself is the landmark.
        {...(onOpen
          ? {}
          : { role: "group", "aria-label": name, "data-testid": testId })}
      >
        <CardHeader>
          <CardTitle className="truncate">{name}</CardTitle>
          <CardDescription className="text-caption">
            {caption ?? (template ? saved : `Saved ${saved}`)}
          </CardDescription>
          {/* Above the overlay button, so the menu takes its own clicks. */}
          <CardAction className="relative z-raised">
            <EntryMenu entry={entry} />
          </CardAction>
        </CardHeader>
        <CardContent className="px-1.5">
          {/* The preview is only a picture, so it is inert: its Button and Badge
            are the real components, but the card's one button is the overlay. */}
          <div
            inert
            aria-hidden="true"
            className="flex aspect-4/3 w-full overflow-hidden rounded-control border"
          >
            <Pane
              stored={stored}
              mode="light"
              className="flex-1 justify-between p-5"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-heading text-display leading-none font-strong">
                  Aa
                </span>
                <span className="truncate text-caption text-muted-foreground">
                  {fontNames(stored)}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-1.5">
                  {swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className={cn(
                        "size-5 rounded-pill border border-border",
                        swatch
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm">Continue</Button>
                  <Badge>New</Badge>
                </div>
              </div>
            </Pane>
            <Pane
              stored={stored}
              mode="dark"
              className="w-2/5 justify-between border-s p-4"
            >
              <span className="font-heading text-heading leading-none font-strong">
                Aa
              </span>
              <div className="flex flex-col items-start gap-2">
                <Button size="sm">Continue</Button>
                <Badge>New</Badge>
              </div>
            </Pane>
          </div>
        </CardContent>
        {onOpen && (
          <button
            type="button"
            onClick={onOpen}
            aria-label={name}
            data-testid={testId}
            data-template={template}
            className="absolute inset-0 rounded-container outline-none"
          />
        )}
      </Card>
    </EntryContextMenu>
  )
}
