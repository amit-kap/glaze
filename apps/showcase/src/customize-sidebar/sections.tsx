import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  RotateCcwIcon,
} from "lucide-react"

import { cn } from "@amit-kap/glaze/lib/utils"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import { Field, FieldError, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@amit-kap/glaze/components/input-group"
import { Switch } from "@amit-kap/glaze/components/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

import {
  ColorField,
  ColorSwatch,
  NumberField,
  Section,
  SelectRow,
  SliderField,
  toHex,
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
  /** The mode the colour rows edit, resolved to light or dark. */
  mode: Mode
  /** Effective value of a colour input (custom override or theme default). */
  color: (m: Mode, key: string) => string
  /** Effective value of a shared (mode-independent) input, as raw CSS. */
  shared: (key: string) => string
  /** Effective value of a tier-2 token: the pin, or the derived value
      resolved under the live theme. */
  system: (m: Mode, key: string) => string
  /** True when the token is pinned, i.e. no longer follows its input. */
  systemOverridden: (m: Mode, key: string) => boolean
  setCustom: (update: (c: Custom) => Custom) => void
  setPx: (key: string, px: number) => void
  setNum: (
    key: string,
    n: number,
    parse: (v: string) => number,
    unit?: string
  ) => void
  setColor: (m: Mode, key: string, hex: string) => void
  /** Pin a tier-2 token to a colour, or pass null to return it to the
      input's derivation. */
  setSystem: (m: Mode, key: string, hex: string | null) => void
  radius: number
  pill: boolean
}

// One derived token inside a colour row's drill-down, at caption scale:
// swatch opens the same picker as a full colour field, the name truncates
// with a tooltip rather than clipping, and the hex sits in a fixed column.
// Once pinned, the token stops following the input — the name goes solid
// and the reset button returns it to the derivation.
function DerivedRow({ name, editor }: { name: string; editor: ThemeEditor }) {
  const { mode } = editor
  const token = name.slice(2)
  const overridden = editor.systemOverridden(mode, token)
  const value = editor.system(mode, token)
  return (
    <div className="flex h-6 items-center gap-2">
      <ColorSwatch
        label={name}
        value={value}
        onChange={(hex) => editor.setSystem(mode, token, hex)}
      />
      <span
        title={name}
        className={cn(
          "min-w-0 flex-1 truncate font-mono text-caption",
          overridden ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {name}
      </span>
      <span className="shrink-0 font-mono text-caption text-muted-foreground">
        {toHex(value)}
      </span>
      {/* Fixed slot, so the hex column never shifts when a pin is set. */}
      <span className="flex size-control-xs shrink-0 items-center justify-center">
        {overridden && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Reset ${name} to derived`}
            title="Reset to derived"
            onClick={() => editor.setSystem(mode, token, null)}
          >
            <RotateCcwIcon />
          </Button>
        )}
      </span>
    </div>
  )
}

// One labelled colour field, editing the active mode, expandable to the
// tier-2 tokens the input feeds. The input's own token ("--overlay" under
// Overlay, "--chart-1" under Chart 1) is itself, so it isn't listed.
function ColorRow({
  label,
  self,
  derives,
  value,
  onChange,
  editor,
}: {
  label: string
  self: string
  derives: string[]
  value: string
  onChange: (hex: string) => void
  editor: ThemeEditor
}) {
  const [open, setOpen] = React.useState(false)
  const drillable = derives.filter((name) => name !== `--${self}`)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger render={<FieldLabel className="w-20 shrink-0" />}>
            {label}
          </TooltipTrigger>
          <TooltipContent side="inline-start">
            {derives.join(" ")}
          </TooltipContent>
        </Tooltip>
        <ColorField label={label} value={value} onChange={onChange} />
        {drillable.length > 0 ? (
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon-xs" />}
            aria-label={`Tokens fed by ${label}`}
            aria-expanded={open}
          >
            <ChevronDownIcon
              className={cn(
                "transition-transform duration-(--duration-fast)",
                open && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        ) : (
          // Keeps the colour fields aligned with the drillable rows'.
          <span aria-hidden="true" className="size-control-xs" />
        )}
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-1 ps-14 pt-2 pb-1">
          {drillable.map((name) => (
            <DerivedRow key={name} name={name} editor={editor} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const colorGroups = [
  { label: "Color", rows: brandRows },
  { label: "Status", rows: statusRows },
  { label: "Charts", rows: chartRows },
]

export function ColorsTab({ editor }: { editor: ThemeEditor }) {
  const { mode } = editor
  return (
    <>
      {colorGroups.map((group, i) => (
        <Section
          key={group.label}
          title={group.label}
          defaultOpen={i === 0}
          dots={group.rows.map((r) => editor.color(mode, r.key))}
        >
          {group.rows.map(({ key, label, derives }) => (
            <ColorRow
              key={key}
              label={label}
              self={key}
              derives={derives}
              value={editor.color(mode, key)}
              onChange={(hex) => editor.setColor(mode, key, hex)}
              editor={editor}
            />
          ))}
        </Section>
      ))}
    </>
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

// A corner preview per family: the families derive from the one radius (or
// use the pill shape), so this shows what the radius control really does.
const corner = (r: number) => Math.min(24, r)

function ShapeFields({ editor }: { editor: ThemeEditor }) {
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

export function OtherTab({ editor }: { editor: ThemeEditor }) {
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
    </>
  )
}

// The fields inside the Install theme dialog: name, download, setup command.
export function InstallFields({
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
    <>
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
          className="min-w-0 flex-1 px-3 py-1 break-words select-all"
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
    </>
  )
}
