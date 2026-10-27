import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@amit-kap/glaze/components/empty"

import { Colors } from "./colors"
import { Type } from "./type"
import type { Draft } from "./draft"
import type { Tool } from "./rail"
import type { Mode } from "./theme"

const notes: Record<Exclude<Tool, "colors" | "type">, string> = {
  shape: "Shape settings will live here.",
  motion: "Motion settings will live here.",
}

/** The content column: the active tool's controls. */
export function Panel({
  tool,
  draft,
  mode,
  onModeChange,
}: {
  tool: Tool
  draft: Draft
  mode: Mode
  onModeChange: (mode: Mode) => void
}) {
  if (tool === "colors")
    return <Colors draft={draft} mode={mode} onModeChange={onModeChange} />

  if (tool === "type") return <Type draft={draft} />

  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyDescription className="text-caption">
          {notes[tool]}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
