import * as React from "react"
import { ChevronDownIcon, RotateCcwIcon } from "lucide-react"

import { cn } from "@amit-kap/glaze/lib/utils"
import { parseColor } from "@amit-kap/glaze/lib/color"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"

import type { StudioActions } from "../../control-panel/actions"
import type { Custom } from "../../theme-builder"
import {
  brandRows,
  chartRows,
  controlShapes,
  durations,
  easings,
  elevations,
  fonts,
  headingFonts,
  monoFonts,
  statusRows,
  toConfig,
  typeSteps,
  weights,
} from "../../theme-builder"
import type { Mode, ThemeEditor } from "../editor"
import { Section, toHex } from "../fields"

// --- Labels ----------------------------------------------------------------

const colorLabels = new Map(
  [...brandRows, ...statusRows, ...chartRows].map((r) => [r.key, r.label])
)

// Shared keys named after the sidebar controls that edit them; anything
// else (radius, space-base, typeface-*) is prettified from the key.
const sharedLabels = new Map<string, string>([
  ...typeSteps.flatMap((s): [string, string][] => [
    [`type-${s.key}`, `${s.label} size`],
    [`type-${s.key}-leading`, `${s.label} leading`],
  ]),
  ...weights.map((w): [string, string] => [w.key, `${w.label} weight`]),
  ...durations.map((d): [string, string] => [d.key, `${d.label} duration`]),
  ...easings.map((e): [string, string] => [e.key, `${e.label} easing`]),
  ...elevations.map((e): [string, string] => [e.key, `${e.label} elevation`]),
])

const prettify = (key: string) =>
  key.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())

const sharedLabel = (key: string) => sharedLabels.get(key) ?? prettify(key)

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const optionLabel = (list: { value: string; label: string }[], v: string) =>
  list.find((f) => f.value === v)?.label ?? v

// --- Rows ------------------------------------------------------------------

// Same checkerboard as the colour fields, so translucent values read alike.
const checker =
  "repeating-conic-gradient(var(--border) 0 25%, var(--background) 0 50%) 0 0 / 8px 8px"

function Swatch({ value }: { value: string }) {
  const p = parseColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }
  const fill = `rgb(${p.r} ${p.g} ${p.b} / ${p.a})`
  return (
    <span
      aria-hidden="true"
      className="size-5 shrink-0 rounded-item-sm border border-border"
      style={{ background: `linear-gradient(${fill}, ${fill}), ${checker}` }}
    />
  )
}

// One change at caption scale, mirroring DerivedRow: optional swatch, a
// label that truncates with a tooltip, old → new, and a reset in a fixed
// slot so the value columns line up across rows.
function ChangeRow({
  label,
  mono,
  swatch,
  from,
  to,
  onReset,
}: {
  label: string
  /** Token names read as code; option labels as prose. */
  mono?: boolean
  swatch?: string
  from?: string
  to: string
  onReset: () => void
}) {
  return (
    <div className="flex h-6 items-center gap-2">
      {swatch !== undefined && <Swatch value={swatch} />}
      <span
        title={label}
        className={cn(
          "min-w-0 flex-1 truncate text-caption",
          mono && "font-mono"
        )}
      >
        {label}
      </span>
      {from !== undefined && from !== "" && (
        <span
          title={from}
          className="max-w-24 shrink-0 truncate font-mono text-caption text-muted-foreground line-through"
        >
          {from}
        </span>
      )}
      <span
        title={to}
        className="max-w-32 shrink-0 truncate font-mono text-caption"
      >
        {to}
      </span>
      <span className="flex size-control-xs shrink-0 items-center justify-center">
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Reset ${label}`}
          title="Reset"
          onClick={onReset}
        >
          <RotateCcwIcon />
        </Button>
      </span>
    </div>
  )
}

// --- Groups ----------------------------------------------------------------

const modes: { m: Mode; title: string }[] = [
  { m: "light", title: "Light" },
  { m: "dark", title: "Dark" },
]

// Drops `key` from one of the record-valued fields of Custom.
const without =
  (field: "light" | "dark" | "shared" | "components", key: string) =>
  (c: Custom): Custom => {
    const next = { ...c[field] }
    delete next[key]
    return { ...c, [field]: next }
  }

export function ChangesTab({
  editor,
  actions,
}: {
  editor: ThemeEditor
  actions: StudioActions
}) {
  const { custom, defaults } = editor
  const count = actions.changeCount
  const clear = (field: keyof Custom) =>
    editor.setCustom((c) => ({ ...c, [field]: undefined }))

  const options: { label: string; value: string; field: keyof Custom }[] = []
  if (custom.controls !== undefined)
    options.push({
      label: "Controls",
      value: optionLabel(controlShapes, custom.controls),
      field: "controls",
    })
  if (custom.font !== undefined)
    options.push({
      label: "Font",
      value: optionLabel(fonts, custom.font),
      field: "font",
    })
  if (custom.headingFont !== undefined)
    options.push({
      label: "Heading font",
      value: optionLabel(headingFonts, custom.headingFont),
      field: "headingFont",
    })
  if (custom.monoFont !== undefined)
    options.push({
      label: "Mono font",
      value: optionLabel(monoFonts, custom.monoFont),
      field: "monoFont",
    })
  if (custom.fades !== undefined)
    options.push({
      label: "Fades",
      value: custom.fades ? "On" : "Off",
      field: "fades",
    })

  const shared = Object.entries(custom.shared)
  const components = Object.entries(custom.components ?? {})

  return (
    <>
      <div className="flex h-control-sm items-center justify-between gap-2 py-2.5">
        <span className="text-body">
          {count} {count === 1 ? "change" : "changes"} on{" "}
          {capitalise(actions.base)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={count === 0}
          onClick={actions.reset}
        >
          <RotateCcwIcon />
          Reset all
        </Button>
      </div>

      {count === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Nothing changed yet</EmptyTitle>
            <EmptyDescription>
              Edits you make in the other tabs show up here, each with its own
              reset.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {modes.map(({ m, title }) => {
        const rows = Object.entries(custom[m])
        if (rows.length === 0) return null
        return (
          <Section key={m} title={`Colours · ${title}`} defaultOpen>
            {rows.map(([key, value]) => (
              <ChangeRow
                key={key}
                label={colorLabels.get(key) ?? key}
                swatch={value}
                from={toHex(defaults[m][key])}
                to={toHex(value)}
                onReset={() => editor.setCustom(without(m, key))}
              />
            ))}
          </Section>
        )
      })}

      {modes.map(({ m, title }) => {
        const rows = Object.entries(custom.system?.[m] ?? {})
        if (rows.length === 0) return null
        return (
          <Section key={m} title={`Pinned tokens · ${title}`} defaultOpen>
            {rows.map(([key, value]) => (
              <ChangeRow
                key={key}
                label={`--${key}`}
                mono
                swatch={value}
                to={toHex(value)}
                onReset={() => editor.setSystem(m, key, null)}
              />
            ))}
          </Section>
        )
      })}

      {shared.length > 0 && (
        <Section title="Shape, type, motion" defaultOpen>
          {shared.map(([key, value]) => (
            <ChangeRow
              key={key}
              label={sharedLabel(key)}
              from={defaults.shared[key]?.trim()}
              to={value.trim()}
              onReset={() => editor.setCustom(without("shared", key))}
            />
          ))}
        </Section>
      )}

      {options.length > 0 && (
        <Section title="Options" defaultOpen>
          {options.map(({ label, value, field }) => (
            <ChangeRow
              key={field}
              label={label}
              to={value}
              onReset={() => clear(field)}
            />
          ))}
        </Section>
      )}

      {components.length > 0 && (
        <Section title="Component tokens" defaultOpen>
          {components.map(([key, value]) => (
            <ChangeRow
              key={key}
              label={`--${key}`}
              mono
              to={value.trim()}
              onReset={() => editor.setCustom(without("components", key))}
            />
          ))}
        </Section>
      )}

      <ConfigJson actions={actions} custom={custom} />
    </>
  )
}

// The draft as the glaze.config.json it would be exported as, so the list
// above can be checked against what actually ships.
function ConfigJson({
  actions,
  custom,
}: {
  actions: StudioActions
  custom: Custom
}) {
  const [open, setOpen] = React.useState(false)
  const json = React.useMemo(
    () =>
      JSON.stringify(
        toConfig(actions.base, custom, "system", "comfortable"),
        null,
        2
      ),
    [actions.base, custom]
  )
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2.5">
        <span>Config JSON</span>
        <ChevronDownIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-3">
        <pre className="max-h-64 overflow-auto rounded-item bg-muted p-3 font-mono text-caption">
          {json}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  )
}
