import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@amit-kap/glaze/components/empty"

import { Colors } from "./colors"
import { Shape } from "./shape-panel"
import { Type } from "./type"
import type { Draft } from "./draft"
import type { Tool } from "./rail"
import type { Density } from "./shape"
import type { Mode } from "./theme"

const notes: Record<Exclude<Tool, "colors" | "type" | "shape">, string> = {
  motion: "Motion settings will live here.",
}

/** The content column: the active tool's controls. */
export function Panel({
  tool,
  draft,
  mode,
  onModeChange,
  density,
  onDensityChange,
}: {
  tool: Tool
  draft: Draft
  mode: Mode
  onModeChange: (mode: Mode) => void
  density: Density
  onDensityChange: (density: Density) => void
}) {
  if (tool === "colors")
    return <Colors draft={draft} mode={mode} onModeChange={onModeChange} />

  if (tool === "type") return <Type draft={draft} />
  if (tool === "shape")
    return (
      <Shape
        draft={draft}
        density={density}
        onDensityChange={onDensityChange}
      />
    )

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
