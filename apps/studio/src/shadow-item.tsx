import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
} from "@amit-kap/glaze/components/collapsible"
import { cn } from "@amit-kap/glaze/lib/utils"

import { NumberField, SettingItem } from "./controls"
import {
  formatShadow,
  parseShadow,
  shadowAlpha,
  withAlpha,
  type ShadowLayer,
} from "./shape"

// The five numbers of a layer: [label, hint, min, max, step].
const fields = [
  ["X", "Horizontal offset in pixels", -64, 64, 1],
  ["Y", "Vertical offset in pixels", -64, 64, 1],
  ["Blur", "Blur radius in pixels", 0, 100, 1],
  ["Spread", "Spread in pixels; negative pulls the shadow in", -50, 50, 1],
  ["Opacity", "Shadow opacity, in percent", 0, 100, 1],
] as const

/**
 * One shadow: a row with a swatch of the result, opening in place to the
 * numbers of each of its layers.
 */
export function ShadowItem({
  label,
  note,
  value,
  edited,
  onChange,
  onReset,
}: {
  label: string
  note: string
  value: string
  edited: boolean
  onChange: (value: string) => void
  onReset: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const layers = parseShadow(value)

  const update = (index: number, patch: Partial<ShadowLayer>) =>
    onChange(
      formatShadow(
        layers.map((layer, i) => (i === index ? { ...layer, ...patch } : layer))
      )
    )

  const read = (layer: ShadowLayer, name: (typeof fields)[number][0]) => {
    if (name === "X") return layer.x
    if (name === "Y") return layer.y
    if (name === "Blur") return layer.blur
    if (name === "Spread") return layer.spread
    return Math.round(shadowAlpha(layer.color) * 100)
  }

  const write = (
    index: number,
    layer: ShadowLayer,
    name: (typeof fields)[number][0],
    next: number
  ) => {
    if (name === "X") update(index, { x: next })
    else if (name === "Y") update(index, { y: next })
    else if (name === "Blur") update(index, { blur: next })
    else if (name === "Spread") update(index, { spread: next })
    else update(index, { color: withAlpha(layer.color, next / 100) })
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SettingItem label={label} note={note} edited={edited} onReset={onReset}>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
          className="h-control-xs gap-2 px-1 hover:bg-transparent aria-expanded:bg-transparent"
          onClick={() => setOpen(!open)}
        >
          <span
            aria-hidden
            className="size-5 rounded-(--shape-item) border border-border bg-background"
            style={{ boxShadow: value }}
          />
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast)",
              open && "rotate-180"
            )}
          />
        </Button>
      </SettingItem>

      <CollapsibleContent>
        <div className="flex flex-col gap-3 pb-2">
          {layers.map((layer, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              {layers.length > 1 && (
                <span className="text-micro text-muted-foreground">
                  Layer {index + 1}
                </span>
              )}
              <div className="grid grid-cols-5 gap-1.5">
                {fields.map(([name, hint, min, max, step]) => (
                  <div key={name} className="flex flex-col gap-1">
                    <span className="text-micro text-muted-foreground">
                      {name}
                    </span>
                    <NumberField
                      label={`${label} ${name.toLowerCase()}${
                        layers.length > 1 ? `, layer ${index + 1}` : ""
                      }`}
                      hint={hint}
                      value={read(layer, name)}
                      min={min}
                      max={max}
                      step={step}
                      className="w-full min-w-0 px-1.5"
                      onCommit={(next) => write(index, layer, name, next)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
