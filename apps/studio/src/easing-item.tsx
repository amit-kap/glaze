import * as React from "react"
import { ChevronDownIcon, PlayIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import {
  Collapsible,
  CollapsibleContent,
} from "@amit-kap/glaze/components/collapsible"
import { cn } from "@amit-kap/glaze/lib/utils"

import { NumberField, SettingItem } from "./controls"
import { curvePoints, formatBezier, parseEasing, type Bezier } from "./motion"

// The four numbers of a cubic Bézier: [label, hint, min, max].
const fields = [
  ["X1", "Where the first handle sits in time", 0, 1],
  ["Y1", "How far along the first handle pulls; above 1 overshoots", -2, 3],
  ["X2", "Where the second handle sits in time", 0, 1],
  ["Y2", "How far along the second handle pulls; above 1 overshoots", -2, 3],
] as const

/** A curve drawn from 0 to 1, with 0 and 1 marked: overshoot reads as a bump. */
function Curve({
  easing,
  size,
  className,
}: {
  easing: string
  size: number
  className?: string
}) {
  const pad = size * 0.14
  const span = size - pad * 2
  // Room above 1 and below 0 for curves that overshoot.
  const y = (value: number) => pad + ((1.5 - value) / 2) * span
  const x = (value: number) => pad + value * span
  const line = curvePoints(easing)
    .map(([px, py]) => `${x(px).toFixed(1)},${y(py).toFixed(1)}`)
    .join(" ")

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)}
    >
      <line
        x1={x(0)}
        x2={x(1)}
        y1={y(0)}
        y2={y(0)}
        stroke="var(--border)"
        strokeDasharray="2 2"
      />
      <line
        x1={x(0)}
        x2={x(1)}
        y1={y(1)}
        y2={y(1)}
        stroke="var(--border)"
        strokeDasharray="2 2"
      />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * One easing curve: a row with a small drawing of it, opening in place to the
 * four handle numbers, a larger curve and a play button to feel it.
 */
export function EasingItem({
  label,
  note,
  value,
  edited,
  onChange,
  onReset,
}: {
  label: string
  note: string
  value: string
  edited: boolean
  onChange: (value: string) => void
  onReset: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const track = React.useRef<HTMLDivElement>(null)
  const dot = React.useRef<HTMLSpanElement>(null)
  const easing = parseEasing(value)

  const play = () => {
    if (!track.current || !dot.current) return
    const travel = track.current.clientWidth - dot.current.clientWidth
    try {
      dot.current.animate(
        [{ translate: "0px" }, { translate: `${travel}px` }],
        { duration: 800, easing: value, fill: "forwards" }
      )
    } catch {
      /* A curve the browser can't parse simply doesn't play. */
    }
  }

  const setHandle = (index: number, next: number) => {
    if (easing.kind !== "bezier") return
    const p = [...easing.p] as Bezier
    p[index] = next
    onChange(formatBezier(p))
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SettingItem label={label} note={note} edited={edited} onReset={onReset}>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
          className="h-control-xs gap-1 px-1 hover:bg-transparent aria-expanded:bg-transparent"
          onClick={() => setOpen(!open)}
        >
          <Curve easing={value} size={24} className="text-foreground" />
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-fast)",
              open && "rotate-180"
            )}
          />
        </Button>
      </SettingItem>

      <CollapsibleContent>
        <div className="flex flex-col gap-3 pb-2">
          <div className="flex items-center gap-3">
            <Curve easing={value} size={64} className="text-foreground" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div
                ref={track}
                className="relative h-3 w-full rounded-pill bg-muted"
              >
                <span
                  ref={dot}
                  className="absolute inset-s-0 top-0 block size-3 rounded-pill bg-foreground"
                />
              </div>
              <Button
                variant="ghost"
                size="xs"
                className="w-fit"
                onClick={play}
              >
                <PlayIcon />
                Play
              </Button>
            </div>
          </div>

          {easing.kind === "bezier" ? (
            <div className="grid grid-cols-4 gap-1.5">
              {fields.map(([name, hint, min, max], index) => (
                <div key={name} className="flex flex-col gap-1">
                  <span className="text-micro text-muted-foreground">
                    {name}
                  </span>
                  <NumberField
                    label={`${label} ${name}`}
                    hint={hint}
                    value={easing.p[index]}
                    min={min}
                    max={max}
                    step={0.01}
                    className="w-full min-w-0 px-1.5"
                    onCommit={(next) => setHandle(index, next)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-micro text-muted-foreground">
              This curve is a list of points, so it has no handles to edit.
              Reset restores it.
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
