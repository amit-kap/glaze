import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Field, FieldLabel } from "@amit-kap/glaze/components/field"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@amit-kap/glaze/components/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amit-kap/glaze/components/select"

// Stories follow the upstream shadcn/ui (base-nova) Pagination examples:
// https://ui.shadcn.com/docs/components/base/pagination
const meta = {
  title: "Components/Pagination",
  component: Pagination,
  subcomponents: {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Pagination with page navigation, next and previous links. Previous and Next hide their labels below the `sm` breakpoint.",
      },
    },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
}

// --- Variants -------------------------------------------------------------

export const Simple: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        {[1, 2, 3, 4, 5].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href="#" isActive={page === 2}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  ),
}

// Upstream renders PaginationPrevious/Next, whose labels only hide below
// `sm`; icon-sized links keep this icon-only at every width.
export const IconsOnly: Story = {
  render: () => (
    <div className="flex w-lg items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select defaultValue="25">
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Go to previous page">
              <ChevronLeftIcon />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" aria-label="Go to next page">
              <ChevronRightIcon />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
}
