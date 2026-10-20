import type { CSSProperties } from "react"
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
        <Mono className="block truncate text-foreground">{token}</Mono>
        <Value>{raw}</Value>
      </div>
    </div>
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
      lead="Semantic colours, never raw values. Every token on this page is derived from the theme's inputs, so the same name reads correctly in every theme, in light and dark."
    >
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
