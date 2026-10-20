import type { CSSProperties, ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, TokenUse, Value, Mono, useTokens } from "./docs"
import { colors, tokenUses } from "./tokens"

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

const allTokens = colors.flatMap((group) => group.tokens.map((s) => s.token))

function tileStyle(token: string): CSSProperties {
  return {
    backgroundColor: "var(--background)",
    backgroundImage: `linear-gradient(var(${token}), var(${token})), repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%)`,
    backgroundSize: "auto, 12px 12px",
  }
}

/** Colour inputs a theme sets. Everything else on this page is derived. */
const inputs = [
  "--canvas",
  "--surface",
  "--ink",
  "--ink-muted",
  "--line",
  "--brand",
  "--brand-ink",
  "--danger",
  "--warning",
  "--success",
  "--info",
  "--overlay",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
]
const inputTokens = new Set(inputs)

function Swatch({
  token,
  raw,
  on,
}: {
  token: string
  raw: string
  on?: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div
        className="flex h-16 items-center justify-center rounded-item border border-border"
        style={on ? { background: `var(${on})` } : tileStyle(token)}
      >
        {on ? (
          <span
            className="text-title leading-none font-strong"
            style={{ color: `var(${token})` }}
          >
            Aa
          </span>
        ) : null}
      </div>
      <div className="min-w-0">
        <div className="flex items-start gap-1.5">
          <Mono className="block break-words whitespace-normal text-foreground">
            {token}
          </Mono>
          {inputTokens.has(token) ? <Tag>input</Tag> : null}
        </div>
        <Value>{raw}</Value>
      </div>
    </div>
  )
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="mt-px shrink-0 rounded-pill border border-border px-1.5 font-mono text-[9px] leading-4 tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </span>
  )
}

function Group({
  title,
  note,
  tokens,
  values,
}: {
  title: string
  note?: string
  tokens: { token: string; on?: string }[]
  values: Record<string, string>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-body font-strong">{title}</h3>
        {note ? (
          <p className="max-w-[70ch] text-caption text-muted-foreground">
            {note}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-6">
        {tokens.map((swatch) => (
          <Swatch
            key={swatch.token}
            token={swatch.token}
            on={swatch.on}
            raw={values[swatch.token] ?? ""}
          />
        ))}
      </div>
    </div>
  )
}

const byTitle = (title: string) =>
  colors.find((group) => group.title === title)!

function ColorsPage() {
  const values = useTokens(allTokens)
  const group = (title: string) => (
    <Group
      title={byTitle(title).title}
      note={byTitle(title).note}
      tokens={byTitle(title).tokens}
      values={values}
    />
  )

  return (
    <Page
      title="Colors"
      lead="Semantic colours, never raw values. A theme sets seventeen colour inputs; every other token on this page is derived from them, so the same name reads correctly in every theme, in light and dark."
    >
      <Section
        title="Inputs you set"
        note="These are the knobs: the only colours a theme file assigns. Everything below is computed from them by tokens.css, so changing one input moves every token built on it."
      >
        <div className="flex flex-wrap gap-2">
          {inputs.map((token) => (
            <span
              key={token}
              className="flex items-center gap-2 rounded-item border border-border bg-card py-1 ps-1 pe-2.5"
            >
              <span
                className="size-5 rounded-item-sm border border-border"
                style={{ background: `var(${token})` }}
              />
              <Mono className="text-foreground">{token}</Mono>
            </span>
          ))}
        </div>
      </Section>

      <Section
        title="Choosing a token"
        note="Start from the surface, then pick the text colour that sits on it. Reach for a status colour only when the meaning is status."
      >
        <div className="flex flex-col">
          {tokenUses.map((use) => (
            <TokenUse key={use.surface} {...use} />
          ))}
        </div>
      </Section>

      <Section title="Surfaces">
        {group("Surfaces and text")}
        {group("Actions")}
        {group("Interaction states")}
      </Section>

      <Section title="Lines and status">
        {group("Lines and focus")}
        {group("Status")}
        {group("Severity")}
      </Section>

      <Section title="Data and navigation">
        {group("Data")}
        {group("Sidebar")}
      </Section>
    </Page>
  )
}

export const Colors: Story = {
  render: () => <ColorsPage />,
}
