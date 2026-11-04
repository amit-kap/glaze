import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { Card, CardContent } from "@amit-kap/glaze/components/card"
import { InsetSlider } from "@amit-kap/glaze/components/inset-slider"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import { Separator } from "@amit-kap/glaze/components/separator"
import { cn } from "@amit-kap/glaze/lib/utils"

import { hues, type MotionDial } from "./dials"
import { palette } from "./palette"
import type { Draft } from "./draft"
import { canonical, defaults, sameColor, type Color, type Mode } from "./theme"
import { fontOptions } from "./typography"

const modes: Mode[] = ["light", "dark"]

const motionOptions: { value: MotionDial; label: string }[] = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "edgy", label: "Edgy" },
]

const primaryOptions = [
  { value: "neutral", label: "Neutral" },
  { value: "brand", label: "Same as Brand" },
]

type Tint = "mono" | "warm" | "cool"

const tintOptions: { value: Tint; label: string }[] = [
  { value: "mono", label: "Mono" },
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
]

// How strongly Warm and Cool tint the neutrals.
const tintStrength = 0.5

// The faces on offer here: the sans ones Advanced has, plus a mono.
const fonts = [
  ...fontOptions["typeface-sans"].filter(
    (font) => font.label !== "Playfair Display"
  ),
  { label: "JetBrains Mono", value: '"JetBrains Mono Variable", monospace' },
]

const first = (value: number | readonly number[]) =>
  typeof value === "number" ? value : value[0]

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-body font-medium text-foreground">{title}</h3>
      {children}
    </section>
  )
}

/** One brand swatch: a square of the color, ringed when it is the brand. */
function Swatch({
  name,
  value,
  selected,
  onSelect,
}: {
  name: string
  value: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={name}
      title={name}
      onClick={onSelect}
      style={{ backgroundColor: value }}
      className={cn(
        "size-5 shrink-0 rounded-item-sm ring-offset-2 ring-offset-card transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "ring-2 ring-foreground"
      )}
    />
  )
}

/** A slider with the names of its two ends under it. */
function Dial({
  label,
  low,
  high,
  value,
  max,
  onChange,
}: {
  label: string
  low: string
  high: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <InsetSlider
        aria-label={label}
        min={0}
        max={max}
        step={1}
        ticks
        value={value}
        onValueChange={(next) => onChange(first(next))}
      />
      <div className="flex justify-between text-caption text-muted-foreground">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}

/**
 * The Simple level: a handful of dials, each of which sets many tokens. It
 * only reads and writes the draft the Advanced tools use, so the two always
 * agree.
 */
export function SimplePanel({
  draft,
  mode,
  advancedChanges,
  onAdvanced,
}: {
  draft: Draft
  mode: Mode
  /** Settings changed that no Simple control covers. */
  advancedChanges: number
  onAdvanced: () => void
}) {
  const { theme, type, dials, setColor, resetColor } = draft
  const colors = theme[mode]

  // The first swatch is Nova's own brand; the rest are Tailwind's 500s.
  const brandEdited =
    draft.overridden("light", "brand") || draft.overridden("dark", "brand")
  const resetBrand = () => {
    for (const each of modes) resetColor(each, "brand")
  }

  // One brand colour for both modes; tune the dark one in Advanced.
  const setBrand = (value: Color) => {
    for (const each of modes) setColor(each, "brand", value)
  }

  // Primary follows Brand until it is held at Nova's own neutral, so an
  // untouched theme reads "Same as Brand".
  const primary = modes.some((each) => draft.unlinked[each].includes("primary"))
    ? "neutral"
    : "brand"
  const setPrimary = (value: string) => {
    for (const each of modes)
      for (const token of ["primary", "primary-foreground"]) {
        if (value === "neutral") setColor(each, token, defaults[each][token])
        else resetColor(each, token)
      }
  }

  const tint: Tint =
    dials.neutrals.strength <= 0
      ? "mono"
      : dials.neutrals.hue === hues.cool
        ? "cool"
        : "warm"

  return (
    <div className="flex flex-col gap-6 py-4">
      <Section title="Scale">
        <Dial
          label="Scale, comfortable to compact"
          low="Comfortable"
          high="Compact"
          max={10}
          value={Math.round(dials.scale * 5) + 5}
          onChange={(value) => draft.setScale((value - 5) / 5)}
        />
      </Section>

      <Section title="Tone">
        <Dial
          label="Tone, quiet to bold"
          low="Quiet"
          high="Bold"
          max={10}
          value={Math.round(dials.tone * 5) + 5}
          onChange={(value) => draft.setTone((value - 5) / 5)}
        />
      </Section>

      <Section title="Motion">
        <SegmentedControl
          size="sm"
          className="w-full"
          label="Motion"
          options={motionOptions}
          value={dials.motion}
          onValueChange={draft.setMotionDial}
        />
      </Section>

      <Separator />

      <Section title="Typography">
        <div
          role="listbox"
          aria-label="Typeface"
          className="flex flex-col gap-0.5 rounded-control border border-border bg-background p-1"
        >
          {fonts.map((font) => {
            const selected = type["typeface-sans"] === font.value
            return (
              <button
                key={font.label}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => draft.setType("typeface-sans", font.value)}
                style={{ fontFamily: font.value }}
                className={cn(
                  "flex h-control-sm items-center justify-between rounded-item px-2.5 text-body text-foreground outline-none hover:bg-muted focus-visible:bg-muted",
                  selected && "bg-muted"
                )}
              >
                {font.label}
                {selected && <CheckIcon className="size-4" />}
              </button>
            )
          })}
        </div>
      </Section>

      <Separator />

      <Section title="Color">
        <Card size="sm">
          <CardContent>
            <div
              role="radiogroup"
              aria-label="Brand color"
              className="flex flex-wrap gap-2.5"
            >
              <Swatch
                name="Nova"
                value={defaults.light.brand}
                selected={!brandEdited}
                onSelect={resetBrand}
              />
              {palette.map((color) => (
                <Swatch
                  key={color.name}
                  name={color.name}
                  value={color.value}
                  selected={
                    brandEdited &&
                    sameColor(colors.brand, canonical(color.value))
                  }
                  onSelect={() => setBrand(color.value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Primary">
        <SegmentedControl
          size="sm"
          className="w-full"
          label="Primary"
          options={primaryOptions}
          value={primary}
          onValueChange={setPrimary}
        />
      </Section>

      <Section title="Neutrals">
        <SegmentedControl
          size="sm"
          className="w-full"
          label="Neutrals"
          options={tintOptions}
          value={tint}
          onValueChange={(value) =>
            draft.setNeutrals(
              value === "mono"
                ? { ...dials.neutrals, strength: 0 }
                : { hue: hues[value], strength: tintStrength }
            )
          }
        />
      </Section>

      <div className="flex flex-col items-start gap-2 border-t border-border pt-4">
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
