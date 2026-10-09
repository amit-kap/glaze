import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  FolderIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react"
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@amit-kap/glaze/components/collapsible"
import { Field, FieldGroup, FieldLabel } from "@amit-kap/glaze/components/field"
import { Input } from "@amit-kap/glaze/components/input"
import { Tabs, TabsList, TabsTrigger } from "@amit-kap/glaze/components/tabs"

// Stories follow the upstream shadcn/ui (base-nova) Collapsible examples:
// https://ui.shadcn.com/docs/components/base/collapsible
const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  subcomponents: { CollapsibleContent, CollapsibleTrigger },
  parameters: {
    docs: {
      description: {
        component: "An interactive component which expands/collapses a panel.",
      },
    },
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <Collapsible
        {...args}
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex w-[350px] flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-body font-semibold">Order #4189</h4>
          <CollapsibleTrigger
            render={<Button variant="ghost" size="icon" className="size-8" />}
          >
            <ChevronsUpDownIcon />
            <span className="sr-only">Toggle details</span>
          </CollapsibleTrigger>
        </div>
        <div className="flex items-center justify-between rounded-md border px-4 py-2 text-body">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium">Shipped</span>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 text-body">
            <p className="font-medium">Shipping address</p>
            <p className="text-muted-foreground">
              100 Market St, San Francisco
            </p>
          </div>
          <div className="rounded-md border px-4 py-2 text-body">
            <p className="font-medium">Items</p>
            <p className="text-muted-foreground">2x Studio Headphones</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}

export const Basic: Story = {
  render: () => (
    <Card className="w-sm">
      <CardContent>
        <Collapsible className="rounded-md data-open:bg-muted">
          <CollapsibleTrigger
            render={<Button variant="ghost" className="w-full" />}
          >
            Product details
            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-body">
            <div>
              This panel can be expanded or collapsed to reveal additional
              content.
            </div>
            <Button size="xs">Learn More</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ),
}

// --- Compositions ---------------------------------------------------------

// Upstream reuses one id for all four inputs; each gets its own here.
export const SettingsPanel: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <Card className="w-xs" size="sm">
        <CardHeader>
          <CardTitle>Radius</CardTitle>
          <CardDescription>
            Set the corner radius of the element.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="flex items-start gap-2"
          >
            <FieldGroup className="grid w-full grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="radius-x" className="sr-only">
                  Radius X
                </FieldLabel>
                <Input id="radius-x" placeholder="0" defaultValue={0} />
              </Field>
              <Field>
                <FieldLabel htmlFor="radius-y" className="sr-only">
                  Radius Y
                </FieldLabel>
                <Input id="radius-y" placeholder="0" defaultValue={0} />
              </Field>
              <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-2">
                <Field>
                  <FieldLabel htmlFor="radius-bottom-x" className="sr-only">
                    Bottom radius X
                  </FieldLabel>
                  <Input
                    id="radius-bottom-x"
                    placeholder="0"
                    defaultValue={0}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="radius-bottom-y" className="sr-only">
                    Bottom radius Y
                  </FieldLabel>
                  <Input
                    id="radius-bottom-y"
                    placeholder="0"
                    defaultValue={0}
                  />
                </Field>
              </CollapsibleContent>
            </FieldGroup>
            <CollapsibleTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={isOpen ? "Show fewer fields" : "Show more fields"}
                />
              }
            >
              {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
      </Card>
    )
  },
}

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] }

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    items: [
      {
        name: "ui",
        items: [
          { name: "button.tsx" },
          { name: "card.tsx" },
          { name: "dialog.tsx" },
          { name: "input.tsx" },
          { name: "select.tsx" },
          { name: "table.tsx" },
        ],
      },
      { name: "login-form.tsx" },
      { name: "register-form.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
  },
  {
    name: "hooks",
    items: [
      { name: "use-media-query.ts" },
      { name: "use-debounce.ts" },
      { name: "use-local-storage.ts" },
    ],
  },
  {
    name: "types",
    items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
  },
  {
    name: "public",
    items: [{ name: "favicon.ico" }, { name: "logo.svg" }, { name: "images" }],
  },
  { name: "app.tsx" },
  { name: "layout.tsx" },
  { name: "globals.css" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "README.md" },
  { name: ".gitignore" },
]

// Upstream rotates the chevron on Radix's `data-[state=open]`; Base UI sets
// `data-panel-open` on the trigger instead.
function FileTreeNode({ item }: { item: FileTreeItem }) {
  if ("items" in item) {
    return (
      <Collapsible>
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
            />
          }
        >
          <ChevronRightIcon className="transition-transform group-data-panel-open/button:rotate-90" />
          <FolderIcon />
          {item.name}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 ml-5">
          <div className="flex flex-col gap-1">
            {item.items.map((child) => (
              <FileTreeNode key={child.name} item={child} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="link"
      size="sm"
      className="w-full justify-start gap-2 text-foreground"
    >
      <FileIcon />
      <span>{item.name}</span>
    </Button>
  )
}

export const FileTree: Story = {
  render: () => (
    <Card className="w-[16rem] gap-2" size="sm">
      <CardHeader>
        <Tabs defaultValue="explorer">
          <TabsList className="w-full">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="settings">Outline</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {fileTree.map((item) => (
            <FileTreeNode key={item.name} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  ),
}
