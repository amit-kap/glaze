import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  BookOpenCheckIcon,
  FileTextIcon,
  GitBranchIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@amit-kap/glaze/components/marker"
import { Spinner } from "@amit-kap/glaze/components/spinner"
import { Toaster, createToastManager } from "@amit-kap/glaze/components/toast"

// Stories follow the upstream shadcn/ui (base-nova) Marker examples:
// https://ui.shadcn.com/docs/components/base/marker
const meta = {
  title: "Components/Marker",
  component: Marker,
  subcomponents: { MarkerContent, MarkerIcon },
  parameters: {
    docs: {
      description: {
        component:
          'A small inline note in a conversation or activity feed, such as a status line, a divider or an event. Set `role="status"` for live updates.',
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
    variant: {
      control: "inline-radio",
      options: ["default", "separator", "border"],
    },
  },
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
    </div>
  ),
}

// --- Variants -------------------------------------------------------------

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Marker>
        <MarkerContent>A default marker for inline notes.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>A separator marker</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>A border marker for row boundaries.</MarkerContent>
      </Marker>
    </div>
  ),
}

export const Separator: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {["Today", "Worked for 42s", "Conversation compacted"].map((label) => (
        <Marker key={label} variant="separator">
          <MarkerContent>{label}</MarkerContent>
        </Marker>
      ))}
    </div>
  ),
}

export const Border: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Marker variant="border">
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </div>
  ),
}

// --- States ---------------------------------------------------------------

export const Status: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Running tests</MarkerContent>
      </Marker>
    </div>
  ),
}

// Add `shimmer` to the content for in-progress text.
export const Shimmer: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Marker role="status">
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Reading 4 files</MarkerContent>
      </Marker>
    </div>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
      <Marker className="flex-col">
        <MarkerIcon>
          <BookOpenCheckIcon />
        </MarkerIcon>
        <MarkerContent>Syncing completed</MarkerContent>
      </Marker>
    </div>
  ),
}

const markerToast = createToastManager()

// Use `render` to make a marker a link or a button.
export const LinksAndButtons: Story = {
  render: () => (
    <Toaster toastManager={markerToast}>
      <div className="flex flex-col gap-8">
        <Marker render={<a href="#links-and-buttons" />}>
          <MarkerIcon>
            <GitBranchIcon />
          </MarkerIcon>
          <MarkerContent>View the pull request</MarkerContent>
        </Marker>
        <Marker
          render={
            <button
              type="button"
              className="transition-colors hover:text-foreground"
              onClick={() =>
                markerToast.add({ title: "You clicked the revert button" })
              }
            />
          }
        >
          <MarkerIcon>
            <RotateCcwIcon />
          </MarkerIcon>
          <MarkerContent>Revert this change</MarkerContent>
        </Marker>
      </div>
    </Toaster>
  ),
}
