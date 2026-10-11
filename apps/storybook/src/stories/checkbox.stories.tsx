import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@amit-kap/glaze/components/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@amit-kap/glaze/components/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amit-kap/glaze/components/table"

// Stories follow the upstream shadcn/ui (base-nova) Checkbox examples:
// https://ui.shadcn.com/docs/components/base/checkbox
const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "A control that allows the user to toggle between checked and not checked. Compose it with `Field` and `FieldLabel` for a label, description and validation state.",
      },
    },
  },
  args: { "aria-label": "Accept terms and conditions" },
  argTypes: {
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// --- Basic ----------------------------------------------------------------

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

// --- States ---------------------------------------------------------------

export const Disabled: Story = {
  render: () => (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-disabled>
        <Checkbox
          id="toggle-checkbox-disabled"
          name="toggle-checkbox-disabled"
          disabled
        />
        <FieldLabel htmlFor="toggle-checkbox-disabled">
          Enable notifications
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const Invalid: Story = {
  render: () => (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          aria-invalid
        />
        <FieldLabel htmlFor="terms-checkbox-invalid">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

// --- Compositions ---------------------------------------------------------

export const WithLabel: Story = {
  render: () => (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
        <FieldLabel htmlFor="terms-checkbox-basic">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </FieldGroup>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <FieldGroup className="mx-auto w-72">
      <Field orientation="horizontal">
        <Checkbox
          id="terms-checkbox-desc"
          name="terms-checkbox-desc"
          defaultChecked
        />
        <FieldContent>
          <FieldLabel htmlFor="terms-checkbox-desc">
            Accept terms and conditions
          </FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}

// From upstream's demo: the whole card is the label, so clicking anywhere
// toggles the checkbox.
export const WithChoiceCard: Story = {
  decorators: [
    (Story) => (
      <div className="w-sm">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <FieldGroup className="max-w-sm">
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  ),
}

export const WithGroup: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">
        Show these items on the desktop:
      </FieldLegend>
      <FieldDescription>
        Select the items you want to show on the desktop.
      </FieldDescription>
      <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox id="hard-disks" name="hard-disks" defaultChecked />
          <FieldLabel htmlFor="hard-disks" className="font-normal">
            Hard disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="external-disks" name="external-disks" defaultChecked />
          <FieldLabel htmlFor="external-disks" className="font-normal">
            External disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="cds-dvds" name="cds-dvds" />
          <FieldLabel htmlFor="cds-dvds" className="font-normal">
            CDs, DVDs, and iPods
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="connected-servers" name="connected-servers" />
          <FieldLabel htmlFor="connected-servers" className="font-normal">
            Connected servers
          </FieldLabel>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

const tableData = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "User",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
]

export const WithTable: Story = {
  render: function Render() {
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
      new Set(["1"])
    )

    const selectAll = selectedRows.size === tableData.length

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedRows(new Set(tableData.map((row) => row.id)))
      } else {
        setSelectedRows(new Set())
      }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
      const newSelected = new Set(selectedRows)
      if (checked) {
        newSelected.add(id)
      } else {
        newSelected.delete(id)
      }
      setSelectedRows(newSelected)
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                id="select-all-checkbox"
                name="select-all-checkbox"
                aria-label="Select all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.id}
              data-state={selectedRows.has(row.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  id={`row-${row.id}-checkbox`}
                  name={`row-${row.id}-checkbox`}
                  aria-label={`Select ${row.name}`}
                  checked={selectedRows.has(row.id)}
                  onCheckedChange={(checked) =>
                    handleSelectRow(row.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}
