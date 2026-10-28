import * as React from "react"
import { ChevronDownIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
} from "@amit-kap/glaze/components/collapsible"
import { cn } from "@amit-kap/glaze/lib/utils"

/**
 * A card for a setting too rich for one field, drawn like the kit's
 * `ColorSelector`: a preview and the name on the left, a one-line readout and a
 * chevron on the right, and the editor opening beneath. Studio-only: the kit
 * has no card for a value that isn't a colour.
 */
export function SelectorCard({
  label,
  note,
  preview,
  readout,
  edited,
  onReset,
  children,
}: {
  label: string
  note: string
  /** What the setting looks like, small. */
  preview: React.ReactNode
  /** The value in a few characters, shown on the right. */
  readout: string
  edited: boolean
  onReset: () => void
  children: React.ReactNode
}) {
  const contentId = React.useId()
  const [open, setOpen] = React.useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        data-slot="selector-card"
        className="flex w-full flex-col rounded-control border border-border bg-background px-2 py-1 transition-colors has-[[data-slot=selector-card-header]:hover]:border-ring"
      >
        <div
          data-slot="selector-card-header"
          className="flex h-control-sm w-full items-center gap-1"
          onClick={() => setOpen(!open)}
        >
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={open}
            aria-controls={contentId}
            aria-label={label}
            className="h-control-sm min-w-0 shrink gap-1.5 px-0 hover:bg-transparent aria-expanded:bg-transparent"
          >
            {preview}
            <span className="truncate text-caption font-medium text-foreground">
              {label}
            </span>
          </Button>

          {edited && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Reset ${label}`}
              title={`Reset ${label}`}
              className="size-4 shrink-0 p-0 text-muted-foreground [&_svg]:size-4"
              onClick={(event) => {
                event.stopPropagation()
                onReset()
              }}
            >
              <RotateCcwIcon />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            aria-expanded={open}
            aria-controls={contentId}
            aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
            className="ms-auto h-control-sm shrink-0 gap-2 px-0 hover:bg-transparent aria-expanded:bg-transparent"
          >
            <span className="font-mono text-caption whitespace-nowrap text-muted-foreground">
              {readout}
            </span>
            <ChevronDownIcon
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast)",
                open && "rotate-180"
              )}
            />
          </Button>
        </div>

        <CollapsibleContent id={contentId}>
          <div className="flex w-full flex-col gap-3 py-2">
            {note && (
              <p className="text-caption text-muted-foreground">{note}</p>
            )}
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
