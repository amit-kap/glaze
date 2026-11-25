import * as React from "react"

import { Card } from "@amit-kap/glaze/components/card"
import { cn } from "@amit-kap/glaze/lib/utils"
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
export const tiles: {
  name: string
  demo: () => React.ReactNode
  wide?: boolean
}[] = [
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

// One demo in a card, with the component's name in the footer strip. `bleed`
// removes the padding, for content that fills the card.
export function DemoTile({
  name,
  wide,
  bleed,
  className,
  contentClassName,
  children,
  ...props
}: {
  name: string
  wide?: boolean
  bleed?: boolean
  contentClassName?: string
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof Card>, "children" | "name">) {
  return (
    <Card
      role="region"
      aria-label={name}
      {...props}
      className={cn(
        "min-w-0 gap-0 overflow-hidden py-0",
        wide && "sm:col-span-2",
        className
      )}
    >
      <div
        className={cn(
          "flex min-h-56 min-w-0 flex-1",
          bleed ? "items-stretch" : "items-center justify-center px-6 py-10",
          contentClassName
        )}
      >
        {children}
      </div>
      <div className="shrink-0 border-t border-border/40 px-4 py-3 text-body text-muted-foreground">
        {name}
      </div>
    </Card>
  )
}
