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
  const dot = React.useRef<HTMLDivElement>(null)
  const { ref: durationRef, values: durationValues } = useMeasured(
    { animationDuration: `var(${durationToken})` },
    ["animation-duration"]
  )

  const play = () => {
    const el = dot.current
    if (!el) return
    el.getAnimations().forEach((animation) => animation.cancel())
    const cs = getComputedStyle(el)
    const ms = Number.parseFloat(cs.getPropertyValue(durationToken)) || 150
    const easing = cs.getPropertyValue(easingToken).trim() || "linear"
    el.animate(
      [{ transform: "translateX(0px)" }, { transform: "translateX(140px)" }],
      { duration: ms, easing, fill: "forwards" }
    )
  }

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
          ref={dot}
          className="size-3 rounded-pill bg-primary"
          style={{ willChange: "transform" }}
        />
      </div>
      <Button variant="outline" size="xs" onClick={play}>
        Replay
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
        note="All five run at --duration-moderate so the curve is what you see. Spring is a critically damped linear() curve: fast start, no overshoot."
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
