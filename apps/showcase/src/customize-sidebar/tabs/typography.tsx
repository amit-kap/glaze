import { FieldLabel } from "@amit-kap/glaze/components/field"

import type { ThemeEditor } from "../editor"
import { NumberField, Section, SelectRow } from "../fields"
import {
  fonts,
  headingFonts,
  monoFonts,
  toNumber,
  toPx,
  typeSteps,
  weights,
} from "../../theme-builder"

// A select that clears its override when set back to the theme's default.
export function FontSelect({
  editor,
  id,
  label,
  items,
  field,
}: {
  editor: ThemeEditor
  id: string
  label: string
  items: { value: string; label: string }[]
  field: "font" | "headingFont" | "monoFont"
}) {
  return (
    <SelectRow
      id={id}
      label={label}
      items={items}
      value={editor.custom[field] ?? editor.defaults[field]}
      onChange={(v) =>
        editor.setCustom((c) => ({
          ...c,
          [field]: v === editor.defaults[field] ? undefined : v,
        }))
      }
    />
  )
}

export function TypeScaleRows({ editor }: { editor: ThemeEditor }) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[5rem_1fr_5rem] items-center gap-2 pb-1 text-caption text-muted-foreground">
        <span>Step</span>
        <span>Size</span>
        <span className="text-end">Leading</span>
      </div>
      {typeSteps.map(({ key, label }) => (
        <div
          key={key}
          className="grid grid-cols-[5rem_1fr_5rem] items-center gap-2 border-t border-border py-1"
        >
          <FieldLabel>{label}</FieldLabel>
          <NumberField
            label={`${label} size`}
            value={toPx(editor.shared(`type-${key}`))}
            min={8}
            max={64}
            suffix="px"
            digits={1}
            className="w-24"
            onChange={(px) => editor.setPx(`type-${key}`, px)}
          />
          <NumberField
            label={`${label} leading`}
            value={toNumber(editor.shared(`type-${key}-leading`))}
            min={1}
            max={3}
            digits={2}
            className="w-full"
            onChange={(n) => editor.setNum(`type-${key}-leading`, n, toNumber)}
          />
        </div>
      ))}
    </div>
  )
}

export function TypographyTab({ editor }: { editor: ThemeEditor }) {
  return (
    <>
      <Section title="Font family" defaultOpen>
        <FontSelect
          editor={editor}
          id="panel-sans"
          label="Sans"
          items={fonts}
          field="font"
        />
        <FontSelect
          editor={editor}
          id="panel-heading"
          label="Heading"
          items={headingFonts}
          field="headingFont"
        />
        <FontSelect
          editor={editor}
          id="panel-mono"
          label="Mono"
          items={monoFonts}
          field="monoFont"
        />
      </Section>
      <Section title="Type scale" defaultOpen>
        <TypeScaleRows editor={editor} />
      </Section>
      <Section title="Weights" defaultOpen>
        <div className="flex gap-2">
          {weights.map(({ key, label }) => (
            <NumberField
              key={key}
              label={`${label} weight`}
              value={Number(editor.shared(key)) || 0}
              min={100}
              max={900}
              className="min-w-0 flex-1"
              inputClassName="px-1 text-center"
              onChange={(n) => editor.setNum(key, n, (v) => Number(v) || 0)}
            />
          ))}
        </div>
      </Section>
    </>
  )
}
