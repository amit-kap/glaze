import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Card, CardContent } from "@amit-kap/glaze/components/card"
import { InsetSlider } from "@amit-kap/glaze/components/inset-slider"
import { SegmentedControl } from "@amit-kap/glaze/components/segmented-control"
import { Separator } from "@amit-kap/glaze/components/separator"
import { cn } from "@amit-kap/glaze/lib/utils"

import { hues, type MotionDial } from "./dials"
import { palette } from "./palette"
import type { Draft } from "./draft"
import {
  autoInk,
  canonical,
  defaults,
  sameColor,
  type Color,
  type Mode,
} from "./theme"
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

// A name for each of the 11 places on the scale and tone sliders. The middle
// is Nova; the scale runs from the roomiest to the tightest.
const scaleNames = [
  "3XL",
  "2XL",
  "XL",
  "L",
  "M+",
  "M",
  "M−",
  "S",
  "XS",
  "2XS",
  "3XS",
]

const toneNames = [
  "Whisper",
  "Hushed",
  "Quiet",
  "Soft",
  "Mellow",
  "Even",
  "Firm",
  "Sturdy",
  "Strong",
  "Bold",
  "Loud",
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
  aside,
  children,
}: {
  title: string
  /** Sits on the title row, at the end: a readout of the current choice. */
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body font-medium text-foreground">{title}</h3>
        {aside && (
          <span className="text-caption text-muted-foreground">{aside}</span>
        )}
      </div>
      {children}
    </section>
  )
}

/** Whether the brand is an edit no palette entry matches. */
const brandChoiceCustom = (brand: Color, edited: boolean) =>
  edited && !palette.some((color) => sameColor(brand, canonical(color.value)))

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
    <div className="flex flex-col gap-1.5">
      {/* The control is taller than its track for a bigger hit area; pull
          that padding back so the title and the labels sit against the track. */}
      <div className="-my-2.5">
        <InsetSlider
          aria-label={label}
          min={0}
          max={max}
          step={1}
          ticks
          value={value}
          onValueChange={(next) => onChange(first(next))}
        />
      </div>
      <div className="relative flex justify-between text-caption text-muted-foreground">
        <span>{low}</span>
        {/* A tick at the middle marks Nova; pressing it resets the slider. */}
        <button
          type="button"
          aria-label={`Reset ${label}`}
          title="Reset"
          onClick={() => onChange(max / 2)}
          className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center px-2 outline-none focus-visible:text-foreground"
        >
          <span className="h-3 w-px bg-muted-foreground" />
        </button>
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
export function SimplePanel({ draft, mode }: { draft: Draft; mode: Mode }) {
  const { theme, type, dials, setColor, resetColor } = draft
  const colors = theme[mode]

  // The first swatch is Nova's own brand; the rest are Tailwind's 500s.
  const brandEdited =
    draft.overridden("light", "brand") || draft.overridden("dark", "brand")
  const resetBrand = () => {
    for (const each of modes) resetColor(each, "brand")
  }

  // Nova's own brand, then Tailwind's 500s. A brand set elsewhere reads Custom.
  const brandOptions = [
    { name: "Nova", value: defaults.light.brand },
    ...palette,
  ]
  const brandChoice = !brandEdited
    ? "Nova"
    : brandChoiceCustom(colors.brand, brandEdited)
      ? "Custom"
      : palette.find((color) =>
          sameColor(colors.brand, canonical(color.value))
        )!.name

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
    <div className="flex flex-col gap-8 py-6">
      <Section title="Brand color" aside={brandChoice}>
        <Card size="sm">
          <CardContent className="flex flex-col gap-3">
            {/* Nova and the 17 colours fill two rows; the nine neutrals the third. */}
            <div
              role="radiogroup"
              aria-label="Brand color"
              className="grid grid-cols-9 justify-items-center gap-y-3"
            >
              {brandOptions.map((option) => {
                const selected = option.name === brandChoice
                return (
                  <button
                    key={option.name}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={option.name}
                    title={option.name}
                    onClick={() =>
                      option.name === "Nova"
                        ? resetBrand()
                        : setBrand(option.value)
                    }
                    style={{
                      backgroundColor: option.value,
                      color: autoInk(canonical(option.value)),
                    }}
                    className="grid size-7 place-items-center rounded-pill shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)] transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {selected && <CheckIcon className="size-4" />}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </Section>

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

      <Section title="Primary action">
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

      <Separator />

      <Section
        title="Scale"
        aside={scaleNames[Math.round(dials.scale * 5) + 5]}
      >
        <Dial
          label="Scale, comfortable to compact"
          low="Comfortable"
          high="Compact"
          max={10}
          value={Math.round(dials.scale * 5) + 5}
          onChange={(value) => draft.setScale((value - 5) / 5)}
        />
      </Section>

      <Section title="Tone" aside={toneNames[Math.round(dials.tone * 5) + 5]}>
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
    </div>
  )
}
