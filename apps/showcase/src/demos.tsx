import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ArrowUpIcon,
  BellIcon,
  BoldIcon,
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  ItalicIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  SmileIcon,
  UnderlineIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@amit-kap/glaze/components/accordion"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@amit-kap/glaze/components/attachment"
import { Avatar, AvatarFallback, AvatarGroup } from "@amit-kap/glaze/components/avatar"
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
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
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
import { Slider } from "@amit-kap/glaze/components/slider"
import { Switch } from "@amit-kap/glaze/components/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@amit-kap/glaze/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"
import { toast } from "@amit-kap/glaze/components/toast"
import { ToggleGroup, ToggleGroupItem } from "@amit-kap/glaze/components/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@amit-kap/glaze/components/tooltip"

export function ComposerDemo() {
  return (
    <InputGroup className="w-full max-w-md">
      <InputGroupTextarea placeholder="Ask, search or chat…" />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-xs" aria-label="Attach">
          <PaperclipIcon />
        </InputGroupButton>
        <InputGroupText className="ml-auto">52% used</InputGroupText>
        <InputGroupButton variant="default" size="icon-xs" className="rounded-pill" aria-label="Send">
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export function ButtonsDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => toast.add({ type: "success", title: "Changes saved" })}>Save</Button>
        <Button variant="secondary">Preview</Button>
        <Button variant="outline">Share</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge>New</Badge>
        <Badge variant="secondary">Beta</Badge>
        <Badge variant="outline">v0.1.1</Badge>
        <Badge variant="destructive">Deprecated</Badge>
      </div>
    </div>
  )
}

export function SignInDemo() {
  return (
    <FieldGroup className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor="demo-email">Email</FieldLabel>
        <Input id="demo-email" type="email" placeholder="you@example.com" />
      </Field>
      <Field>
        <FieldLabel htmlFor="demo-password">Password</FieldLabel>
        <Input id="demo-password" type="password" placeholder="••••••••" />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="demo-remember" defaultChecked />
        <FieldLabel htmlFor="demo-remember" className="font-normal">
          Keep me signed in
        </FieldLabel>
      </Field>
      <Button className="w-full" onClick={() => toast.add({ type: "success", title: "Signed in" })}>
        Sign in
      </Button>
    </FieldGroup>
  )
}

export function SwitchesDemo() {
  return (
    <FieldGroup className="w-full max-w-xs">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="demo-notify">Notifications</FieldLabel>
          <FieldDescription>Mentions and replies.</FieldDescription>
        </FieldContent>
        <Switch id="demo-notify" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="demo-digest">Weekly digest</FieldLabel>
          <FieldDescription>Every Monday.</FieldDescription>
        </FieldContent>
        <Switch id="demo-digest" />
      </Field>
    </FieldGroup>
  )
}

export function CheckboxDemo() {
  return (
    <FieldGroup className="w-full max-w-xs gap-4">
      {[
        { id: "mentions", label: "Mentions", description: "When someone @mentions you.", checked: true },
        { id: "replies", label: "Replies", description: "Replies to your comments.", checked: true },
        { id: "updates", label: "Product updates", description: "New features and releases.", checked: false },
        { id: "billing", label: "Billing", description: "Managed by your workspace admin.", checked: true, disabled: true },
      ].map((item) => (
        <Field key={item.id} orientation="horizontal" data-disabled={item.disabled || undefined}>
          <Checkbox id={`demo-check-${item.id}`} defaultChecked={item.checked} disabled={item.disabled} />
          <FieldContent>
            <FieldLabel htmlFor={`demo-check-${item.id}`}>{item.label}</FieldLabel>
            <FieldDescription>{item.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </FieldGroup>
  )
}

export function RadioDemo() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-xs gap-4" aria-label="Plan">
      {[
        { value: "starter", label: "Starter", description: "One project, community support." },
        { value: "pro", label: "Pro", description: "Unlimited projects and themes." },
        { value: "team", label: "Team", description: "Shared themes and roles." },
      ].map((plan) => (
        <Field key={plan.value} orientation="horizontal">
          <RadioGroupItem value={plan.value} id={`demo-plan-${plan.value}`} />
          <FieldContent>
            <FieldLabel htmlFor={`demo-plan-${plan.value}`}>{plan.label}</FieldLabel>
            <FieldDescription>{plan.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  )
}

const languages = [
  { value: "en", label: "English" },
  { value: "he", label: "Hebrew" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
]

export function ChoicesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <Select items={languages} defaultValue="en">
        <SelectTrigger className="w-full" aria-label="Language">
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
      <Slider defaultValue={[60]} max={100} step={1} aria-label="Volume" />
    </div>
  )
}

export function ToolbarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ToggleGroup variant="outline" multiple defaultValue={["bold"]} aria-label="Formatting">
        {[
          { value: "bold", icon: BoldIcon, label: "Bold", key: "⌘B" },
          { value: "italic", icon: ItalicIcon, label: "Italic", key: "⌘I" },
          { value: "underline", icon: UnderlineIcon, label: "Underline", key: "⌘U" },
        ].map(({ value, icon: Icon, label, key }) => (
          <Tooltip key={value}>
            <TooltipTrigger render={<ToggleGroupItem value={value} aria-label={label} />}>
              <Icon />
            </TooltipTrigger>
            <TooltipContent>
              {label} <Kbd>{key}</Kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Dimensions</PopoverTrigger>
        <PopoverContent className="w-72">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the size of the layer.</PopoverDescription>
          </PopoverHeader>
          <div className="grid gap-2">
            {[
              ["width", "100%"],
              ["height", "240px"],
            ].map(([id, value]) => (
              <div key={id} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`dim-${id}`} className="capitalize">
                  {id}
                </Label>
                <Input id={`dim-${id}`} defaultValue={value} className="col-span-2" />
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="More" />}>
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BellIcon />
              Subscribe
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SlidersHorizontalIcon />
              Filters
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOutIcon />
            Leave
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function CommandDemo() {
  return (
    <Command className="w-full max-w-md rounded-container border shadow-raised">
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

export function ChatDemo() {
  return (
    <MessageGroup className="w-full max-w-md gap-4">
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
          <Attachment size="sm">
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

const issues = [
  { id: "GLZ-142", title: "Focus ring clipped in dialogs", severity: "critical", owner: "NO" },
  { id: "GLZ-139", title: "Sidebar badge misaligned", severity: "high", owner: "VE" },
  { id: "GLZ-131", title: "Chart tooltip lacks contrast", severity: "medium", owner: "MA" },
  { id: "GLZ-128", title: "Calendar week starts Sunday", severity: "low", owner: "LY" },
] as const

const severityClass = {
  critical: "bg-severity-critical/10 text-severity-critical dark:bg-severity-critical/20",
  high: "bg-severity-high/10 text-severity-high dark:bg-severity-high/20",
  medium: "bg-severity-medium/10 text-severity-medium dark:bg-severity-medium/20",
  low: "bg-severity-low/10 text-severity-low dark:bg-severity-low/20",
}

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issue</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead className="text-right">Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>
              <div className="font-medium">{issue.title}</div>
              <div className="text-caption text-muted-foreground">{issue.id}</div>
            </TableCell>
            <TableCell>
              <Badge className={`capitalize ${severityClass[issue.severity]}`}>{issue.severity}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Avatar size="sm" className="ml-auto">
                <AvatarFallback>{issue.owner}</AvatarFallback>
              </Avatar>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-container border" />
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

export function TabsDemo() {
  return (
    <Tabs defaultValue="upload" className="w-full max-w-xs">
      <TabsList>
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>
      <TabsContent value="upload" className="flex flex-col gap-4 pt-2">
        <Progress value={68}>
          <ProgressLabel>Uploading assets</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => toast.add({ type: "success", title: "Upload complete" })}>
            Finish
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.add({ type: "error", title: "Upload cancelled" })}>
            Cancel
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="faq">
        <Accordion>
          <AccordionItem value="themes">
            <AccordionTrigger>Can I make my own theme?</AccordionTrigger>
            <AccordionContent>Yes. Set the inputs for light and dark; everything else is derived.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="primitives">
            <AccordionTrigger>What is it built on?</AccordionTrigger>
            <AccordionContent>shadcn/ui components on Base UI primitives.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  )
}

export function PeopleDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarGroup>
        {["NO", "VE", "MA", "LY"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  )
}
