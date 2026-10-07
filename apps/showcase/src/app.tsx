import type * as React from "react"

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
} from "./demos"

// One tile per component, showing its variants, with the component's name in
// the footer strip. `wide` tiles span both columns.
const tiles: { name: string; demo: () => React.ReactNode; wide?: boolean }[] = [
  { name: "Button", demo: ButtonDemo, wide: true },
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
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4 sm:py-10 xl:py-16">
        <ControlPanel />
        <main className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tiles.map(({ name, demo: Demo, wide }) => (
            <section
              key={name}
              aria-label={name}
              className={`tile flex flex-col overflow-hidden rounded-container ${wide ? "sm:col-span-2" : ""}`}
            >
              <div className="flex min-h-56 flex-1 items-center justify-center px-6 py-10">
                <Demo />
              </div>
              <div className="shrink-0 border-t border-border/40 px-4 py-3 text-body text-muted-foreground">
                {name}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
