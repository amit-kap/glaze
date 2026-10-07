import type { Meta, StoryObj } from "@storybook/react-vite"
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
} from "@amitka/glaze/components/attachment"
import { Spinner } from "@amitka/glaze/components/spinner"
import { FileTextIcon, TriangleAlertIcon, XIcon } from "lucide-react"

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
          "Displays a file or media attachment with upload state, preview and actions.",
      },
    },
  },
  argTypes: {
    state: {
      control: "select",
      options: ["idle", "uploading", "processing", "error", "done"],
    },
    size: { control: "radio", options: ["default", "sm", "xs"] },
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
  args: { state: "done", size: "default", orientation: "horizontal" },
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia>
        {args.state === "uploading" || args.state === "processing" ? (
          <Spinner />
        ) : args.state === "error" ? (
          <TriangleAlertIcon />
        ) : (
          <FileTextIcon />
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>
          {args.state === "error" ? "Upload failed" : "PDF · 2.4 MB"}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove">
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  ),
}

export const Uploading: Story = { ...Default, args: { state: "uploading" } }
export const Error: Story = { ...Default, args: { state: "error" } }

export const Image: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Attachment {...args}>
      <AttachmentMedia variant="image">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=300&q=80"
          alt="Preview"
        />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>sunset.jpg</AttachmentTitle>
        <AttachmentDescription>JPG · 840 KB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger aria-label="Open sunset.jpg" />
    </Attachment>
  ),
}

export const Group: Story = {
  render: () => (
    <AttachmentGroup className="w-md">
      {["brief.pdf", "notes.md", "budget.xlsx", "logo.svg"].map((name) => (
        <Attachment key={name} size="sm">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      ))}
    </AttachmentGroup>
  ),
}
