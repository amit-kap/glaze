import {
  ArrowUpRightIcon,
  BoldIcon,
  BookmarkIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import { Badge } from "@amit-kap/glaze/components/badge"
import { Button } from "@amit-kap/glaze/components/button"
import { Spinner } from "@amit-kap/glaze/components/spinner"
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
