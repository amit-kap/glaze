"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@amit-kap/glaze/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-pill border border-transparent transition outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-(--switch-height) data-[size=default]:w-(--switch-width) data-[size=sm]:h-(--switch-height-sm) data-[size=sm]:w-(--switch-width-sm) dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-pill bg-background ring-0 transition-transform group-data-[size=default]/switch:size-(--switch-thumb) group-data-[size=sm]/switch:size-(--switch-thumb-sm) group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-(--spacing(0.5)))] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-(--spacing(0.5)))] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
