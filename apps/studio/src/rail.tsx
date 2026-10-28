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
      className="flex w-11 shrink-0 flex-col items-stretch gap-2"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const current = id === value
        return (
          <Button
            key={id}
            variant={current ? "default" : "ghost"}
            aria-current={current ? "page" : undefined}
            aria-label={label}
            title={label}
            onClick={() => onChange(id)}
            className={cn(
              "size-11 rounded-lg p-2",
              !current && "bg-transparent text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-5" />
          </Button>
        )
      })}
    </nav>
  )
}
