// One demo per Glaze component, with the same content as that component's
// Storybook stories (apps/storybook/src/stories), so the showcase and the docs
// show one product. Each demo names the stories it mirrors. Like the stories,
// classes follow the token contract (npm run check:tokens checks both).
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  AlertCircleIcon,
  ArrowUpRightIcon,
  BoldIcon,
  BookmarkIcon,
  CalculatorIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  FileCodeIcon,
  InfoIcon,
  ItalicIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UnderlineIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@amit-kap/glaze/components/accordion"
import { Alert, AlertDescription, AlertTitle } from "@amit-kap/glaze/components/alert"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@amit-kap/glaze/components/attachment"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@amit-kap/glaze/components/bubble"
import { Button } from "@amit-kap/glaze/components/button"
import { Calendar } from "@amit-kap/glaze/components/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@amit-kap/glaze/components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@amit-kap/glaze/components/chart"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@amit-kap/glaze/components/input-group"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@amit-kap/glaze/components/item"
import { Kbd, KbdGroup } from "@amit-kap/glaze/components/kbd"
import { Label } from "@amit-kap/glaze/components/label"
import { Marker, MarkerContent } from "@amit-kap/glaze/components/marker"
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@amit-kap/glaze/components/message"
import { Popover, PopoverContent, PopoverTrigger } from "@amit-kap/glaze/components/popover"
import { Progress, ProgressLabel, ProgressValue } from "@amit-kap/glaze/components/progress"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@amit-kap/glaze/components/questionnaire"
import { RadioGroup, RadioGroupItem } from "@amit-kap/glaze/components/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Skeleton } from "@amit-kap/glaze/components/skeleton"
import { Slider } from "@amit-kap/glaze/components/slider"
import { Spinner } from "@amit-kap/glaze/components/spinner"
import { Switch } from "@amit-kap/glaze/components/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"
import { Textarea } from "@amit-kap/glaze/components/textarea"
import { toast } from "@amit-kap/glaze/components/toast"
import { Toggle } from "@amit-kap/glaze/components/toggle"
import { ToggleGroup, ToggleGroupItem } from "@amit-kap/glaze/components/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@amit-kap/glaze/components/tooltip"

const Stack = ({ children, loose }: { children: React.ReactNode; loose?: boolean }) => (
  <div className={`flex w-full max-w-sm flex-col ${loose ? "gap-8" : "gap-4"}`}>{children}</div>
)
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
)

/* ---------- actions ---------- */

// Stories: Default…Link (variants), Size, Loading.
export function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Row>
        <Button onClick={() => toast.add({ type: "success", title: "Saved" })}>Button</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Row>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {(
          [
            ["xs", "icon-xs", "Extra Small"],
            ["sm", "icon-sm", "Small"],
            ["default", "icon", "Default"],
            ["lg", "icon-lg", "Large"],
          ] as const
        ).map(([size, iconSize, label]) => (
          <div key={size} className="flex items-start gap-2">
            <Button size={size} variant="outline">
              {label}
            </Button>
            <Button size={iconSize} aria-label="Submit" variant="outline">
              <ArrowUpRightIcon />
            </Button>
          </div>
        ))}
      </div>
      <Row>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" />
          Generating
        </Button>
        <Button variant="secondary" disabled>
          Downloading
          <Spinner data-icon="inline-end" />
        </Button>
      </Row>
    </div>
  )
}

// Stories: Variants, Severity.
export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Row>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
      </Row>
      <Row>
        <Badge variant="critical">Critical</Badge>
        <Badge variant="high">High</Badge>
        <Badge variant="medium">Medium</Badge>
        <Badge variant="low">Low</Badge>
      </Row>
    </div>
  )
}

// Stories: Default, Outline, Size.
export function ToggleDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
        <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
        Bookmark
      </Toggle>
      <Row>
        <Toggle variant="outline" aria-label="Toggle italic">
          <ItalicIcon />
          Italic
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bold">
          <BoldIcon />
          Bold
        </Toggle>
      </Row>
      <Row>
        <Toggle variant="outline" aria-label="Toggle small" size="sm">
          Small
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle default" size="default">
          Default
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle large" size="lg">
          Large
        </Toggle>
      </Row>
    </div>
  )
}

// Stories: Default, Outline.
export function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup variant="outline" multiple>
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
      <ToggleGroup variant="outline" defaultValue={["all"]}>
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="missed" aria-label="Toggle missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

/* ---------- inputs ---------- */

// Stories: Default, Disabled, Invalid.
export function InputDemo() {
  return (
    <Stack>
      <Input placeholder="Enter text" aria-label="Text" />
      <Field data-disabled>
        <FieldLabel htmlFor="input-disabled">Email</FieldLabel>
        <Input id="input-disabled" type="email" placeholder="Email" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
        <Input id="input-invalid" placeholder="Error" aria-invalid />
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
    </Stack>
  )
}

// Story: Default.
export function TextareaDemo() {
  return (
    <Stack>
      <Textarea placeholder="Type your message here." aria-label="Message" />
    </Stack>
  )
}

// Stories: Default, With Text.
export function InputGroupDemo() {
  return (
    <Stack>
      <InputGroup>
        <InputGroupInput placeholder="Search..." aria-label="Search" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" aria-label="Amount" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" className="ps-0.5!" aria-label="Website" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Enter your message" aria-label="Message" />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground">120 characters left</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Stack>
  )
}

// Story: With Group.
export function CheckboxDemo() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
      <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
      <FieldGroup className="gap-3">
        {[
          { id: "hard-disks", label: "Hard disks", checked: true },
          { id: "external-disks", label: "External disks", checked: true },
          { id: "cds-dvds", label: "CDs, DVDs, and iPods", checked: false },
          { id: "connected-servers", label: "Connected servers", checked: false },
        ].map((item) => (
          <Field key={item.id} orientation="horizontal">
            <Checkbox id={item.id} name={item.id} defaultChecked={item.checked} />
            <FieldLabel htmlFor={item.id} className="font-normal">
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}

// Story: With Description.
export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      {[
        { value: "default", label: "Default", description: "Standard spacing for most use cases." },
        { value: "comfortable", label: "Comfortable", description: "More space between elements." },
        { value: "compact", label: "Compact", description: "Minimal spacing for dense layouts." },
      ].map((option) => (
        <Field key={option.value} orientation="horizontal">
          <RadioGroupItem value={option.value} id={`desc-${option.value}`} />
          <FieldContent>
            <FieldLabel htmlFor={`desc-${option.value}`}>{option.label}</FieldLabel>
            <FieldDescription>{option.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}

// Stories: With Label, Size.
export function SwitchDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
      <FieldGroup className="w-40">
        <Field orientation="horizontal">
          <Switch id="switch-size-sm" size="sm" />
          <FieldLabel htmlFor="switch-size-sm">Small</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id="switch-size-default" size="default" />
          <FieldLabel htmlFor="switch-size-default">Default</FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  )
}

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
]
const vegetables = [
  { label: "Carrot", value: "carrot" },
  { label: "Leek", value: "leek" },
]

// Stories: Default, Small.
export function SelectDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Select items={[...fruits, ...vegetables]} defaultValue="banana">
        <SelectTrigger className="w-48" aria-label="Produce">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            {vegetables.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select items={fruits} defaultValue="apple">
        <SelectTrigger size="sm" className="w-40" aria-label="Fruit (small)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Stories: Default, Range, Disabled.
export function SliderDemo() {
  return (
    <Stack loose>
      <Slider defaultValue={[75]} max={100} step={1} aria-label="Volume" />
      <Slider defaultValue={[25, 50]} max={100} step={5} aria-label="Range" />
      <Slider defaultValue={[50]} max={100} step={1} disabled aria-label="Volume" />
    </Stack>
  )
}

// Stories: Default, Invalid.
export function FieldDemo() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="field-username">Username</FieldLabel>
        <Input id="field-username" type="text" placeholder="Max Leiter" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="field-invalid">Invalid Input</FieldLabel>
        <Input id="field-invalid" placeholder="Error" aria-invalid />
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}

/* ---------- navigation & disclosure ---------- */

const panels = [
  {
    value: "overview",
    title: "Overview",
    description: "View your key metrics and recent project activity. Track progress across all your active projects.",
    content: "You have 12 active projects and 3 pending tasks.",
  },
  {
    value: "analytics",
    title: "Analytics",
    description: "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
    content: "Page views are up 25% compared to last month.",
  },
  {
    value: "reports",
    title: "Reports",
    description: "Generate and download your detailed reports. Export data in multiple formats for analysis.",
    content: "You have 5 reports ready and available to export.",
  },
  {
    value: "settings",
    title: "Settings",
    description: "Manage your account preferences and options. Customize your experience to fit your needs.",
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
              <CardContent className="text-body text-muted-foreground">{panel.content}</CardContent>
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
          We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within 5-7 business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
        <AccordionContent>Reach us via email, live chat, or phone. We respond within 24 hours during business days.</AccordionContent>
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

/* ---------- overlays ---------- */

// Stories: Side, With Keyboard Shortcut.
export function TooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Row>
        {(["left", "top", "bottom", "right"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" className="w-fit capitalize" />}>{side}</TooltipTrigger>
            <TooltipContent side={side}>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </Row>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="icon-sm" aria-label="Save changes" />}>
          <SaveIcon />
        </TooltipTrigger>
        <TooltipContent>
          Save Changes <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

// Story: Default.
export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-body text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            {[
              ["width", "Width", "100%"],
              ["max-width", "Max. width", "300px"],
              ["height", "Height", "25px"],
              ["max-height", "Max. height", "none"],
            ].map(([id, label, value]) => (
              <div key={id} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`demo-${id}`}>{label}</Label>
                <Input id={`demo-${id}`} defaultValue={value} className="col-span-2 h-8" />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Story: Default.
export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------- feedback ---------- */

// Stories: Default, Destructive.
export function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>Your payment of $29.99 has been processed. A receipt has been sent to your email address.</AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>We&apos;ve added dark mode support. You can enable it in your account settings.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Your payment could not be processed. Please check your payment method and try again.</AlertDescription>
      </Alert>
    </div>
  )
}

// Stories: Default, Label.
export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <Progress value={progress} className="w-[60%]" aria-label="Progress" />
      <Progress value={56} className="w-full">
        <ProgressLabel>Upload progress</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}

// Stories: Default, In Button.
export function SpinnerDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <Item variant="muted" className="w-full">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none justify-end">
          <span className="text-body tabular-nums">$100.00</span>
        </ItemContent>
      </Item>
      <Row>
        <Button disabled size="sm">
          <Spinner data-icon="inline-start" />
          Loading...
        </Button>
        <Button variant="outline" disabled size="sm">
          <Spinner data-icon="inline-start" />
          Please wait
        </Button>
        <Button variant="secondary" disabled size="sm">
          <Spinner data-icon="inline-start" />
          Processing
        </Button>
      </Row>
    </div>
  )
}

// Story: Default.
export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-pill" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

/* ---------- conversation ---------- */

// Story: Variants.
export function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12">
      <Bubble>
        <BubbleContent>This is the default primary bubble.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>This is the secondary variant.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>This one is muted. It uses a lower emphasis color for the chat bubble.</BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>This one is tinted. The tint is a softer color derived from the primary color.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>We can also use an outlined variant.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive" align="end">
        <BubbleContent>Or a destructive variant with a reaction.</BubbleContent>
        <BubbleReactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent className="space-y-3">
          <p>
            Ghost bubbles work for assistant text, <strong>markdown</strong>, and other content that should not be framed.
          </p>
          <p>
            This is perfect for assistant messages that should not have a frame and can take the full width of the container. You can
            also render <code>code</code> in it.
          </p>
        </BubbleContent>
      </Bubble>
    </div>
  )
}

const me = { src: "https://github.com/shadcn.png", alt: "@me", fallback: "ME" }
const rabbit = { src: "https://github.com/evilrabbit.png", alt: "@rabbit", fallback: "R" }

function Person({ src, alt, fallback }: typeof me) {
  return (
    <MessageAvatar>
      <Avatar>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </MessageAvatar>
  )
}

// Story: Default.
export function MessageDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Message align="end">
        <Person {...me} />
        <MessageContent>
          <Bubble>
            <BubbleContent>Deploying to prod real quick.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <Person {...rabbit} />
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>It&apos;s 4:55 PM. On a Friday.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <Person {...me} />
        <MessageContent>
          <Bubble>
            <BubbleContent>It&apos;s a one-line change.</BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>
      <Message>
        <Person {...rabbit} />
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>It&apos;s always a one-line change 😭.</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>Alright, let me take a look.</BubbleContent>
              <BubbleReactions aria-label="Reactions: thumbs up">
                <span>👍</span>
              </BubbleReactions>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
      <Marker role="status">
        <MarkerContent className="shimmer">
          <span className="font-medium">Oliver</span> is typing...
        </MarkerContent>
      </Marker>
    </div>
  )
}

const images = [
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
    alt: "Workspace",
  },
  {
    name: "desk-reference.jpg",
    meta: "JPG · 1.1 MB",
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80",
    alt: "Desk",
  },
  {
    name: "office-reference.jpg",
    meta: "JPG · 940 KB",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80",
    alt: "Office",
  },
]

// Story: Default.
export function AttachmentDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <AttachmentGroup>
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  )
}

/* ---------- people & keys ---------- */

const people = [
  { handle: "shadcn", initials: "CN" },
  { handle: "maxleiter", initials: "LR" },
  { handle: "evilrabbit", initials: "ER" },
]

// Stories: Default, Sizes.
export function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-row flex-wrap items-center justify-center gap-6 md:gap-12">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="grayscale" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
          <AvatarBadge className="bg-success " />
        </Avatar>
        <AvatarGroup className="grayscale">
          {people.map((person) => (
            <Avatar key={person.handle}>
              <AvatarImage src={`https://github.com/${person.handle}.png`} alt={`@${person.handle}`} />
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </div>
      <div className="flex flex-wrap items-center gap-2 grayscale">
        {(["sm", "default", "lg"] as const).map((size) => (
          <Avatar key={size} size={size}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}

// Stories: Default, Group.
export function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>⌃</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>B</Kbd>
      </KbdGroup>
      <p className="text-body text-muted-foreground">
        Use{" "}
        <KbdGroup>
          <Kbd>Ctrl + B</Kbd>
          <Kbd>Ctrl + K</Kbd>
        </KbdGroup>{" "}
        to open the command palette
      </p>
    </div>
  )
}

/* ---------- data ---------- */

const invoices = [
  ["INV001", "Paid", "$250.00", "Credit Card"],
  ["INV002", "Pending", "$150.00", "PayPal"],
  ["INV003", "Unpaid", "$350.00", "Bank Transfer"],
  ["INV004", "Paid", "$450.00", "Credit Card"],
  ["INV005", "Paid", "$550.00", "PayPal"],
  ["INV006", "Pending", "$200.00", "Bank Transfer"],
  ["INV007", "Unpaid", "$300.00", "Credit Card"],
]

// Story: Default.
export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(([invoice, status, amount, method]) => (
          <TableRow key={invoice}>
            <TableCell className="font-medium">{invoice}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{method}</TableCell>
            <TableCell className="text-end">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

// Story: Default.
export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return <Calendar captionLayout="dropdown" mode="single" selected={date} onSelect={setDate} className="rounded-control border" />
}

const visitors = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
]

const visitorsConfig = {
  views: { label: "Page Views" },
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-1)" },
} satisfies ChartConfig

type Device = "desktop" | "mobile"

const formatDay = (value: string) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })

// Story: Default (interactive bar chart).
export function ChartDemo() {
  const [activeChart, setActiveChart] = React.useState<Device>("desktop")
  const total = React.useMemo(
    () => ({
      desktop: visitors.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: visitors.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )
  return (
    <Card className="w-full py-0 pb-4">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>Showing total visitors for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {(["desktop", "mobile"] as const).map((chart) => (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-start even:border-s data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-s sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-caption text-muted-foreground">{visitorsConfig[chart].label}</span>
              <span className="text-title leading-none font-strong sm:text-heading">{total[chart].toLocaleString()}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={visitorsConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={visitors} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={formatDay} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    typeof value !== "string" && typeof value !== "number"
                      ? value
                      : new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/* ---------- forms ---------- */

const questionnaireItems = [
  {
    choices: [
      { description: "Show what the agent ran and what came back.", label: "Tool call timeline", value: "tool-calls" },
      { description: "Ask before sensitive or destructive actions.", label: "Approval checkpoints", value: "approvals" },
      { description: "Make delegated work and results easier to follow.", label: "Sub-agent handoffs", value: "handoffs" },
    ],
    description: "Choose a direction or describe another task.",
    input: { label: "Another agent feature", placeholder: "Describe another feature…" },
    name: "direction",
    required: true,
    title: "What should the agent build next?",
  },
  {
    choices: [
      { label: "Progress", value: "progress" },
      { label: "Decisions", value: "decisions" },
      { label: "Risks", value: "risks" },
      { label: "Next step", value: "next-step" },
    ],
    description: "Select all that apply, or skip this question.",
    multiple: true,
    name: "signals",
    required: false,
    title: "What should every progress update include?",
  },
  {
    choices: [
      { label: "Start now", value: "now" },
      { label: "Next development cycle", value: "next-cycle" },
      { label: "Add it to the backlog", value: "backlog" },
    ],
    description: "Choose when the agent should begin the work.",
    name: "timing",
    required: true,
    title: "When should work begin?",
  },
] as const

// Story: Default.
export function QuestionnaireDemo() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const signals = formData.getAll("signals").join(", ") || "None"
    toast.add({
      title: "Agent plan saved",
      description: `Direction: ${formData.get("direction") ?? "None"} · Progress signals: ${signals} · Timing: ${formData.get("timing") ?? "None"}`,
    })
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="direction"
      items={questionnaireItems}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />
      {questionnaireItems.map((question) => (
        <QuestionnaireItem key={question.name} multiple={"multiple" in question && question.multiple} name={question.name} required={question.required}>
          <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
          <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice key={choice.value} value={choice.value}>
                <span className="font-medium">{choice.label}</span>
                {"description" in choice ? <span className="text-muted-foreground">{choice.description}</span> : null}
              </QuestionnaireChoice>
            ))}
            {"input" in question ? <QuestionnaireInput aria-label={question.input.label} placeholder={question.input.placeholder} /> : null}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}
