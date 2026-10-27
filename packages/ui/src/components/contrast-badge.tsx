"use client"

import { contrastRatio, parseColor } from "@amit-kap/glaze/lib/color"
import { Badge } from "@amit-kap/glaze/components/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

/** The WCAG level a ratio reaches, as the label the badge shows. */
function contrastLevel(ratio: number) {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}

/**
 * How readable one colour is on another, as AA / AAA / Fail. Hovering shows
 * the ratio. Sits on the colour that does the reading — text on a fill, an
 * icon on a surface — so the pair is never ambiguous. Alpha is ignored;
 * contrast is judged on the colour itself.
 */
function ContrastBadge({
  foreground,
  background,
  className,
}: {
  /** The colour being read: text, icon or line. */
  foreground: string
  /** The colour behind it. */
  background: string
  className?: string
}) {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  if (!fg || !bg) return null

  const ratio = contrastRatio(fg, bg)
  const level = contrastLevel(ratio)
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Badge
            variant={level === "Fail" ? "destructive" : "outline"}
            className={className}
          />
        }
      >
        {level}
      </TooltipTrigger>
      <TooltipContent>{ratio.toFixed(2)}:1</TooltipContent>
    </Tooltip>
  )
}

export { ContrastBadge, contrastLevel }
