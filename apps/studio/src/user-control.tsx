import * as React from "react"

import { Avatar, AvatarFallback } from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Input } from "@amit-kap/glaze/components/input"

import { initials, useUser } from "./user"

/** A button that opens the mock sign-in (see user.ts): a name and an email. */
export function SignInButton({
  variant = "outline",
  size = "sm",
  children = "Sign in",
}: {
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
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sign-in-name">Name</FieldLabel>
                <Input
                  id="sign-in-name"
                  name="name"
                  autoComplete="name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                <Input
                  id="sign-in-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button type="submit">Continue</Button>
            </DialogFooter>
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
