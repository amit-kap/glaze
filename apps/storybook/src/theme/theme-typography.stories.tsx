import type { CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, Value, Mono, useMeasured, useTokens } from "./docs"
import { typeFamilies, typeScale, weights } from "./tokens"

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

function TypeRow({ token }: { token: string }) {
  const style: CSSProperties = { fontFamily: "var(--font-sans)" }
  const className = token.replace("--text-", "text-")
  const { ref, values } = useMeasured(style, ["font-size", "line-height"])

  const size = Number.parseFloat(values["font-size"] ?? "")
  const leading = Number.parseFloat(values["line-height"] ?? "")
  const ratio = size && leading ? `${(leading / size).toFixed(2)}×` : "—"

  return (
    <div className="grid grid-cols-[126px_56px_52px_1fr] items-baseline gap-4 border-b border-border/60 py-3 last:border-0">
      <Mono className="text-foreground">{token.replace("--text-", "")}</Mono>
      <span className="font-mono text-caption text-muted-foreground">
        {values["font-size"] ?? "—"}
      </span>
      <span className="font-mono text-caption text-muted-foreground">
        {ratio}
      </span>
      <div ref={ref} style={style} className={`min-w-0 truncate ${className}`}>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  )
}

function FamilyCard({
  token,
  role,
  raw,
}: {
  token: string
  role: string
  raw: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-container border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-body font-medium">{role}</span>
        <Mono className="text-muted-foreground">{token}</Mono>
      </div>
      <div
        className="text-heading leading-tight tracking-[-0.01em]"
        style={{ fontFamily: `var(${token})` }}
      >
        Glaze 0123 — quick brown
      </div>
      <Value>{raw}</Value>
    </div>
  )
}

function TypographyPage() {
  const familyValues = useTokens(typeFamilies.map((f) => f.token))
  const weightValues = useTokens(weights.map((w) => w.token))

  return (
    <Page
      title="Typography"
      lead="Six steps, three families, three weights. Components read the step names (text-body, text-title); the theme decides what they measure."
    >
      <Section
        title="Families"
        note="Heading defaults to the sans family; a theme can split them (Sera pairs Noto Sans with Playfair Display)."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {typeFamilies.map((family) => (
            <FamilyCard
              key={family.token}
              token={family.token}
              role={family.role}
              raw={familyValues[family.token] ?? ""}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Scale"
        note="Line heights are unitless ratios, not pixels — a component that sets its own font size keeps the same rhythm."
      >
        <div className="flex flex-col">
          {typeScale.map((token) => (
            <TypeRow key={token} token={token} />
          ))}
        </div>
      </Section>

      <Section
        title="Weights"
        note="Three weights only: normal, medium, strong."
      >
        <div className="flex flex-col">
          {weights.map((weight) => (
            <div
              key={weight.token}
              className="flex items-baseline gap-6 border-b border-border/60 py-3 last:border-0"
            >
              <Mono className="w-40 shrink-0 text-foreground">
                {weight.role}
              </Mono>
              <span
                className="text-display leading-none"
                style={{ fontWeight: `var(${weight.token})` }}
              >
                Aa
              </span>
              <Value>{weightValues[weight.token] ?? ""}</Value>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}

export const Typography: Story = {
  render: () => <TypographyPage />,
}
