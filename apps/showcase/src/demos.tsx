// One demo per Glaze component, showing its variants and states. Components
// are used as they ship: classNames here are layout only.
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  AlertCircleIcon,
  ArrowUpIcon,
  BellIcon,
  BoldIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  FileTextIcon,
  ImageIcon,
  ItalicIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  TriangleAlertIcon,
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
  AttachmentMedia,
  AttachmentTitle,
} from "@amit-kap/glaze/components/attachment"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Bubble, BubbleContent } from "@amit-kap/glaze/components/bubble"
import { Button } from "@amit-kap/glaze/components/button"
import { Calendar } from "@amit-kap/glaze/components/calendar"
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
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@amit-kap/glaze/components/input-group"
import { Kbd, KbdGroup } from "@amit-kap/glaze/components/kbd"
import { Label } from "@amit-kap/glaze/components/label"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from "@amit-kap/glaze/components/message"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@amit-kap/glaze/components/popover"
import { Progress, ProgressLabel, ProgressValue } from "@amit-kap/glaze/components/progress"
import { RadioGroup, RadioGroupItem } from "@amit-kap/glaze/components/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@amit-kap/glaze/components/select"
import { Skeleton } from "@amit-kap/glaze/components/skeleton"
import { Slider } from "@amit-kap/glaze/components/slider"
import { Spinner } from "@amit-kap/glaze/components/spinner"
import { Switch } from "@amit-kap/glaze/components/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@amit-kap/glaze/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"
import { Textarea } from "@amit-kap/glaze/components/textarea"
import { toast } from "@amit-kap/glaze/components/toast"
import { Toggle } from "@amit-kap/glaze/components/toggle"
import { ToggleGroup, ToggleGroupItem } from "@amit-kap/glaze/components/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@amit-kap/glaze/components/tooltip"

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full max-w-xs flex-col gap-3">{children}</div>
)
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
)

/* ---------- actions ---------- */

export function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Row>
        <Button onClick={() => toast.add({ type: "success", title: "Saved" })}>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Row>
      <Row>
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button disabled>
          <Spinner />
          Saving
        </Button>
      </Row>
    </div>
  )
}

export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Row>
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="destructive">Destructive</Badge>
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

export function ToggleDemo() {
  return (
    <Row>
      <Toggle aria-label="Bold" defaultPressed>
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Underline" defaultPressed>
        <UnderlineIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Disabled" disabled>
        <BoldIcon />
      </Toggle>
    </Row>
  )
}

export function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" multiple defaultValue={["bold"]} aria-label="Formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

/* ---------- inputs ---------- */

export function InputDemo() {
  return (
    <Stack>
      <Input placeholder="Placeholder" aria-label="Empty" />
      <Input defaultValue="Filled value" aria-label="Filled" />
      <Input placeholder="Disabled" disabled aria-label="Disabled" />
      <Input defaultValue="not-an-email" aria-invalid aria-label="Invalid" />
    </Stack>
  )
}

export function TextareaDemo() {
  return (
    <Stack>
      <Textarea placeholder="Write a message…" aria-label="Message" />
    </Stack>
  )
}

export function InputGroupDemo() {
  return (
    <Stack>
      <InputGroup>
        <InputGroupInput placeholder="Search…" aria-label="Search" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" aria-label="Website" />
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask, search or chat…" aria-label="Prompt" />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" aria-label="Attach">
            <PaperclipIcon />
          </InputGroupButton>
          <InputGroupText className="ml-auto">52% used</InputGroupText>
          <InputGroupButton variant="default" size="icon-xs" aria-label="Send">
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Stack>
  )
}

export function CheckboxDemo() {
  return (
    <FieldGroup className="w-full max-w-xs">
      {[
        { id: "mentions", label: "Mentions", checked: true },
        { id: "replies", label: "Replies", checked: false },
        { id: "billing", label: "Billing (managed by admin)", checked: true, disabled: true },
      ].map((item) => (
        <Field key={item.id} orientation="horizontal" data-disabled={item.disabled || undefined}>
          <Checkbox id={`cb-${item.id}`} defaultChecked={item.checked} disabled={item.disabled} />
          <FieldLabel htmlFor={`cb-${item.id}`}>{item.label}</FieldLabel>
        </Field>
      ))}
    </FieldGroup>
  )
}

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-xs" aria-label="Plan">
      {[
        { value: "starter", label: "Starter", description: "One project." },
        { value: "pro", label: "Pro", description: "Unlimited projects." },
        { value: "team", label: "Team", description: "Shared themes and roles." },
      ].map((plan) => (
        <Field key={plan.value} orientation="horizontal">
          <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
          <FieldContent>
            <FieldLabel htmlFor={`plan-${plan.value}`}>{plan.label}</FieldLabel>
            <FieldDescription>{plan.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}

export function SwitchDemo() {
  return (
    <FieldGroup className="w-full max-w-xs">
      {[
        { id: "on", label: "On", props: { defaultChecked: true } },
        { id: "off", label: "Off", props: {} },
        { id: "small", label: "Small", props: { size: "sm" as const, defaultChecked: true } },
        { id: "disabled", label: "Disabled", props: { disabled: true } },
      ].map((s) => (
        <Field key={s.id} orientation="horizontal">
          <FieldLabel htmlFor={`sw-${s.id}`}>{s.label}</FieldLabel>
          <Switch id={`sw-${s.id}`} {...s.props} />
        </Field>
      ))}
    </FieldGroup>
  )
}

const languages = [
  { value: "en", label: "English" },
  { value: "he", label: "Hebrew" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
]

export function SelectDemo() {
  return (
    <Stack>
      {(["default", "sm"] as const).map((size) => (
        <Select key={size} items={languages} defaultValue="en">
          <SelectTrigger size={size} className="w-full" aria-label={`Language (${size})`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </Stack>
  )
}

export function SliderDemo() {
  return (
    <Stack>
      <Slider defaultValue={[60]} max={100} aria-label="Volume" />
      <Slider defaultValue={[25, 75]} max={100} aria-label="Price range" />
      <Slider defaultValue={[40]} max={100} disabled aria-label="Disabled" />
    </Stack>
  )
}

export function FieldDemo() {
  return (
    <FieldGroup className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor="field-name">Username</FieldLabel>
        <Input id="field-name" placeholder="glaze" />
        <FieldDescription>Choose a unique username.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="field-email">Email</FieldLabel>
        <Input id="field-email" defaultValue="not-an-email" aria-invalid />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </FieldGroup>
  )
}

/* ---------- navigation & disclosure ---------- */

export function TabsDemo() {
  return (
    <Stack>
      {(["default", "line"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="account">
          <TabsList variant={variant}>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="billing" disabled>
              Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" />
          <TabsContent value="password" />
        </Tabs>
      ))}
    </Stack>
  )
}

export function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-xs">
      <AccordionItem value="themes">
        <AccordionTrigger>Can I make my own theme?</AccordionTrigger>
        <AccordionContent>Yes. Set the inputs for light and dark; the rest is derived.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="primitives">
        <AccordionTrigger>What is it built on?</AccordionTrigger>
        <AccordionContent>shadcn/ui components on Base UI primitives.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="license">
        <AccordionTrigger>How is it licensed?</AccordionTrigger>
        <AccordionContent>MIT.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function CommandDemo() {
  return (
    <Command className="w-full max-w-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon />
            Calendar
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            Search emoji
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

/* ---------- overlays ---------- */

export function TooltipDemo() {
  return (
    <Row>
      {(["top", "bottom"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>{side === "top" ? "Top" : "Bottom"}</TooltipTrigger>
          <TooltipContent side={side}>
            Save changes <Kbd>⌘S</Kbd>
          </TooltipContent>
        </Tooltip>
      ))}
    </Row>
  )
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Dimensions</PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the layer.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          {[
            ["width", "Width", "100%"],
            ["height", "Height", "240px"],
          ].map(([id, label, value]) => (
            <div key={id} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={`dim-${id}`}>{label}</Label>
              <Input id={`dim-${id}`} defaultValue={value} className="col-span-2" />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <MoreHorizontalIcon />
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuItem>
            <BellIcon />
            Subscribe
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SlidersHorizontalIcon />
            Filters
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Archive</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Leave
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------- feedback ---------- */

export function AlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Theme saved</AlertTitle>
        <AlertDescription>Every project using Glaze picks it up on the next release.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Release failed</AlertTitle>
        <AlertDescription>Check your npm login and try again.</AlertDescription>
      </Alert>
    </div>
  )
}

export function ProgressDemo() {
  return (
    <Stack>
      <Progress value={68}>
        <ProgressLabel>Uploading assets</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={25} aria-label="Quarter done" />
      <Progress value={null} aria-label="Loading" />
    </Stack>
  )
}

export function SpinnerDemo() {
  return (
    <Row>
      <Spinner />
      <Button variant="secondary" disabled>
        <Spinner />
        Loading
      </Button>
    </Row>
  )
}

export function SkeletonDemo() {
  return (
    <Stack>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </Stack>
  )
}

/* ---------- conversation ---------- */

export function BubbleDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      {(["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"] as const).map((variant, i) => (
        <Bubble key={variant} variant={variant} align={i % 2 ? "end" : "start"}>
          <BubbleContent>{variant[0].toUpperCase() + variant.slice(1)} bubble</BubbleContent>
        </Bubble>
      ))}
    </div>
  )
}

export function MessageDemo() {
  return (
    <MessageGroup className="w-full max-w-md">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>NO</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Pushed the new tokens. Every theme picks them up.</BubbleContent>
          </Bubble>
          <MessageFooter>9:41</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Switching themes now. Looks great.</BubbleContent>
          </Bubble>
          <MessageFooter>Read</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

export function AttachmentDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Attachment state="done">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>tokens.css</AttachmentTitle>
          <AttachmentDescription>CSS · 4.8 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>cover.png</AttachmentTitle>
          <AttachmentDescription>Uploading…</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error" size="sm">
        <AttachmentMedia>
          <TriangleAlertIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>huge-video.mov</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="xs">
        <AttachmentMedia>
          <ImageIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sunset.jpg</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </div>
  )
}

/* ---------- people & keys ---------- */

export function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Row>
        {(["sm", "default", "lg"] as const).map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback>GL</AvatarFallback>
          </Avatar>
        ))}
        <Avatar>
          <AvatarFallback>ON</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </Row>
      <AvatarGroup>
        {["NO", "VE", "MA"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    </div>
  )
}

export function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Row>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
      </Row>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  )
}

/* ---------- data ---------- */

const issues = [
  { id: "GLZ-142", title: "Focus ring clipped in dialogs", severity: "critical", label: "Critical" },
  { id: "GLZ-139", title: "Sidebar badge misaligned", severity: "high", label: "High" },
  { id: "GLZ-131", title: "Chart tooltip lacks contrast", severity: "medium", label: "Medium" },
  { id: "GLZ-128", title: "Calendar week starts Sunday", severity: "low", label: "Low" },
] as const

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead className="text-right">Severity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>{issue.id}</TableCell>
            <TableCell>{issue.title}</TableCell>
            <TableCell className="text-right">
              <Badge variant={issue.severity}>{issue.label}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={date} onSelect={setDate} />
}

const traffic = [
  { month: "Jan", visitors: 186, signups: 80 },
  { month: "Feb", visitors: 305, signups: 200 },
  { month: "Mar", visitors: 237, signups: 120 },
  { month: "Apr", visitors: 273, signups: 190 },
  { month: "May", visitors: 409, signups: 230 },
  { month: "Jun", visitors: 414, signups: 280 },
]

const chartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  signups: { label: "Sign-ups", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <AreaChart accessibilityLayer data={traffic} margin={{ left: 4, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area dataKey="signups" type="natural" fill="var(--color-signups)" fillOpacity={0.3} stroke="var(--color-signups)" stackId="a" />
        <Area dataKey="visitors" type="natural" fill="var(--color-visitors)" fillOpacity={0.3} stroke="var(--color-visitors)" stackId="a" />
      </AreaChart>
    </ChartContainer>
  )
}
