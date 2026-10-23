# Glaze architecture (V4)

Status: current direction, 2026-10-23. Supersedes V1–V3, which are archived in
`archive/`. This document describes the target; the colours are migrated, the
rest of the editor is not yet.

## Two parts, one project

**Glaze is Amit's component library, based on shadcn's Nova style.** It includes original components, components he has modified, and components he has added. Nova is its default appearance.

**Glaze Studio is the theme editor for Glaze.** It customizes the library's appearance, previews changes on its actual components, and saves or exports themes.

A theme changes how Glaze looks. The library, its component improvements and its behavior remain intact.

This is an incremental refactor of the existing project, not a new project or a rewrite from scratch.

## What stays

- The Glaze component package and its public component APIs.
- Amit's component edits, additions and interaction improvements.
- Nova as the only built-in theme, and the default appearance.
- Storybook as the component documentation and verification environment.
- Existing Studio implementation and design work that supports this model.
- Existing runtime features, including mode and density, until explicitly changed through a compatibility plan.

Do not replace Glaze components with stock shadcn components to simplify theming. Simplify the theme plumbing around the actual library.

## Responsibilities

| Part                  | Responsibility                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Glaze components      | Structure, behavior, variants and custom component features.                             |
| Nova defaults         | The default appearance of the Glaze library in light and dark.                           |
| Theme variables       | The supported appearance values consumed by Glaze.                                       |
| Settings catalog      | Editable variables, allowed values, defaults, short explanations and verified consumers. |
| Glaze Studio          | Editing, live preview, theme save/open and CSS export.                                   |
| Storybook             | Examples, documentation and checks for the actual Glaze components.                      |
| Consuming application | Uses Glaze and optionally applies an exported theme.                                     |

shadcn and Base UI remain the foundations where already used. Glaze owns the modifications and additions maintained in this repository.

## Theme model

```text
Glaze Nova defaults + theme changes → Glaze components
                                           ↑
                              previewed in Glaze Studio
```

A saved theme contains changes relative to Glaze's Nova defaults. It does not copy the component library or replace its behavior.

Prefer the existing shadcn variable names where they already express the property:

| Variable                                          | Short explanation                        |
| ------------------------------------------------- | ---------------------------------------- |
| `--background`                                    | Page background.                         |
| `--foreground`                                    | Main text and icons.                     |
| `--card`, `--card-foreground`                     | Card fill and content color.             |
| `--popover`, `--popover-foreground`               | Floating-panel fill and content color.   |
| `--primary`, `--primary-foreground`               | Primary action fill and content color.   |
| `--secondary`, `--secondary-foreground`           | Secondary action fill and content color. |
| `--muted`, `--muted-foreground`                   | Quiet surfaces and supporting text.      |
| `--accent`, `--accent-foreground`                 | Item highlights and their content color. |
| `--border`                                        | Shared borders and dividers.             |
| `--input`                                         | Input outline color.                     |
| `--ring`                                          | Keyboard-focus color.                    |
| `--destructive`                                   | Destructive action color.                |
| `--chart-1` through `--chart-5`                   | Chart series colors.                     |
| `--sidebar` and supported `--sidebar-*` variables | Sidebar appearance.                      |
| `--radius`                                        | Base corner roundness.                   |

The catalog must reflect Glaze's actual usage, including differences from stock shadcn. The table is a starting point, not a claim that it covers every Glaze property.

A theme sets this layer directly. Everything else a component reads is derived from it: `--popover` follows `--card`, `--card-foreground` and `--popover-foreground` follow `--foreground`, and the three mixing recipes produce `--muted`, `--secondary`, `--accent` and the sidebar fills. The only extra inputs are the ones shadcn has no name for: Brand and On brand, Overlay, and the four severity colours. They are plain values a theme sets; nothing is derived from them.

Remove unnecessary duplicate inputs such as an editor-facing `--canvas` that exists only to feed `--background`, or a private `--ink` that only aliases `--foreground`. The editor should change the meaningful variable directly.

Do not remove useful Glaze variables merely because they are not standard shadcn variables. Typography, spacing, control sizing, shadows, motion and custom components already have needs that the standard color variables do not cover.

## Simple, explicit relationships

Independent settings stay independent. Editing Primary must not silently recolor unrelated Ring, Accent or Sidebar settings.

Keep useful shared rules, such as a radius scale or density-adjusted control sizing. Give each rule one documented meaning across themes. Do not select alternate derivation formulas based on a theme's name.

Shared recipes are kept. Where Nova already mixes two colors to produce a third — quiet fills from the background and foreground, sidebar from the background — the recipe stays, is documented once, and applies in both modes. Editing Background then moves the quiet fills too, by the same rule in every theme.

A derived value is shown as following its sources, with its current result, and can be overridden like any other setting.

What is not allowed is stopping a recipe by pinning its result to a literal. Nova's light-mode pins of derived values are removed first, so one rule applies in light and dark.

If a component needs an independent property, expose a narrowly scoped component variable with a clear consumer. Do not turn every CSS declaration into an editor control.

For each existing rule, decide whether to keep it, replace it with a direct value, or expose a specific adjustment based on actual component needs. Make that decision before removing the rule.

## Brand and Primary

- **Brand** is an optional identity color, stored as `--brand`.
- **Primary** is the main interaction color, stored as `--primary`.
- Their text colors are `--brand-ink` and `--primary-foreground`.

By default the two are linked, exactly as the library already declares them: `--primary: var(--brand)` and `--primary-foreground: var(--brand-ink)`. Editing Brand then changes Primary too, which is what most themes want.

Separating them is optional and is one explicit choice in Studio ("Set separately"). It writes `--primary`, and `--primary-foreground` when the text color needs to differ, as ordinary values. Resetting Primary removes that value and restores the link. Resetting Primary must not erase a separate On primary value.

This needs no new variable, flag or link state. The link is the default declaration in the library; the separation is an override the theme mechanism already supports; reset is the absence of the override. The JSON stores a value only when the user set one.

Every value that follows the action color reads `--primary`, never `--brand`: primary tints, primary borders, selection, focus ring and sidebar primary. Brand-colored application surfaces read `--brand`. One rule: action color reads `--primary`, identity reads `--brand`. This makes the split complete when the user asks for it, and invisible when they don't.

A component or application surface uses Brand only when explicitly designed to do so. Document those consumers. Do not claim every standard component uses Brand.

Preserve existing variable names where practical. If the foreground name changes from `--brand-ink` to another name, provide an explicit migration rather than silently breaking themes.

## Studio editing sections

| Section           | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| Colors            | Page, surface, text, action, status, chart and sidebar colors. |
| Typography        | Supported font families, sizes, line spacing and weights.      |
| Spacing & size    | Supported spacing and control dimensions.                      |
| Corners           | Shared and specifically supported corner settings.             |
| Shadows           | Supported surface shadows.                                     |
| Motion            | Supported timings and easing choices.                          |
| Component details | Necessary adjustments that affect a specific component.        |

Expose a setting only when its effect is supported by the actual Glaze components and exported theme. Existing Glaze capabilities are the starting inventory; this is not a mandate to invent missing controls.

Each field shows one friendly name, one short explanation and its current value. CSS names and technical formulas belong in details or copy actions.

A **Used by** list identifies actual component properties affected by that variable. If a shared rule has separately configured consumers, distinguish them from the consumers that still follow it. Do not present every historical dependency as an active effect.

### The settings catalog

One catalog file lives in the Glaze package and is the only list of editable settings. For each: key, friendly name, one short explanation, value type, default source, scope and consumers. Studio's panels, Storybook's documentation and the CSS export all read it. Nothing keeps a second copy of these names or descriptions.

A small script derives the consumers by reading the components and recording which variable backs each property. Its output is reviewed and committed alongside the component change, so **Used by** describes the library rather than a hand-written list.

## Studio flow

1. Start a new session from Nova.
2. Optionally load a saved theme.
3. Edit settings and preview the changes on Glaze components.
4. Save the theme, save a copy, or export CSS.

A preset is simply a saved theme. It uses the same file format and behavior as a user-saved theme. There is no separate preset layer, parent-theme chain or preset-provenance tracking.

Loading a theme replaces the current customization; it does not merge it with the previously loaded theme. Offer Save or Discard before replacing unsaved work.

## Save JSON, export CSS

**JSON is the editable source. CSS is generated output.** Users do not maintain both manually.

A saved theme contains:

- Theme name and format version.
- A Glaze baseline/version reference for compatibility.
- Explicit shared changes where supported.
- Explicit light- and dark-mode changes.
- Supported component adjustments, if any.

The baseline reference identifies the library defaults the theme expects. It is not a record of which preset a value came from.

| Action      | Behavior                                                                               |
| ----------- | -------------------------------------------------------------------------------------- |
| Save        | Store the current changes in the browser's theme library.                              |
| Open        | Validate a theme JSON file and apply its changes to the supported Glaze Nova baseline. |
| Export JSON | Download the current theme as a JSON file.                                             |
| Save a copy | Duplicate the theme in the library without changing the original.                      |
| Export CSS  | Generate CSS representing the same changes.                                            |
| Reset field | Remove the selected override and use its remaining shared source or Nova default.      |
| Reset all   | Clear theme changes and return to Nova.                                                |

An omitted setting inherits its default. A custom value remains explicit even if it happens to equal today's default.

Reset does not restore a loaded theme's previous saved value. Reloading restores that saved version. Reset changes the working state; nothing is stored until Save is used.

### Where themes live

Studio runs in the browser and has no backend, so the first version stores themes locally and moves them as files.

- The working theme autosaves to local storage, so a refresh does not lose unsaved edits.
- **Save** writes the theme into local storage; **Your themes** lists what is there.
- **Export JSON** downloads the file; **Open** reads one back, by picker or drag and drop.
- Files are how themes are shared and kept; local storage is convenience, not the source of truth.

Sync across machines, hosted theme libraries and accounts are out of scope until a backend exists.

### Delivery

A project uses one theme, so exported CSS is written where the library's defaults already live:

```css
:root { … }
.dark { … }
```

Import it after the library's styles. It outranks Nova's zero-specificity defaults by specificity, so import order does not matter, and the app needs no attribute, provider or runtime code.

Studio applies the same declarations to its preview by writing them into a style element. Preview and export are therefore the same CSS; only the mounting point differs.

Switching between several themes inside a running app is out of scope for the first version. Storybook keeps its theme switch for development, because it loads many theme files at once; that is a development feature and not part of the export.

## Resolution and export

The editor resolves declarations in a predictable order:

1. Load Glaze's Nova defaults for the active mode.
2. Apply supported shared theme changes.
3. Apply supported mode-specific changes.
4. Apply explicit component adjustments in their documented scopes.
5. Let the library's retained CSS relationships and runtime rules resolve the rendered values.

The editor does not invent a second set of formulas to approximate the library. Preview and export use the same library defaults and changes.

Use a typed catalog to define which keys are allowed in each scope, what values they accept, their default sources and their consumers. Shared rules must state their dependencies explicitly. Validate imported JSON against this contract.

Export only the overrides needed to represent the theme. Preserve retained CSS links rather than flattening every computed value. Separate light and dark selectors so a light change cannot overwrite an untouched dark default.

Every generated file starts with a comment recording the theme format version and the Glaze baseline it was written against:

```css
/* Glaze theme v1 · baseline @amit-kap/glaze 0.4.0 */
```

CSS has no other place to record this, and exported themes outlive the version that produced them. If the installed Glaze is newer than the recorded baseline, the difference can be reported instead of drifting silently. The comment is inert; it does not affect the CSS.

A consuming app uses the compatible **Glaze library plus the exported CSS**. It does not need Studio or a runtime JSON parser. Existing theme-provider APIs may remain for choosing mode; applying an exported theme does not require them.

Manual edits to exported CSS do not update JSON. Importing arbitrary CSS into Studio is outside the initial scope.

## Preview, modes and runtime behavior

Preview the actual Glaze library, including custom components such as RevealButton and IconSwitch, alongside representative forms, cards, menus, dialogs, tables, charts and navigation.

Studio's interface keeps a stable appearance while the preview receives the edited theme. Scope the preview and its portals consistently; menus and dialogs must show the same theme as their triggers.

Nova supplies light and dark defaults. Editing one mode does not change the other automatically. Make the edited mode clear and show it in the preview.

Keep the library's existing density and reduced-motion behavior working during the refactor. Density selection, viewport width and preview screen are inspection/runtime state unless deliberately supported as saved theme settings. Do not confuse them with edits to spacing defaults.

Theme changes must preserve focus visibility, keyboard interaction, component state behavior and reduced-motion support. Color customization can affect contrast; show useful contrast feedback where applicable.

## Incremental refactor

Keep the current repository and package structure. Refactor in small, reviewable steps:

1. Record the current Glaze Nova appearance and behavior in light/dark and supported densities, including custom components.
2. Inventory variables, component consumers, redundant aliases and theme-specific overrides.
3. Build the typed settings catalog from that inventory. Identify the rules worth retaining and the exact compatibility changes needed.
4. Simplify one category at a time, starting with colors — including pointing every value that follows the action color at `--primary` instead of `--brand`, so the optional Brand/Primary split is decided in one place, and removing Nova's light-mode pins of derived values so each retained recipe applies in both modes. Preserve component APIs and modifications; review visible changes before adopting them.
5. Implement or adapt Studio's validated theme state, JSON save/open and CSS generation using that catalog.
6. Connect Studio previews and Storybook documentation to the same settings and actual Glaze components.
7. Verify exported CSS in a small application that imports Glaze. Compare it with Studio's preview.
8. Retire the named themes. Nova is the only built-in theme; a saved theme that named another one opens against Nova, with its values kept, and renamed or unsupported variables report what changed.

Do not restart the project, replace the library with stock shadcn, remove custom components, or retire the Glaze package as part of this refactor.

Do not assume old V2 or V3 configs are V4-compatible. Version and validate any conversion.

## Success criteria

- Glaze remains the component library Amit has built and customized.
- Nova remains its usable default appearance.
- Glaze Studio edits that library's themes and previews its real components.
- Settings have understandable, predictable effects.
- Brand and Primary can be different without hidden coupling.
- Saved themes reopen reliably; presets are ordinary saved themes.
- JSON stores changes; exported CSS reproduces the preview in a Glaze application.
- Exported CSS needs no runtime code, provider or attribute in the consuming app.
- A retained recipe behaves the same in light and dark, and a derived value that is overridden is visible as an override.
- Existing component behavior and consumers remain supported through the refactor.
