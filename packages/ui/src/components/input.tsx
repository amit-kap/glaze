import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@amit-kap/glaze/lib/utils"

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: "default" | "sm"
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "h-control-md w-full min-w-0 rounded-control border border-input bg-(--input-fill) px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-control-xs file:border-0 file:bg-transparent file:text-body file:font-medium file:text-foreground placeholder:text-muted-foreground user-invalid:border-destructive user-invalid:ring-3 user-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-control-sm data-[size=sm]:rounded-(--button-radius-xs) md:text-body dark:bg-input/30 dark:user-invalid:border-destructive/50 dark:user-invalid:ring-destructive/40 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
