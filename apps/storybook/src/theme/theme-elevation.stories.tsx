import type { Meta, StoryObj } from "@storybook/react-vite"

import { Page, Section, Value, Mono, useTokens } from "./docs"
import { elevations } from "./tokens"

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

function ElevationCard({
  token,
  role,
  note,
  raw,
}: {
  token: string
  role: string
  note: string
  raw: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex h-32 flex-col justify-end rounded-container border border-border bg-card p-5"
        style={{ boxShadow: `var(${token})` }}
      >
        <span className="text-body font-medium">{role}</span>
        <span className="text-caption text-muted-foreground">{note}</span>
      </div>
      <div className="flex flex-col">
        <Mono className="text-foreground">{token}</Mono>
        <Value>{raw}</Value>
      </div>
    </div>
  )
}

function ElevationPage() {
  const values = useTokens(elevations.map((e) => e.token))

  return (
    <Page
      title="Elevation"
      lead="Three levels, each mapped to a Tailwind shadow utility, so a theme can replace the whole scale without a component knowing."
    >
      <Section
        title="Scale"
        note="Raised for cards and menubars, floating for popovers and dropdowns, modal for dialogs and sheets."
      >
        <div className="grid gap-10 rounded-container bg-muted p-8 md:grid-cols-3">
          {elevations.map((elevation) => (
            <ElevationCard
              key={elevation.token}
              token={elevation.token}
              role={elevation.role}
              note={elevation.note}
              raw={values[elevation.token] ?? ""}
            />
          ))}
        </div>
      </Section>

      <Section
        title="In dark mode"
        note="Shadows read weaker against dark surfaces, so elevation there is carried mostly by --surface and --muted mixes. Toggle Mode in the toolbar to compare."
      >
        <p className="max-w-[72ch] text-body text-muted-foreground">
          A theme may flatten the scale entirely — Gr8r keeps hairline shadows
          in both modes. The contract is the three names, not the blur values.
        </p>
      </Section>
    </Page>
  )
}

export const Elevation: Story = {
  render: () => <ElevationPage />,
}
