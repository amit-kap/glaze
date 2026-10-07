import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ArrowUpIcon,
  BellIcon,
  BoldIcon,
  CalendarIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderPlusIcon,
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
import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Badge } from "@amit-kap/glaze/components/badge"
import { Bubble, BubbleContent } from "@amit-kap/glaze/components/bubble"
import { Button } from "@amit-kap/glaze/components/button"
import { Calendar } from "@amit-kap/glaze/components/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@amit-kap/glaze/components/chart"
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@amit-kap/glaze/components/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@amit-kap/glaze/components/input-group"
import { Kbd } from "@amit-kap/glaze/components/kbd"
import { Label } from "@amit-kap/glaze/components/label"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@amit-kap/glaze/components/message"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@amit-kap/glaze/components/popover"
import { Progress, ProgressLabel, ProgressValue } from "@amit-kap/glaze/components/progress"
import { RadioGroup, RadioGroupItem } from "@amit-kap/glaze/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"
import { Separator } from "@amit-kap/glaze/components/separator"
import { Slider } from "@amit-kap/glaze/components/slider"
import { Switch } from "@amit-kap/glaze/components/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"
import { toast } from "@amit-kap/glaze/components/toast"
import { ToggleGroup, ToggleGroupItem } from "@amit-kap/glaze/components/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@amit-kap/glaze/components/tooltip"

export function SignInDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to Glaze</CardTitle>
        <CardDescription>Welcome back. Enter your details below.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">
            Sign up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="signin-email">Email</FieldLabel>
            <Input id="signin-email" type="email" placeholder="you@example.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="signin-password">Password</FieldLabel>
            <Input id="signin-password" type="password" placeholder="••••••••" />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="signin-remember" defaultChecked />
            <FieldLabel htmlFor="signin-remember" className="font-normal">
              Keep me signed in
            </FieldLabel>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" onClick={() => toast.add({ type: "success", title: "Signed in" })}>
          Sign in
        </Button>
        <Button variant="outline" className="w-full">
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  )
}

const languages = [
  { value: "en", label: "English" },
  { value: "he", label: "Hebrew" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
]

export function SettingsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Applied to every workspace you own.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="settings-notify">Notifications</FieldLabel>
              <FieldDescription>Mentions, replies and reviews.</FieldDescription>
            </FieldContent>
            <Switch id="settings-notify" defaultChecked />
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="settings-digest">Weekly digest</FieldLabel>
              <FieldDescription>A summary every Monday.</FieldDescription>
            </FieldContent>
            <Switch id="settings-digest" />
          </Field>
          <FieldSeparator />
          <Field>
            <FieldLabel htmlFor="settings-language">Language</FieldLabel>
            <Select items={languages} defaultValue="en">
              <SelectTrigger id="settings-language" className="w-full">
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
          </Field>
          <Field>
            <FieldLabel>Start of week</FieldLabel>
            <RadioGroup defaultValue="monday" className="flex gap-4">
              {["sunday", "monday"].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <RadioGroupItem value={day} id={`week-${day}`} />
                  <Label htmlFor={`week-${day}`} className="capitalize">
                    {day}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Field>
          <Field>
            <FieldLabel>Text size</FieldLabel>
            <Slider defaultValue={[60]} max={100} step={1} />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export function ChatDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design review</CardTitle>
        <CardDescription>3 people · updated just now</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <MessageGroup className="gap-4">
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
                <BubbleContent>Switching to Maia now. The pills look great.</BubbleContent>
              </Bubble>
              <MessageFooter>Read</MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
        <InputGroup>
          <InputGroupTextarea placeholder="Reply to the thread…" />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-xs" aria-label="Attach">
              <PaperclipIcon />
            </InputGroupButton>
            <InputGroupText className="ml-auto">⏎ to send</InputGroupText>
            <InputGroupButton variant="default" size="icon-xs" className="rounded-pill" aria-label="Send">
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  )
}

export function CommandDemo() {
  return (
    <Command className="rounded-container border shadow-raised">
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

export function IssuesDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open issues</CardTitle>
        <CardDescription>4 need attention this sprint.</CardDescription>
        <CardAction>
          <IssueMenu />
        </CardAction>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

function IssueMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="More" />}>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Issues</DropdownMenuLabel>
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
          Leave project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ToolbarDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor toolbar</CardTitle>
        <CardDescription>Toggles, tooltips, a popover and shortcuts.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
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
        <Separator orientation="vertical" className="h-6" />
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
        <Button
          variant="secondary"
          onClick={() =>
            toast.add({
              title: "Draft saved",
              actionProps: { children: "Undo", onClick: () => toast.add({ title: "Restored" }) },
            })
          }
        >
          Save
        </Button>
      </CardContent>
    </Card>
  )
}

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Card className="items-center">
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </CardContent>
    </Card>
  )
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
    <Card>
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
        <CardDescription>Visitors and sign-ups, first half of the year.</CardDescription>
        <CardAction>
          <Badge variant="secondary">+24%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <AreaChart accessibilityLayer data={traffic} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="signups" type="natural" fill="var(--color-signups)" fillOpacity={0.3} stroke="var(--color-signups)" stackId="a" />
            <Area dataKey="visitors" type="natural" fill="var(--color-visitors)" fillOpacity={0.3} stroke="var(--color-visitors)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function TabsDemo() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="upload">
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
                <AccordionContent>
                  Yes. Set about seventeen inputs for light and dark; everything else is derived.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="primitives">
                <AccordionTrigger>What is it built on?</AccordionTrigger>
                <AccordionContent>shadcn/ui components on Base UI primitives, styled with Tailwind.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export function EmptyDemo() {
  return (
    <Card>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderPlusIcon />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>Create a project to start theming your app.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="sm">Create project</Button>
            <Button size="sm" variant="outline">
              Import
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </Card>
  )
}
