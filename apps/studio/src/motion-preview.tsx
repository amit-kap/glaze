import * as React from "react"
import { PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@amit-kap/glaze/components/button"
import { Card, CardContent } from "@amit-kap/glaze/components/card"

import { motionVars, toMs, type MotionValues } from "./motion"

const rows = [
  { label: "Standard", ease: "var(--motion-ease-standard)" },
  { label: "Enter", ease: "var(--motion-ease-enter)" },
  { label: "Exit", ease: "var(--motion-ease-exit)" },
]

// How long the dot rests at each end before it goes back.
const rest = 700

// Real durations are too quick to compare by eye, so the demo runs slower.
const slow = 4

/**
 * A dot crossing a track once per curve, on the draft's own durations and
 * easing, slowed down so the difference shows. It loops, so a change to the
 * Motion choice shows at once. Each row has its own play/pause. The panel
 * sits outside the themed stage, so the values come in directly.
 */
export function MotionPreview({ motion }: { motion: MotionValues }) {
  const [end, setEnd] = React.useState(false)
  const moderate = toMs(motion["motion-moderate"])

  React.useEffect(() => {
    const timer = setInterval(
      () => setEnd((value) => !value),
      moderate * slow + rest
    )
    return () => clearInterval(timer)
  }, [moderate])

  return (
    <Card size="sm">
      <CardContent
        className="flex flex-col gap-3"
        style={motionVars(motion) as React.CSSProperties}
      >
        {rows.map((row) => (
          <Row key={row.label} {...row} end={end} />
        ))}
      </CardContent>
    </Card>
  )
}

// A paused row holds where it is and picks the shared loop up again on play.
function Row({
  label,
  ease,
  end,
}: {
  label: string
  ease: string
  end: boolean
}) {
  const [playing, setPlaying] = React.useState(true)
  const [at, setAt] = React.useState(end)

  React.useEffect(() => {
    if (playing) setAt(end)
  }, [end, playing])

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-caption text-muted-foreground">
        {label}
      </span>
      <div className="relative h-1 flex-1 rounded-pill bg-muted">
        <span
          aria-hidden
          className="absolute top-1/2 size-3 -translate-y-1/2 rounded-pill bg-brand"
          style={{
            left: at ? "calc(100% - 0.75rem)" : "0",
            transitionProperty: "left",
            transitionDuration: `calc(var(--motion-moderate) * ${slow})`,
            transitionTimingFunction: ease,
          }}
        />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`${playing ? "Pause" : "Play"} ${label}`}
        aria-pressed={!playing}
        onClick={() => setPlaying((value) => !value)}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  )
}
