import * as React from "react"

import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

export type Preset = { value: string; label: string; css: string }

// Values are compared as CSS text, so spacing differences don't count.
const norm = (css: string | undefined) =>
  (css ?? "").replace(/\s+/g, " ").trim()

/** The preset whose css equals `css`, or undefined for a hand-written value. */
export const matchPreset = (presets: Preset[], css: string | undefined) =>
  presets.find((p) => norm(p.css) === norm(css))

export const sameCss = (a: string | undefined, b: string | undefined) =>
  norm(a) === norm(b)

// A select over CSS presets for a raw-CSS input. A value that matches no
// preset is shown as a disabled "Custom" item, so a theme's own value is
// never silently replaced just by rendering the row.
export function PresetSelect({
  id,
  label,
  presets,
  value,
  onChange,
  children,
}: {
  id: string
  label: string
  presets: Preset[]
  /** The current raw CSS value. */
  value: string | undefined
  /** Called with the chosen preset's css. */
  onChange: (css: string) => void
  /** Rendered between the label and the select, e.g. a preview. */
  children?: React.ReactNode
}) {
  const matched = matchPreset(presets, value)
  const items = matched
    ? presets
    : [{ value: "custom", label: "Custom", css: value ?? "" }, ...presets]
  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      <Select
        items={items}
        value={matched?.value ?? "custom"}
        onValueChange={(v) => {
          const preset = presets.find((p) => p.value === v)
          if (preset) onChange(preset.css)
        }}
      >
        <SelectTrigger id={id} className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                disabled={item.value === "custom"}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
