# Glaze Studio

Status: plan, 2026-10-23. Written against V2 and updated for **V4**
(`glaze-architecture.md`). V4 is the only specification to implement against.

The showcase app becomes **Glaze Studio**: one place to pick a look, tune every Glaze input on real screens, and keep the result as a theme you can load again, share, or install. Mockups: Paper file `glaze`, page **studio** (artboards *Studio · Colors / Dashboard*, *Studio · Shape / Dashboard*, *Studio · Start*).

## What V4 changes for this plan

V4 keeps the shell, the screens, the library and the export sheet described
here. It changes the model underneath them:

- **One catalog, not a second token list.** Sections, groups, labels, notes,
  defaults and "used by" counts come from `packages/ui/src/theme/catalog.ts`.
  Studio renders the catalog; it does not keep its own copy of names or order.
- **No `--canvas`.** The page colour is `--background`, and it is a setting, not
  a derived value. Palette rows read Brand, On brand, Primary, On primary,
  Background, Surface, Ink, Secondary text, Border, Overlay.
- **Primary follows Brand.** `--primary` and `--primary-foreground` are editable
  settings whose defaults are Brand and On brand. "Separate actions from
  identity" sets `--primary`; "Follow brand" removes the declaration. It is one
  row in Changes, not a flag.
- **No pins.** Built-in themes no longer pin derived tokens; a theme sets inputs
  and the recipes produce the rest. A user override is still possible and still
  visible, but it is called an override and it belongs to the user's theme, not
  to Nova.
- **One theme per project.** No runtime whole-theme switching in exported CSS:
  the export is `:root` plus `.dark`. Split and the theme picker stay as editing
  aids inside Studio.
- **Every export carries a baseline.** The generated CSS starts with the same
  version and baseline header the package uses, so an exported file can be
  compared later.

Sections that survive unchanged in shape: Start, top bar, rail, panel layout,
canvas, Changes, Library, Export, the visual spec. Sections whose rows change:
Colors (catalog-driven, Background instead of Canvas, Primary row), Changes (no
Pinned tokens group), Parts (catalog groups), and the export preview (header,
`:root`/`.dark` only).

Status marks follow the other TODO files: 🚧 in progress, ✅ done awaiting review, 🟡 partly done, ⏭ not done (reason given).

## 1. Why

The current Customize panel is a settings form in a drawer: a column of label + control rows, six tabs in a scrolling strip, a floating bar over the content, and a 35-tile component zoo as the only preview. It has the right data model (inputs → derived tokens, config → CSS, library, share, changes) but the wrong shape for a design tool. A theme is judged on composed screens, controls should look like what they change, and the theme's identity (name, base, state) should be visible at all times.

Studio keeps every piece of logic built so far (`theme-builder/`, `control-panel/actions.ts`, `StudioActions`, `fromConfig`/`toConfig`, library store, share codec, token drill-down) and replaces the shell and the controls.

## 2. Principles

1. **Editor layout, not a drawer.** Tools left, canvas right, identity on top. The panel is a sibling of the canvas; nothing floats over the preview.
2. **Judge on screens.** The default preview is a composed page (dashboard, settings, login, chat). The component grid is one view among them.
3. **Controls look like what they change.** Corners as corners, shadows as shadows, fonts in their own face, easing as curves, colours as swatches.
4. **Always know where you are.** Name, base theme, change count, saved state, and undo are one glance away.
5. **Nothing is lost.** Every edit is undoable, every state is saveable, every saved theme round-trips through config.
6. **Same contract.** Studio writes only settings that are in the catalog, plus explicit overrides and component tokens, through `GlazeConfig`. It never edits components.

## 3. Information architecture

```
Start                      pick a base · open a saved theme · import · paste link
└── Studio
    ├── Top bar            identity · mode · density · undo/redo · Library · Share · Save · Export
    ├── Rail               Colors · Type · Shape · Motion · Parts · (Changes, with count)
    ├── Panel              the active section's controls (320px, resizable 280–480)
    └── Canvas
        ├── Canvas bar     Dashboard · Settings · Login · Chat · All components | inspect hint | width
        └── Stage          the chosen screen, themed live; Split shows light and dark side by side
Sheets                     Library (saved · import · share) · Export (CLI · files · CSS)
```

Routes (hash-based, no router dependency): `#/` Start, `#/studio`, `#/studio/<section>`, `#t=<share>` (existing share link, opens Studio with the theme loaded).

## 4. Screens

### 4.1 Start

Entry when there is no draft in storage, and reachable from the Glaze mark in the top bar.

- Headline "Start from a look." with the one-line explanation that every theme is Nova underneath.
- **Gallery**: the 9 built-in themes as 304px cards. Each card is a miniature in its own character (button pair, text card, input + switch) rendered with that theme's real tokens, plus name, one-line hint and brand/background/ink dots. Clicking opens Studio on that base with no changes.
- **Your themes**: saved themes from the library (dots, name, `base · N changes · age`, Open), plus a dashed drop zone for `glaze.config.json` or a generated `.css`.
- Actions: *Import config…* (file picker), *Paste share link*.

Implementation: the miniatures are real Glaze components inside a `[data-theme]` subtree per card. This is the first use of subtree theming; the cascade machinery already supports it.

### 4.2 Studio top bar (48px)

Left to right:

| Element | Behaviour |
|---|---|
| Glaze mark | Back to Start (confirms if unsaved changes) |
| Theme name | Inline-editable text; placeholder "Untitled theme" |
| `based on <Base>` chip | Click opens the base picker (popover with the 9 themes and hints); switching with changes pending confirms and clears, as today |
| `· N changes` | Click jumps to the Changes section; hidden at 0 |
| Light · Dark · Split | Segmented; Split renders the stage twice (light left, dark right) |
| Comfortable · Compact | Segmented density |
| Undo · Redo | History of `Custom` snapshots; ⌘Z / ⇧⌘Z; disabled at ends |
| Library | Opens the Library sheet |
| Share | Copies the share link, shows a toast; opens the Share tab if nothing is customised |
| **Save** ⌘S | Primary. Saves/updates in the library; label becomes *Saved* for 1.5s |
| Export | Opens the Export sheet |

The floating bottom bar is removed.

### 4.3 Rail (56px)

Vertical icon tabs with 10px labels: **Colors**, **Type**, **Shape**, **Motion**, **Parts**. Pinned to the bottom: **Changes** with a count badge. Active tab has a raised white pill. Keyboard: `1`–`6` switch sections when focus is not in a field.

### 4.4 Panel (320px default)

Each section has a title row (18px semibold) with a right-aligned context caption ("Editing light", "Applies to both modes"), then the controls. Sections are not scrolling tab strips: the panel scrolls vertically as one column. Panel width persists in `--panel-w` as today, min 280, max 480.

#### Colors

- **Palette list**: one row per colour setting, in catalog order: Brand, On brand, Primary, On primary, Background, Surface, Ink, Secondary text, Border, Overlay. Collapsed row = 24px swatch · name · hex. One row is expanded at a time (accordion) into a card:
  - 36px swatch, name, description of what it drives, hex, contrast badge against its pair (Brand↔On brand, Primary↔On primary, Background↔Ink, Surface↔Ink): AA / AAA / fail with the ratio in the tooltip.
  - Inline picker: saturation/value plane, hue strip, HEX | OKLCH toggle, text field, theme swatches. No popover.
  - **Feeds N tokens**: the drill-down built in `tabs/colors.tsx`, restyled as 26px rows: swatch, `--token` in mono, value or mix percent, and an `override` badge + reset when the theme sets the value itself. Header shows the count and "N overrides". Primary and On primary show "Follows Brand" until set.
- **Status** and **Charts** as collapsed dot rows that expand to the same row/card pattern.
- Mode: the panel edits the mode the stage is showing; in Split it edits light and shows a "Light / Dark" toggle in the title row.
- Brand ink keeps following Brand until edited (`inkAuto`), with a small "auto" tag.

#### Type

- **Family**: three rows (Sans, Heading, Mono). Each opens a list where every font name is rendered in its own face with a sample line ("The quick brown fox · 0123"). Heading has "Same as sans" first.
- **Scale**: the five steps as live specimens — the step name set at its own size and leading, with size and leading fields on the right. Dragging a step's size updates the specimen.
- **Weights**: three specimens ("Normal 400", "Medium 500", "Strong 600") with a 100–900 stepper each.

#### Shape

- **Radius**: corner chips `0 · 4 · 8 · 10 · 14 · Pill` drawn as actual corners, with a fine slider beneath; the value in mono on the right. "Derived per family" shows Item/Control/Floating/Container corners with their resolved px.
- **Controls**: two tactile cards, *Follow radius* and *Pill*.
- **Spacing**: a growing block scale (4 → 40px) for `space-base`, plus a segmented *Control height* (28 · 32 · 36 · 40) that sets `control-height`.
- **Elevation**: three cards wearing their shadows (Raised / Floating / Modal). Selecting a card opens the preset list (None · Subtle · Raised · Floating · Lifted · Deep · Deepest), each preset drawn as a shadow chip.

#### Motion

- **Durations**: Fast / Base / Moderate / Slow as four fields, with a preview strip where a dot travels each duration on hover.
- **Easing**: Standard / Emphasized / Enter / Exit as rows with an SVG curve thumbnail; the preset list shows curve thumbnails too (Standard, Decelerate, Accelerate, Overshoot, Snappy, Settle, Linear).
- **Fades** switch (`fade-scale`), and a note that reduced motion is honoured automatically.

#### Parts (component tokens)

Grouped by component, each group with a one-line hint and a live miniature of the part:

| Group | Token(s) | Control |
|---|---|---|
| Inputs | `input-fill` | Transparent · Filled · Muted, shown on a live input |
| Buttons | `button-radius-xs`, `button-radius-sm` | Item radius · Pill · Square, shown on xs/sm buttons |
| Cards | `card-shadow` | shadow chips, shown on a card |
| Checkbox | `checkbox-radius` | Item · Round · Square · Soft, shown on a checkbox |
| Textarea | `textarea-radius` | Control · Pill · Square |
| Toast | `toast-radius` | Follow · Pill · Square · Match container |

Overridden rows show a *Custom* badge and a reset.

#### Changes

The diff built in `tabs/changes.tsx`, kept as is: header "N changes on Base" + Reset all, groups (Colours light/dark, Overrides, Shape/type/motion, Options, Component tokens) with per-row reset, and the Config JSON collapsible. Adds an *Undo last* link at the top.

### 4.5 Canvas

- **Canvas bar**: screen tabs **Dashboard · Settings · Login · Chat · All components**; an inspect hint on the right ("Highlighting what Brand touches" while a colour row is expanded); a width toggle **390 · 768 · Fit**.
- **Stage**: the chosen screen inside a 12px-radius frame on a muted background. *Fit* fills the stage; 390/768 centre a fixed-width frame. Split renders two frames side by side, the right one inside `.dark`.
- **Screens** are composed from Glaze components, each ~150 lines:
  - *Dashboard*: app sidebar, page header with primary action, four stat cards, bar chart card, recent-orders table with a selected row.
  - *Settings*: a form page — profile fields, notification switches, danger zone, save bar.
  - *Login*: centred card with inputs, checkbox, primary button, link, OAuth buttons.
  - *Chat*: message scroller with bubbles, attachments, composer.
  - *All components*: the existing tile grid, with category chips (Actions, Inputs, Navigation, Overlays, Feedback, Data, Chat) to filter.
- **Inspect**: when a colour row is expanded, every element whose computed colour resolves from that input's derived tokens gets a 1.5px ring. Implementation: the screens mark elements with `data-tokens="primary ring"` where they use a token; the stage sets `data-inspect="brand"` and a stylesheet rings the matching elements (`[data-inspect="brand"] [data-tokens~="primary"]`). The `derives` map in `inputs.ts` gives input → tokens.

### 4.6 Library sheet

The dialog built in `library.tsx`, moved to a right-side sheet so the canvas stays visible: **Saved** (save/update, list with Load/rename/delete), **Import** (paste, file, drop), **Share** (link + copy). Unchanged behaviour.

### 4.7 Export sheet

Replaces the Install dialog: theme name, **Download** (`<name>.css` + `glaze.config.json`), the CLI command with copy, and a read-only CSS preview with a copy button. The CSS is `:root` plus `.dark` only, with no runtime code, and opens with the version and baseline header. States: invalid name shows the validation error inline.

## 5. State and data

Everything already exists in `apps/showcase/src/theme-builder` and `control-panel`; Studio adds history and routing.

| Concern | Where | Change |
|---|---|---|
| Draft (`base`, `custom`, `savedId`) | `control-panel/index.tsx`, store v3 | Add `history: Custom[]`, `cursor` for undo/redo; snapshot on every committed edit (not per keystroke: debounce text/slider by 300ms) |
| Config ↔ state | `theme-builder/config.ts` (`toConfig`, `fromConfig`) | None |
| Library | `custom-theme-store.ts` | None |
| Share | `theme-builder/share.ts` | None |
| Actions | `control-panel/actions.ts` (`StudioActions`) | Add `undo`, `redo`, `canUndo`, `canRedo`, `section`, `setSection`, `screen`, `setScreen`, `inspect`, `setInspect`, `split`, `setSplit`, `width`, `setWidth` |
| Resolved token probe | `customize-sidebar/index.tsx` | Move to a hook `useResolvedTokens(names, deps)`; in Split, probe inside both frames |
| Route | new `studio/route.ts` | Hash read/write; `#t=` keeps working |

Persistence keys: draft `glaze-showcase-custom-v3`, library `glaze-showcase-library-v1`, UI prefs (section, screen, width, split, panel width) in `glaze-studio-ui-v1`.

## 6. Visual spec

- **Type**: Geist. Panel title 18/600 −0.015em; labels 13/500; captions 12/400 muted; mono values 12 Geist Mono; rail labels 10/500.
- **Spacing**: 20px panel padding; 12px between groups; 8px inside a card; 4px between list rows.
- **Surfaces**: panel and top bar `background`; rail `sidebar`; canvas `muted`; stage frame `background` with `border` and a 12px container radius.
- **Selection**: active chip = 2px `foreground` border on `muted`; inactive = 1.5px `border-strong`.
- **Inspect ring**: 1.5px solid brand, 2px offset, plus a 12% brand wash on filled areas.
- **Shadows**: tool chrome uses `0 1px 2px rgb(0 0 0 / 0.06)` for raised pills only. Everything else flat.
- Dark mode of the tool chrome follows the mode switch (the tool is themed by Glaze too), except the stage, which follows Light/Dark/Split independently.

All of this is expressed with Glaze token utilities; `check:tokens` runs on `apps/showcase/src`.

## 7. Build plan

Each phase ships behind the existing app, is screenshot-reviewed (headless Chrome via `.shot.mjs`), passes `turbo typecheck`, `check:tokens`, eslint, and is committed separately. Work is delegated to subagents by file ownership; the coordinator wires integration points and reviews.

### Phase 1 — Shell  ⏭
Files: `apps/showcase/src/studio/{shell.tsx, top-bar.tsx, rail.tsx, panel.tsx, canvas.tsx, route.ts}`, `app.tsx`.
- New layout with top bar, rail, panel, canvas; remove the floating bar and drawer.
- Mount existing tabs into the panel by section; existing tile grid as the "All components" screen.
- Undo/redo history in `control-panel/index.tsx`; `StudioActions` extended.
- Hash routing; `#t=` share links still open the loaded theme.
Exit: feature parity with today in the new frame.

### Phase 2 — Screens and inspect  ⏭
Files: `apps/showcase/src/screens/{dashboard,settings,login,chat}.tsx`, `studio/stage.tsx`, `studio/inspect.css`.
- Four composed screens with `data-tokens` annotations.
- Width toggle, Split (nested `.dark`), inspect rings driven by the expanded colour row.
Exit: Dashboard default; Split and inspect working in all screens.

### Phase 3 — Visual controls  ⏭
Files: `customize-sidebar/tabs/{colors,typography,shape,motion,components}.tsx`, `fields.tsx`, new `fields/{corner-chips,shadow-chips,curve,font-list,specimen}.tsx`.
- Colors: accordion rows with inline picker, contrast badge, restyled drill-down.
- Shape: corner chips, control cards, block scale, elevation cards.
- Type: font list in own face, scale specimens, weight specimens.
- Motion: duration dots, curve thumbnails.
- Parts: live miniatures per group.
Exit: no `SelectRow` left in the panel except where a list is genuinely the right control (font families).

### Phase 4 — Start, Library sheet, Export sheet  ⏭
Files: `studio/start.tsx`, `customize-sidebar/library.tsx` (sheet), `studio/export.tsx`.
- Start with gallery (subtree-themed miniatures), Your themes, import/drop/paste.
- Library as a sheet; Export sheet replaces Install.
Exit: full loop — Start → tune → Save → reopen from Start; share link → Studio.

### Phase 5 — Polish  ⏭
- Keyboard: ⌘Z/⇧⌘Z, ⌘S, `1`–`6`, `Esc` closes sheets.
- Reduced motion, focus order, aria labels on all icon buttons, contrast of tool chrome in dark.
- Mobile: rail becomes a bottom bar, panel becomes a bottom sheet, canvas full width.
- Paper mocks updated for Type, Motion, Parts, Changes, Library, Export.

## 8. Out of scope (for now)

- Editing settings beyond colours (shape/motion overrides). The drill-down pattern extends to them later if needed.
- A server: themes stay in the browser and in files.
- Live collaboration or theme versioning beyond the library list.
- Generating screens for arbitrary user content.

## 9. Open questions

1. Panel side: left (as mocked) or right (as today)?
2. Start screen as a separate step, or the gallery inside Library with Studio as the landing page?
3. Should Split be a third mode button (as mocked) or a toggle beside Light/Dark?
4. Do the screens need a "Marketing" page, or is product chrome enough to judge a theme?
