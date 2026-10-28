import * as React from "react"
import { PlayIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { cn } from "@amit-kap/glaze/lib/utils"

import { ChoiceSelect, NumberField } from "./controls"
import { curvePoints, formatBezier, parseEasing, type Bezier } from "./motion"
import { SelectorCard } from "./selector-card"

// The four numbers of a cubic Bézier: [label, hint, min, max].
const fields = [
  ["X1", "Where the first handle sits in time", 0, 1],
  ["Y1", "How far along the first handle pulls; above 1 overshoots", -1, 2],
  ["X2", "Where the second handle sits in time", 0, 1],
  ["Y2", "How far along the second handle pulls; above 1 overshoots", -1, 2],
] as const

const presets: { label: string; value: string; p: Bezier }[] = [
  { label: "Linear", value: "linear", p: [0, 0, 1, 1] },
  { label: "Ease", value: "ease", p: [0.25, 0.1, 0.25, 1] },
  { label: "Ease in", value: "ease-in", p: [0.42, 0, 1, 1] },
  { label: "Ease out", value: "ease-out", p: [0, 0, 0.58, 1] },
  { label: "Ease in-out", value: "ease-in-out", p: [0.42, 0, 0.58, 1] },
]
const custom = { label: "Custom", value: "custom" }

const matchPreset = (p: Bezier) =>
  presets.find((preset) => preset.p.every((n, i) => Math.abs(n - p[i]) < 0.005))

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

/**
 * A curve drawn from 0 to 1 in time, with 0 and 1 marked. `lo` and `hi` are
 * the values the drawing has room for, so overshoot reads as a bump.
 */
function Curve({
  easing,
  width,
  height = width,
  lo = -0.5,
  hi = 1.5,
  pad = width * 0.14,
  className,
  children,
}: {
  easing: string
  width: number
  height?: number
  lo?: number
  hi?: number
  pad?: number
  className?: string
  children?: (at: {
    x: (value: number) => number
    y: (value: number) => number
  }) => React.ReactNode
}) {
  const x = (value: number) => pad + value * (width - pad * 2)
  const y = (value: number) =>
    pad + ((hi - value) / (hi - lo)) * (height - pad * 2)
  const line = curvePoints(easing)
    .map(([px, py]) => `${x(px).toFixed(1)},${y(py).toFixed(1)}`)
    .join(" ")

  return (
    <g className={className}>
      {[0, 1].map((level) => (
        <line
          key={level}
          x1={x(0)}
          x2={x(1)}
          y1={y(level)}
          y2={y(level)}
          stroke="var(--border)"
          strokeDasharray="2 2"
        />
      ))}
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {children?.({ x, y })}
    </g>
  )
}

function CurveThumb({ easing }: { easing: string }) {
  return (
    <svg
      aria-hidden
      width={16}
      height={16}
      viewBox="0 0 16 16"
      className="shrink-0 text-foreground"
    >
      <Curve easing={easing} width={16} pad={2.5} />
    </svg>
  )
}

const W = 240
const H = 168
const LO = -1
const HI = 2

/**
 * The curve with its two handles to drag. Arrow keys nudge a focused handle by
 * 0.01, or 0.1 with Shift.
 */
function CurveEditor({
  label,
  value,
  p,
  onChange,
}: {
  label: string
  value: string
  p: Bezier
  onChange: (p: Bezier) => void
}) {
  const svg = React.useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = React.useState<0 | 1 | null>(null)
  const pad = 20

  // Pixel position in the drawing back to curve space.
  const toCurve = (event: React.PointerEvent) => {
    const box = svg.current!.getBoundingClientRect()
    const px = ((event.clientX - box.left) / box.width) * W
    const py = ((event.clientY - box.top) / box.height) * H
    return {
      cx: clamp((px - pad) / (W - pad * 2), 0, 1),
      cy: clamp(HI - ((py - pad) / (H - pad * 2)) * (HI - LO), LO, HI),
    }
  }

  const move = (handle: 0 | 1, cx: number, cy: number) => {
    const next = [...p] as Bezier
    next[handle * 2] = +cx.toFixed(2)
    next[handle * 2 + 1] = +cy.toFixed(2)
    onChange(next)
  }

  const nudge = (handle: 0 | 1, event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.01
    const dx =
      event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0
    const dy =
      event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0
    if (!dx && !dy) return
    event.preventDefault()
    move(
      handle,
      clamp(p[handle * 2] + dx, 0, 1),
      clamp(p[handle * 2 + 1] + dy, LO, HI)
    )
  }

  return (
    <svg
      ref={svg}
      role="group"
      aria-label={`${label} curve`}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full touch-none rounded-md bg-muted text-foreground"
    >
      <Curve easing={value} width={W} height={H} lo={LO} hi={HI} pad={pad}>
        {({ x, y }) =>
          ([0, 1] as const).map((handle) => {
            const hx = x(p[handle * 2])
            const hy = y(p[handle * 2 + 1])
            const ax = x(handle)
            const ay = y(handle)
            return (
              <g key={handle}>
                <line
                  x1={ax}
                  y1={ay}
                  x2={hx}
                  y2={hy}
                  stroke="var(--muted-foreground)"
                  strokeWidth={1}
                />
                <circle
                  cx={ax}
                  cy={ay}
                  r={2.5}
                  fill="var(--muted-foreground)"
                />
                <circle
                  cx={hx}
                  cy={hy}
                  r={dragging === handle ? 9 : 8}
                  tabIndex={0}
                  role="slider"
                  aria-label={`${label} handle ${handle + 1}`}
                  aria-valuetext={`x ${p[handle * 2]}, y ${p[handle * 2 + 1]}`}
                  aria-roledescription="2D handle"
                  aria-valuemin={LO}
                  aria-valuemax={HI}
                  aria-valuenow={p[handle * 2 + 1]}
                  className={cn(
                    "cursor-grab fill-primary stroke-background outline-none focus-visible:stroke-ring",
                    dragging === handle && "cursor-grabbing"
                  )}
                  strokeWidth={2}
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId)
                    setDragging(handle)
                  }}
                  onPointerMove={(event) => {
                    if (dragging !== handle) return
                    const { cx, cy } = toCurve(event)
                    move(handle, cx, cy)
                  }}
                  onPointerUp={() => setDragging(null)}
                  onPointerCancel={() => setDragging(null)}
                  onLostPointerCapture={() => setDragging(null)}
                  onKeyDown={(event) => nudge(handle, event)}
                />
              </g>
            )
          })
        }
      </Curve>
    </svg>
  )
}

/**
 * One easing curve, edited as a `SelectorCard`: the card shows the curve, and
 * opening it gives the curve with two handles to drag, a preset, the four
 * numbers behind it and a play button to feel it.
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
  const track = React.useRef<HTMLDivElement>(null)
  const dot = React.useRef<HTMLSpanElement>(null)
  const easing = parseEasing(value)
  const p = easing.kind === "bezier" ? easing.p : null

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

  return (
    <SelectorCard
      label={label}
      note={note}
      edited={edited}
      onReset={onReset}
      readout={
        p
          ? p.map((n) => +n.toFixed(2)).join(" ")
          : easing.kind === "points"
            ? "points"
            : "custom"
      }
      preview={<CurveThumb easing={value} />}
    >
      {p ? (
        <>
          <CurveEditor
            label={label}
            value={value}
            p={p}
            onChange={(next) => onChange(formatBezier(next))}
          />

          <div className="flex items-center justify-between gap-2">
            <span className="text-caption text-muted-foreground">Preset</span>
            <ChoiceSelect
              label={`${label} preset`}
              items={[...presets, custom]}
              value={matchPreset(p)?.value ?? custom.value}
              onChange={(next) => {
                const preset = presets.find((item) => item.value === next)
                if (preset) onChange(formatBezier(preset.p))
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {fields.map(([name, hint, min, max], index) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-micro text-muted-foreground">{name}</span>
                <NumberField
                  label={`${label} ${name}`}
                  hint={hint}
                  value={p[index]}
                  min={min}
                  max={max}
                  step={0.01}
                  className="w-full min-w-0 px-1.5"
                  onCommit={(next) => {
                    const q = [...p] as Bezier
                    q[index] = next
                    onChange(formatBezier(q))
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <svg
            aria-hidden
            width={64}
            height={64}
            viewBox="0 0 64 64"
            className="shrink-0 text-foreground"
          >
            <Curve easing={value} width={64} />
          </svg>
          <p className="text-micro text-muted-foreground">
            {easing.kind === "points"
              ? "This curve is a list of points, so it has no handles to drag. Reset restores it."
              : "Studio can't draw this curve, so it has no handles to drag. Reset restores it."}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={play}>
          <PlayIcon />
          Play
        </Button>
        <div
          ref={track}
          className="relative h-3 min-w-0 flex-1 rounded-pill bg-muted"
        >
          <span
            ref={dot}
            className="absolute inset-s-0 top-0 block size-3 rounded-pill bg-foreground"
          />
        </div>
      </div>
    </SelectorCard>
  )
}
