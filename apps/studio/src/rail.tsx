import { PaletteIcon, ShapesIcon, TypeIcon, WavesIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { cn } from "@amit-kap/glaze/lib/utils"

const items = [
  { id: "colors", label: "Colors", icon: PaletteIcon },
  { id: "type", label: "Type", icon: TypeIcon },
  { id: "shape", label: "Shape", icon: ShapesIcon },
  { id: "motion", label: "Motion", icon: WavesIcon },
] as const

export type Tool = (typeof items)[number]["id"]

export function Rail({
  value,
  onChange,
}: {
  value: Tool
  onChange: (tool: Tool) => void
}) {
  return (
    <nav
      aria-label="Tools"
      className="flex w-13 shrink-0 flex-col items-stretch gap-2"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const current = id === value
        return (
          <Button
            key={id}
            variant={current ? "default" : "ghost"}
            aria-current={current ? "page" : undefined}
            onClick={() => onChange(id)}
            className={cn(
              "h-12.5 w-13 flex-col gap-2 rounded-lg p-2",
              !current && "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className={cn("size-4", !current && "text-foreground")} />
            <span className="text-micro leading-none font-medium">{label}</span>
          </Button>
        )
      })}
    </nav>
  )
}
