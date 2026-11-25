import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { cn } from "@amit-kap/glaze/lib/utils"

import { toneComponentVars } from "./dials"
import type { Stored } from "./draft"
import { previewVars } from "./scope"
import type { Mode } from "./theme"

/** A font stack's first family: `"Inter Variable", sans-serif` is "Inter". */
const familyOf = (css: string) =>
  css.match(/^\s*"?([^",]+?)(?: Variable)?"?\s*,/)?.[1] ?? ""

/** The fonts as the card names them: the heading font first, if it differs. */
function fontNames(stored: Stored) {
  const body = familyOf(stored.type["typeface-sans"])
  const heading = familyOf(stored.type["typeface-heading"])
  return heading && heading !== body ? `${heading} · ${body}` : body
}

const swatches = [
  "bg-brand",
  "bg-primary",
  "bg-background",
  "bg-foreground",
  "bg-muted",
]

/** One half of the preview, wearing the theme in one mode. */
function Pane({
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

/**
 * A theme as a card: a live preview in light and dark, then its name. Only the
 * two preview panes wear the theme; the card around them is Studio's own.
 */
export function ThemeCard({
  name,
  stored,
  meta,
  onOpen,
  onDelete,
  testId,
  template,
}: {
  name: string
  stored: Stored
  /** A quiet line beside the name, such as when the theme was saved. */
  meta?: string
  onOpen: () => void
  onDelete?: () => void
  testId: string
  template?: string
}) {
  return (
    <div className="group relative flex flex-col gap-3">
      {/* The preview is only a picture, so it is inert: its Button and Badge
          are the real components, but the card's one button is the overlay. */}
      <div
        inert
        aria-hidden="true"
        className={cn(
          "flex aspect-4/3 w-full overflow-hidden rounded-container border transition-shadow duration-(--duration-fast)",
          "group-hover:shadow-raised group-has-focus-visible:ring-2 group-has-focus-visible:ring-ring"
        )}
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
      <div className="flex items-baseline justify-between gap-3 px-0.5">
        <span className="truncate text-body font-medium">{name}</span>
        {meta && (
          <span className="shrink-0 text-caption text-muted-foreground">
            {meta}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label={name}
        data-testid={testId}
        data-template={template}
        className="absolute inset-0 rounded-container outline-none"
      />
      {onDelete && (
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={`Delete ${name}`}
          onClick={onDelete}
          className="absolute inset-e-2 top-2 z-raised opacity-0 transition-opacity duration-(--duration-fast) group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <Trash2Icon />
        </Button>
      )}
    </div>
  )
}

/** The card that starts a new theme from Nova. */
export function NewThemeCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="new-theme-card"
      className="group flex w-full flex-col gap-3 text-start outline-none"
    >
      <span className="flex aspect-4/3 w-full items-center justify-center rounded-container border border-dashed text-muted-foreground transition-colors duration-(--duration-fast) group-hover:bg-muted group-hover:text-foreground group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <PlusIcon className="size-6" />
      </span>
      <span className="px-0.5 text-body font-medium">New theme</span>
    </button>
  )
}
