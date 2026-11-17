import * as React from "react"
import { cn } from "@amit-kap/glaze/lib/utils"
import { fieldState, textControl } from "@amit-kap/glaze/lib/control-styles"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-(--textarea-min-height) w-full rounded-(--textarea-radius) border border-input bg-(--input-fill) px-2.5 py-2 transition-colors outline-none placeholder:text-muted-foreground dark:bg-input/30",
        textControl,
        fieldState,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
