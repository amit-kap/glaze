"use client"

import * as React from "react"
import { PipetteIcon } from "lucide-react"

import { cn } from "@amit-kap/glaze/lib/utils"
import {
  formatColor,
  hsvaToRgba,
  hslToRgba,
  oklchToRgba,
  parseColor,
  rgbaToHsl,
  rgbaToHsva,
  rgbaToOklch,
  type ColorFormat,
  type Hsva,
  type Rgba,
} from "@amit-kap/glaze/lib/color"
import { Button } from "@amit-kap/glaze/components/button"
import { Card, CardContent } from "@amit-kap/glaze/components/card"
import { Input } from "@amit-kap/glaze/components/input"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@amit-kap/glaze/components/tooltip"

// The Chromium-only eyedropper; hidden where it isn't there.
type EyeDropperApi = new () => { open(): Promise<{ sRGBHex: string }> }

const formats: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
]

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

const css = (c: Rgba) =>
  `rgb(${Math.round(c.r)} ${Math.round(c.g)} ${Math.round(c.b)} / ${c.a})`

// A checkerboard under a colour, so transparency reads as transparency.
const checker =
  "repeating-conic-gradient(var(--border) 0 25%, var(--background) 0 50%) 0 0 / 8px 8px"

type ColorPickerProps = {
  /** Any CSS colour the picker can read: hex, rgb(), hsl() or oklch(). */
  value?: string
  defaultValue?: string
  /** Called with the colour written in the current format. */
  onValueChange?: (value: string, color: Rgba) => void
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  /** Colours to pick from; the row is hidden when omitted. */
  swatches?: string[]
  hideEyedropper?: boolean
  /** Draw the picker in a card; the popover turns this off. */
  card?: boolean
  /** Hide the swatch beside the sliders, for callers that already show it. */
  hidePreview?: boolean
  /** Draw the saturation field short, for pickers that sit inside a row. */
  compact?: boolean
  /** Hide the numeric channel row; sliders and the format carry editing. */
  showFields?: boolean
  /** Sits after the eyedropper: a verdict on the colour, not a control. */
  accessory?: React.ReactNode
  className?: string
}

function useHsva(value: string | undefined, defaultValue: string) {
  const [hsva, setHsva] = React.useState<Hsva>(() =>
    rgbaToHsva(parseColor(value ?? defaultValue) ?? { r: 0, g: 0, b: 0, a: 1 })
  )
  // A controlled value that isn't what we last reported is an outside change.
  const [seen, setSeen] = React.useState(value)
  if (value !== undefined && value !== seen) {
    setSeen(value)
    const parsed = parseColor(value)
    if (parsed) setHsva((h) => rgbaToHsva(parsed, h.h))
  }
  return [hsva, setHsva, setSeen] as const
}

function ColorPicker({
  value,
  defaultValue = "#6B97FF",
  onValueChange,
  format: formatProp,
  defaultFormat = "hex",
  onFormatChange,
  swatches,
  hideEyedropper = false,
  card = true,
  hidePreview = false,
  compact = false,
  showFields = true,
  accessory,
  className,
}: ColorPickerProps) {
  const [hsva, setHsva, setSeen] = useHsva(value, defaultValue)
  const [formatState, setFormatState] = React.useState(defaultFormat)
  const format = formatProp ?? formatState
  const rgba = hsvaToRgba(hsva)
  const areaRef = React.useRef<HTMLDivElement>(null)
  const canPick =
    !hideEyedropper && typeof window !== "undefined" && "EyeDropper" in window

  // Every change comes through here: keep the hue for greys, then report.
  const commit = (next: Hsva, nextFormat = format) => {
    setHsva(next)
    const out = formatColor(hsvaToRgba(next), nextFormat)
    setSeen(out)
    onValueChange?.(out, hsvaToRgba(next))
  }
  const commitRgba = (next: Rgba) => commit(rgbaToHsva(next, hsva.h))

  const changeFormat = (next: ColorFormat) => {
    setFormatState(next)
    onFormatChange?.(next)
    commit(hsva, next)
  }

  // --- Saturation/value area ---------------------------------------------

  const pickAt = (event: React.PointerEvent) => {
    const box = areaRef.current?.getBoundingClientRect()
    if (!box) return
    commit({
      ...hsva,
      s: clamp((event.clientX - box.left) / box.width, 0, 1),
      v: 1 - clamp((event.clientY - box.top) / box.height, 0, 1),
    })
  }

  const onAreaKey = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.01
    const move: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    const [ds, dv] = move[event.key] ?? []
    if (ds === undefined) return
    event.preventDefault()
    commit({
      ...hsva,
      s: clamp(hsva.s + ds, 0, 1),
      v: clamp(hsva.v + dv, 0, 1),
    })
  }

  const eyedrop = async () => {
    try {
      const { sRGBHex } = await new (
        window as unknown as { EyeDropper: EyeDropperApi }
      ).EyeDropper().open()
      const parsed = parseColor(sRGBHex)
      if (parsed) commitRgba({ ...parsed, a: hsva.a })
    } catch {
      // Dismissed with Escape.
    }
  }

  // --- Channel fields -----------------------------------------------------

  const hsl = rgbaToHsl(rgba)
  const oklch = rgbaToOklch(rgba)
  const withAlpha = (c: Rgba) => ({ ...c, a: hsva.a })

  const fields: {
    label: string
    value: number
    digits?: number
    min: number
    max: number
    set: (n: number) => void
  }[] =
    format === "rgb"
      ? (["r", "g", "b"] as const).map((k) => ({
          label: k.toUpperCase(),
          value: rgba[k],
          min: 0,
          max: 255,
          set: (n) => commitRgba({ ...rgba, [k]: n }),
        }))
      : format === "hsl"
        ? [
            {
              label: "H",
              value: hsl.h,
              min: 0,
              max: 360,
              set: (n) => commitRgba(withAlpha(hslToRgba(n, hsl.s, hsl.l))),
            },
            {
              label: "S",
              value: hsl.s,
              min: 0,
              max: 100,
              set: (n) => commitRgba(withAlpha(hslToRgba(hsl.h, n, hsl.l))),
            },
            {
              label: "L",
              value: hsl.l,
              min: 0,
              max: 100,
              set: (n) => commitRgba(withAlpha(hslToRgba(hsl.h, hsl.s, n))),
            },
          ]
        : format === "oklch"
          ? [
              {
                label: "L",
                value: oklch.l,
                digits: 1,
                min: 0,
                max: 100,
                set: (n) =>
                  commitRgba(withAlpha(oklchToRgba(n, oklch.c, oklch.h))),
              },
              {
                label: "C",
                value: oklch.c,
                digits: 3,
                min: 0,
                max: 0.4,
                set: (n) =>
                  commitRgba(withAlpha(oklchToRgba(oklch.l, n, oklch.h))),
              },
              {
                label: "H",
                value: oklch.h,
                digits: 1,
                min: 0,
                max: 360,
                set: (n) =>
                  commitRgba(withAlpha(oklchToRgba(oklch.l, oklch.c, n))),
              },
            ]
          : []

  const hueColor = css(hsvaToRgba({ h: hsva.h, s: 1, v: 1, a: 1 }))
  const solid = css({ ...rgba, a: 1 })

  const content = (
    <>
      <div
        ref={areaRef}
        data-slot="color-picker-area"
        role="group"
        aria-label="Saturation and brightness"
        tabIndex={0}
        className={cn(
          "relative w-full cursor-crosshair touch-none rounded-control outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/25",
          compact ? "h-15" : "h-36"
        )}
        style={{
          background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, ${hueColor})`,
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          pickAt(event)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            pickAt(event)
        }}
        onKeyDown={onAreaKey}
      >
        <span
          data-slot="color-picker-thumb"
          className="pointer-events-none absolute size-3.5 -translate-1/2 rounded-pill"
          style={{
            left: `${hsva.s * 100}%`,
            top: `${(1 - hsva.v) * 100}%`,
            backgroundColor: solid,
            // White with a dark hairline reads on any colour, in any theme.
            border: "2px solid white",
            boxShadow: "0 0 0 1px rgb(0 0 0 / 0.3)",
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Slider
            aria-label="Hue"
            min={0}
            max={360}
            step={1}
            value={[hsva.h]}
            onValueChange={(v) =>
              commit({ ...hsva, h: Array.isArray(v) ? v[0] : v })
            }
            className="**:data-[slot=slider-range]:bg-transparent! **:data-[slot=slider-track]:h-2.5! **:data-[slot=slider-track]:bg-[linear-gradient(to_right,red,#ff0,#0f0,#0ff,#00f,#f0f,red)]!"
          />
          <Slider
            aria-label="Opacity"
            min={0}
            max={100}
            step={1}
            value={[Math.round(hsva.a * 100)]}
            onValueChange={(v) =>
              commit({ ...hsva, a: (Array.isArray(v) ? v[0] : v) / 100 })
            }
            style={{
              ["--alpha-track" as string]: `linear-gradient(to right, transparent, ${solid}), ${checker}`,
            }}
            className="**:data-[slot=slider-range]:bg-transparent! **:data-[slot=slider-track]:h-2.5! **:data-[slot=slider-track]:[background:var(--alpha-track)]!"
          />
        </div>
        {!hidePreview && (
          <span
            data-slot="color-picker-preview"
            aria-hidden="true"
            className="size-9 shrink-0 rounded-control border border-border"
            style={{
              background: `linear-gradient(${css(rgba)}, ${css(rgba)}), ${checker}`,
            }}
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Select
            items={formats}
            value={format}
            onValueChange={(v) => v && changeFormat(v as ColorFormat)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Colour format"
              className="w-full min-w-0 flex-1 rounded-md"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {formats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {canPick && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Pick a colour from the screen"
                    className="w-16 shrink-0 rounded-md"
                    onClick={eyedrop}
                  />
                }
              >
                <PipetteIcon />
              </TooltipTrigger>
              <TooltipContent>Eyedropper</TooltipContent>
            </Tooltip>
          )}
          {accessory}
        </div>

        {showFields && (
          <div
            className={cn(
              "grid items-end gap-1.5",
              format === "hex"
                ? "grid-cols-[minmax(0,1fr)_4rem]"
                : "grid-cols-[repeat(3,minmax(0,1fr))_4rem]"
            )}
          >
            {format === "hex" ? (
              <ChannelField
                ariaLabel="Hex"
                text={formatColor({ ...rgba, a: 1 }, "hex")}
                onCommit={(text) => {
                  const parsed = parseColor(text)
                  if (parsed) commitRgba({ ...parsed, a: hsva.a })
                }}
              />
            ) : (
              fields.map((f) => (
                <ChannelField
                  key={f.label}
                  label={f.label}
                  text={String(Number(f.value.toFixed(f.digits ?? 0)))}
                  onCommit={(text) => {
                    const n = Number.parseFloat(text)
                    if (!Number.isNaN(n)) f.set(clamp(n, f.min, f.max))
                  }}
                />
              ))
            )}
            <ChannelField
              ariaLabel="Opacity"
              text={`${Math.round(hsva.a * 100)}%`}
              onCommit={(text) => {
                const n = Number.parseFloat(text)
                if (!Number.isNaN(n))
                  commit({ ...hsva, a: clamp(n, 0, 100) / 100 })
              }}
            />
          </div>
        )}
      </div>

      {swatches && swatches.length > 0 && (
        <div
          data-slot="color-picker-swatches"
          className="flex flex-wrap gap-1.5"
        >
          {swatches.map((swatch) => {
            const parsed = parseColor(swatch)
            if (!parsed) return null
            const active =
              formatColor(parsed, "hex") === formatColor(rgba, "hex")
            return (
              <button
                key={swatch}
                type="button"
                aria-label={swatch}
                aria-pressed={active}
                onClick={() => commitRgba(parsed)}
                className="size-6 cursor-pointer rounded-item border border-border outline-none focus-visible:ring-3 focus-visible:ring-ring/25 aria-pressed:ring-2 aria-pressed:ring-ring"
                style={{
                  background: `linear-gradient(${css(parsed)}, ${css(parsed)}), ${checker}`,
                }}
              />
            )
          })}
        </div>
      )}
    </>
  )

  return card ? (
    <Card
      data-slot="color-picker"
      size="sm"
      className={cn("w-full min-w-0", className)}
    >
      <CardContent className="flex flex-col gap-3">{content}</CardContent>
    </Card>
  ) : (
    <div
      data-slot="color-picker"
      className={cn("flex w-full min-w-0 flex-col gap-3", className)}
    >
      {content}
    </div>
  )
}

// A labelled text field that takes edits freely and applies them on blur or
// Enter; text that doesn't parse reverts to the current value.
function ChannelField({
  label,
  ariaLabel,
  text,
  onCommit,
  className,
}: {
  /** A visible label above the field. */
  label?: string
  /** The name for fields without a visible label. */
  ariaLabel?: string
  text: string
  onCommit: (text: string) => void
  className?: string
}) {
  const [draft, setDraft] = React.useState<string | null>(null)
  const done = () => {
    if (draft !== null) onCommit(draft)
    setDraft(null)
  }
  return (
    <label className={cn("flex min-w-0 flex-col gap-1", className)}>
      {label && (
        <span className="text-caption text-muted-foreground">{label}</span>
      )}
      <Input
        aria-label={label ? undefined : ariaLabel}
        value={draft ?? text}
        spellCheck={false}
        autoComplete="off"
        className="h-control-sm px-2 font-mono text-caption md:text-caption"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={done}
        onKeyDown={(event) => {
          if (event.key === "Enter") done()
          if (event.key === "Escape") setDraft(null)
        }}
      />
    </label>
  )
}

// A button showing the colour, opening the picker in a popover.
function ColorPickerPopover({
  triggerLabel,
  triggerClassName,
  value,
  defaultValue = "#6B97FF",
  onValueChange,
  ...props
}: ColorPickerProps & {
  triggerLabel?: string
  triggerClassName?: string
}) {
  const [state, setState] = React.useState(defaultValue)
  const current = value ?? state
  const parsed = parseColor(current)
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("justify-start", triggerClassName)}
          />
        }
      >
        <span
          aria-hidden="true"
          className="size-4 shrink-0 rounded-item border border-border"
          style={{
            background: parsed
              ? `linear-gradient(${css(parsed)}, ${css(parsed)}), ${checker}`
              : undefined,
          }}
        />
        {triggerLabel && <span>{triggerLabel}</span>}
        <span className="font-mono text-caption text-muted-foreground">
          {current}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <ColorPicker
          {...props}
          card={false}
          value={current}
          onValueChange={(next, color) => {
            setState(next)
            onValueChange?.(next, color)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker, ColorPickerPopover }
export type { ColorFormat, ColorPickerProps }
