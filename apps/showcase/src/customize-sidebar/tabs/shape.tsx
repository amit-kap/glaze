import { FieldLabel } from "@amit-kap/glaze/components/field"

import type { ThemeEditor } from "../editor"
import { Section, SelectRow, SliderField } from "../fields"
import { PresetSelect, sameCss } from "./preset-select"
import {
  controlShapes,
  elevations,
  shadowPresets,
  toPx,
} from "../../theme-builder"

// Writes a raw-CSS shared input, dropping the override when it equals the
// theme's own value (the setShared convention in the sidebar).
export const setSharedCss = (editor: ThemeEditor, key: string, css: string) =>
  editor.setCustom((c) => {
    const next = { ...c.shared, [key]: css }
    if (sameCss(editor.defaults.shared[key], css)) delete next[key]
    return { ...c, shared: next }
  })

// The three elevation tiers as presets, with the shadows shown on the
// panel itself so a change is visible without hunting for a card.
export function ElevationFields({ editor }: { editor: ThemeEditor }) {
  return (
    <>
      <div className="flex justify-around py-3">
        {elevations.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <div
              aria-hidden="true"
              className="size-10 rounded-item border border-border bg-card"
              style={{ boxShadow: editor.shared(key) }}
            />
            <span className="text-caption text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      {elevations.map(({ key, label }) => (
        <PresetSelect
          key={key}
          id={`panel-${key}`}
          label={label}
          presets={shadowPresets}
          value={editor.shared(key)}
          onChange={(css) => setSharedCss(editor, key, css)}
        />
      ))}
    </>
  )
}

// A corner preview per family: the families derive from the one radius (or
// use the pill shape), so this shows what the radius control really does.
const corner = (r: number) => Math.min(24, r)

export function ShapeFields({ editor }: { editor: ThemeEditor }) {
  const { defaults, radius, pill } = editor
  return (
    <>
      <SliderField
        id="panel-radius"
        label="Radius"
        value={radius}
        min={0}
        max={24}
        onChange={(px) => editor.setPx("radius", px)}
      />
      <SelectRow
        id="panel-controls"
        label="Controls"
        items={controlShapes}
        value={editor.custom.controls ?? defaults.controls}
        onChange={(v) =>
          editor.setCustom((c) => ({
            ...c,
            controls: v === defaults.controls ? undefined : v,
          }))
        }
      />
      <div className="flex flex-col gap-2">
        <FieldLabel>Corners by family</FieldLabel>
        <div className="flex justify-between">
          {[
            { name: "Item", r: radius * 0.8 },
            { name: "Control", r: pill ? 24 : radius },
            { name: "Floating", r: radius },
            { name: "Container", r: radius * 1.4 },
          ].map(({ name, r }) => (
            <div key={name} className="flex w-16 flex-col items-center gap-1.5">
              <div
                aria-hidden="true"
                className="size-12 border-s-2 border-t-2 border-foreground"
                style={{ borderStartStartRadius: corner(r) }}
              />
              <span className="text-caption text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function ShapeTab({ editor }: { editor: ThemeEditor }) {
  return (
    <>
      <Section title="Shape" defaultOpen>
        <ShapeFields editor={editor} />
      </Section>
      <Section title="Spacing and size" defaultOpen>
        <SliderField
          id="panel-space"
          label="Spacing base"
          value={toPx(editor.shared("space-base"))}
          min={2}
          max={8}
          onChange={(px) => editor.setPx("space-base", px)}
        />
        <SliderField
          id="panel-height"
          label="Control height"
          value={
            toPx(editor.shared("control-height")) ||
            toPx(editor.shared("space-base")) * 8
          }
          min={24}
          max={48}
          onChange={(px) => editor.setPx("control-height", px)}
        />
      </Section>
      <Section title="Elevation" defaultOpen>
        <ElevationFields editor={editor} />
      </Section>
    </>
  )
}
