import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@amit-kap/glaze/components/progress"
import { Slider } from "@amit-kap/glaze/components/slider"

// Stories follow the upstream shadcn/ui (base-nova) Progress examples:
// https://ui.shadcn.com/docs/components/base/progress
const meta = {
  title: "Components/Progress",
  component: Progress,
  subcomponents: { ProgressLabel, ProgressValue },
  parameters: {
    docs: {
      description: {
        component:
          "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar. Put `ProgressLabel` and `ProgressValue` inside it for a labelled bar.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex w-sm justify-center">
        <Story />
      </div>
    ),
  ],
  args: { value: 56 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

// Animates from 13% to 66% after half a second.
export const Default: Story = {
  render: function Render() {
    const [progress, setProgress] = React.useState(13)

    React.useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500)
      return () => clearTimeout(timer)
    }, [])

    return <Progress value={progress} className="w-[60%]" />
  },
}

// --- Compositions ---------------------------------------------------------

export const Label: Story = {
  render: (args) => (
    <Progress {...args} className="w-full">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}

// Glaze's Slider takes an array value (one entry per thumb); upstream passes
// a single number.
export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = React.useState(50)

    return (
      <div className="flex w-full flex-col gap-4">
        <Progress value={value} className="w-full" />
        <Slider
          value={[value]}
          onValueChange={(next) =>
            setValue(Array.isArray(next) ? next[0] : next)
          }
          min={0}
          max={100}
          step={1}
          aria-label="Progress"
        />
      </div>
    )
  },
}
