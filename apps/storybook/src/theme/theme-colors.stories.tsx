import type { CSSProperties } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, TokenUse, Value, Mono, useTokens } from "./docs"
import { colorInputs, tokenUses, type ColorInput } from "./tokens"

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

const allTokens = [
  ...colorInputs.map((input) => input.token),
  ...colorInputs.flatMap((input) => input.tokens.map((t) => t.token)),
]

const groups = colorInputs.reduce<
  { name: ColorInput["group"]; inputs: ColorInput[] }[]
>((acc, input) => {
  const last = acc.at(-1)
  if (last && last.name === input.group) last.inputs.push(input)
  else acc.push({ name: input.group, inputs: [input] })
  return acc
}, [])

function Chip({ token, size = "sm" }: { token: string; size?: "sm" | "lg" }) {
  return (
    <span
      className={
        size === "lg"
          ? "size-11 shrink-0 rounded-item border border-border"
          : "mt-1.5 size-3.5 shrink-0 rounded-item-sm border border-border"
      }
      style={tileStyle(token)}
    />
  )
}

function tileStyle(token: string): CSSProperties {
  return {
    backgroundColor: "var(--background)",
    backgroundImage: `linear-gradient(var(${token}), var(${token})), repeating-conic-gradient(var(--border) 0% 25%, transparent 0% 50%)`,
    backgroundSize: "auto, 8px 8px",
  }
}

function InputBlock({
  input,
  values,
}: {
  input: ColorInput
  values: Record<string, string>
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Chip token={input.token} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Mono className="text-body text-foreground">{input.token}</Mono>
          <p className="max-w-[60ch] text-caption text-muted-foreground">
            {input.role}
          </p>
        </div>
        <Value>{values[input.token] ?? ""}</Value>
      </div>

      {input.tokens.length > 0 ? (
        <div className="flex flex-col ps-[56px]">
          {input.tokens.map((derived) => (
            <div
              key={`${input.token}-${derived.token}`}
              className="grid grid-cols-[14px_180px_minmax(0,1fr)_minmax(0,210px)] items-start gap-3 border-b border-border/60 py-2 last:border-0"
            >
              <Chip token={derived.token} />
              <Mono className="text-foreground">{derived.token}</Mono>
              <span className="text-caption text-muted-foreground">
                {derived.note}
              </span>
              <Value>{values[derived.token] ?? ""}</Value>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ColorsPage() {
  const values = useTokens(allTokens)

  return (
    <Page
      title="Colors"
      lead="Seventeen inputs a theme sets, and every token built from each one. The value beside a token is live: switch theme or mode in the toolbar and this page re-reads it."
    >
      {groups.map((group) => (
        <section
          key={group.name}
          className="flex flex-col gap-8 border-t border-border pt-8"
        >
          <h2 className="font-mono text-caption tracking-[0.16em] text-muted-foreground uppercase">
            {group.name}
          </h2>
          {group.inputs.map((input) => (
            <InputBlock key={input.token} input={input} values={values} />
          ))}
        </section>
      ))}

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
    </Page>
  )
}

export const Colors: Story = {
  render: () => <ColorsPage />,
}
