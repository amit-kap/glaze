# Glaze architecture — Nova + your changes

Status: proposed architecture, 2026-10-23. This document defines the new direction; the current code has not yet been migrated.

## Purpose

Glaze makes shadcn components easy to customize.

Nova is the default setup. A project changes the parts it needs: colors, fonts, sizes, corners, shadows and motion. The components keep working the same way.

**A custom theme is Nova plus your changes.**

## Principles

1. **One complete default.** Nova provides a working value for everything.
2. **Save only changes.** A customization does not copy the entire theme.
3. **Predictable effects.** Each shared setting affects the same component properties in every customization.
4. **Simple controls first.** Users work with familiar names, not token tiers.
5. **Local exceptions stay local.** A component adjustment changes that component only.
6. **Reset removes a change.** The value returns to its shared default, rather than saving another fixed value.
7. **Preserve behavior.** Customization does not change keyboard support, focus handling, accessibility semantics or component APIs.

## What stays underneath

| Part | Responsibility |
| --- | --- |
| Base UI | Interaction, focus, keyboard handling and accessibility primitives. |
| shadcn | Component structure, composition and variants. |
| Glaze | Nova defaults, shared appearance settings and optional component adjustments. |
| Project | Its saved changes and application-specific layout. |

Components are written once. Appearance flows through the shared settings; projects do not need to restyle each component.

## How customization works

```text
Nova defaults + project changes
               ↓
       shared appearance values
               ↓
          components
               ↑
   optional component adjustments
```

The implementation can still use CSS custom properties and derived values. Users do not need to learn those layers to customize a button or a page.

There is one set of derivation rules for every project. Theme names never select different formulas or secretly replace shared outputs.

### Example: changing the brand

1. Nova supplies the default brand color.
2. The project chooses blue.
3. Brand surfaces follow blue. Primary actions follow too, unless Primary has been set separately.
4. Resetting Brand removes that change and restores Nova's brand color for the active mode.

The same relationship applies in every project.

### Example: adjusting one component

1. Shared control corners apply to buttons, inputs and selects.
2. A project explicitly gives buttons pill-shaped corners.
3. Inputs and selects continue following shared control corners.
4. Resetting the button adjustment makes buttons follow shared control corners again.

This exception is visible under Buttons. It does not change the shared corner rule.

## Customization sections

Storybook, the customization UI and this document use this order.

### 1. Colors

The colors of surfaces, content and interaction.

| Setting | What it changes |
| --- | --- |
| Page | Main page background and its related quiet surface colors. |
| Surface | Cards, menus and floating panel backgrounds. |
| Overlay | The translucent backdrop behind dialogs, sheets and drawers. |
| Main text | Main text and icons; also contributes to neutral fills. |
| Secondary text | Supporting labels, helper text and metadata. |
| Border | Shared dividers and outlines. |
| Brand | Brand identity color for explicitly branded surfaces and accents. |
| On brand | Text and icons on brand-colored fills. |
| Primary | Primary actions, checked controls, selection tints and focus colors. Follows Brand unless set separately. |
| On primary | Text and icons on primary fills. Follows On brand unless set separately. |
| Danger | Errors and destructive actions. |
| Warning | Conditions needing attention. |
| Success | Positive outcomes. |
| Information | Informational states. |
| Chart colors 1–5 | Available colors for chart series. |

Shared colors may be calculated from more than one setting. Those relationships are fixed and documented once. A quiet background can mix Page and Main text; every customization uses the same rule.

Do not pin derived colors to separate literals inside named themes. If a property needs independent customization, make it an explicit setting with one consistent rule, or a visible component adjustment.

Mixing percentages are implementation defaults, not a required part of the basic editing experience.

#### Brand and Primary

Two separate variables with different jobs:

| Variable | Job | Default |
| --- | --- | --- |
| `--brand` | Brand identity color. | Nova's brand color. |
| `--primary` | Main interaction color. | `var(--brand)` |
| `--brand-ink` | Text and icons on Brand. | Nova's on-brand color. |
| `--primary-foreground` | Text and icons on Primary. | `var(--brand-ink)` |

For example, Brand can be purple while Primary is black. Branded surfaces stay purple; primary buttons and checked controls use black.

The Primary setting offers **Follow Brand** or **Custom**. Changing Brand updates Primary only while linked. Resetting Primary restores the link. This is an explicit shared setting, not a hidden theme override.

Primary tints, primary borders, selection colors and focus rings derive from `--primary`, not directly from `--brand`. Brand-specific surfaces use `--brand`. Components use the color matching their role.

On primary has its own **Follow On brand** or **Custom** choice. When Primary is set separately, show its text contrast so the user can choose a readable On primary color. Resetting Primary does not silently erase a separate On primary change.

Store only custom values, independently for light and dark. Omit linked values from saved changes so the relationship survives export and reload.

### 2. Typography

How text looks and occupies space.

| Setting | What it changes |
| --- | --- |
| Body font | Body text and interface labels. |
| Heading font | Elements using the heading family. Follows Body font unless changed. |
| Mono font | Code and aligned data. |
| Display | Prominent heading size and line spacing. |
| Heading | Section heading size and line spacing. |
| Title | Compact title size and line spacing. |
| Body | Main interface text size and line spacing. |
| Caption | Supporting text size and line spacing. |
| Micro | Small keycaps and compact labels. |
| Normal, Medium, Strong | Three text weights. |

Keep size and line spacing together. Font family, size and weight remain separate choices.

### 3. Spacing & size

How much room elements occupy.

| Setting | What it changes |
| --- | --- |
| Spacing | Shared padding, gaps and spacing-based dimensions. |
| Control height | Standard button, input and select height. Other sizes follow fixed offsets. |
| Density | Comfortable or Compact spacing and control sizes. |

Density is a preview/runtime setting. It does not change fonts or corner radii, and switching density does not rewrite saved customization values.

### 4. Corners

The roundness of elements.

| Setting | What it changes |
| --- | --- |
| Base radius | Default roundness across the interface. |
| Items | Menu items and other small elements. |
| Controls | Buttons, inputs, selects and toggles. |
| Floating panels | Menus, popovers and dropdown panels. |
| Containers | Cards and larger containers. |

Families follow the base radius by default. A family may explicitly use its own radius or a pill shape. The rule is always the same: **Follow base** or **Custom**. A custom family setting is visible, never hidden in a preset.

Changing the base radius affects only families that follow it. The UI shows that before the user edits it. Resetting a family restores the link, not a copied radius.

### 5. Shadows

The depth of surfaces.

| Setting | What it changes |
| --- | --- |
| Raised | Slightly lifted surfaces. |
| Floating | Menus and floating panels. |
| Modal | Prominent overlays. |

Assign component roles once and keep them consistent across customizations. A component can explicitly choose no shadow or a custom shadow in Component details.

### 6. Motion

The pace and feel of transitions.

| Setting | What it changes |
| --- | --- |
| Fast, Base, Moderate, Slow | Four shared transition durations. |
| Linear | Constant speed. |
| Standard | Smooth acceleration and deceleration. |
| Emphasized | Expressive movement with possible overshoot. |
| Enter | Arrival that slows to a stop. |
| Exit | Departure that accelerates away. |
| Spring | Movement that overshoots and settles. |

Components select timing by role. Exits may use a fixed share of entrance timing. Reduced-motion preferences apply automatically, including to custom timings; they are not a theme the user must build.

### 7. Component details

Optional changes that apply to one component.

Examples: button corners, input fill, card shadow or drawer timing.

Each adjustment shows its shared/default source and its current value. Reset removes the adjustment. Add an adjustment only when a shared setting cannot express the intended result.

The default experience should work without opening this section.

## Defaults and saved changes

### Start fresh or load a theme

Every new session starts with Nova and no custom changes. The user can load a saved theme to continue working on it.

| Action | Behavior |
| --- | --- |
| Start fresh | Use Nova with an empty set of changes. |
| Load theme | Replace the current customization with the saved JSON changes applied to Nova. Do not merge with the previous theme. |
| Edit | Change the loaded theme's working values. |
| Save | Save the current changes relative to Nova to the same theme. |
| Save a copy | Save those changes as a new theme, leaving the original intact. |
| Reset a setting | Remove its custom value and restore Nova's default or the current shared rule. |
| Reset all | Remove every custom value and return to Nova. |

A **preset is simply a saved theme**. It uses the same JSON format and loading behavior as any user-saved theme. There is no separate preset layer, parent-theme chain or tracking of which preset a value came from.

Loaded values and newly edited values form one set of changes relative to Nova. Reset does not return a value to its last saved value; reloading the saved theme restores the saved version. Starting fresh or loading another theme prompts the user to save or discard any unsaved edits.

### Resolve the current theme

Resolve values in this order:

1. Load Nova defaults for the active light or dark mode.
2. Apply the project's shared changes.
3. Calculate shared outputs using the same formulas for every project.
4. Apply explicit component adjustments.
5. Apply runtime density and reduced-motion rules where relevant.

A custom value can be a literal or a supported choice such as Pill. Customizations cannot replace the shared derivation rules.

A saved customization is a **JSON file** containing only the project's changes. Nova remains the base. It contains:

- A name and format version.
- Shared changes to typography, spacing, corners, shadows and motion.
- Color changes for light and dark mode separately.
- Optional component adjustments, with mode-specific values where needed.

Missing values inherit defaults. Saving, loading and exporting preserve that inheritance. Do not flatten all calculated values into fixed overrides.

Resetting a shared setting removes the project's value and restores Nova's default rule. Resetting a component adjustment restores its connection to the current shared settings.

Defaults belong to the installed Glaze version. Pinning the package version makes an inherited appearance reproducible; changes to defaults must be documented in releases.

### Save JSON, export CSS

| Action | Result |
| --- | --- |
| Save | Write the editable customization to JSON. |
| Open | Read and validate JSON, then replace the current customization with its changes applied to Nova. |
| Export CSS | Generate a CSS file for the application from the saved changes. |
| Reset | Remove a JSON setting and regenerate the preview/export. |

JSON is the source of truth. CSS is generated output; users do not maintain both. An application loads Glaze's defaults and the exported CSS, with no JSON parser required at runtime.

The JSON format has a versioned schema, a name, shared changes, separate light/dark changes and component adjustments. Keys map to the supported settings catalog. Values are validated before preview or export; arbitrary derived-token overrides are not part of the format.

An omitted setting means **follow the default or shared source**. For example, omitting Primary makes it follow Brand; supplying Primary gives it its own color. Save only the custom choice, not a copy of the currently resolved value. A custom value remains explicit even if it happens to equal today's default.

The CSS generator preserves those links and mode boundaries. It emits only the overrides needed to represent the changes, including any required selectors or link declarations; it does not freeze all resolved tokens into literals. Import the generated stylesheet after Glaze's defaults.

Opening the same JSON must restore the same choices, and exporting it must produce equivalent CSS consistently. Manual edits to generated CSS do not update the JSON. Importing arbitrary CSS into the editor is outside the initial scope.

## Light and dark

Nova supplies both modes. A project may customize either mode without having to define the other.

Editing a light-mode color changes light mode only. The UI always makes the edited mode clear. Automatically generating matching dark colors is optional assistance, not an implicit side effect.

Color relationships stay consistent between modes. Mode-specific default values or mixing strengths may differ, but named themes cannot introduce alternate dependencies.

## Storybook and editing UI

The main row contains:

- One friendly name.
- One short explanation of what changes.
- The current value and a useful preview.

Show CSS names in details or copy actions. Do not repeat names such as “Surface — --surface” in every main row. Do not label ordinary settings “Input” or “Direct.”

An expandable **Changes** list shows the properties that currently follow the setting. If a family or component is customized separately, show it under **Set separately** instead of counting it as affected.

Technical details can show the source token, formula and consumers. They must describe actual component usage, not suggest that every selected state or every border uses one token.

Use one maintained settings catalog for order, names, short descriptions and dependency metadata. Verify that metadata against the CSS and component usage when changing the implementation.

## Scope

Glaze customizes appearance. It does not redesign application layouts, change component behavior or guarantee exact copies of every shadcn style.

Nova is the starting appearance. Existing named themes may become saved themes containing ordinary, visible changes to Nova. These presets use the same format and behavior as user-saved themes, with no separate provenance or inheritance layer. They do not need separate rules or exact visual preservation.

## Moving from the current implementation

This is a migration plan, not a statement that the changes already exist.

1. Record Nova's current appearance in both modes and densities as a comparison baseline.
2. Inventory shared settings, derived outputs and existing theme/component overrides.
3. Establish one derivation contract. Remove hidden system pins; choose Nova input defaults that produce the intended base appearance.
4. Where a necessary visual choice cannot be represented, add a small explicit setting rather than a theme-specific exception.
5. Make family and component exceptions visible and resettable. Implement versioned JSON save/open and CSS generation that preserve links and mode-specific changes.
6. Convert useful named themes to saved-theme JSON files using the same load/save flow as user themes. Keep existing theme imports working during a documented transition; do not silently remove them.
7. Update Storybook, the customization UI and documentation to the simpler model.
8. Verify a small set of representative changes: brand, page color, font, control height, base radius and one component adjustment. Check reset, light/dark, density and reduced motion.

Exact Nova parity may conflict with removing the old pinned values. Record any visible difference and review it before adopting the new default. Do not reintroduce hidden exceptions just to hide that difference.

## Success criteria

- Nova works with no custom configuration.
- Every new session starts from Nova; loading a saved theme replaces the current customization.
- Presets and user themes share one format, without a separate preset or provenance layer.
- A project saves only the settings it changed.
- JSON is the editable source; generated CSS works directly in the application.
- Save/open preserves explicit choices and inherited links.
- A shared change has predictable effects across components and presets.
- Separate adjustments are visible, intentional and resettable.
- Reset restores inheritance.
- A user can customize Glaze without understanding its internal token layers.
