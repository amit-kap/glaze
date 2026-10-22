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
  ButtonGroupDemo,
  CalendarDemo,
  CardDemo,
  CarouselDemo,
  ChartDemo,
  CheckboxDemo,
  CollapsibleDemo,
  ColorPickerDemo,
  CommandDemo,
  ContextMenuDemo,
  DialogDemo,
  DropdownMenuDemo,
  EmptyDemo,
  IconSwitchDemo,
  InputDemo,
  ItemDemo,
  MarkerDemo,
  MessageDemo,
  ProgressDemo,
  QuestionnaireDemo,
  RadioGroupDemo,
  RevealButtonDemo,
  SelectDemo,
  SliderDemo,
  SwitchDemo,
  TableDemo,
  TabsDemo,
  TooltipDemo,
} from "./demos"

// One tile per component, showing its variants, with the component's name in
// the footer strip. `wide` tiles span both columns.
const tiles: { name: string; demo: () => React.ReactNode; wide?: boolean }[] = [
  { name: "Accordion", demo: AccordionDemo },
  { name: "Alert", demo: AlertDemo, wide: true },
  { name: "Attachment", demo: AttachmentDemo },
  { name: "Avatar", demo: AvatarDemo },
  { name: "Badge", demo: BadgeDemo },
  { name: "Bubble", demo: BubbleDemo },
  { name: "Button Group", demo: ButtonGroupDemo },
  { name: "Button", demo: ButtonDemo },
  { name: "Calendar", demo: CalendarDemo },
  { name: "Card", demo: CardDemo },
  { name: "Carousel", demo: CarouselDemo },
  { name: "Chart", demo: ChartDemo, wide: true },
  { name: "Checkbox", demo: CheckboxDemo },
  { name: "Collapsible", demo: CollapsibleDemo },
  { name: "Color Picker", demo: ColorPickerDemo },
  { name: "Command", demo: CommandDemo },
  { name: "Context Menu", demo: ContextMenuDemo },
  { name: "Dialog", demo: DialogDemo },
  { name: "Dropdown Menu", demo: DropdownMenuDemo },
  { name: "Empty", demo: EmptyDemo },
  { name: "Icon Switch", demo: IconSwitchDemo },
  { name: "Input", demo: InputDemo },
  { name: "Item", demo: ItemDemo },
  { name: "Marker", demo: MarkerDemo },
  { name: "Message", demo: MessageDemo },
  { name: "Progress", demo: ProgressDemo },
  { name: "Questionnaire", demo: QuestionnaireDemo, wide: true },
  { name: "Radio Group", demo: RadioGroupDemo },
  { name: "Reveal Button", demo: RevealButtonDemo },
  { name: "Select", demo: SelectDemo },
  { name: "Slider", demo: SliderDemo },
  { name: "Switch", demo: SwitchDemo },
  { name: "Table", demo: TableDemo, wide: true },
  { name: "Tabs", demo: TabsDemo },
  { name: "Tooltip", demo: TooltipDemo },
]

// One demo in a card, with the component's name in the footer strip.
function DemoTile({
  name,
  wide,
  children,
}: {
  name: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <Card
      role="region"
      aria-label={name}
      className={`min-w-0 gap-0 overflow-hidden py-0 ${wide ? "sm:col-span-2" : ""}`}
    >
      <div className="flex min-h-56 flex-1 items-center justify-center px-6 py-10">
        {children}
      </div>
      <div className="shrink-0 border-t border-border/40 px-4 py-3 text-body text-muted-foreground">
        {name}
      </div>
    </Card>
  )
}

export function App() {
  const [customizing, setCustomizing] = React.useState(false)
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Tiles fill the width, with room at the bottom for the settings bar. */}
      <div
        className={`px-3 pt-3 pb-32 transition-[padding] duration-(--duration-moderate) ease-standard motion-reduce:transition-none sm:px-6 sm:pt-6 [html[data-panel-dragging]_&]:transition-none ${customizing ? "lg:pe-[calc(var(--panel-w,420px)+--spacing(6))]" : ""}`}
      >
        <main className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {tiles.map(({ name, demo: Demo, wide }) => (
            <DemoTile key={name} name={name} wide={wide}>
              <Demo />
            </DemoTile>
          ))}
        </main>
      </div>
      <ControlPanel open={customizing} onOpenChange={setCustomizing} />
    </div>
  )
}
