import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@amit-kap/glaze/lib/utils"
import { fieldState, textControl } from "@amit-kap/glaze/lib/control-styles"

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: "mini" | "sm" | "default"
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "h-control-md w-full min-w-0 rounded-control border border-input bg-(--input-fill) px-2.5 py-1 transition-colors outline-none file:inline-flex file:h-control-xs file:border-0 file:bg-transparent file:text-body file:font-medium file:text-foreground placeholder:text-muted-foreground data-[size=mini]:h-control-xs data-[size=mini]:rounded-(--button-radius-xs) data-[size=mini]:px-2 data-[size=mini]:py-0 data-[size=mini]:text-caption data-[size=sm]:h-control-sm data-[size=sm]:rounded-(--button-radius-xs) dark:bg-input/30",
        textControl,
        fieldState,
        className
      )}
      {...props}
    />
  )
}

export { Input }
