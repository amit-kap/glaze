# Glaze V3 — shadcn theme editor

Status: proposed direction, 2026-10-23. Supersedes V2 for future development. The current implementation has not yet been migrated.

## Purpose

**Glaze is an app for editing themes for shadcn components. That is all.**

Start with Nova, change the existing theme variables, preview real components, save the theme and export CSS for an application.

Glaze does not introduce another component library, token hierarchy or styling contract.

## Product flow

1. Open Glaze with Nova defaults.
2. Optionally load a saved theme.
3. Edit values and see the result immediately.
4. Save the theme as JSON, or save a copy.
5. Export CSS to use with shadcn components.

A preset is an ordinary saved theme. Loading it replaces the current theme; it does not introduce a parent or another inheritance layer.

## Architecture

| Part | Responsibility |
| --- | --- |
| shadcn components | The components being previewed and themed. |
| Nova baseline | A versioned snapshot of the selected shadcn setup and its default variables. |
| Settings catalog | Names, short descriptions, value types and known consumers of existing variables. |
| Editor state | The user's explicit changes and preview settings. |
| Preview | Real components using the baseline plus those changes. |
| JSON save/open | Store and restore the editable theme. |
| CSS export | Write the same changes as CSS declarations. |

```text
Nova baseline + saved changes → preview components
                         └──→ exported CSS
```

There is no Glaze input-to-system-token conversion. The editor writes the variable the component already uses.

For example, editing Page background changes `--background` directly. There is no intermediate `--canvas`.

## Editing variables directly

The variable names and defaults come from the selected shadcn setup. The catalog must be checked against that setup, rather than assuming every shadcn version or style exposes the same variables.

The main editing groups are:

| Group | Examples | What they change |
| --- | --- | --- |
| Page | `--background`, `--foreground` | Main background and content colors. |
| Surfaces | `--card`, `--card-foreground`, `--popover`, `--popover-foreground` | Card and floating-panel colors. |
| Actions | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground` | Primary and secondary action colors. |
| Quiet & highlighted | `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground` | Quiet surfaces, supporting text and highlighted items. |
| Borders & focus | `--border`, `--input`, `--ring` | Borders, input outlines and keyboard-focus color. |
| Destructive | `--destructive` | Destructive action color. |
| Charts | `--chart-1` through `--chart-5` | Available chart series colors. |
| Sidebar | The setup's `--sidebar-*` variables and `--sidebar` | Sidebar surfaces, content, actions and focus. |
| Corners | `--radius` | Base radius used by the setup's existing radius rules. |

Each exposed variable has one short explanation and its current value. Show a friendly label once; put the CSS name in details or a copy action.

Existing shadcn relationships remain intact. If its radius scale derives from `--radius`, the preview uses that scale. Glaze does not invent additional relationships between independent colors.

Changing Primary does not secretly change Ring, Accent, Sidebar primary or any other independent variable. Grouping fields in the UI does not link their values. A future “apply to several fields” action must explicitly show which fields it changes.

## Brand and Primary

Primary remains shadcn's `--primary`: the main action color.

An optional `--brand` stores a separate identity color. It is an application extension, not a standard shadcn control and not an alias for Primary. An optional `--brand-foreground` provides text color for application surfaces that use Brand.

Brand and Primary are independent. Editing either leaves the other unchanged. Standard shadcn components do not automatically consume Brand; the app or a clearly labeled brand preview must use it explicitly.

Export these optional variables only when the theme includes them. Do not add automatic Brand-to-Primary derivation or inheritance.

## Scope of controls

Start with the variables the chosen shadcn setup actually exposes.

Fonts, spacing, control heights, shadows and motion are not universally controlled by standard shadcn variables. Only expose a control when the preview components and exported CSS can genuinely support it.

Do not add a new token system or rewrite all components to make an editor field work. Additional capabilities are separate, deliberate features with clear application requirements.

There is no general per-component adjustment system in V3. A property that requires editing component classes belongs to application code unless a later feature explicitly supports it.

## Nova baseline

Use real shadcn components configured with Nova as the preview baseline. Do not use the existing Glaze-derived component styles as evidence of standard shadcn behavior.

The baseline records the source setup/version, required CSS bridge, component dependencies and defaults for both modes. This makes preview and export behavior reproducible.

Nova's values are defaults, not formulas Glaze needs to recreate. Fixed values are perfectly valid. There is no requirement to derive all colors from a smaller palette.

## Theme state

The editable state contains:

- Theme name and JSON format version.
- Baseline identifier/version.
- Explicit variable changes for light and dark mode.
- Optional supported shared changes, such as radius, where the baseline permits them.
- Optional Brand values.

Only supported catalog keys are editable. Validate values on load and before generating CSS. Do not treat imported strings as executable code or unrestricted stylesheets.

An omitted value uses the baseline. An explicitly saved value remains explicit even if it happens to equal the baseline today.

The baseline identifier is a compatibility reference, not preset provenance. There is no record of which preset a particular value came from.

## Save JSON, export CSS

| Action | Result |
| --- | --- |
| Save | Write the current changes to the theme's JSON file. |
| Open | Validate JSON and apply its changes to its supported Nova baseline. |
| Save a copy | Create another saved theme without changing the original. |
| Export CSS | Generate declarations for the same explicit changes. |
| Reset field | Remove the selected override; use a remaining shared value or the baseline. |
| Reset all | Clear all changes and return to Nova. |

JSON is the editable source. CSS is generated output. Users never need to maintain both manually.

The resolver is a merge, not a color-derivation engine:

```text
active values = baseline for mode + shared changes + changes for mode
```

Only keys explicitly allowed in each scope may appear there. Mode-specific changes win where both scopes are supported. Reset removes the selected declaration; if a shared change remains, it still applies and the UI must show that source.

Export only the declarations needed for the user's changes. Keep light and dark selectors separate so a light override cannot accidentally replace an untouched dark default. Preserve the baseline's existing CSS-variable relationships and bridge.

The application's shadcn setup must match the documented baseline requirements. No Glaze component package, runtime provider or JSON parser is required to use the exported CSS.

Manual edits to exported CSS do not update JSON. Importing arbitrary CSS into the editor is outside the initial scope.

## Modes and preview settings

Nova supplies light and dark defaults. Editing one mode does not automatically change the other.

The edited mode must be clear. The preview follows that mode so users see what they are changing.

Viewport size, selected preview screen and other inspection controls are editor state, not theme declarations. Do not retain the old Glaze density feature unless the selected shadcn setup supports equivalent behavior explicitly.

## Preview and documentation

Use a small, representative set of real components: buttons, fields, cards, menus, dialogs, tables, charts and a sidebar.

Preview styles must use the same baseline and overrides as the export. Avoid editor-only fixes that make the preview look correct while the exported theme behaves differently.

Each field can show **Used by** examples based on actual component usage. These are consumers of the variable, not a speculative list of derived tokens.

Storybook can remain a development and verification tool. Its documentation should describe the directly editable shadcn variables, not the previous Glaze token tiers.

The editor interface keeps its own stable styling so changing the theme does not unintentionally restyle the controls being used to edit it.

## Loading and compatibility

New sessions start from Nova. Users can load a saved theme explicitly.

Before replacing unsaved work, offer Save or Discard. Reset changes the working theme; it does not overwrite a saved file until Save is used.

Reject unsupported format versions or baseline identifiers with a clear message. Do not silently reinterpret an old Glaze config as a V3 theme. Conversion from older configs is a separate migration with explicit mappings and a report of unsupported settings.

## Migration from the existing project

1. Capture and pin the actual shadcn Nova baseline and its light/dark variables.
2. Build a direct-variable catalog with validated types and verified component consumers.
3. Implement the merge-based theme state, JSON save/open and CSS export.
4. Replace the preview's dependency on Glaze-derived styling with the selected shadcn setup.
5. Check that the same exported CSS produces the same appearance in a small independent shadcn application.
6. Rework the editor and Storybook around direct variables and short descriptions.
7. Convert useful existing themes only where their settings map cleanly. Report unsupported differences.
8. Retire the extra token layer and component-package direction through a documented transition. Existing consumers must not lose their working imports silently.

Do not implement the V2 derivation catalog or resolver as the foundation for V3.

## Success criteria

- Users edit the variables their shadcn components already use.
- Nova works immediately without a custom theme.
- Saved themes reopen reliably and contain only explicit changes.
- Brand and Primary can be different without hidden links.
- Reset behavior is visible and predictable.
- Exported CSS matches the preview in a compatible application.
- Glaze is useful as an editor without becoming a new component framework.
