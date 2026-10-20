import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@amit-kap/glaze/components/button"

import { Page, Section, Value, Mono, useMeasured, useTokens } from "./docs"
import { durations, easings } from "./tokens"

const meta = {
  title: "Theme",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true, hideNoControlsWarning: true },
    options: { showPanel: false },
  },
  tags: ["!autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function formatDuration(raw: string) {
  if (!raw) return "—"
  if (raw.endsWith("ms")) return raw
  if (raw.endsWith("s")) return `${Math.round(Number.parseFloat(raw) * 1000)}ms`
  return raw
}

/**
 * Reads a used time (as getComputedStyle reports it: "0.1s" or "150ms").
 * Duration tokens are calc() expressions of --motion-scale, so the token text
 * cannot be parseFloat'd — it has to be measured on a real element.
 */
function toMs(time: string) {
  const value = time.trim()
  const number = Number.parseFloat(value)
  if (Number.isNaN(number)) return 0
  return value.endsWith("ms") ? number : number * 1000
}

function MotionRow({
  label,
  token,
  durationToken,
  easingToken,
  raw,
  showDuration = false,
}: {
  label: string
  token: string
  durationToken: string
  easingToken: string
  raw: string
  showDuration?: boolean
}) {
  const [playing, setPlaying] = React.useState(false)
  const { ref: durationRef, values: durationValues } = useMeasured(
    { animationDuration: `var(${durationToken})` },
    ["animation-duration"]
  )

  // A CSS animation, not the Web Animations API: dropping animation-name stops
  // the dot and puts it back at the left edge, and adding it again starts a
  // fresh run. The loop comes from the keyframes.
  const canMove = toMs(durationValues["animation-duration"] ?? "") > 0
  const running = playing && canMove

  const toggle = () => setPlaying((current) => !current)

  const value = showDuration
    ? formatDuration(durationValues["animation-duration"] ?? "")
    : raw

  return (
    <div className="grid grid-cols-[96px_1fr_176px_72px] items-center gap-4 border-b border-border/60 py-3 last:border-0">
      <span className="text-body font-medium">{label}</span>
      <div className="flex min-w-0 flex-col">
        <Mono className="text-foreground">{token}</Mono>
        <Value>{value}</Value>
        <span
          ref={durationRef}
          aria-hidden
          className="pointer-events-none absolute size-px opacity-0"
          style={{ animationDuration: `var(${durationToken})` }}
        />
      </div>
      <div className="flex h-6 w-44 items-center rounded-pill bg-muted px-1.5">
        <div
          className="size-3 rounded-pill bg-primary"
          style={
            running
              ? {
                  animationName: "motion-glide",
                  animationDuration: `var(${durationToken})`,
                  animationTimingFunction: `var(${easingToken})`,
                  animationIterationCount: "infinite",
                  willChange: "transform",
                }
              : undefined
          }
        />
      </div>
      <Button
        variant="outline"
        size="xs"
        className="w-full"
        aria-label={`${playing ? "Pause" : "Play"} ${label}`}
        disabled={!canMove}
        title={canMove ? undefined : "Reduced motion: travel is off"}
        onClick={toggle}
      >
        {playing ? "Pause" : "Play"}
      </Button>
    </div>
  )
}

function MotionPage() {
  const durationValues = useTokens(durations)
  const easingValues = useTokens(easings.map((e) => e.token))

  return (
    <Page
      title="Motion"
      lead="Four durations and five curves, both named by intent. Exits run at 75% of the matching enter so a dismissal reads as final."
    >
      <style>{`
        @keyframes motion-glide {
          from { transform: translateX(0); }
          to { transform: translateX(140px); }
        }
      `}</style>
      <Section
        title="Durations"
        note="Tokens are multiplied by --motion-scale at use time; also available as duration-(--duration-fast) utilities."
      >
        <div className="flex flex-col">
          {durations.map((token) => (
            <MotionRow
              key={token}
              label={token.replace("--duration-", "")}
              token={token}
              durationToken={token}
              easingToken="--ease-standard"
              raw={durationValues[token] ?? ""}
              showDuration
            />
          ))}
        </div>
      </Section>

      <Section
        title="Easings"
        note="All five run at --duration-moderate so the curve is what you see. Spring overshoots about 5% and settles back; the other four only ever ease toward the target."
      >
        <div className="flex flex-col">
          {easings.map((easing) => (
            <MotionRow
              key={easing.token}
              label={easing.role}
              token={easing.token}
              durationToken="--duration-moderate"
              easingToken={easing.token}
              raw={easingValues[easing.token] ?? ""}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Reduced motion"
        note="Not 'no motion': --motion-scale becomes 0 so travel stops, while --fade-scale stays at 1 because a fade still says where something came from."
      >
        <p className="max-w-[72ch] text-body text-muted-foreground">
          Popups keep their opacity transition and drop the zoom/slide pair.
          Component timings (drawer, toast, message scroller) are derived from
          the same scale, so they follow automatically.
        </p>
      </Section>
    </Page>
  )
}

export const Motion: Story = {
  render: () => <MotionPage />,
}
