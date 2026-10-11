import * as React from "react"

import { Card } from "@amit-kap/glaze/components/card"
import { ControlPanel } from "./control-panel"
import {
  AccordionDemo,
  AlertDemo,
  AttachmentDemo,
  AvatarDemo,
  BadgeDemo,
  BubbleDemo,
  ButtonDemo,
  CalendarDemo,
  ChartDemo,
  CheckboxDemo,
  CommandDemo,
  DropdownMenuDemo,
  FieldDemo,
  InputDemo,
  InputGroupDemo,
  KbdDemo,
  MessageDemo,
  PopoverDemo,
  ProgressDemo,
  QuestionnaireDemo,
  RadioGroupDemo,
  SelectDemo,
  SkeletonDemo,
  SliderDemo,
  SpinnerDemo,
  SwitchDemo,
  TableDemo,
  TabsDemo,
  TextareaDemo,
  ToggleDemo,
  ToggleGroupDemo,
  TooltipDemo,
  TypographyDemo,
} from "./demos"

// One tile per component, showing its variants, with the component's name in
// the footer strip. `wide` tiles span both columns.
const tiles: { name: string; demo: () => React.ReactNode; wide?: boolean }[] = [
  { name: "Button", demo: ButtonDemo, wide: true },
  { name: "Typography", demo: TypographyDemo, wide: true },
  { name: "Badge", demo: BadgeDemo },
  { name: "Toggle", demo: ToggleDemo },
  { name: "ToggleGroup", demo: ToggleGroupDemo },
  { name: "Input", demo: InputDemo },
  { name: "InputGroup", demo: InputGroupDemo },
  { name: "Textarea", demo: TextareaDemo },
  { name: "Checkbox", demo: CheckboxDemo },
  { name: "RadioGroup", demo: RadioGroupDemo },
  { name: "Switch", demo: SwitchDemo },
  { name: "Select", demo: SelectDemo },
  { name: "Slider", demo: SliderDemo },
  { name: "Field", demo: FieldDemo },
  { name: "Questionnaire", demo: QuestionnaireDemo, wide: true },
  { name: "Tabs", demo: TabsDemo },
  { name: "Accordion", demo: AccordionDemo },
  { name: "Command", demo: CommandDemo, wide: true },
  { name: "Tooltip", demo: TooltipDemo },
  { name: "Popover", demo: PopoverDemo },
  { name: "DropdownMenu", demo: DropdownMenuDemo },
  { name: "Progress", demo: ProgressDemo },
  { name: "Alert", demo: AlertDemo, wide: true },
  { name: "Spinner", demo: SpinnerDemo },
  { name: "Skeleton", demo: SkeletonDemo },
  { name: "Bubble", demo: BubbleDemo },
  { name: "Message", demo: MessageDemo },
  { name: "Attachment", demo: AttachmentDemo },
  { name: "Avatar", demo: AvatarDemo },
  { name: "Kbd", demo: KbdDemo },
  { name: "Calendar", demo: CalendarDemo },
  { name: "Table", demo: TableDemo, wide: true },
  { name: "Chart", demo: ChartDemo, wide: true },
]

export function App() {
  const [customizing, setCustomizing] = React.useState(false)
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Tiles fill the width, with room at the bottom for the settings bar. */}
      <div
        className={`px-3 pt-3 pb-32 transition-[padding] duration-(--duration-moderate) ease-standard motion-reduce:transition-none sm:px-6 sm:pt-6 ${customizing ? "lg:pr-[calc(--spacing(80)+--spacing(6))]" : ""}`}
      >
        <main className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {tiles.map(({ name, demo: Demo, wide }) => (
            <Card
              key={name}
              role="region"
              aria-label={name}
              className={`min-w-0 gap-0 overflow-hidden py-0 ${wide ? "sm:col-span-2" : ""}`}
            >
              <div className="flex min-h-56 flex-1 items-center justify-center px-6 py-10">
                <Demo />
              </div>
              <div className="shrink-0 border-t border-border/40 px-4 py-3 text-body text-muted-foreground">
                {name}
              </div>
            </Card>
          ))}
        </main>
      </div>
      <ControlPanel open={customizing} onOpenChange={setCustomizing} />
    </div>
  )
}
