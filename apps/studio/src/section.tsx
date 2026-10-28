import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
} from "@amit-kap/glaze/components/collapsible"
import { cn } from "@amit-kap/glaze/lib/utils"

/**
 * A titled group in a tool's panel. It opens as a whole; the note explains
 * the group while it's open.
 */
export function PanelSection({
  title,
  note,
  defaultOpen = false,
  children,
}: {
  title: string
  note?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = React.useState(defaultOpen)

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <section className="flex flex-col gap-1 border-b border-border">
        <Button
          variant="ghost"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="h-auto w-full flex-col items-stretch gap-0 border-0 px-0 py-2.5 whitespace-normal hover:bg-transparent focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid aria-expanded:bg-transparent"
        >
          <span className="flex w-full items-center justify-between">
            <span className="text-body font-medium text-foreground">
              {title}
            </span>
            <ChevronDownIcon
              className={cn(
                "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast)",
                expanded && "rotate-180"
              )}
            />
          </span>
          {note && (
            <span
              aria-hidden={!expanded}
              className={cn(
                "grid w-full text-left transition-[grid-template-rows,margin-top] duration-(--duration-moderate) ease-standard",
                expanded && "mt-1"
              )}
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <span className="min-h-0 overflow-clip text-caption text-muted-foreground">
                {note}
              </span>
            </span>
          )}
        </Button>

        <CollapsibleContent>
          <div className="mb-2 flex flex-col gap-1">{children}</div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  )
}
