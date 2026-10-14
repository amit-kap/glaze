"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@amit-kap/glaze/lib/utils"
import { reserveWeight } from "@amit-kap/glaze/lib/label"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative no-scrollbar inline-flex w-fit max-w-full scroll-fade-x items-center justify-center-safe overflow-x-auto rounded-control p-1 text-muted-foreground group-data-horizontal/tabs:h-control-lg group-data-vertical/tabs:h-fit group-data-vertical/tabs:max-h-full group-data-vertical/tabs:scroll-fade-y group-data-vertical/tabs:flex-col group-data-vertical/tabs:overflow-x-hidden group-data-vertical/tabs:overflow-y-auto data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      <TabsIndicator />
      {children}
    </TabsPrimitive.List>
  )
}

// One indicator per list slides to the active tab, instead of each trigger
// switching its own background. Base UI measures the active tab into
// --active-tab-*; the indicator moves on translate and resizes to match.
// It is anchored at inline-start, so RTL measures from --active-tab-right.
// Rendered before the triggers, so they paint above it.
function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "pointer-events-none absolute inset-s-0 top-0 transition-[translate,width,height] duration-(--duration-moderate) ease-spring",
        "group-data-[variant=default]/tabs-list:h-(--active-tab-height) group-data-[variant=default]/tabs-list:w-(--active-tab-width) group-data-[variant=default]/tabs-list:translate-x-(--active-tab-left) group-data-[variant=default]/tabs-list:translate-y-(--active-tab-top) group-data-[variant=default]/tabs-list:rounded-item group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-raised rtl:group-data-[variant=default]/tabs-list:-translate-x-(--active-tab-right) dark:group-data-[variant=default]/tabs-list:bg-input",
        "group-data-[variant=line]/tabs-list:bg-foreground group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.75 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:w-(--active-tab-width) group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:translate-x-(--active-tab-left) group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:translate-y-[calc(var(--active-tab-top)+var(--active-tab-height)+3px)] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:h-(--active-tab-height) group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.75 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:translate-x-[calc(var(--active-tab-left)+var(--active-tab-width)+2px)] group-data-vertical/tabs:group-data-[variant=line]/tabs-list:translate-y-(--active-tab-top) rtl:group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:-translate-x-(--active-tab-right) rtl:group-data-vertical/tabs:group-data-[variant=line]/tabs-list:translate-x-[calc(-1*(var(--active-tab-right)+var(--active-tab-width)+2px))]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-control-sm flex-1 items-center justify-center-safe gap-2 rounded-item border border-transparent px-3 text-body font-medium whitespace-nowrap text-foreground/60 transition-[color,border-color,box-shadow,outline-color,font-weight] group-data-vertical/tabs:w-full group-data-vertical/tabs:flex-none group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--icon-size)",
        "data-active:font-strong data-active:text-foreground dark:data-active:text-foreground",
        className
      )}
      {...props}
    >
      {reserveWeight(children, "font-strong")}
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-body outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  tabsListVariants,
}
