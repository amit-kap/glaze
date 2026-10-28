import { PlusIcon, XIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { ColorPickerPopover } from "@amit-kap/glaze/components/color-picker"

import { SliderField } from "./controls"
import { SelectorCard } from "./selector-card"
import {
  formatShadow,
  parseShadow,
  shadowAlpha,
  withAlpha,
  type ShadowLayer,
} from "./shape"

const newLayer: ShadowLayer = {
  x: 0,
  y: 2,
  blur: 4,
  spread: 0,
  color: "rgb(0 0 0 / 0.1)",
  inset: false,
}

/**
 * One shadow, edited as a `SelectorCard`: the card shows the result, and
 * opening it gives a live tile on the page and, per layer, sliders for the
 * offset, blur, spread and opacity plus a picker for the colour.
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
  const layers = parseShadow(value)
  const commit = (next: ShadowLayer[]) => onChange(formatShadow(next))
  const update = (index: number, patch: Partial<ShadowLayer>) =>
    commit(
      layers.map((layer, i) => (i === index ? { ...layer, ...patch } : layer))
    )

  return (
    <SelectorCard
      label={label}
      note={note}
      edited={edited}
      onReset={onReset}
      readout={`${layers.length} ${layers.length === 1 ? "layer" : "layers"}`}
      preview={
        <span
          aria-hidden
          className="size-4 shrink-0 rounded-(--shape-item) border border-border bg-background"
          style={{ boxShadow: value }}
        />
      }
    >
      <div className="flex h-24 items-center justify-center rounded-md bg-muted">
        <div
          aria-hidden
          className="h-12 w-28 rounded-(--shape-container) bg-background"
          style={{ boxShadow: value }}
        />
      </div>

      {layers.map((layer, index) => {
        const name = layers.length > 1 ? `${label}, layer ${index + 1}` : label
        return (
          <div
            key={index}
            role="group"
            aria-label={name}
            className="flex flex-col gap-2"
          >
            <div className="flex h-control-sm items-center gap-1">
              <span className="text-caption font-medium text-foreground">
                {layers.length > 1 ? `Layer ${index + 1}` : "Layer"}
              </span>
              <ColorPickerPopover
                triggerLabel="Colour"
                compact
                format="rgb"
                value={layer.color}
                triggerClassName="ms-1"
                onValueChange={(color) => update(index, { color })}
              />
              {layers.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="ms-auto"
                  aria-label={`Remove ${name}`}
                  onClick={() => commit(layers.filter((_, i) => i !== index))}
                >
                  <XIcon />
                </Button>
              )}
            </div>
            <SliderField
              name={name}
              label="X (px)"
              hint="Horizontal offset in pixels"
              value={layer.x}
              min={-64}
              max={64}
              step={1}
              onCommit={(x) => update(index, { x })}
            />
            <SliderField
              name={name}
              label="Y (px)"
              hint="Vertical offset in pixels"
              value={layer.y}
              min={-64}
              max={64}
              step={1}
              onCommit={(y) => update(index, { y })}
            />
            <SliderField
              name={name}
              label="Blur (px)"
              hint="Blur radius in pixels"
              value={layer.blur}
              min={0}
              max={100}
              step={1}
              onCommit={(blur) => update(index, { blur })}
            />
            <SliderField
              name={name}
              label="Spread (px)"
              hint="Spread in pixels; negative pulls the shadow in"
              value={layer.spread}
              min={-50}
              max={50}
              step={1}
              onCommit={(spread) => update(index, { spread })}
            />
            <SliderField
              name={name}
              label="Opacity (%)"
              hint="Shadow opacity, in percent"
              value={Math.round(shadowAlpha(layer.color) * 100)}
              min={0}
              max={100}
              step={1}
              onCommit={(percent) =>
                update(index, { color: withAlpha(layer.color, percent / 100) })
              }
            />
          </div>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => commit([...layers, newLayer])}
      >
        <PlusIcon />
        Add layer
      </Button>
    </SelectorCard>
  )
}
