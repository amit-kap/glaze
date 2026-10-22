import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import { Switch } from "@amit-kap/glaze/components/switch"

import type { ThemeEditor } from "../editor"
import { NumberField, Section } from "../fields"
import { PresetSelect } from "./preset-select"
import { setSharedCss } from "./shape"
import { durations, easingPresets, easings, toMs } from "../../theme-builder"

// The spring is a long linear() ramp with no preset equivalent, so it stays
// out of the select rows.
const easingRows = easings.filter((e) => e.key !== "motion-ease-spring")

// A dot that slides once on hover, on the row's own curve, so the easing
// is felt rather than read.
function EasingDot({ css }: { css: string }) {
  return (
    <span aria-hidden="true" className="flex w-11 shrink-0 items-center">
      <span
        className="size-5 rounded-pill bg-primary transition-[translate] duration-(--duration-slow) group-hover:translate-x-6 motion-reduce:transition-none"
        style={{ transitionTimingFunction: css }}
      />
    </span>
  )
}

export function MotionTab({ editor }: { editor: ThemeEditor }) {
  return (
    <>
      <Section title="Motion" defaultOpen>
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          {durations.map(({ key, label }) => (
            <div key={key} className="flex min-w-0 flex-col gap-1">
              <span className="text-caption text-muted-foreground">
                {label}
              </span>
              <NumberField
                label={`${label} duration`}
                value={toMs(editor.shared(key))}
                min={0}
                max={2000}
                suffix="ms"
                className="w-full"
                inputClassName="px-2.5"
                onChange={(n) => editor.setNum(key, n, toMs, "ms")}
              />
            </div>
          ))}
        </div>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="panel-fades">Fades</FieldLabel>
          <Switch
            id="panel-fades"
            checked={editor.custom.fades !== false}
            onCheckedChange={(on) =>
              editor.setCustom((c) => ({ ...c, fades: on ? undefined : false }))
            }
          />
        </Field>
      </Section>
      <Section title="Easing" defaultOpen>
        {easingRows.map(({ key, label }) => (
          <div key={key} className="group">
            <PresetSelect
              id={`panel-${key}`}
              label={label}
              presets={easingPresets}
              value={editor.shared(key)}
              onChange={(css) => setSharedCss(editor, key, css)}
            >
              <EasingDot css={editor.shared(key)} />
            </PresetSelect>
          </div>
        ))}
      </Section>
    </>
  )
}
