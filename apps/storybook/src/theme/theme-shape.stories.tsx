import type { CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, Value, Mono, useMeasured, useTokens } from "./docs"
import { controlHeights, radii, spacingSteps } from "./tokens"

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

function RadiusTile({ token, role }: { token: string; role: string }) {
  const style: CSSProperties = {
    borderRadius: `var(${token})`,
    background: "var(--muted)",
    border: "1px solid var(--border)",
  }
  const { ref, values } = useMeasured(style, ["border-top-left-radius"])
  const measured = values["border-top-left-radius"] ?? ""

  return (
    <div className="flex flex-col gap-2">
      <div ref={ref} style={style} className="h-20 w-full" />
      <Mono className="text-foreground">{role}</Mono>
      <Value>{measured.replace(/[\d.]+e\+\d+px/, "pill")}</Value>
    </div>
  )
}

function SpacingRow({ step }: { step: number }) {
  const style: CSSProperties = {
    width: `calc(var(--spacing) * ${step})`,
    height: "8px",
    background: "var(--primary)",
    borderRadius: "var(--radius-pill)",
  }
  const { ref, values } = useMeasured(style, ["width"])

  return (
    <div className="flex items-center gap-4">
      <Mono className="w-16 shrink-0 text-muted-foreground">{step}×</Mono>
      <div className="flex h-4 w-full max-w-[420px] items-center">
        <div ref={ref} style={style} />
      </div>
      <span className="w-16 font-mono text-caption text-muted-foreground">
        {values.width ?? "—"}
      </span>
    </div>
  )
}

function ControlRow({ token }: { token: string }) {
  const style: CSSProperties = {
    height: `var(${token})`,
    background: "var(--muted)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-control)",
  }
  const { ref, values } = useMeasured(style, ["height"])

  return (
    <div className="flex items-center gap-4">
      <Mono className="w-32 shrink-0 text-foreground">
        {token.replace("--control-", "")}
      </Mono>
      <div className="flex w-full max-w-[420px] items-center">
        <div ref={ref} style={style} className="w-40" />
      </div>
      <span className="w-16 font-mono text-caption text-muted-foreground">
        {values.height ?? "—"}
      </span>
    </div>
  )
}

function ShapePage() {
  const base = useTokens(["--radius", "--spacing", "--space-base"])

  return (
    <Page
      title="Shape"
      lead="Radius, spacing and control heights are one system: a theme sets --radius and --space-base, density scales the spacing, and every component follows."
    >
      <Section
        title="Radius"
        note={`Semantic steps derived from --radius (${base["--radius"] ?? "—"}), plus a pill. Components never use the base radius directly.`}
      >
        <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
          {radii.map((radius) => (
            <RadiusTile
              key={radius.token}
              token={radius.token}
              role={radius.role}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Spacing"
        note={`Multiples of --spacing (${base["--spacing"] ?? "—"}), itself --space-base × density. Switch Density to Compact in the toolbar to see the scale contract.`}
      >
        <div className="flex flex-col gap-3">
          {spacingSteps.map((step) => (
            <SpacingRow key={step} step={step} />
          ))}
        </div>
      </Section>

      <Section
        title="Control heights"
        note="Derived from the spacing scale, so a theme's rhythm sets every field, button and tab height together."
      >
        <div className="flex flex-col gap-3">
          {controlHeights.map((token) => (
            <ControlRow key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title="Density"
        note="Two steps, set on any element with data-density."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-container border border-border bg-card p-5">
            <span className="text-body font-medium">Comfortable</span>
            <Mono className="text-muted-foreground">--density: 1</Mono>
            <p className="text-caption text-muted-foreground">
              The default. Spacing is exactly the theme's scale.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-container border border-border bg-card p-5">
            <span className="text-body font-medium">Compact</span>
            <Mono className="text-muted-foreground">--density: 0.875</Mono>
            <p className="text-caption text-muted-foreground">
              Spacing shrinks 12.5%; type and radii stay put.
            </p>
          </div>
        </div>
      </Section>
    </Page>
  )
}

export const Shape: Story = {
  render: () => <ShapePage />,
}
