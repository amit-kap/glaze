"use client"

import type { ReactNode } from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@amit-kap/glaze/lib/utils"

// A switch that toggles between two icons instead of on/off alone: both
// icons stay visible in a pill track and a thumb slides behind the active
// one. The cells are `relative` so icons paint above the sliding thumb
// without z-index. Icon color and thumb position both follow data-checked.
const sizes = {
  sm: {
    root: "h-control-xs p-0.5",
    cell: "size-5 [&_svg:not([class*='size-'])]:size-3.5",
    // start offset = root padding; travel = one cell width.
    thumb:
      "inset-y-0.5 inset-s-0.5 size-5 data-checked:translate-x-5 rtl:data-checked:-translate-x-5",
  },
  default: {
    root: "h-control-md p-1",
    cell: "size-6 [&_svg:not([class*='size-'])]:size-4.5",
    thumb:
      "inset-y-1 inset-s-1 size-6 data-checked:translate-x-6 rtl:data-checked:-translate-x-6",
  },
}

function IconSwitch({
  className,
  size = "default",
  icon,
  checkedIcon,
  ...props
}: SwitchPrimitive.Root.Props & {
  /** Icon for the unchecked (start) side. */
  icon: ReactNode
  /** Icon for the checked (end) side. */
  checkedIcon: ReactNode
  size?: keyof typeof sizes
}) {
  const cell = cn("relative grid place-items-center", sizes[size].cell)
  return (
    <SwitchPrimitive.Root
      data-slot="icon-switch"
      className={cn(
        "group/icon-switch relative inline-flex shrink-0 items-center rounded-pill border bg-secondary transition-colors outline-none focus-visible:border-ring data-disabled:cursor-not-allowed data-disabled:opacity-50",
        sizes[size].root,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="icon-switch-thumb"
        className={cn(
          "pointer-events-none absolute rounded-pill bg-primary transition-transform duration-(--duration-moderate) ease-spring",
          sizes[size].thumb
        )}
      />
      <span
        data-slot="icon-switch-off-icon"
        className={cn(
          cell,
          "text-muted-foreground transition-colors duration-(--duration-moderate) group-data-[unchecked]/icon-switch:text-primary-foreground"
        )}
      >
        {icon}
      </span>
      <span
        data-slot="icon-switch-on-icon"
        className={cn(
          cell,
          "text-muted-foreground transition-colors duration-(--duration-moderate) group-data-[checked]/icon-switch:text-primary-foreground"
        )}
      >
        {checkedIcon}
      </span>
    </SwitchPrimitive.Root>
  )
}

export { IconSwitch }
