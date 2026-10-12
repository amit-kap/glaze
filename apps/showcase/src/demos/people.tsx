import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@amit-kap/glaze/components/avatar"
import { Kbd, KbdGroup } from "@amit-kap/glaze/components/kbd"

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
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
          <AvatarBadge className="bg-success" />
        </Avatar>
        <AvatarGroup className="grayscale">
          {people.map((person) => (
            <Avatar key={person.handle}>
              <AvatarImage
                src={`https://github.com/${person.handle}.png`}
                alt={`@${person.handle}`}
              />
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
