# Paper kit index

Node IDs for every kit piece in the master Paper file **shadcn-comp-lib** (`01M2SEXJVQ6AGV316HJQ9W58S4`). Read this instead of walking the kit with Paper calls.

- A copy of the master keeps the same node IDs, so these IDs also work in any sketch file made from it. Clone with `<x-paper-clone node-id="…" />`.
- Only the component artboards are listed. Headers and group labels on each artboard are docs, not pieces.
- Indexed at master sync stamp `fb5cd2b`. When a piece is added or rebuilt in the master, update this file in the same change.

## Pages

| Page | ID |
|---|---|
| base-nova-neutral (kit) | `p-5-0` |
| icons · lucide | `p-7-0` |

## Tokens

The Tokens artboard is `IR-0`, and its sync stamp text is `IU-0`. Use the tokens as CSS variables; don't clone the artboard.

- **Color:** `--color-background`, `--color-foreground`, `--color-card(-foreground)`, `--color-popover(-foreground)`, `--color-primary(-foreground)`, `--color-secondary(-foreground)`, `--color-muted(-foreground)`, `--color-accent(-foreground)`, `--color-destructive`, `--color-border`, `--color-input`, `--color-ring`, `--color-chart-1…5` (neutral greys), `--color-sidebar-*`.
- **Type:** `--font-sans` (Geist), `--font-heading`. Geist Mono is available by name. Sizes: `--font-size-xs` 12, `--font-size-sm` 14, `--font-size-base` 16. Weights: `--font-weight-regular`, `-medium`, `-semibold`.
- **Radius:** `--radius-sm` 6, `-md` 8, `-lg` 10, `-xl` 14, `-2xl` 18, `-3xl` 22, `-4xl` 26.
- **Spacing:** `--spacing-2` 8, `-4` 16, `-6` 24.

## Components

### Button · `KY-0`

| Piece | ID |
|---|---|
| Button / default / default | `4Y-0` |
| Button / outline / default | `50-0` |
| Button / secondary / default | `52-0` |
| Button / ghost / default | `54-0` |
| Button / destructive / default | `56-0` |
| Button / link / default | `58-0` |
| Button / default / xs | `5G-0` |
| Button / default / sm | `5I-0` |
| Button / default / lg | `5M-0` |
| Button / outline / icon-xs (24) | `BZ-0` |
| Button / outline / icon-sm (28) | `CB-0` |
| Button / outline / icon (32) | `CN-0` |
| Button / outline / icon-lg (36) | `CZ-0` |
| Button / default / default / icon-start | `5U-0` |
| Button / outline / default / icon-end | `5Z-0` |
| Button / default / default / disabled | `6E-0` |

### Badge · `LF-0`

| Piece | ID |
|---|---|
| Badge / default | `LM-0` |
| Badge / secondary | `LO-0` |
| Badge / destructive | `LQ-0` |
| Badge / outline | `LS-0` |
| Badge / ghost | `LU-0` |
| Badge / link | `LW-0` |
| Badge / secondary / icon-start | `LY-0` |

### Input and Textarea · `M3-0`

All are 240 wide; set `width: 100%` on the clone where the code uses `w-full`.

| Piece | ID |
|---|---|
| Input / placeholder | `MA-0` |
| Input / filled | `MC-0` |
| Input / focus | `ME-0` |
| Input / disabled | `MG-0` |
| Input / invalid | `MI-0` |
| Textarea / placeholder | `MN-0` |

### Label · `MQ-0`

| Piece | ID |
|---|---|
| Label / default | `MZ-0` |
| Label / disabled | `N0-0` |

### Field · `RG-0`

| Piece | ID |
|---|---|
| Field / vertical | `RL-0` |
| Field / vertical / invalid | `RQ-0` |
| Field / horizontal / switch | `RV-0` |
| Field / horizontal / checkbox | `S1-0` |

### Select · `O5-0`

| Piece | ID |
|---|---|
| Select / trigger / placeholder | `OD-0` |
| Select / trigger / value | `OH-0` |
| Select / trigger / value / sm | `OL-0` |
| Select / open (trigger + content) | `OR-0` |
| Select / content | `OW-0` |

### Checkbox · `MR-0`

| Piece | ID |
|---|---|
| Checkbox / unchecked | `N8-0` |
| Checkbox / checked | `N9-0` |
| Checkbox / disabled | `NC-0` |
| Checkbox / invalid | `ND-0` |
| Checkbox / checked / label | `NE-0` |

### Switch · `MS-0`

| Piece | ID |
|---|---|
| Switch / off / default | `NQ-0` |
| Switch / on / default | `NS-0` |
| Switch / off / sm | `NU-0` |
| Switch / on / sm | `NW-0` |
| Switch / on / default / disabled | `NY-0` |
| Switch / off / default / label | `O0-0` |

### Separator · `O6-0`

| Piece | ID |
|---|---|
| Separator / horizontal | `PF-0` |
| Separator / vertical | `PI-0` |
| Separator / vertical / in row | `PG-0` |

### Avatar · `PN-0`

| Piece | ID |
|---|---|
| Avatar / image / default | `PT-0` |
| Avatar / fallback / sm | `PV-0` |
| Avatar / fallback / default | `PX-0` |
| Avatar / fallback / lg | `PZ-0` |
| Avatar / fallback / default / badge | `Q1-0` |
| Avatar / group | `Q4-0` |

### Tabs · `PO-0`

Each list has three tabs: active, normal and disabled. To use it as a 2-tab switcher or a segmented control, delete the disabled tab or set its `opacity` to 1, and reorder with `move_nodes`.

| Piece | ID |
|---|---|
| Tabs / default | `QI-0` |
| Tabs / line | `QP-0` |

### Alert · `QY-0`

| Piece | ID |
|---|---|
| Alert / default | `8-0` |
| Alert / destructive | `J-0` |
| Alert / default / action | `U-0` |

### Card · `QZ-0`

| Piece | ID |
|---|---|
| Card / login form / default | `1P-0` |
| Card / parts / default | `3T-0` |
| Card / simple / sm | `3Z-0` |

### Dialog · `R0-0`

| Piece | ID |
|---|---|
| Dialog / overlay (with content) | `RE-0` |
| Dialog / content | `2S-0` |

### Table · `S7-0`

| Piece | ID |
|---|---|
| Table / default | `SB-0` |
| Table / header row | `SC-0` |
| Table / row | `SL-0` |
| Table / row / selected | `SU-0` |
| Table / footer row | `TC-0` |
| Table / caption | `TH-0` |

### Sidebar · `TK-0`

| Piece | ID |
|---|---|
| Sidebar / panel (256 wide) | `TO-0` |
| Sidebar / header | `TP-0` |
| Sidebar / menu button / lg | `TQ-0` |
| Sidebar / input | `TY-0` |
| Sidebar / group | `U0-0` |
| Sidebar / group label | `U1-0` |
| Sidebar / menu button / active | `U3-0` |
| Sidebar / menu button / badge | `U8-0` |
| Sidebar / menu button / default | `UF-0` |
| Sidebar / menu button / hover | `UM-0` |
| Sidebar / menu sub | `UW-0` |
| Sidebar / footer | `V1-0` |

## Icons · `YN-0` on `icons · lucide`

Clone the SVG ID, not its cell. All icons are 16px with stroke 2 and stroke `var(--color-foreground)`. To recolor one, set `stroke` on its child paths.

| Icon | ID | Icon | ID |
|---|---|---|---|
| plus | `YU-0` | bell | `10F-0` |
| x | `Z0-0` | mail | `10L-0` |
| check | `Z6-0` | calendar | `10R-0` |
| chevron-down | `ZB-0` | trash | `10Z-0` |
| chevron-right | `ZG-0` | pencil | `118-0` |
| arrow-right | `ZL-0` | ellipsis | `11E-0` |
| search | `ZR-0` | log-out | `11L-0` |
| settings | `ZX-0` | info | `11S-0` |
| user | `103-0` | copy | `11Z-0` |
| house | `109-0` | menu | `125-0` |
| layers | `12Y-0` | archive | `13W-0` |
| database | `135-0` | focus | `143-0` |
| cloud | `13C-0` | arrow-down-wide-narrow | `14C-0` |
| server | `13H-0` | minus | `14L-0` |
| square-function | `13P-0` | maximize | `14Q-0` |

The second block (layers onward) was added after some sketch files were copied. In those copies the same icons were added by hand, so they have different IDs. Find them by name on the copy's icons page.

## Known gaps

These came up while sketching and cost extra calls. Add them to the master when a sketch next needs them.

| Need | Component in code | What sketches do today |
|---|---|---|
| Search field with a leading icon | `input-group.tsx` | Clone `Input`, insert `Icon / search`, move it first and recolor it (5 calls) |
| Segmented control, such as `1 · 2 · All` | `toggle-group.tsx` | Clone `Tabs / default`, then rename, reorder and re-enable tabs |
| Toolbar of icon buttons, such as zoom | `button-group.tsx` | Clone `Button / outline / icon` and clear each border |
| Ghost icon buttons (close, row actions) | `button.tsx` (`ghost` + `icon-*`) | Clone an outline icon button and set its border to transparent |
