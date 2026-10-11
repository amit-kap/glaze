import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@amit-kap/glaze/components/toggle-group"

// Stories follow the upstream shadcn/ui (base-nova) Toggle Group examples:
// https://ui.shadcn.com/docs/components/base/toggle-group
const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  subcomponents: { ToggleGroupItem },
  parameters: {
    docs: {
      description: {
        component:
          "A set of two-state buttons that can be toggled on or off. Pass `multiple` to allow more than one pressed item; `spacing` sets the gap between items (0 joins them into a segmented control).",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    spacing: { control: { type: "number", min: 0, max: 4 } },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { variant: "outline", multiple: true },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

// --- Variants -------------------------------------------------------------

export const Outline: Story = {
  render: () => (
    <ToggleGroup variant="outline" defaultValue={["all"]}>
      <ToggleGroupItem value="all" aria-label="Toggle all">
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="missed" aria-label="Toggle missed">
        Missed
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Spacing: Story = {
  render: () => (
    <ToggleGroup size="sm" defaultValue={["top"]} variant="outline" spacing={2}>
      <ToggleGroupItem value="top" aria-label="Toggle top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
        Bottom
      </ToggleGroupItem>
      <ToggleGroupItem value="left" aria-label="Toggle left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Toggle right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ToggleGroup
      multiple
      orientation="vertical"
      spacing={1}
      defaultValue={["bold", "italic"]}
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

// --- Sizes ----------------------------------------------------------------

export const Size: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup size="sm" defaultValue={["top"]} variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup defaultValue={["top"]} variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <ToggleGroup disabled>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

// --- Compositions ---------------------------------------------------------

const fontWeightItem = "flex size-16 flex-col items-center justify-center"

// Upstream "Custom": a controlled single-select group styled as large tiles.
export const Custom: Story = {
  render: function Render() {
    const [fontWeight, setFontWeight] = React.useState("normal")

    return (
      <Field>
        <FieldLabel>Font Weight</FieldLabel>
        <ToggleGroup
          value={[fontWeight]}
          onValueChange={(value) => setFontWeight(value[0])}
          variant="outline"
          spacing={2}
          size="lg"
        >
          <ToggleGroupItem
            value="light"
            aria-label="Light"
            className={fontWeightItem}
          >
            <span className="text-title leading-none font-light">Aa</span>
            <span className="text-caption text-muted-foreground">Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="normal"
            aria-label="Normal"
            className={fontWeightItem}
          >
            <span className="text-title leading-none font-normal">Aa</span>
            <span className="text-caption text-muted-foreground">Normal</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="medium"
            aria-label="Medium"
            className={fontWeightItem}
          >
            <span className="text-title leading-none font-medium">Aa</span>
            <span className="text-caption text-muted-foreground">Medium</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bold"
            aria-label="Bold"
            className={fontWeightItem}
          >
            <span className="text-title leading-none font-bold">Aa</span>
            <span className="text-caption text-muted-foreground">Bold</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <FieldDescription>
          Use{" "}
          <code className="rounded-control bg-muted px-1 py-0.5 font-mono">
            font-{fontWeight}
          </code>{" "}
          to set the font weight.
        </FieldDescription>
      </Field>
    )
  },
}
