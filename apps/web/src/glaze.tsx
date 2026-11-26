import type * as React from "react"

import { cn } from "@amit-kap/glaze/lib/utils"

const vars = (values: Record<string, string>) => values as React.CSSProperties

/**
 * The filter that melts the drip blocks into one poured shape: blur them,
 * then cut the blur back to a hard edge. Rendered once per page.
 */
export function Goo() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0">
      <defs>
        <filter id="goo" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
        </filter>
      </defs>
    </svg>
  )
}

type Drip = { x: string; w: string; h: string; d?: string; wide?: boolean }

// Positions are percentages of the edge; `wide` drips only show from the
// tablet width up, so a phone gets a few clear drips rather than a comb.
const pour: Drip[] = [
  { x: "3%", w: "2.4rem", h: "5.5rem", d: "120ms" },
  { x: "9.5%", w: "1.5rem", h: "2.6rem", d: "420ms", wide: true },
  { x: "17%", w: "3rem", h: "9.5rem", d: "0ms" },
  { x: "25%", w: "1.7rem", h: "3.8rem", d: "560ms", wide: true },
  { x: "38%", w: "2.2rem", h: "6.4rem", d: "260ms", wide: true },
  { x: "49%", w: "1.4rem", h: "2.4rem", d: "700ms" },
  { x: "58%", w: "2.8rem", h: "11.5rem", d: "80ms" },
  { x: "66%", w: "1.6rem", h: "4.2rem", d: "480ms", wide: true },
  { x: "77%", w: "2.3rem", h: "7.2rem", d: "200ms", wide: true },
  { x: "86%", w: "1.5rem", h: "3rem", d: "620ms" },
  { x: "93%", w: "2.6rem", h: "8.4rem", d: "340ms" },
]

const swells: Drip[] = [
  { x: "-2%", w: "16%", h: "3.4rem" },
  { x: "11%", w: "20%", h: "4.2rem" },
  { x: "30%", w: "24%", h: "3rem" },
  { x: "52%", w: "18%", h: "4.4rem" },
  { x: "69%", w: "22%", h: "3.2rem" },
  { x: "88%", w: "16%", h: "4rem" },
]

/**
 * The glaze running off the bottom edge of its parent, which must be
 * `relative`. `drop` adds the falling drop under the longest drip.
 */
export function Drips({
  className,
  drop = false,
}: {
  className?: string
  drop?: boolean
}) {
  return (
    <div aria-hidden="true" className={cn("drips", className)}>
      {swells.map(({ x, w, h }) => (
        <span
          key={x}
          className="swell"
          style={vars({ "--x": x, "--w": w, "--h": h })}
        />
      ))}
      {pour.map(({ x, w, h, d, wide }) => (
        <span
          key={x}
          className={cn("drip", wide && "hidden sm:block")}
          style={vars({ "--x": x, "--w": w, "--h": h, "--d": d ?? "0ms" })}
        />
      ))}
      {drop && (
        <span
          className="drop"
          style={vars({
            "--x": "calc(58% + 0.5rem)",
            "--y": "10.5rem",
            "--w": "1.8rem",
          })}
        />
      )}
    </div>
  )
}

const sprinkleColours = [
  "bg-glaze-sprinkle",
  "bg-background",
  "bg-glaze-berry",
  "bg-glaze-ink",
  "bg-glaze-dough",
]

/**
 * Sprinkles scattered over a poster. `points` are [x%, y%, rotation] and the
 * colours cycle through the mark's own.
 */
export function Sprinkles({
  points,
  className,
}: {
  points: [number, number, number][]
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {points.map(([x, y, r], index) => (
        <span
          key={index}
          className={cn(
            "sprinkle",
            sprinkleColours[index % sprinkleColours.length]
          )}
          style={vars({
            "--x": `${x}%`,
            "--y": `${y}%`,
            "--r": `${r}deg`,
            "--d": `${900 + index * 70}ms`,
          })}
        />
      ))}
    </div>
  )
}
