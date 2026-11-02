import * as React from "react"

import { ColorSelector } from "@amit-kap/glaze/components/color-selector"
import { Button } from "@amit-kap/glaze/components/button"
import { InsetSlider } from "@amit-kap/glaze/components/inset-slider"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import type { ColorFormat } from "@amit-kap/glaze/lib/color"

import { ChoiceSelect, SettingItem } from "./controls"
import type { Draft } from "./draft"
import {
  densityOptions,
  densitySetting,
  shapeChanged,
  toCss,
  toPx,
  type Density,
} from "./shape"
import { hues } from "./dials"
import { fontOptions, typeChanged } from "./typography"
import { rowOf, type Color, type Mode } from "./theme"

const tints: { value: "cool" | "warm"; label: string }[] = [
  { value: "cool", label: "Cool" },
  { value: "warm", label: "Warm" },
]

const radii = [0, 4, 8, 10, 14, 16]

const radiusOptions = radii.map((px) => ({
  value: String(px),
  label: String(px),
}))

// The family radii a user may have pinned in Advanced; while any is set, the
// single radius here no longer describes the whole interface.
const familyRadii = [
  "shape-item",
  "shape-control",
  "shape-floating",
  "shape-container",
]

/**
 * The Simple level: the few settings most themes start with. It only reads and
 * writes the draft the Advanced tools use, so the two always agree.
 */
export function SimplePanel({
  draft,
  mode,
  density,
  onDensityChange,
  advancedChanges,
  onAdvanced,
}: {
  draft: Draft
  mode: Mode
  density: Density
  onDensityChange: (density: Density) => void
  /** Settings changed outside the four Simple controls. */
  advancedChanges: number
  onAdvanced: () => void
}) {
  const { theme, shape, type, setColor, resetColor, setShape, setType } = draft
  const [format, setFormat] = React.useState<ColorFormat>("oklch")
  const [open, setOpen] = React.useState(false)

  const radiusPx = toPx(shape.radius, shape)
  const pinned = familyRadii.some((token) => shapeChanged(token, shape[token]))
  const radiusValue =
    radii.includes(radiusPx) && !pinned ? String(radiusPx) : ""

  const tint = draft.dials.neutrals.hue === hues.cool ? "cool" : "warm"
  const colors = theme[mode]
  const brandEdited =
    draft.overridden("light", "brand") || draft.overridden("dark", "brand")
  const pair = {
    foreground: colors["brand-ink"],
    background: colors.brand,
  }

  // One brand colour for both modes; tune the dark one in Advanced.
  const setBrand = (value: Color) => {
    setColor("light", "brand", value)
    setColor("dark", "brand", value)
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex h-12 shrink-0 items-center bg-sidebar">
        <h2 className="text-title font-medium text-foreground">Basics</h2>
      </div>

      <div className="flex flex-col gap-3 border-b border-border pb-3">
        <ColorSelector
          label="Brand"
          value={colors.brand}
          description={rowOf.brand?.note}
          contrast={pair}
          dependents={(rowOf.brand?.feeds ?? []).map((token) => ({
            label: rowOf[token]?.label ?? token,
            value: colors[token] ?? colors.brand,
          }))}
          format={format}
          onFormatChange={setFormat}
          edited={brandEdited}
          onReset={() => {
            resetColor("light", "brand")
            resetColor("dark", "brand")
          }}
          open={open}
          onOpenChange={setOpen}
          onValueChange={setBrand}
        />
      </div>

      <div className="flex flex-col gap-1 border-b border-border py-3">
        <SettingItem
          label="Neutrals"
          note="Tints the greys: surfaces, fills, borders and text."
          edited={draft.dials.neutrals.strength > 0}
          onReset={() =>
            draft.setNeutrals({ ...draft.dials.neutrals, strength: 0 })
          }
        >
          <SegmentedControl
            size="sm"
            label="Neutrals tint"
            options={tints}
            value={tint}
            onValueChange={(value) =>
              draft.setNeutrals({ ...draft.dials.neutrals, hue: hues[value] })
            }
          />
        </SettingItem>
        <InsetSlider
          aria-label="Neutrals strength"
          min={0}
          max={10}
          step={1}
          ticks
          value={Math.round(draft.dials.neutrals.strength * 10)}
          onValueChange={(value) =>
            draft.setNeutrals({
              ...draft.dials.neutrals,
              strength: (Array.isArray(value) ? value[0] : value) / 10,
            })
          }
        />

        <SettingItem
          label="Corner radius"
          note="How round corners are, in px. One value drives every corner."
          edited={shapeChanged("radius", shape.radius)}
          onReset={() => draft.resetShape(["radius"])}
        >
          <SegmentedControl
            size="sm"
            label="Corner radius in px"
            options={radiusOptions}
            value={radiusValue}
            onValueChange={(value) => setShape("radius", toCss(Number(value)))}
          />
        </SettingItem>
        {!radiusValue && (
          <p className="text-caption text-muted-foreground">
            Custom corners are set in Advanced.
          </p>
        )}

        <SettingItem
          label={densitySetting.label}
          note={densitySetting.note}
          edited={false}
          onReset={() => {}}
        >
          <ChoiceSelect
            label={densitySetting.label}
            items={densityOptions}
            value={density}
            onChange={(value) => onDensityChange(value as Density)}
          />
        </SettingItem>

        <SettingItem
          label="Font"
          note="The typeface for interface text."
          edited={typeChanged("typeface-sans", type["typeface-sans"])}
          onReset={() => draft.resetType(["typeface-sans"])}
        >
          <ChoiceSelect
            label="Font"
            items={fontOptions["typeface-sans"]}
            value={type["typeface-sans"]}
            onChange={(value) => setType("typeface-sans", value)}
          />
        </SettingItem>
      </div>

      <div className="flex flex-col items-start gap-2 py-3">
        {advancedChanges > 0 && (
          <p className="text-caption text-muted-foreground">
            {advancedChanges} more{" "}
            {advancedChanges === 1 ? "setting" : "settings"} changed in
            Advanced.
          </p>
        )}
        <Button variant="outline" size="sm" onClick={onAdvanced}>
          Edit all settings
        </Button>
      </div>
    </div>
  )
}
