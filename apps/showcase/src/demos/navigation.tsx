import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@amit-kap/glaze/components/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@amit-kap/glaze/components/command"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@amit-kap/glaze/components/tabs"

const panels = [
  {
    value: "overview",
    title: "Overview",
    description:
      "View your key metrics and recent project activity. Track progress across all your active projects.",
    content: "You have 12 active projects and 3 pending tasks.",
  },
  {
    value: "analytics",
    title: "Analytics",
    description:
      "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
    content: "Page views are up 25% compared to last month.",
  },
  {
    value: "reports",
    title: "Reports",
    description:
      "Generate and download your detailed reports. Export data in multiple formats for analysis.",
    content: "You have 5 reports ready and available to export.",
  },
  {
    value: "settings",
    title: "Settings",
    description:
      "Manage your account preferences and options. Customize your experience to fit your needs.",
    content: "Configure notifications, security, and themes.",
  },
]

// Stories: Default, Line.
export function TabsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList>
          {panels.map((panel) => (
            <TabsTrigger key={panel.value} value={panel.value}>
              {panel.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {panels.map((panel) => (
          <TabsContent key={panel.value} value={panel.value}>
            <Card>
              <CardHeader>
                <CardTitle>{panel.title}</CardTitle>
                <CardDescription>{panel.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-body text-muted-foreground">
                {panel.content}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

// Story: Default.
export function AccordionDemo() {
  return (
    <Accordion defaultValue={["shipping"]} className="w-full max-w-md">
      <AccordionItem value="shipping">
        <AccordionTrigger>What are your shipping options?</AccordionTrigger>
        <AccordionContent>
          We offer standard (5-7 days), express (2-3 days), and overnight
          shipping. Free shipping on international orders.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          Returns accepted within 30 days. Items must be unused and in original
          packaging. Refunds processed within 5-7 business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
        <AccordionContent>
          Reach us via email, live chat, or phone. We respond within 24 hours
          during business days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// Story: Default.
export function CommandDemo() {
  return (
    <Command className="w-full max-w-sm border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <CalculatorIcon />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
