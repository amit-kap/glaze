import { PaletteIcon, ShapesIcon, TypeIcon, WavesIcon } from "lucide-react"

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
      className="flex w-[52px] shrink-0 flex-col items-stretch gap-2"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const current = id === value
        return (
          <button
            key={id}
            type="button"
            aria-current={current ? "page" : undefined}
            onClick={() => onChange(id)}
            className={cn(
              "flex h-[50px] flex-col items-center justify-center gap-2 rounded-lg p-2 transition-colors",
              current
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className={cn("size-4", !current && "text-foreground")} />
            <span className="text-micro leading-none font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
