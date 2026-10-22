import type { CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, Value, Mono, useMeasured } from "./docs"
import { componentTokens } from "./tokens"

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

function format(raw: string, duration: boolean) {
  if (!raw) return "—"
  if (duration) {
    return raw.endsWith("ms")
      ? raw
      : `${Math.round(Number.parseFloat(raw) * 1000)}ms`
  }
  if (/^rgba?\(0, 0, 0, 0\) 0px 0px 0px 0px$/.test(raw)) return "none"
  if (/^rgba?\(0, 0, 0, 0\)$/.test(raw)) return "transparent"
  if (/^[\d.]+px$/.test(raw) && Number.parseFloat(raw) > 500) return "pill"
  return raw
}

function TokenRow({ token }: { token: string }) {
  const isRadius = token.includes("radius")
  const isShadow = token.includes("shadow")
  const isFill = token.includes("fill")
  const isDuration = token.endsWith("duration")

  const style: CSSProperties = {}
  const props: string[] = []

  if (isRadius) {
    style.borderRadius = `var(${token})`
    props.push("border-top-left-radius")
  } else if (isShadow) {
    style.boxShadow = `var(${token})`
    props.push("box-shadow")
  } else if (isFill) {
    style.backgroundColor = `var(${token})`
    props.push("background-color")
  } else if (isDuration) {
    style.animationDuration = `var(${token})`
    props.push("animation-duration")
  }

  const { ref, values } = useMeasured(style, props)
  const raw = props.length ? (values[props[0]] ?? "") : ""

  return (
    <div className="grid grid-cols-[260px_1fr_44px] items-center gap-4 border-b border-border/60 py-3 last:border-0">
      <Mono className="truncate text-foreground">{token}</Mono>
      <Value>{format(raw, isDuration)}</Value>
      <div className="flex justify-end">
        <span
          ref={ref}
          aria-hidden
          className="pointer-events-none absolute size-px opacity-0"
          style={style}
        />
        {isShadow ? (
          <div
            style={style}
            className="size-9 rounded-item border border-border bg-card"
          />
        ) : isFill ? (
          <div
            style={{
              backgroundColor: "var(--background)",
              backgroundImage: `linear-gradient(var(${token}), var(${token})), repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%)`,
              backgroundSize: "auto, 10px 10px",
            }}
            className="size-9 rounded-item border border-border"
          />
        ) : isRadius ? (
          <div style={style} className="size-9 border border-border bg-muted" />
        ) : null}
      </div>
    </div>
  )
}

function ComponentPage() {
  return (
    <Page
      title="Component tokens"
      lead="Tier 3 exists only where one component must diverge from its family: a pill button beside square inputs, a filled field, a card that floats. Each defaults to a derived system token."
    >
      <Section
        title="How they work"
        note="Named --{component}-{property}[-{variant}], declared in tokens.css with a default, and overridable by a theme. A component token never replaces a system token for the whole family."
      >
        <p className="max-w-[72ch] text-body text-muted-foreground">
          If a style detail can be said in an input (radius, spacing, type,
          colour), it belongs in tier 1 — a component token is the last resort.
          Maia's pill buttons are{" "}
          <Mono className="text-foreground">--button-radius-sm: 9999px</Mono>;
          Rhea's filled fields are{" "}
          <Mono className="text-foreground">--input-fill</Mono>.
        </p>
      </Section>

      <Section
        title="Tokens"
        note="Grouped by the component they belong to. Values show what the browser computed, so theme switches are reflected immediately."
      >
        <div className="flex flex-col gap-10">
          {componentTokens.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-body font-strong">{group.title}</h3>
                {"note" in group && group.note ? (
                  <p className="text-caption text-muted-foreground">
                    {group.note}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col">
                {group.tokens.map((token) => (
                  <TokenRow key={token} token={token} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}

export const Component: Story = {
  name: "Component tokens",
  render: () => <ComponentPage />,
}
