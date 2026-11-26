import type * as React from "react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { cn } from "@amit-kap/glaze/lib/utils"

import { Logo, logoPink } from "./logo"

/**
 * The mark, the wordmark, the Alpha badge and the Glaze version, as the files
 * pages' side panel and the editor's top bar both show them.
 */
export function BrandMark({ homeHref }: { homeHref?: string }) {
  const lockup = (
    <>
      <Logo />
      <span className="font-brand text-glaze-ink text-heading leading-none">
        glaze
      </span>
    </>
  )
  return (
    <div className="flex items-center gap-2.5">
      {homeHref ? (
        <a
          href={homeHref}
          data-testid="home-link"
          aria-label="Glaze Studio home"
          className="flex items-center gap-1.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {lockup}
        </a>
      ) : (
        <span className="flex items-center gap-1.5">{lockup}</span>
      )}
      <Badge
        variant="outline"
        className="h-auto px-1.5 py-0.5 text-[10px] leading-none uppercase"
        style={{ color: logoPink, borderColor: logoPink }}
      >
        Alpha
      </Badge>
      {__GLAZE_VERSION__ && (
        <span className="text-caption text-muted-foreground tabular-nums">
          {__GLAZE_VERSION__}
        </span>
      )}
    </div>
  )
}

// The mark's own colours, in turn.
const sprinkleColours = [
  "bg-glaze-ink",
  "bg-glaze-pink",
  "bg-glaze-sprinkle",
  "bg-glaze-dough",
  "bg-glaze-berry",
]

/**
 * Sprinkles scattered over a poster, landing a beat apart. `points` are
 * [x%, y%, rotation]; the poster is the positioned parent.
 */
export function Sprinkles({
  points,
  className,
}: {
  points: [number, number, number][]
  className?: string
}) {
  return (
    <>
      {points.map(([x, y, r], index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "sprinkle",
            sprinkleColours[index % sprinkleColours.length],
            className
          )}
          style={
            {
              "--x": `${x}%`,
              "--y": `${y}%`,
              "--r": `${r}deg`,
              "--d": `${300 + index * 70}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}
