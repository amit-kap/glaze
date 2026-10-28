"use client"

import * as React from "react"
import { ChevronDownIcon, RotateCcwIcon } from "lucide-react"

import {
  formatColor,
  parseColor,
  rgbaToHsl,
  rgbaToOklch,
  type ColorFormat,
  type Rgba,
} from "@amit-kap/glaze/lib/color"
import { cn } from "@amit-kap/glaze/lib/utils"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
} from "@amit-kap/glaze/components/collapsible"
import { ColorPicker } from "@amit-kap/glaze/components/color-picker"
import { ColorSwatch } from "@amit-kap/glaze/components/color-swatch"
import { Input } from "@amit-kap/glaze/components/input"
import { ContrastBadge } from "@amit-kap/glaze/components/contrast-badge"

/** A token this colour writes, shown under the picker with its own values. */
type Dependent = {
  /** What the row is called; the token name reads well in a dense list. */
  label: string
  value: string
}

const round = (n: number, digits: number) => Number(n.toFixed(digits))

// 100%, not 100.0%; 98.5% keeps the decimal the eye needs.
const percent = (n: number) => `${round(n, 1)}%`

/** A colour as designers read it: lightness, chroma, hue — not as CSS. */
export function colorChannels(value: string) {
  const parsed = parseColor(value)
  if (!parsed) return null
  const { l, c, h } = rgbaToOklch(parsed)
  return `${percent(l)} · ${round(c, 2)} · ${round(h, 0)}°`
}

/**
 * The colour's channels, in the notation the picker is set to: L/C/H, R/G/B,
 * H/S/L — or the hex itself, which has no channels to split. The slots never
 * resize, so a column of rows reads as one table of values.
 */
function Channels({
  value,
  format = "oklch",
}: {
  value: string
  /** Mirrors the picker's format, so a value is never written two ways. */
  format?: ColorFormat
}) {
  const parsed = parseColor(value)
  // Wide enough for the longest value a channel can take (14.5%, 0.183, 355°)
  // with the hairline and its gaps either side of it.
  const cell = "w-9"

  if (!parsed) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 text-center font-mono text-caption whitespace-nowrap text-muted-foreground",
          cell
        )}
      >
        —
      </span>
    )
  }

  // Hex is one value, not three: it gets the whole block, rules and all.
  if (format === "hex") {
    return (
      <span
        aria-hidden="true"
        className="w-[131px] shrink-0 text-center font-mono text-caption whitespace-nowrap text-muted-foreground"
      >
        {formatColor({ ...parsed, a: 1 }, "hex")}
      </span>
    )
  }

  const hsl = rgbaToHsl(parsed)
  const oklch = rgbaToOklch(parsed)
  const cells =
    format === "rgb"
      ? [
          `${round(parsed.r, 0)}`,
          `${round(parsed.g, 0)}`,
          `${round(parsed.b, 0)}`,
        ]
      : format === "hsl"
        ? [`${round(hsl.h, 0)}°`, `${percent(hsl.s)}`, `${percent(hsl.l)}`]
        : [percent(oklch.l), `${round(oklch.c, 2)}`, `${round(oklch.h, 0)}°`]

  return (
    <span aria-hidden="true" className="flex h-4 shrink-0 items-center gap-1">
      {cells.map((text, index) => (
        <React.Fragment key={index}>
          <span className="h-4 w-px shrink-0 bg-border" />
          <span
            className={cn(
              "shrink-0 text-center font-mono text-caption whitespace-nowrap text-muted-foreground",
              cell
            )}
          >
            {text}
          </span>
        </React.Fragment>
      ))}
    </span>
  )
}

const channelNames: Record<Exclude<ColorFormat, "hex">, string[]> = {
  oklch: ["Lightness", "Chroma", "Hue"],
  rgb: ["Red", "Green", "Blue"],
  hsl: ["Hue", "Saturation", "Lightness"],
}

/** What each editable cell holds for a colour, in the card's notation. */
function cellsOf(color: Rgba, format: ColorFormat): string[] {
  if (format === "hex") return [formatColor(color, "hex")]
  if (format === "rgb")
    return [color.r, color.g, color.b].map((n) => String(round(n, 0)))
  if (format === "hsl") {
    const { h, s, l } = rgbaToHsl(color)
    return [h, s, l].map((n) => String(round(n, 1)))
  }
  const { l, c, h } = rgbaToOklch(color)
  return [String(round(l, 1)), String(round(c, 3)), String(round(h, 1))]
}

// A cell may carry its unit: "20.5%" and "355°" are as good as "20.5", "355".
const bare = (text: string) => text.trim().replace(/[%°]$/, "")

/** The colour the cells spell, or null when any cell is not a number. */
function colorOf(cells: string[], format: ColorFormat, alpha: number) {
  if (format === "hex") {
    const hex = parseColor(cells[0])
    return hex && cells[0].trim().replace("#", "").length < 8
      ? { ...hex, a: alpha }
      : hex
  }
  const numbers = cells.map((cell) =>
    bare(cell) === "" ? Number.NaN : Number(bare(cell))
  )
  if (numbers.some((n) => !Number.isFinite(n))) return null
  const [x, y, z] = numbers
  return parseColor(
    format === "rgb"
      ? `rgb(${x} ${y} ${z} / ${alpha})`
      : format === "hsl"
        ? `hsl(${x} ${y}% ${z}% / ${alpha})`
        : `oklch(${x}% ${y} ${z} / ${alpha})`
  )
}

/**
 * Anything CSS reads as a colour, including names like `red`, which the
 * kit's own parser doesn't know: the browser resolves it.
 */
function resolveColor(text: string): Rgba | null {
  const direct = parseColor(text)
  if (direct) return direct
  if (typeof document === "undefined" || !CSS.supports("color", text.trim()))
    return null
  const probe = document.createElement("span")
  probe.style.color = text.trim()
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return parseColor(resolved)
}

/**
 * The header's readout. With a way to change the colour it is a button; click
 * it and each channel becomes a field in the card's notation: lightness,
 * chroma and hue for OKLCH, red, green and blue for RGB, hue, saturation and
 * lightness for HSL, one field for hex. Tab moves between them; Enter, or
 * leaving the group, applies; Escape, or an unreadable number, puts the old
 * colour back. Pasting a whole colour in any notation into any field applies
 * it at once.
 */
function EditableChannels({
  label,
  value,
  format,
  onValueChange,
}: {
  label: string
  value: string
  format: ColorFormat
  onValueChange: (value: string) => void
}) {
  const [cells, setCells] = React.useState<string[] | null>(null)
  const [invalid, setInvalid] = React.useState(false)
  const parsed = parseColor(value)

  if (cells === null) {
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Edit ${label} value`}
        title="Click to type or paste a colour"
        className="h-control-sm shrink-0 px-0 hover:bg-transparent"
        onClick={(event) => {
          event.stopPropagation()
          setInvalid(false)
          setCells(
            parsed
              ? cellsOf(parsed, format)
              : cellsOf({ r: 0, g: 0, b: 0, a: 1 }, format)
          )
        }}
      >
        <Channels value={value} format={format} />
      </Button>
    )
  }

  const apply = (color: Rgba) => {
    // Write what the picker would, and say nothing when nothing changed.
    const next = formatColor(color, format)
    if (!parsed || next !== formatColor(parsed, format)) onValueChange(next)
    setCells(null)
  }
  const commit = () => {
    const color = colorOf(cells, format, parsed?.a ?? 1)
    if (!color) return false
    apply(color)
    return true
  }

  return (
    <span
      role="group"
      aria-label={`${label} value`}
      className="mx-px flex h-control-sm shrink-0 items-center gap-1"
      onClick={(event) => event.stopPropagation()}
      onBlur={(event) => {
        // Moving between the fields isn't leaving the group.
        if (event.currentTarget.contains(event.relatedTarget as Node | null))
          return
        if (!commit()) setCells(null)
      }}
    >
      {cells.map((text, index) => (
        <React.Fragment key={index}>
          {format !== "hex" && (
            <span aria-hidden="true" className="h-4 w-px shrink-0 bg-border" />
          )}
          <Input
            autoFocus={index === 0}
            size="mini"
            spellCheck={false}
            aria-label={
              format === "hex"
                ? `${label} hex`
                : `${label} ${channelNames[format][index].toLowerCase()}`
            }
            aria-invalid={invalid || undefined}
            value={text}
            className={cn(
              "text-center font-mono",
              // Same width as the readout it replaces, so opening it moves
              // nothing: a channel cell is 36px, so its text is a size down.
              format === "hex"
                ? "w-[131px]"
                : "w-9 data-[size=mini]:px-0 data-[size=mini]:text-micro md:data-[size=mini]:text-micro"
            )}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => {
              setCells(
                cells.map((cell, i) =>
                  i === index ? event.target.value : cell
                )
              )
              setInvalid(false)
            }}
            onPaste={(event) => {
              // A whole colour, in any notation, replaces all the fields.
              const pasted = event.clipboardData.getData("text").trim()
              if (!/[#(a-z]/i.test(pasted)) return
              const color = resolveColor(pasted)
              if (!color) return
              event.preventDefault()
              apply(color)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                if (!commit()) setInvalid(true)
              } else if (event.key === "Escape") {
                event.preventDefault()
                setCells(null)
              }
            }}
          />
        </React.Fragment>
      ))}
    </span>
  )
}

/**
 * One colour, in a card: swatch, name, its OKLCH values and how readable it
 * is. Opening it reveals the picker and every token that follows this colour,
 * so a theme is edited where the consequences are visible.
 */
function ColorSelector({
  label,
  value,
  onValueChange,
  description,
  contrast,
  dependents,
  edited = false,
  onReset,
  open,
  defaultOpen = false,
  onOpenChange,
  format: formatProp,
  defaultFormat = "oklch",
  onFormatChange,
  className,
}: {
  /** The row's name; also its accessible name. */
  label: string
  /** Any CSS colour the picker can read. */
  value: string
  /** Omit to show the value without a picker. */
  onValueChange?: (value: string) => void
  /** One line under the header, shown while open. */
  description?: string
  /** The pair to judge readability on, when the colour is actually read. */
  contrast?: { foreground: string; background: string }
  /** Tokens that read this colour. */
  dependents?: Dependent[]
  /** True when the colour differs from the theme it started from. */
  edited?: boolean
  onReset?: () => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** The notation for every value in the card; defaults to OKLCH. */
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  className?: string
}) {
  const contentId = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  // The header reads in the same notation the picker is set to. A panel can
  // lift the choice, so every card is read the same way.
  const [ownFormat, setOwnFormat] = React.useState<ColorFormat>(defaultFormat)
  const format = formatProp ?? ownFormat
  const setFormat = (next: ColorFormat) => {
    if (formatProp === undefined) setOwnFormat(next)
    onFormatChange?.(next)
  }
  const isOpen = open ?? uncontrolled

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setOpen}>
      <div
        data-slot="color-selector"
        className={cn(
          "flex w-full flex-col rounded-control border border-border bg-background px-2 py-1 transition-colors",
          // Hover reads as a border, not a fill: the card stays one surface.
          "has-[[data-slot=color-selector-header]:hover]:border-ring",
          className
        )}
      >
        {/* The whole header toggles; the reset is the one thing that doesn't. */}
        <div
          data-slot="color-selector-header"
          className="flex h-control-sm w-full items-center gap-1"
          onClick={() => setOpen(!isOpen)}
        >
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-label={label}
            className="h-control-sm min-w-0 shrink gap-1 px-0 hover:bg-transparent aria-expanded:bg-transparent"
          >
            <ColorSwatch value={value} size="xs" />
            <span className="truncate text-caption font-medium text-foreground">
              {label}
            </span>
          </Button>

          {edited && onReset && (
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={`Reset ${label}`}
              title={`Reset ${label}`}
              className="size-4 shrink-0 p-0 text-muted-foreground [&_svg]:size-4"
              onClick={(event) => {
                event.stopPropagation()
                onReset()
              }}
            >
              <RotateCcwIcon />
            </Button>
          )}

          <span className="ms-auto flex shrink-0 items-center gap-2">
            {onValueChange ? (
              <EditableChannels
                label={label}
                value={value}
                format={format}
                onValueChange={onValueChange}
              />
            ) : (
              <span title={colorReadout(value)}>
                <Channels value={value} format={format} />
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={isOpen}
              aria-controls={contentId}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
              className="h-control-sm shrink-0 px-0 hover:bg-transparent aria-expanded:bg-transparent"
            >
              <ChevronDownIcon
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast)",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </span>
        </div>

        <CollapsibleContent id={contentId}>
          <div className="flex w-full flex-col">
            {description && (
              <p className="w-full py-2 text-caption text-muted-foreground">
                {description}
              </p>
            )}

            {onValueChange && (
              <div className="w-full py-2">
                <ColorPicker
                  value={value}
                  onValueChange={onValueChange}
                  defaultFormat="oklch"
                  card={false}
                  format={format}
                  onFormatChange={setFormat}
                  compact
                  showFields={false}
                  hidePreview
                  accessory={
                    contrast ? (
                      <ContrastBadge
                        foreground={contrast.foreground}
                        background={contrast.background}
                        className="text-micro"
                      />
                    ) : undefined
                  }
                />
              </div>
            )}

            {dependents && dependents.length > 0 && (
              <ul className="flex w-full flex-col gap-2 py-2">
                {dependents.map((dependent) => (
                  <li
                    key={dependent.label}
                    className="flex w-full items-start justify-between"
                  >
                    <span className="flex items-center gap-1">
                      <ColorSwatch value={dependent.value} size="xs" />
                      <span className="truncate text-caption text-foreground">
                        {dependent.label}
                      </span>
                    </span>
                    <Channels value={dependent.value} format={format} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

/** The value a selector shows in its tooltip: full precision, one notation. */
export function colorReadout(value: string) {
  const parsed = parseColor(value)
  return parsed ? formatColor(parsed, "oklch") : value
}

export { ColorSelector }
export type { Dependent as ColorSelectorDependent }
