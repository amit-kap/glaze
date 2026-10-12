import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  FileCodeIcon,
  FileSearchIcon,
  FileTextIcon,
  FileWarningIcon,
  RefreshCwIcon,
  TableIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@amit-kap/glaze/components/attachment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amit-kap/glaze/components/dialog"
import { Spinner } from "@amit-kap/glaze/components/spinner"

// Stories follow the upstream shadcn/ui (base-nova) Attachment examples:
// https://ui.shadcn.com/docs/components/base/attachment
const meta = {
  title: "Components/Attachment",
  component: Attachment,
  subcomponents: {
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays a file or image attached to a message or form, with its upload `state`, a `size`, and optional actions. `AttachmentTrigger` makes the whole card clickable.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-sm">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["idle", "uploading", "processing", "error", "done"],
    },
    size: { control: "inline-radio", options: ["default", "sm", "xs"] },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj<typeof meta>

const images = [
  {
    name: "workspace.png",
    meta: "PNG · 820 KB",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
    alt: "Workspace",
  },
  {
    name: "desk-reference.jpg",
    meta: "JPG · 1.1 MB",
    src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80",
    alt: "Desk",
  },
  {
    name: "office-reference.jpg",
    meta: "JPG · 940 KB",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80",
    alt: "Office",
  },
]

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <AttachmentGroup>
        {images.map((image) => (
          <Attachment key={image.name} orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={image.src} alt={image.alt} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{image.name}</AttachmentTitle>
              <AttachmentDescription>{image.meta}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment className="w-full" {...args}>
        <AttachmentMedia>
          <FileCodeIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
          <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove message-renderer.tsx">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  ),
}

// --- Sizes ----------------------------------------------------------------

const sizeRows: {
  size: "default" | "sm" | "xs"
  title: string
  meta?: string
}[] = [
  { size: "default", title: "Default attachment", meta: "PDF · 2.4 MB" },
  { size: "sm", title: "Small attachment", meta: "PDF · 2.4 MB" },
  { size: "xs", title: "Extra small attachment" },
]

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {sizeRows.map((row) => (
        <Attachment key={row.size} size={row.size} className="w-full">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{row.title}</AttachmentTitle>
            {row.meta && (
              <AttachmentDescription>{row.meta}</AttachmentDescription>
            )}
          </AttachmentContent>
        </Attachment>
      ))}
    </div>
  ),
}

// --- States ---------------------------------------------------------------

const stateRows: {
  state: "idle" | "uploading" | "processing" | "error" | "done"
  title: string
  meta: string
  icon: LucideIcon | "spinner"
  removeLabel: string
  retry?: boolean
}[] = [
  {
    state: "idle",
    title: "selected-file.pdf",
    meta: "Ready to upload",
    icon: ClockIcon,
    removeLabel: "Remove selected-file.pdf",
  },
  {
    state: "uploading",
    title: "design-system.zip",
    meta: "Uploading · 64%",
    icon: "spinner",
    removeLabel: "Cancel upload",
  },
  {
    state: "processing",
    title: "market-research.pdf",
    meta: "Processing document",
    icon: FileTextIcon,
    removeLabel: "Remove market-research.pdf",
  },
  {
    state: "error",
    title: "financial-model.xlsx",
    meta: "Upload failed. Try again.",
    icon: FileWarningIcon,
    removeLabel: "Remove financial-model.xlsx",
    retry: true,
  },
  {
    state: "done",
    title: "uploaded-report.pdf",
    meta: "Uploaded · 1.8 MB",
    icon: CheckIcon,
    removeLabel: "Remove uploaded-report.pdf",
  },
]

// `state` drives the border, shimmer and error styling.
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {stateRows.map((row) => (
        <Attachment key={row.state} state={row.state} className="w-full">
          <AttachmentMedia>
            {row.icon === "spinner" ? <Spinner /> : <row.icon />}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{row.title}</AttachmentTitle>
            <AttachmentDescription>{row.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {row.retry && (
              <AttachmentAction aria-label="Retry upload">
                <RefreshCwIcon />
              </AttachmentAction>
            )}
            <AttachmentAction aria-label={row.removeLabel}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

// `orientation="vertical"` with image media; the trigger opens the file.
export const Image: Story = {
  render: () => (
    <AttachmentGroup className="w-full">
      {images.map((image) => (
        <Attachment key={image.name} orientation="vertical">
          <AttachmentMedia variant="image">
            <img src={image.src} alt={image.alt} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{image.name}</AttachmentTitle>
            <AttachmentDescription>{image.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${image.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger
            render={
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${image.name}`}
              />
            }
          />
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
}

type GroupItem = { name: string; meta: string; icon?: LucideIcon; src?: string }

const groupItems: GroupItem[] = [
  { name: "briefing-notes.pdf", meta: "PDF · 1.4 MB", icon: FileTextIcon },
  { name: "workspace.png", meta: "PNG · 820 KB", src: images[0].src },
  { name: "customers.csv", meta: "CSV · 18 KB", icon: TableIcon },
  { name: "renderer.tsx", meta: "TSX · 12 KB", icon: FileCodeIcon },
]

export const Group: Story = {
  render: () => (
    <AttachmentGroup className="w-full">
      {groupItems.map((item) => {
        const Icon = item.icon

        return (
          <Attachment key={item.name} className="w-64">
            {item.src ? (
              <AttachmentMedia variant="image">
                <img src={item.src} alt={item.name} />
              </AttachmentMedia>
            ) : Icon ? (
              <AttachmentMedia>
                <Icon />
              </AttachmentMedia>
            ) : null}
            <AttachmentContent>
              <AttachmentTitle>{item.name}</AttachmentTitle>
              <AttachmentDescription>{item.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={`Remove ${item.name}`}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        )
      })}
    </AttachmentGroup>
  ),
}

// The trigger fills the card; actions stay clickable above it.
export const Trigger: Story = {
  render: () => (
    <Dialog>
      <Attachment className="w-full">
        <AttachmentMedia>
          <FileSearchIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>research-summary.pdf</AttachmentTitle>
          <AttachmentDescription>Open preview dialog</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Copy link">
            <CopyIcon />
          </AttachmentAction>
          <AttachmentAction aria-label="Remove research-summary.pdf">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
        <DialogTrigger
          render={
            <AttachmentTrigger aria-label="Preview research-summary.pdf" />
          }
        />
      </Attachment>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>research-summary.pdf</DialogTitle>
          <DialogDescription>
            The attachment trigger fills the card and opens the dialog, while
            the actions stay independently clickable above it.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
}
