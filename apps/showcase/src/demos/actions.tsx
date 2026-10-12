import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BoldIcon,
  BookmarkIcon,
  ItalicIcon,
  MoreHorizontalIcon,
  UnderlineIcon,
} from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { ButtonGroup } from "@amit-kap/glaze/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import { toast } from "@amit-kap/glaze/components/toast"
import { Toggle } from "@amit-kap/glaze/components/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@amit-kap/glaze/components/toggle-group"

import { Row } from "./layout"

// Stories: Default…Link (variants), Size, Loading.
export function ButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Row>
        <Button onClick={() => toast.add({ type: "success", title: "Saved" })}>
          Button
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </Row>
      <Row>
        {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
          <Button key={size} size={size} variant="outline" aria-label="Submit">
            <ArrowUpRightIcon />
          </Button>
        ))}
      </Row>
    </div>
  )
}

// Stories: Default.
export function ButtonGroupDemo() {
  return (
    <ButtonGroup className="flex-wrap justify-center">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Go Back">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="More Options" />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem>Mark as Read</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Snooze</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
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
        <ToggleGroupItem
          value="strikethrough"
          aria-label="Toggle strikethrough"
        >
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
