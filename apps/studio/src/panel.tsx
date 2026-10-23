import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@amit-kap/glaze/components/empty"
import { cn } from "@amit-kap/glaze/lib/utils"

import type { Tool } from "./rail"

const notes: Record<Tool, string> = {
  colors: "Colour settings will live here.",
  type: "Type settings will live here.",
  shape: "Shape settings will live here.",
  motion: "Motion settings will live here.",
}

/** The content column. Each tool gets its own panel; none are built yet. */
export function Panel({ tool }: { tool: Tool }) {
  return (
    <Empty className={cn("border-0")}>
      <EmptyHeader>
        <EmptyDescription className="text-caption">
          {notes[tool]}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
