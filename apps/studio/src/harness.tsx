import * as React from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisIcon,
  FolderIcon,
  GlobeIcon,
  LayersIcon,
  MicIcon,
  PlusIcon,
  RotateCwIcon,
  SearchIcon,
  ShapesIcon,
  SquareTerminalIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import { Bubble, BubbleContent } from "@amit-kap/glaze/components/bubble"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@amit-kap/glaze/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@amit-kap/glaze/components/message-scroller"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@amit-kap/glaze/components/resizable"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@amit-kap/glaze/components/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"

// A mock of a coding-agent harness: sessions on the left, the conversation in
// the middle and a browser pane on the right. Nothing here is wired up.

const nav: { label: string; icon: LucideIcon }[] = [
  { label: "New", icon: PlusIcon },
  { label: "Search", icon: SearchIcon },
  { label: "Projects", icon: LayersIcon },
  { label: "Artifacts", icon: ShapesIcon },
  { label: "Scheduled", icon: ClockIcon },
  { label: "Customize", icon: BriefcaseIcon },
  { label: "More", icon: EllipsisIcon },
]

const projects: { name: string; open: boolean; sessions: string[] }[] = [
  {
    name: "atlas",
    open: true,
    sessions: [
      "Checkout flow verification",
      "Server setup and sync",
      "Hello",
      "Chart arrangement",
      "Design tokens in Paper",
    ],
  },
  { name: "notes-app", open: false, sessions: ["Offline sync bug"] },
  { name: "personal-site", open: false, sessions: ["Landing page copy"] },
]

const browserTabs = ["Atlas Studio", "Components / Message", "New tab"]

// Earlier turns, so the thread is long enough to scroll.
const earlier: ["me" | "agent", string][] = [
  ["me", "Start with the order summary: quantities, remove, and live totals."],
  [
    "agent",
    "Done. The totals update as you change quantities or pick a shipping method.",
  ],
  ["me", "Add the shipping method as radio choices with delivery notes."],
  [
    "agent",
    "Added Standard, Express and Overnight, with the price on the right.",
  ],
  ["me", "The payment fields only show for a card, right?"],
  [
    "agent",
    "Yes. PayPal and bank transfer hide the card number, expiry and CVC.",
  ],
  ["me", "Now make the place-order button confirm the purchase."],
  ["agent", "It opens a dialog with the total and a Keep shopping button."],
]

/** The width of an element, kept up to date as it resizes. */
function useElementWidth(element: HTMLElement | null) {
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])
  return width
}

// Room the conversation and the pane need to sit side by side.
const PANE_INLINE_WIDTH = 640

/**
 * A harness mock: sessions, a conversation and a browser pane. It follows the
 * width it is given. Wide, all three sit in a row. At laptop width the pane
 * opens over the conversation from its toolbar button, and below the kit
 * 640px the sessions become a drawer too.
 */
export function Harness() {
  // One session is always open: the list selects it and the header names it.
  const [session, setSession] = React.useState(projects[0].sessions[0])
  const [paneOpen, setPaneOpen] = React.useState<boolean | null>(null)
  const [body, setBody] = React.useState<HTMLElement | null>(null)
  const inline = useElementWidth(body) >= PANE_INLINE_WIDTH
  // Until it's toggled, the pane is open exactly when there's room beside it.
  const open = paneOpen ?? inline

  return (
    <SidebarProvider
      contained
      containedBreakpoint={640}
      style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
      className="h-full bg-background"
    >
      <Sessions session={session} onSessionChange={setSession} />
      <SidebarInset className="min-w-0">
        <div ref={setBody} className="relative flex min-h-0 flex-1">
          {inline && open ? (
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize="58%" minSize="36%">
                <Conversation
                  title={session}
                  paneOpen={open}
                  onTogglePane={() => setPaneOpen(!open)}
                />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="42%" minSize="26%">
                <Pane />
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <Conversation
              title={session}
              paneOpen={open}
              onTogglePane={() => setPaneOpen(!open)}
            />
          )}
          {!inline && open && (
            <div className="absolute inset-y-0 end-0 z-20 w-full max-w-md bg-background shadow-modal">
              <Pane onClose={() => setPaneOpen(false)} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function Sessions({
  session: active,
  onSessionChange,
}: {
  session: string
  onSessionChange: (session: string) => void
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map(({ label, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton>
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {projects.map((project) => (
          <Collapsible
            key={project.name}
            defaultOpen={project.open}
            render={<SidebarGroup />}
          >
            <SidebarGroupLabel
              render={<CollapsibleTrigger />}
              className="cursor-pointer gap-1"
            >
              {project.name}
              <ChevronRightIcon className="size-3 transition-transform in-data-[panel-open]:rotate-90" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {project.sessions.map((session) => (
                    <SidebarMenuItem key={session}>
                      <SidebarMenuButton
                        isActive={session === active}
                        onClick={() => {
                          onSessionChange(session)
                          setOpenMobile(false)
                        }}
                      >
                        <span>{session}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 p-1">
          <Avatar size="sm">
            <AvatarFallback className="text-micro">MC</AvatarFallback>
          </Avatar>
          <span className="text-caption">Maya Chen</span>
          <span className="text-micro text-muted-foreground">Pro</span>
          <ChevronDownIcon className="size-3.5 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function CopyButton() {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy"}
      className="text-muted-foreground"
      onClick={() => setCopied(true)}
    >
      <span className="icon-swap" data-swapped={copied || undefined}>
        <CopyIcon />
        <CheckIcon />
      </span>
    </Button>
  )
}

function Conversation({
  title,
  paneOpen,
  onTogglePane,
}: {
  title: string
  paneOpen: boolean
  onTogglePane: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-12 shrink-0 items-center gap-1 px-3">
        <SidebarTrigger aria-label="Toggle sessions" />
        <Button variant="ghost" size="sm" className="min-w-0 gap-1">
          <span className="truncate">{title}</span>
          <ChevronDownIcon />
        </Button>
        <div className="ms-auto flex items-center gap-0.5 text-muted-foreground">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Terminal"
            className="hidden @min-[480px]:inline-flex"
          >
            <SquareTerminalIcon />
          </Button>
          <Button
            variant={paneOpen ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Browser"
            aria-pressed={paneOpen}
            onClick={onTogglePane}
          >
            <GlobeIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Files"
            className="hidden @min-[480px]:inline-flex"
          >
            <FolderIcon />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="More" />
              }
            >
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename session</DropdownMenuItem>
              <DropdownMenuItem>Pin to top</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Move to project</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {projects.map((project) => (
                    <DropdownMenuItem key={project.name}>
                      {project.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>Export transcript</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <MessageScrollerProvider>
        <div className="min-h-0 flex-1">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-5 px-5 pb-4">
                {earlier.map(([from, text], index) => (
                  <MessageScrollerItem key={index}>
                    <MessageGroup>
                      <Message align={from === "me" ? "end" : "start"}>
                        <MessageContent>
                          <Bubble
                            variant={from === "me" ? "secondary" : "ghost"}
                            align={from === "me" ? "end" : "start"}
                          >
                            <BubbleContent className="text-body">
                              {text}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageGroup>
                  </MessageScrollerItem>
                ))}
                <MessageScrollerItem>
                  <MessageGroup>
                    <Message>
                      <MessageContent>
                        <Bubble variant="ghost">
                          <BubbleContent className="space-y-2 text-body">
                            <ul className="list-disc space-y-1.5 ps-5">
                              <li>
                                <strong>Behaviour:</strong> the messages sit at
                                the bottom, and a scroll-to-latest button
                                appears once the thread is scrolled up.
                              </li>
                              <li>
                                <strong>Not tested:</strong> the thread fits on
                                screen, so the scroll behaviour hasn&apos;t been
                                seen in action yet.
                              </li>
                            </ul>
                            <p>Want me to commit and push?</p>
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageGroup>
                </MessageScrollerItem>

                <MessageScrollerItem>
                  <Card size="sm" className="max-w-[88%]">
                    <CardContent className="space-y-2">
                      <CardDescription>
                        The Checkout screen now uses the shared form fields. It
                        renders without console errors, and typecheck and lint
                        pass. Nothing is committed.
                      </CardDescription>
                      <CardTitle className="text-caption">
                        Commit and push?
                      </CardTitle>
                    </CardContent>
                  </Card>
                </MessageScrollerItem>

                <MessageScrollerItem>
                  <MessageGroup>
                    <Message align="end">
                      <MessageContent>
                        <Bubble variant="secondary" align="end">
                          <BubbleContent className="text-body">
                            Replace the chat tab with a harness mock, three
                            columns. Do you need a visual ref?
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageGroup>
                </MessageScrollerItem>

                <MessageScrollerItem>
                  <MessageGroup>
                    <Message>
                      <MessageContent>
                        <Bubble variant="ghost">
                          <BubbleContent className="space-y-2 text-body">
                            <p>
                              Yes, a visual ref would help. Send a screenshot of
                              the full window with a session open, and one with
                              the side pane showing.
                            </p>
                          </BubbleContent>
                        </Bubble>
                        <MessageFooter>
                          <CopyButton />
                        </MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageGroup>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </div>
      </MessageScrollerProvider>

      <div className="shrink-0 px-4 pb-2">
        <InputGroup className="h-11">
          <InputGroupAddon>
            <InputGroupButton size="icon-xs" aria-label="Add">
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Message"
            placeholder="Type / for commands"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Dictate">
              <MicIcon />
            </InputGroupButton>
            <InputGroupButton
              size="icon-xs"
              variant="default"
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div className="mt-2 flex items-center justify-between px-1 text-micro text-muted-foreground">
          <span>Auto</span>
          <span>Sonnet 5.5 · Medium</span>
        </div>
      </div>
    </div>
  )
}

function Pane({ onClose }: { onClose?: () => void }) {
  const [tab, setTab] = React.useState(browserTabs[2])

  return (
    <div className="flex h-full min-h-0 flex-col border-s border-border">
      <div className="flex h-12 shrink-0 items-center gap-1 px-2">
        <Tabs value={tab} onValueChange={setTab} className="min-w-0 flex-1">
          <TabsList size="sm" className="max-w-full justify-start">
            {browserTabs.map((name) => (
              <TabsTrigger key={name} value={name} className="gap-1.5">
                <GlobeIcon />
                <span className="max-w-24 truncate">{name}</span>
                <XIcon className="size-3 text-muted-foreground" />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon-sm" aria-label="New tab">
          <PlusIcon />
        </Button>
        {onClose && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close browser"
            onClick={onClose}
          >
            <XIcon />
          </Button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 px-2 pb-2">
        {[ArrowLeftIcon, ArrowRightIcon, RotateCwIcon].map((Icon, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon-sm"
            aria-label={["Back", "Forward", "Reload"][index]}
            className="text-muted-foreground"
          >
            <Icon />
          </Button>
        ))}
        <InputGroup className="flex-1">
          <InputGroupInput aria-label="Address" placeholder="Type a URL" />
        </InputGroup>
      </div>

      <div className="min-h-0 flex-1" />
    </div>
  )
}
