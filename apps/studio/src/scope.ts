import type * as React from "react"

import { cssVars, type Mode, type Theme } from "./theme"
import { motionVars, type MotionValues } from "./motion"
import { shapeVars, type ShapeValues } from "./shape"
import { typeVars, type TypeValues } from "./typography"

/**
 * Every theme value a framed preview wears, as inline custom properties. The
 * element that gets them also needs `data-theme="nova"` (the kit derives
 * tokens at `[data-theme]`) and, for dark, the `dark` class. Reduced motion
 * zeroes the movement scale, as the system setting does.
 */
export function previewVars({
  theme,
  mode,
  type,
  shape,
  motion,
  extraVars,
  reduceMotion = false,
}: {
  theme: Theme
  mode: Mode
  type: TypeValues
  shape: ShapeValues
  motion: MotionValues
  /** Component tokens a dial sets outright, as CSS custom properties. */
  extraVars: Record<string, string>
  reduceMotion?: boolean
}) {
  return {
    ...cssVars(theme[mode]),
    ...typeVars(type),
    ...shapeVars(shape),
    ...motionVars(motion),
    ...extraVars,
    ...(reduceMotion && { "--motion-scale": "0" }),
  } as React.CSSProperties
}
