import * as React from "react"
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { Field, FieldError, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@amit-kap/glaze/components/input-group"
import { Switch } from "@amit-kap/glaze/components/switch"

import {
  ColorField,
  ModeColumns,
  NumberField,
  Section,
  SelectRow,
  SliderField,
} from "./fields"
import {
  brandRows,
  chartRows,
  controlShapes,
  download,
  durations,
  fonts,
  headingFonts,
  monoFonts,
  statusRows,
  toMs,
  toNumber,
  toPx,
  typeSteps,
  weights,
  type Custom,
  type Defaults,
} from "../theme-builder"

export type Mode = "light" | "dark"

// Everything a section needs: the theme's own values plus the sidebar's
// mutators. Built once by CustomizeSidebar and passed down as one prop.
export interface ThemeEditor {
  custom: Custom
  defaults: Defaults
  /** Effective value of a colour input (custom override or theme default). */
  color: (m: Mode, key: string) => string
  /** Effective value of a shared (mode-independent) input, as raw CSS. */
  shared: (key: string) => string
  setCustom: (update: (c: Custom) => Custom) => void
  setPx: (key: string, px: number) => void
  setNum: (
    key: string,
    n: number,
    parse: (v: string) => number,
    unit?: string
  ) => void
  setColor: (m: Mode, key: string, hex: string) => void
  setBothModes: (key: string, hex: string) => void
  radius: number
  pill: boolean
}

// One labelled row of colour fields, light and dark side by side.
function DualColorRow({
  label,
  color,
  onChange,
}: {
  label: string
  color: (m: Mode) => string
  onChange: (m: Mode, hex: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <FieldLabel className="w-20 shrink-0">{label}</FieldLabel>
      {(["light", "dark"] as const).map((m) => (
        <ColorField
          key={m}
          label={`${label}, ${m}`}
          value={color(m)}
          onChange={(hex) => onChange(m, hex)}
        />
      ))}
    </div>
  )
}

export function ColorSection({ editor }: { editor: ThemeEditor }) {
  return (
    <Section title="Color">
      <ModeColumns />
      {brandRows.map(({ key, label }) => (
        <DualColorRow
          key={key}
          label={label}
          color={(m) => editor.color(m, key)}
          onChange={(m, hex) => editor.setColor(m, key, hex)}
        />
      ))}
    </Section>
  )
}

export function StatusChartsSection({ editor }: { editor: ThemeEditor }) {
  return (
    <Section title="Status and charts">
      <ModeColumns />
      {statusRows.map(({ key, label }) => (
        <DualColorRow
          key={key}
          label={label}
          color={(m) => editor.color(m, key)}
          onChange={(m, hex) => editor.setColor(m, key, hex)}
        />
      ))}
      {chartRows.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <FieldLabel className="w-20 shrink-0">{label}</FieldLabel>
          <ColorField
            label={label}
            value={editor.color("light", key)}
            onChange={(hex) => editor.setBothModes(key, hex)}
          />
          <span className="flex-1" />
        </div>
      ))}
    </Section>
  )
}

// A corner preview per family: the families derive from the one radius (or
// use the pill shape), so this shows what the radius control really does.
const corner = (r: number) => Math.min(24, r)

export function ShapeSection({ editor }: { editor: ThemeEditor }) {
  const { defaults, radius, pill } = editor
  return (
    <Section title="Shape">
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
    </Section>
  )
}

export function SpacingSection({ editor }: { editor: ThemeEditor }) {
  return (
    <Section title="Spacing and size">
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
  )
}

// A select that clears its override when set back to the theme's default.
function FontSelect({
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

function TypeScaleRows({ editor }: { editor: ThemeEditor }) {
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
            className="h-control-xs w-24"
            onChange={(px) => editor.setPx(`type-${key}`, px)}
          />
          <NumberField
            label={`${label} leading`}
            value={toNumber(editor.shared(`type-${key}-leading`))}
            min={1}
            max={3}
            digits={2}
            className="h-control-xs w-full"
            onChange={(n) => editor.setNum(`type-${key}-leading`, n, toNumber)}
          />
        </div>
      ))}
    </div>
  )
}

export function TypographySection({ editor }: { editor: ThemeEditor }) {
  return (
    <Section title="Typography">
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
      <TypeScaleRows editor={editor} />
      <div className="flex items-center justify-between gap-2">
        <FieldLabel>Weights</FieldLabel>
        <div className="flex w-36 gap-2">
          {weights.map(({ key, label }) => (
            <NumberField
              key={key}
              label={`${label} weight`}
              value={Number(editor.shared(key)) || 0}
              min={100}
              max={900}
              className="h-control-sm min-w-0 flex-1"
              inputClassName="px-1 text-center"
              onChange={(n) => editor.setNum(key, n, (v) => Number(v) || 0)}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

export function MotionSection({ editor }: { editor: ThemeEditor }) {
  return (
    <Section title="Motion">
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {durations.map(({ key, label }) => (
          <div key={key} className="flex min-w-0 flex-col gap-1">
            <span className="text-caption text-muted-foreground">{label}</span>
            <NumberField
              label={`${label} duration`}
              value={toMs(editor.shared(key))}
              min={0}
              max={2000}
              suffix="ms"
              className="h-control-sm w-full"
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
  )
}

export function OutputSection({
  editor,
  error,
  css,
  command,
  copied,
  onCopy,
  configJson,
}: {
  editor: ThemeEditor
  error: string | null
  css: string | null
  command: string
  copied: boolean
  onCopy: () => void
  configJson: string
}) {
  const { custom } = editor
  const invalid = error !== null
  return (
    <Section title="Output">
      <Field data-invalid={invalid || undefined}>
        <FieldLabel htmlFor="panel-name">Theme name</FieldLabel>
        <Input
          id="panel-name"
          value={custom.name}
          onChange={(e) =>
            editor.setCustom((c) => ({ ...c, name: e.target.value }))
          }
          aria-invalid={invalid || undefined}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <Button
        variant="outline"
        className="w-full"
        disabled={!css}
        onClick={() => {
          if (!css) return
          download(`${custom.name}.css`, css, "text/css")
          download("glaze.config.json", configJson, "application/json")
        }}
      >
        <DownloadIcon />
        Download theme files
      </Button>
      {/* Text rather than an input, so a long command wraps instead of
          scrolling out of view. Each flag stays on one line with its value;
          browsers would otherwise break after the "--". */}
      <InputGroup className="h-auto items-start py-1">
        <code
          aria-label="Setup command"
          className="min-w-0 flex-1 px-3 py-1 font-mono text-caption break-words select-all"
        >
          {command.split(/ (?=--)/).map((part, i) => (
            <React.Fragment key={part}>
              {i > 0 && " "}
              <span className="whitespace-nowrap">{part}</span>
            </React.Fragment>
          ))}
        </code>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Copy setup command"
            onClick={onCopy}
          >
            <span className="icon-swap" data-swapped={copied || undefined}>
              <CopyIcon />
              <CheckIcon />
            </span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Section>
  )
}
