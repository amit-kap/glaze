import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@amit-kap/glaze/lib/utils"
import {
  formatColor,
  parseColor,
  type ColorFormat,
} from "@amit-kap/glaze/lib/color"
import { Button } from "@amit-kap/glaze/components/button"
import { ColorPicker } from "@amit-kap/glaze/components/color-picker"
import { Field, FieldError, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@amit-kap/glaze/components/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@amit-kap/glaze/components/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Slider } from "@amit-kap/glaze/components/slider"
import { Switch } from "@amit-kap/glaze/components/switch"

import {
  brandRows,
  chartRows,
  controlShapes,
  download,
  durations,
  fonts,
  headingFonts,
  inkFor,
  monoFonts,
  pxToRem,
  statusRows,
  toMs,
  toNumber,
  toPx,
  typeSteps,
  weights,
  type Custom,
  type Defaults,
} from "./theme-builder"

// A checkerboard under translucent colours.
const checker =
  "repeating-conic-gradient(var(--border) 0 25%, var(--background) 0 50%) 0 0 / 8px 8px"

const toHex = (css: string | undefined) => {
  const parsed = parseColor(css ?? "")
  return parsed ? formatColor(parsed, "hex") : "#000000"
}

// --- Building blocks -------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-3 border-t border-border pt-5"
    >
      <h3 className="text-caption font-medium tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function SelectRow({
  id,
  label,
  items,
  value,
  onChange,
}: {
  id: string
  label: string
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => v && onChange(v as string)}
      >
        <SelectTrigger id={id} size="sm" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

// A number that takes edits freely and applies them on blur or Enter; text
// that isn't a number reverts.
function NumberField({
  value,
  onChange,
  min,
  max,
  digits = 0,
  suffix,
  label,
  className,
  inputClassName = "px-2.5",
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  digits?: number
  suffix?: string
  label: string
  className?: string
  inputClassName?: string
}) {
  const [draft, setDraft] = React.useState<string | null>(null)
  const text = String(Number(value.toFixed(digits)))
  const done = () => {
    const n = Number.parseFloat(draft ?? "")
    if (draft !== null && !Number.isNaN(n))
      onChange(Math.min(max, Math.max(min, n)))
    setDraft(null)
  }
  return (
    <InputGroup className={className ?? "h-control-sm w-20"}>
      <InputGroupInput
        aria-label={label}
        inputMode="decimal"
        value={draft ?? text}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={done}
        onKeyDown={(event) => {
          if (event.key === "Enter") done()
          if (event.key === "Escape") setDraft(null)
        }}
        className={cn("text-body", inputClassName)}
      />
      {suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{suffix}</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  suffix = "px",
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  suffix?: string
}) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <NumberField
          label={label}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          suffix={suffix}
        />
      </div>
      <Slider
        id={id}
        aria-label={label}
        min={min}
        max={max}
        step={1}
        value={[Math.min(max, Math.max(min, value))]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </Field>
  )
}

// A colour as a swatch and its hex; the picker opens below it.
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  const [format, setFormat] = React.useState<ColorFormat>("hex")
  const parsed = parseColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }
  const fill = `rgb(${parsed.r} ${parsed.g} ${parsed.b} / ${parsed.a})`
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label={label}
            className="min-w-0 flex-1 justify-start gap-1.5 ps-1.5 font-mono text-caption"
          />
        }
      >
        <span
          aria-hidden="true"
          className="size-4.5 shrink-0 rounded-item border border-border"
          style={{
            background: `linear-gradient(${fill}, ${fill}), ${checker}`,
          }}
        />
        <span className="truncate">
          {formatColor(parsed, "hex").slice(0, 7)}
        </span>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="center" className="w-72">
        <ColorPicker
          card={false}
          format={format}
          onFormatChange={setFormat}
          value={formatColor(parsed, format)}
          onValueChange={(_, color) => onChange(formatColor(color, "hex"))}
          swatches={[
            "#171717",
            "#E7000B",
            "#A65F00",
            "#008236",
            "#155DFC",
            "#6B97FF",
          ]}
        />
      </PopoverContent>
    </Popover>
  )
}

function ModeColumns() {
  return (
    <div className="flex gap-2 text-caption text-muted-foreground">
      <span className="w-20 shrink-0" />
      <span className="flex-1">Light</span>
      <span className="flex-1">Dark</span>
    </div>
  )
}

// --- The sidebar -----------------------------------------------------------

export function CustomizeSidebar({
  open,
  onOpenChange,
  custom,
  setCustom,
  defaults,
  customized,
  error,
  css,
  command,
  copied,
  onCopy,
  onReset,
  configJson,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  custom: Custom
  setCustom: (update: (c: Custom) => Custom) => void
  defaults: Defaults
  customized: boolean
  error: string | null
  css: string | null
  command: string
  copied: boolean
  onCopy: () => void
  onReset: () => void
  configJson: string
}) {
  const shared = (key: string) => custom.shared[key] ?? defaults.shared[key]
  const color = (m: "light" | "dark", key: string) =>
    custom[m][key] ?? defaults[m][key]

  // An override equal to the theme's own is no change, so it's dropped.
  const setShared = (key: string, value: string, unchanged: boolean) =>
    setCustom((c) => {
      const next = { ...c.shared, [key]: value }
      if (unchanged) delete next[key]
      return { ...c, shared: next }
    })
  const setPx = (key: string, px: number) =>
    setShared(
      key,
      pxToRem(px),
      Math.abs(toPx(defaults.shared[key]) - px) < 0.01
    )
  const setNum = (
    key: string,
    n: number,
    parse: (v: string) => number,
    unit = ""
  ) =>
    setShared(
      key,
      `${n}${unit}`,
      Math.abs(parse(defaults.shared[key]) - n) < 0.001
    )

  const setColor = (m: "light" | "dark", key: string, hex: string) =>
    setCustom((c) => {
      const next = { ...c[m], [key]: hex }
      if (toHex(defaults[m][key]) === hex) delete next[key]
      const out = { ...c, [m]: next }
      // Ink on the brand colour follows it until edited by hand.
      if (key === "brand" && c.inkAuto !== false)
        out[m] = { ...next, "brand-ink": inkFor(hex.slice(0, 7)) }
      if (key === "brand-ink") out.inkAuto = false
      return out
    })

  // Charts hold in both modes.
  const setBothModes = (key: string, hex: string) => {
    setColor("light", key, hex)
    setColor("dark", key, hex)
  }

  const radius = toPx(shared("radius"))
  const pill = (custom.controls ?? defaults.controls) === "pill"
  const corner = (r: number) => Math.min(24, r)

  const invalid = error !== null

  return (
    <aside
      id="customize-sidebar"
      aria-label="Customize"
      inert={!open}
      data-open={open || undefined}
      className="invisible fixed inset-y-0 inset-e-0 z-50 flex w-full translate-x-full flex-col gap-5 overflow-y-auto border-s border-border bg-background px-4 pt-4 pb-6 transition-[translate,visibility] duration-(--duration-moderate) ease-standard motion-reduce:transition-none sm:w-80 data-open:visible data-open:translate-x-0"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-title font-medium">Customize</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close customize"
          onClick={() => onOpenChange(false)}
        >
          <XIcon />
        </Button>
      </div>

      <Section title="Color">
        <ModeColumns />
        {brandRows.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <FieldLabel className="w-20 shrink-0">{label}</FieldLabel>
            {(["light", "dark"] as const).map((m) => (
              <ColorField
                key={m}
                label={`${label}, ${m}`}
                value={color(m, key)}
                onChange={(hex) => setColor(m, key, hex)}
              />
            ))}
          </div>
        ))}
      </Section>

      <Section title="Status and charts">
        <ModeColumns />
        {statusRows.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <FieldLabel className="w-20 shrink-0">{label}</FieldLabel>
            {(["light", "dark"] as const).map((m) => (
              <ColorField
                key={m}
                label={`${label}, ${m}`}
                value={color(m, key)}
                onChange={(hex) => setColor(m, key, hex)}
              />
            ))}
          </div>
        ))}
        {chartRows.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <FieldLabel className="w-20 shrink-0">{label}</FieldLabel>
            <ColorField
              label={label}
              value={color("light", key)}
              onChange={(hex) => setBothModes(key, hex)}
            />
            <span className="flex-1" />
          </div>
        ))}
      </Section>

      <Section title="Shape">
        <SliderField
          id="panel-radius"
          label="Radius"
          value={radius}
          min={0}
          max={24}
          onChange={(px) => setPx("radius", px)}
        />
        <SelectRow
          id="panel-controls"
          label="Controls"
          items={controlShapes}
          value={custom.controls ?? defaults.controls}
          onChange={(v) =>
            setCustom((c) => ({
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
              <div
                key={name}
                className="flex w-16 flex-col items-center gap-1.5"
              >
                <div
                  aria-hidden="true"
                  className="size-12 border-s-2 border-t-2 border-foreground"
                  style={{ borderStartStartRadius: corner(r) }}
                />
                <span className="text-caption text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Spacing and size">
        <SliderField
          id="panel-space"
          label="Spacing base"
          value={toPx(shared("space-base"))}
          min={2}
          max={8}
          onChange={(px) => setPx("space-base", px)}
        />
        <SliderField
          id="panel-height"
          label="Control height"
          value={
            toPx(shared("control-height")) || toPx(shared("space-base")) * 8
          }
          min={24}
          max={48}
          onChange={(px) => setPx("control-height", px)}
        />
      </Section>

      <Section title="Typography">
        <SelectRow
          id="panel-sans"
          label="Sans"
          items={fonts}
          value={custom.font ?? defaults.font}
          onChange={(v) =>
            setCustom((c) => ({
              ...c,
              font: v === defaults.font ? undefined : v,
            }))
          }
        />
        <SelectRow
          id="panel-heading"
          label="Heading"
          items={headingFonts}
          value={custom.headingFont ?? defaults.headingFont}
          onChange={(v) =>
            setCustom((c) => ({
              ...c,
              headingFont: v === defaults.headingFont ? undefined : v,
            }))
          }
        />
        <SelectRow
          id="panel-mono"
          label="Mono"
          items={monoFonts}
          value={custom.monoFont ?? defaults.monoFont}
          onChange={(v) =>
            setCustom((c) => ({
              ...c,
              monoFont: v === defaults.monoFont ? undefined : v,
            }))
          }
        />
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
                value={toPx(shared(`type-${key}`))}
                min={8}
                max={64}
                suffix="px"
                digits={1}
                className="h-control-xs w-24"
                onChange={(px) => setPx(`type-${key}`, px)}
              />
              <NumberField
                label={`${label} leading`}
                value={toNumber(shared(`type-${key}-leading`))}
                min={1}
                max={3}
                digits={2}
                className="h-control-xs w-full"
                onChange={(n) => setNum(`type-${key}-leading`, n, toNumber)}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel>Weights</FieldLabel>
          <div className="flex w-36 gap-2">
            {weights.map(({ key, label }) => (
              <NumberField
                key={key}
                label={`${label} weight`}
                value={Number(shared(key)) || 0}
                min={100}
                max={900}
                className="h-control-sm min-w-0 flex-1"
                inputClassName="px-1 text-center"
                onChange={(n) => setNum(key, n, (v) => Number(v) || 0)}
              />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Motion">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          {durations.map(({ key, label }) => (
            <div key={key} className="flex min-w-0 flex-col gap-1">
              <span className="text-caption text-muted-foreground">
                {label}
              </span>
              <NumberField
                label={`${label} duration`}
                value={toMs(shared(key))}
                min={0}
                max={2000}
                suffix="ms"
                className="h-control-sm w-full"
                inputClassName="px-2.5"
                onChange={(n) => setNum(key, n, toMs, "ms")}
              />
            </div>
          ))}
        </div>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="panel-fades">Fades</FieldLabel>
          <Switch
            id="panel-fades"
            checked={custom.fades !== false}
            onCheckedChange={(on) =>
              setCustom((c) => ({ ...c, fades: on ? undefined : false }))
            }
          />
        </Field>
      </Section>

      <Section title="Output">
        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor="panel-name">Theme name</FieldLabel>
          <Input
            id="panel-name"
            value={custom.name}
            onChange={(e) => setCustom((c) => ({ ...c, name: e.target.value }))}
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

      {/* Stays at the bottom of the panel while the sections scroll. */}
      <div className="sticky -bottom-6 z-10 -mx-4 mt-auto -mb-6 border-t border-border bg-background px-4 py-4">
        <Button className="w-full" disabled={!customized} onClick={onReset}>
          <RotateCcwIcon />
          Reset to theme defaults
        </Button>
      </div>
    </aside>
  )
}
