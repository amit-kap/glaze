import * as React from "react"
import {
  ArrowRightIcon,
  ChevronsUpDownIcon,
  LogInIcon,
  MailIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@amit-kap/glaze/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@amit-kap/glaze/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@amit-kap/glaze/components/sidebar"

import { Sprinkles } from "./brand-mark"
import { Logo } from "./logo"
import { initials, useUser } from "./user"

// [x%, y%, rotation] around the mark in the sign-in window's header.
const sprinkles: [number, number, number][] = [
  [10, 22, 32],
  [22, 64, -48],
  [31, 18, 74],
  [70, 70, 18],
  [84, 20, -24],
  [91, 58, 58],
  [66, 12, -62],
  [14, 82, 40],
]

/** A button that opens the mock sign-in (see user.ts): a name and an email. */
export function SignInButton({
  variant = "outline",
  size = "sm",
  className,
  children = "Sign in",
}: {
  className?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  children?: React.ReactNode
}) {
  const { signIn } = useUser()
  const [open, setOpen] = React.useState(false)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    signIn({
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
    })
    setOpen(false)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        data-testid="sign-in"
        className={className}
        onClick={() => setOpen(true)}
      >
        <LogInIcon />
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* The window wears the brand: frosting and the mark on top, ink below. */}
        <DialogContent
          data-theme="glaze"
          className="gap-0 overflow-hidden p-0 text-foreground sm:max-w-sm"
        >
          <div
            data-theme="glaze"
            aria-hidden="true"
            className="poster relative flex h-36 items-center justify-center overflow-hidden bg-background"
          >
            <Sprinkles points={sprinkles} />
            <Logo className="donut relative size-24" />
          </div>
          <form onSubmit={submit} className="flex flex-col gap-6 p-6">
            <DialogHeader className="items-center gap-2 text-center">
              {/* The title's own face and weight would win on the same node. */}
              <DialogTitle className="text-display leading-none">
                <span className="font-brand">Sign in to Glaze</span>
              </DialogTitle>
              <DialogDescription className="text-balance">
                Your saved themes in one place, a click from the editor.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sign-in-name">Name</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <UserIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="sign-in-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    required
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="sign-in-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ada@example.com"
                    required
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
            <div className="flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full">
                Continue
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
              <p className="text-center text-caption text-muted-foreground">
                No password. Nothing leaves this browser.
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** Sign in when signed out; the user's avatar with a Sign out menu when in. */
export function UserControl() {
  const { user, signOut } = useUser()
  if (!user) return <SignInButton />
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-testid="user-menu"
        aria-label="Account"
        className="rounded-pill outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar>
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-body font-medium text-foreground">
              {user.name}
            </span>
            <span>{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The account in a side panel's footer: who is signed in, or Sign in. */
export function SidebarUser() {
  const { user, signOut } = useUser()
  if (!user)
    return (
      // The brand's ink, so the way in is the one coloured thing in the panel.
      <div data-theme="glaze">
        <SignInButton variant="default" size="default" className="w-full" />
      </div>
    )
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            data-testid="user-menu"
            render={<SidebarMenuButton size="lg" />}
          >
            <Avatar size="sm">
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col text-start">
              <span className="truncate text-body font-medium">
                {user.name}
              </span>
              <span className="truncate text-caption text-muted-foreground">
                {user.email}
              </span>
            </span>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
