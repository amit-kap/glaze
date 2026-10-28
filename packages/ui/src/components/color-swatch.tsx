"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { formatColor, parseColor } from "@amit-kap/glaze/lib/color"
import { cn } from "@amit-kap/glaze/lib/utils"

// A colour reads as a sample, not a tile: always a full circle, whatever the
// theme's corner radius says.
const sizes = {
  xs: "size-4 rounded-pill",
  sm: "size-6 rounded-pill",
  md: "size-9 rounded-pill",
} as const

// A checkerboard under the colour, so transparency reads as transparency
// instead of as whatever is behind the swatch.
const checker =
  "repeating-conic-gradient(var(--border) 0 25%, var(--background) 0 50%) 0 0 / 8px 8px"

/**
 * A colour, drawn. The only way Glaze shows a colour value on its own: use it
 * in lists, drill-downs and headers, and let `ColorPicker` edit the value.
 * Decorative by default; pass `label` when the swatch is the only clue to what
 * the colour is, or `render` to make it a button.
 */
function ColorSwatch({
  className,
  value,
  size = "sm",
  label,
  render,
  ...props
}: useRender.ComponentProps<"span"> & {
  /** Any CSS colour the picker can read: hex, rgb(), hsl() or oklch(). */
  value: string
  size?: keyof typeof sizes
  /** Names the colour for assistive tech. Omit when text beside it does. */
  label?: string
}) {
  const parsed = parseColor(value)
  const fill = parsed ? formatColor(parsed, "rgb") : undefined
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "aria-hidden": label ? undefined : true,
        "aria-label": label,
        className: cn(
          "inline-block shrink-0 border border-foreground/20 bg-muted",
          sizes[size],
          className
        ),
        style: fill
          ? { background: `linear-gradient(${fill}, ${fill}), ${checker}` }
          : { background: checker },
      },
      props
    ),
    render,
    state: { slot: "color-swatch", size },
  })
}

export { ColorSwatch }
