import type { Meta, StoryObj } from "@storybook/react-vite"

import { ContrastBadge } from "@amit-kap/glaze/components/contrast-badge"

// Glaze's own component: WCAG contrast as a badge, for anywhere colours meet.
const meta = {
  title: "Custom/Contrast Badge",
  component: ContrastBadge,
  parameters: {
    docs: {
      description: {
        component:
          "How readable one colour is on another: AAA at 7:1, AA at 4.5:1, AA Large at 3:1, Fail below. Hover for the exact ratio. Put it on the colour that does the reading — text on a fill — so the pair is unambiguous. Alpha is ignored, since contrast is judged on the colour itself.",
      },
    },
  },
  args: {
    foreground: "oklch(20.5% 0 0)",
    background: "oklch(100% 0 0)",
  },
} satisfies Meta<typeof ContrastBadge>

export default meta
type Story = StoryObj<typeof meta>

// --- Each level -----------------------------------------------------------

export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {[
        ["AAA", "oklch(0% 0 0)", "oklch(100% 0 0)"],
        ["AA", "oklch(45% 0 0)", "oklch(100% 0 0)"],
        ["AA Large", "oklch(60% 0 0)", "oklch(100% 0 0)"],
        ["Fail", "oklch(80% 0 0)", "oklch(100% 0 0)"],
      ].map(([expected, foreground, background]) => (
        <div key={expected} className="flex items-center gap-3">
          <ContrastBadge foreground={foreground} background={background} />
          <span className="text-caption text-muted-foreground">{expected}</span>
        </div>
      ))}
    </div>
  ),
}

// --- On the colour it describes -------------------------------------------

export const OnAFill: Story = {
  render: () => (
    <div className="flex gap-3">
      <div className="flex items-center gap-2 rounded-control bg-primary px-3 py-2 text-primary-foreground">
        <span>Primary</span>
        <ContrastBadge
          foreground="oklch(98.5% 0 0)"
          background="oklch(20.5% 0 0)"
        />
      </div>
      <div className="flex items-center gap-2 rounded-control bg-destructive px-3 py-2 text-primary-foreground">
        <span>Destructive</span>
        <ContrastBadge
          foreground="oklch(98.5% 0 0)"
          background="oklch(57.7% 0.245 27.325)"
        />
      </div>
    </div>
  ),
}
