import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@amit-kap/glaze/lib/utils"
import {
  formatColor,
  parseColor,
  type ColorFormat,
} from "@amit-kap/glaze/lib/color"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import { ColorPicker } from "@amit-kap/glaze/components/color-picker"
import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import {
  InputGroup,
  InputGroupAddon,
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

// A checkerboard under translucent colours.
const checker =
  "repeating-conic-gradient(var(--border) 0 25%, var(--background) 0 50%) 0 0 / 8px 8px"

export const toHex = (css: string | undefined) => {
  const parsed = parseColor(css ?? "")
  return parsed ? formatColor(parsed, "hex") : "#000000"
}

// --- Building blocks -------------------------------------------------------

// A collapsible section inside a tab. `dots` are swatch previews shown on the
// collapsed header, so a closed colour group still hints at its contents.
export function Section({
  title,
  dots,
  defaultOpen = false,
  children,
}: {
  title: string
  dots?: string[]
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-b border-border"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2.5">
        <span>{title}</span>
        <span className="flex items-center gap-2">
          {!open && dots && (
            <span aria-hidden="true" className="flex gap-1">
              {dots.slice(0, 6).map((color, i) => (
                <span
                  key={i}
                  className="size-3.5 rounded-pill border border-border/60"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
          )}
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function SelectRow({
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
        <SelectTrigger id={id} className="w-36">
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
export function NumberField({
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
    <InputGroup className={className ?? "w-20"}>
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
        className={inputClassName}
      />
      {suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{suffix}</InputGroupText>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export function SliderField({
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

// The colour picker in a popover, around whatever trigger is given.
function ColorPopover({
  value,
  onChange,
  trigger,
  children,
}: {
  /** Carried by the trigger (aria-label); kept so callers stay uniform. */
  label: string
  value: string
  onChange: (hex: string) => void
  trigger: React.ReactElement
  children?: React.ReactNode
}) {
  const [format, setFormat] = React.useState<ColorFormat>("hex")
  const parsed = parseColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }
  return (
    <Popover>
      <PopoverTrigger render={trigger}>{children}</PopoverTrigger>
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

// A colour as a swatch and its hex; the picker opens below it.
export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  const parsed = parseColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }
  const fill = `rgb(${parsed.r} ${parsed.g} ${parsed.b} / ${parsed.a})`
  return (
    <ColorPopover
      label={label}
      value={value}
      onChange={onChange}
      trigger={
        <Button
          variant="outline"
          aria-label={label}
          className="min-w-0 flex-1 justify-start gap-1.5 ps-1.5"
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
      <span className="truncate">{formatColor(parsed, "hex").slice(0, 7)}</span>
    </ColorPopover>
  )
}

// The same picker as a bare swatch, for compact rows that carry their own
// label and hex text.
export function ColorSwatch({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  const parsed = parseColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }
  const fill = `rgb(${parsed.r} ${parsed.g} ${parsed.b} / ${parsed.a})`
  return (
    <ColorPopover
      label={label}
      value={value}
      onChange={onChange}
      trigger={
        <button
          type="button"
          aria-label={label}
          className="relative size-5 shrink-0 overflow-clip rounded-item-sm border border-border"
        />
      }
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `linear-gradient(${fill}, ${fill}), ${checker}` }}
      />
    </ColorPopover>
  )
}
