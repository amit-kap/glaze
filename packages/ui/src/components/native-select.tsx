import * as React from "react"
import { cn } from "@amit-kap/glaze/lib/utils"
import { fieldState } from "@amit-kap/glaze/lib/control-styles"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-disabled",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "h-control-md w-full min-w-0 appearance-none rounded-control border border-input bg-(--input-fill) py-1 ps-2.5 pe-8 text-body transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground data-[size=sm]:h-control-sm data-[size=sm]:rounded-(--button-radius-xs) data-[size=sm]:py-0.5 dark:bg-input/30",
          fieldState,
          // the wrapper fades the select and its chevron together
          "disabled:opacity-100"
        )}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute inset-e-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
