import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  CornerDownLeftIcon,
  CreditCardIcon,
  FileCodeIcon,
  InfoIcon,
  LoaderIcon,
  MailIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
  EyeOffIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@amit-kap/glaze/components/dropdown-menu"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@amit-kap/glaze/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@amit-kap/glaze/components/input-group"
import { Kbd } from "@amit-kap/glaze/components/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@amit-kap/glaze/components/popover"
import { Spinner } from "@amit-kap/glaze/components/spinner"

// Stories follow the upstream shadcn/ui (base-nova) Input Group examples:
// https://ui.shadcn.com/docs/components/base/input-group
const meta = {
  title: "Components/Input Group",
  component: InputGroup,
  subcomponents: {
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Display additional information or actions to an input or textarea. Place addons with `InputGroupAddon` and its `align` prop: `inline-start`, `inline-end`, `block-start` or `block-end`.",
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
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  ),
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <Field data-disabled>
      <FieldLabel htmlFor="input-group-disabled">Search</FieldLabel>
      <InputGroup data-disabled>
        <InputGroupInput
          id="input-group-disabled"
          placeholder="Search..."
          disabled
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="input-group-invalid">Invalid Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="input-group-invalid"
          placeholder="Error"
          aria-invalid
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>
        This field contains validation errors.
      </FieldDescription>
    </Field>
  ),
}

// --- Align ----------------------------------------------------------------

export const InlineStart: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="inline-start-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput id="inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the start.</FieldDescription>
    </Field>
  ),
}

export const InlineEnd: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="inline-end-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="inline-end-input"
          type="password"
          placeholder="Enter password"
        />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  ),
}

export const BlockStart: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="block-start-input">Input</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput
            id="block-start-input"
            placeholder="Enter your name"
          />
          <InputGroupAddon align="block-start">
            <InputGroupText>Full Name</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Header positioned above the input.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="block-start-textarea">Textarea</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-start-textarea"
            placeholder="console.log('Hello, world!');"
            className="font-mono"
          />
          <InputGroupAddon align="block-start">
            <FileCodeIcon className="text-muted-foreground" />
            <InputGroupText className="font-mono">script.js</InputGroupText>
            <InputGroupButton size="icon-xs" className="ml-auto">
              <CopyIcon />
              <span className="sr-only">Copy</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Header positioned above the textarea.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
}

export const BlockEnd: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="block-end-input">Input</FieldLabel>
        <InputGroup className="h-auto">
          <InputGroupInput id="block-end-input" placeholder="Enter amount" />
          <InputGroupAddon align="block-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Footer positioned below the input.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="block-end-textarea">Textarea</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="block-end-textarea"
            placeholder="Write a comment..."
          />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/280</InputGroupText>
            <InputGroupButton variant="default" size="sm" className="ml-auto">
              Post
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          Footer positioned below the textarea.
        </FieldDescription>
      </Field>
    </FieldGroup>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithIcon: Story = {
  render: () => (
    <div className="grid gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <CreditCardIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <CheckIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <StarIcon />
          <InfoIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="grid gap-6">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" className="pl-0.5!" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter your username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Enter your message" />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground">
            120 characters left
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithButton: Story = {
  render: function Render() {
    const [isCopied, setIsCopied] = React.useState(false)
    const [isFavorite, setIsFavorite] = React.useState(false)

    return (
      <div className="grid gap-6">
        <InputGroup>
          <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copy"
              title="Copy"
              size="icon-xs"
              onClick={() => {
                void navigator.clipboard?.writeText("https://x.com/shadcn")
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
              }}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <Popover>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    variant="secondary"
                    size="icon-xs"
                    aria-label="Connection info"
                  />
                }
              >
                <InfoIcon />
              </PopoverTrigger>
              <PopoverContent align="start" className="flex flex-col gap-1">
                <p className="font-medium">Your connection is not secure.</p>
                <p>
                  You should not enter any sensitive information on this site.
                </p>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
          <InputGroupAddon className="pl-1.5 text-muted-foreground">
            https://
          </InputGroupAddon>
          <InputGroupInput id="input-secure" aria-label="URL" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Favorite"
              aria-pressed={isFavorite}
              onClick={() => setIsFavorite(!isFavorite)}
              size="icon-xs"
            >
              <StarIcon
                data-favorite={isFavorite}
                className="data-[favorite=true]:fill-primary data-[favorite=true]:stroke-primary"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Type to search..." />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">Search</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    )
  },
}

export const WithKbd: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithDropdown: Story = {
  render: () => (
    <div className="grid gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter file name" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  aria-label="More"
                  size="icon-xs"
                />
              }
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Copy path</DropdownMenuItem>
                <DropdownMenuItem>Open location</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter search query" />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<InputGroupButton variant="ghost" className="pr-1.5!" />}
            >
              Search In... <ChevronDownIcon className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Blog Posts</DropdownMenuItem>
                <DropdownMenuItem>Changelog</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithSpinner: Story = {
  render: () => (
    <div className="grid gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Searching..." />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Processing..." />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Saving changes..." />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Saving...</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Refreshing data..." />
        <InputGroupAddon>
          <LoaderIcon className="animate-spin" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">
            Please wait...
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithTextarea: Story = {
  decorators: [
    (Story) => (
      <div className="w-md">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <InputGroup>
      <InputGroupTextarea
        id="textarea-code"
        placeholder="console.log('Hello, world!');"
        className="min-h-[200px]"
      />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupText>Line 1, Column 1</InputGroupText>
        <InputGroupButton size="sm" className="ml-auto" variant="default">
          Run <CornerDownLeftIcon />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText className="font-mono font-medium">
          <FileCodeIcon />
          script.js
        </InputGroupText>
        <InputGroupButton
          className="ml-auto"
          size="icon-xs"
          aria-label="Refresh"
        >
          <RefreshCwIcon />
        </InputGroupButton>
        <InputGroupButton variant="ghost" size="icon-xs" aria-label="Copy">
          <CopyIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

// Any element can be the control: mark it with
// `data-slot="input-group-control"` to get the group's focus styles. Upstream
// uses react-textarea-autosize; `field-sizing-content` grows natively here.
export const CustomInput: Story = {
  render: () => (
    <InputGroup>
      <textarea
        data-slot="input-group-control"
        aria-label="Message"
        className="flex field-sizing-content min-h-16 w-full resize-none bg-transparent px-3 py-2.5 text-body outline-none"
        placeholder="Autoresize textarea..."
      />
      <InputGroupAddon align="block-end">
        <InputGroupButton className="ml-auto" size="sm" variant="default">
          Submit
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
