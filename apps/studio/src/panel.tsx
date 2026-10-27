import { Colors } from "./colors"
import { Motion } from "./motion-panel"
import { Shape } from "./shape-panel"
import { Type } from "./type"
import type { Draft } from "./draft"
import type { Tool } from "./rail"
import type { Density } from "./shape"
import type { Mode } from "./theme"

/** The content column: the active tool's controls. */
export function Panel({
  tool,
  draft,
  mode,
  onModeChange,
  density,
  onDensityChange,
  reduceMotion,
  onReduceMotionChange,
}: {
  tool: Tool
  draft: Draft
  mode: Mode
  onModeChange: (mode: Mode) => void
  density: Density
  onDensityChange: (density: Density) => void
  reduceMotion: boolean
  onReduceMotionChange: (reduce: boolean) => void
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
    <Motion
      draft={draft}
      reduceMotion={reduceMotion}
      onReduceMotionChange={onReduceMotionChange}
    />
  )
}
