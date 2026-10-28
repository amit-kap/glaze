import * as React from "react"
import { MoreHorizontalIcon, SearchIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@amit-kap/glaze/components/avatar"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@amit-kap/glaze/components/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@amit-kap/glaze/components/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

type Role = "Owner" | "Editor" | "Viewer"

type Member = { name: string; email: string; role: Role; photo?: string }

const roles: { value: Role; label: string }[] = [
  { value: "Owner", label: "Owner" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
]

const initial: Member[] = [
  {
    name: "Jack Walsh",
    email: "jack.walsh@acme.co",
    role: "Owner",
    photo: "/avatars/jack-walsh.png",
  },
  { name: "Ilze Pērkone", email: "ilze@acme.co", role: "Editor" },
  { name: "Vernon Desilets", email: "vernon@acme.co", role: "Viewer" },
  { name: "Lin Wāngshū", email: "lin.wang@acme.co", role: "Editor" },
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

/** A members settings page: a searchable list with roles, a row menu and an invite dialog. */
export function Settings() {
  const [members, setMembers] = React.useState(initial)
  const [query, setQuery] = React.useState("")

  const shown = members.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase())
  )

  const setRole = (email: string, role: Role) =>
    setMembers((all) =>
      all.map((member) =>
        member.email === email ? { ...member, role } : member
      )
    )

  return (
    <div className="h-full overflow-y-auto bg-background p-4 @min-[600px]:p-8">
      <div className="mx-auto flex max-w-xl flex-col gap-5">
        <div>
          <h2 className="text-heading font-medium">Workspace Members</h2>
          <p className="mt-1 text-caption text-muted-foreground">
            Add teammates to collaborate on projects together. Control
            permissions and manage access levels for each member.{" "}
            <Button variant="link" size="sm" className="h-auto px-0">
              View member permissions guide
            </Button>
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <InputGroup className="max-w-52">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search members"
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
          <InviteDialog
            onInvite={(member) => setMembers((all) => [...all, member])}
          />
        </div>

        <div>
          <p className="mb-2 text-micro text-muted-foreground">
            {shown.length} {shown.length === 1 ? "member" : "members"}
          </p>
          <ItemGroup>
            {shown.map((member, index) => (
              <React.Fragment key={member.email}>
                {index > 0 && <ItemSeparator />}
                <Item size="xs" className="px-0">
                  <ItemMedia>
                    <Avatar>
                      {member.photo && (
                        <AvatarImage src={member.photo} alt="" />
                      )}
                      <AvatarFallback>{initials(member.name)}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{member.name}</ItemTitle>
                    <ItemDescription>{member.email}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Select
                      items={roles}
                      value={member.role}
                      onValueChange={(next) =>
                        next && setRole(member.email, next as Role)
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        aria-label={`Role for ${member.name}`}
                        className="w-24"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false} align="end">
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={`Actions for ${member.name}`}
                          />
                        }
                      >
                        <MoreHorizontalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                          <DropdownMenuItem>Resend invite</DropdownMenuItem>
                          <DropdownMenuItem>View activity</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={member.role === "Owner"}
                          onClick={() =>
                            setMembers((all) =>
                              all.filter((item) => item.email !== member.email)
                            )
                          }
                        >
                          Remove member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
            {shown.length === 0 && (
              <p className="py-8 text-center text-caption text-muted-foreground">
                No members match &ldquo;{query}&rdquo;.
              </p>
            )}
          </ItemGroup>
        </div>
      </div>
    </div>
  )
}

function InviteDialog({ onInvite }: { onInvite: (member: Member) => void }) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<Role>("Viewer")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Invite Member</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a link to join this workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="invite-email">Email</FieldLabel>
            <Input
              id="invite-email"
              type="email"
              placeholder="name@acme.co"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Select
              items={roles}
              value={role}
              onValueChange={(next) => next && setRole(next as Role)}
            >
              <SelectTrigger aria-label="Role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles
                  .filter((item) => item.value !== "Owner")
                  .map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!email.includes("@")}
            onClick={() => {
              onInvite({
                name: email.split("@")[0],
                email,
                role,
              })
              setEmail("")
              setOpen(false)
            }}
          >
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
