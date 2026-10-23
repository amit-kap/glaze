# Glaze: Component Library Architecture

Glaze (`@amit-kap/glaze`) is my component library. The name is the architecture: a fixed form underneath, and a glaze on top that gives it colour, texture and finish. Themes are glazes.

This doc covers how the library is layered, how theming works, and the rules every component and theme must follow.

## Purpose

One component library shared by all my projects. Components are written once and contain no visual decisions. A project's look comes entirely from the theme it applies.

## Principles

1. **Theme over style.** Every visual decision that can be a token is a token. Component code keeps only structure and layout.
2. **Few inputs, many outputs.** A theme sets a small set of input values; everything else is derived from them.
3. **One contract.** Components use system or component tokens. Themes normally set inputs; documented system and component overrides capture exceptions.
4. **Every theme is complete.** A theme defines every required input for both light and dark.
5. **Dark is designed, not inverted.** Each theme sets its own dark inputs.
6. **Behaviour is never hand-built.** Interactive components sit on Base UI primitives.

## Layers

```
┌──────────────────────────────────────────────────┐
│ Theme       input tokens → derived system tokens │  runtime, swappable
├──────────────────────────────────────────────────┤
│ Component   structure + layout, reads tokens     │  code
├──────────────────────────────────────────────────┤
│ shadcn      anatomy (data-slot), variants (cva), │  code
│             semantic names, CLI                  │
├──────────────────────────────────────────────────┤
│ Base UI     focus, keyboard, ARIA, positioning,  │  dependency
│             state                                │
└──────────────────────────────────────────────────┘
```

The library has exactly one *style* (shadcn's Nova) as its starting point. Every style decision it contains (radius, heights, type, shadow, motion, colour) is lifted into tokens. What shadcn calls a style (Vega, Maia, Lyra, …) is expressed here as a theme.

## Token tiers

```
Tier 1  Inputs            set by themes           --brand, --radius, --motion-base
          │ derived in tokens.css
Tier 2  System tokens     read by components      --primary, --radius-control, --duration-base
          │ default
Tier 3  Component tokens  per-component override  --button-radius
```

- **Inputs** are the normal values a theme sets; explicit overrides are exceptions.
- **System tokens** are derived in `tokens.css` or mapped from inputs in `globals.css`. They're the contract components use.
- **Component tokens** exist only where a component must diverge from its family (e.g. pill buttons with square inputs). Defaults may be formulas, system tokens or independent values.

## Theme reference

Storybook and this reference use the same order: **Colors → Typography → Spacing & size → Corners → Shadows → Motion → Component details**. CSS names stay unchanged.

Start with an input, then follow its **Affects** list to the values components use. Every description is intentionally short. Values in Storybook are read from the current theme, mode and density.

- **Input:** a value a theme sets.
- **Derived:** follows the inputs listed; several inputs may contribute to one value.
- **Direct:** used as-is, without a separate derived alias.
- **Theme override:** the theme replaces a derived default. The normal connection may no longer apply.
- **Setting:** density or motion scaling controlled by the environment or toolbar.
- **Fixed:** a system value independent of theme inputs, such as pill rounding.

Colors, shape defaults, spacing and timing derive in `tokens.css`. Typography, radius and shadow aliases map through `@theme inline` in `globals.css`; not every alias is declared in `tokens.css`.

Required theme inputs are the page, surface, text, border, brand, four status and five chart colors, plus base radius. Define colors for light and dark. Optional inputs inherit defaults from Nova or `tokens.css`; family overrides replace shape defaults. `--control-height` falls back to eight base spacing units.

Affects lists below describe default dependencies, including downstream aliases. A theme override can stop propagation at any point. Nova, for example, pins several light-mode neutral colors and focus rings. A selected table row currently uses `--muted`, not `--selected`: token purpose is not a promise that every component state uses it.

### 1. Colors

Backgrounds, text, borders, actions and status colors.

#### Surfaces

The layers behind your content.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Page · `--canvas` | The page color; also contributes to quiet fills and focus. | `--background`, `--muted`, `--subtle-foreground`, `--sidebar`, `--sidebar-accent`, `--ring`, `--sidebar-ring` |
| Surface · `--surface` | Cards and floating panels; also the base of neutral highlights. | `--card`, `--popover`, `--secondary`, `--accent` |
| Overlay · `--overlay` | Translucent backdrop behind dialogs, sheets and drawers. | Used directly. |

#### Text

Colors for reading and emphasis.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Main text · `--ink` | Main text and icons; also tints neutral fills and outlines. | `--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground`, `--sidebar-foreground`, `--sidebar-accent-foreground`, `--secondary`, `--accent`, `--muted`, `--hover`, `--active`, `--border-strong`, `--input`, `--sidebar`, `--sidebar-accent` |
| Secondary text · `--ink-muted` | Helper text, metadata and quieter labels. | `--muted-foreground`, `--subtle-foreground` |

#### Borders

Lines that separate and define elements.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Border · `--line` | Default outlines and the base of stronger field borders. | `--border`, `--border-strong`, `--input`, `--sidebar-border` |

#### Brand

Primary actions, selection and keyboard focus.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Brand · `--brand` | Primary fills, brand tints and focus colors. | `--primary`, `--primary-subtle`, `--primary-border`, `--selected`, `--ring`, `--sidebar-ring`, `--sidebar-primary` |
| On brand · `--brand-ink` | Text and icons on brand-colored fills. | `--primary-foreground`, `--sidebar-primary-foreground` |

#### Status

Colors that communicate a result or severity.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Danger · `--danger` | Errors and destructive actions. | `--destructive`, `--danger-subtle`, `--severity-critical`, `--severity-high` |
| Warning · `--warning` | Conditions needing attention. | `--warning-subtle`, `--severity-medium`, `--severity-high` |
| Success · `--success` | Positive outcomes and low severity. | `--success-subtle`, `--severity-low` |
| Information · `--info` | Informational notices and indicators. | `--info-subtle` |

#### Charts

Five color slots; chart configurations choose how to use them.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Series 1 · `--chart-1` | Color for chart series 1. | Used directly. |
| Series 2 · `--chart-2` | Color for chart series 2. | Used directly. |
| Series 3 · `--chart-3` | Color for chart series 3. | Used directly. |
| Series 4 · `--chart-4` | Color for chart series 4. | Used directly. |
| Series 5 · `--chart-5` | Color for chart series 5. | Used directly. |

#### Advanced mixing

Fine-tune derived fills, borders and sidebar colors.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Fill tint · `--mix-fill` | Amount of ink in secondary and item-highlight fills. | `--secondary`, `--accent`, `--sidebar-accent` |
| Quiet tint · `--mix-muted` | Amount of ink in the quiet background. | `--muted` |
| Sidebar tint · `--mix-sidebar` | Amount of ink in the sidebar background. | `--sidebar`, `--sidebar-accent` |
| Border tint · `--mix-strong` | Amount of ink added to stronger outlines. | `--border-strong`, `--input` |
| Focus tint · `--mix-ring` | Amount of brand mixed with the page for focus. | `--ring`, `--sidebar-ring` |
| Sidebar brand · `--sidebar-brand` | Separate sidebar primary fill; falls back to Brand. | `--sidebar-primary` |
| On sidebar brand · `--sidebar-brand-ink` | Separate sidebar primary text; falls back to On brand. | `--sidebar-primary-foreground` |
| High severity · `--caution` | Separate high-severity color; defaults to danger mixed with warning. | `--severity-high` |

#### Affected values

The layer below the inputs; theme overrides take precedence.

| Token | What it changes |
| --- | --- |
| `--background` | Page background. |
| `--muted` | Quiet background fill. |
| `--subtle-foreground` | Extra-quiet text color. |
| `--sidebar` | Sidebar background. |
| `--sidebar-accent` | Sidebar item highlight. |
| `--ring` | Keyboard-focus color. |
| `--sidebar-ring` | Sidebar focus color. |
| `--card` | Card fill. |
| `--popover` | Floating panel fill. |
| `--secondary` | Secondary action fill. |
| `--accent` | Item highlight fill. |
| `--foreground` | Main text and icons. |
| `--card-foreground` | Text and icons on cards. |
| `--popover-foreground` | Text and icons on floating panels. |
| `--secondary-foreground` | Text on secondary fills. |
| `--accent-foreground` | Text on highlighted items. |
| `--sidebar-foreground` | Sidebar text and icons. |
| `--sidebar-accent-foreground` | Text on sidebar highlights. |
| `--hover` | Pointer-over wash. |
| `--active` | Pressed-state wash. |
| `--border-strong` | Stronger outlines. |
| `--input` | Default field border color. |
| `--muted-foreground` | Secondary text. |
| `--border` | Default dividers and outlines. |
| `--sidebar-border` | Sidebar dividers. |
| `--primary` | Primary action and checked-control fill. |
| `--primary-subtle` | Soft brand tint. |
| `--primary-border` | Translucent brand border. |
| `--selected` | Brand-tinted selection color. |
| `--sidebar-primary` | Sidebar primary fill. |
| `--primary-foreground` | Text and icons on primary fills. |
| `--sidebar-primary-foreground` | Text on sidebar primary fills. |
| `--destructive` | Destructive action color. |
| `--danger-subtle` | Soft error tint. |
| `--severity-critical` | Critical severity color. |
| `--severity-high` | High severity color. |
| `--warning-subtle` | Soft warning tint. |
| `--severity-medium` | Medium severity color. |
| `--success-subtle` | Soft success tint. |
| `--severity-low` | Low severity color. |
| `--info-subtle` | Soft information tint. |

### 2. Typography

Fonts, text sizes, line spacing and weights.

#### Fonts

Family is independent of text size and weight.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Body & UI · `--typeface-sans` | Default font for body text and interface labels. | `--font-sans` |
| Headings · `--typeface-heading` | Font for elements using the heading family. | `--font-heading` |
| Code & data · `--typeface-mono` | Font for code and aligned data. | `--font-mono` |

#### Size & line spacing

Size sets the text height; leading sets the space between lines.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Display · `--type-display` | Prominent headings. | `--text-display` |
| Display leading · `--type-display-leading` | Line-height multiplier for display text. | `--text-display--line-height` |
| Heading · `--type-heading` | Larger section headings. | `--text-heading` |
| Heading leading · `--type-heading-leading` | Line-height multiplier for heading text. | `--text-heading--line-height` |
| Title · `--type-title` | Compact titles and component headings. | `--text-title` |
| Title leading · `--type-title-leading` | Line-height multiplier for title text. | `--text-title--line-height` |
| Body · `--type-body` | Main interface text. | `--text-body` |
| Body leading · `--type-body-leading` | Line-height multiplier for body text. | `--text-body--line-height` |
| Caption · `--type-caption` | Supporting labels and metadata. | `--text-caption` |
| Caption leading · `--type-caption-leading` | Line-height multiplier for caption text. | `--text-caption--line-height` |
| Micro · `--type-micro` | Small keycaps and compact labels. | `--text-micro` |
| Micro leading · `--type-micro-leading` | Line-height multiplier for micro text. | `--text-micro--line-height` |

#### Weight

Three levels of emphasis.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Normal · `--weight-normal` | Regular text weight. | `--font-weight-normal` |
| Medium · `--weight-medium` | Moderate emphasis. | `--font-weight-medium` |
| Strong · `--weight-strong` | Strong emphasis. | `--font-weight-strong` |

#### Affected values

The layer below the inputs; theme overrides take precedence.

| Token | What it changes |
| --- | --- |
| `--font-sans` | Default font for body text and interface labels. |
| `--font-heading` | Font for elements using the heading family. |
| `--font-mono` | Font for code and aligned data. |
| `--text-display` | Prominent headings. |
| `--text-display--line-height` | Line spacing for display text. |
| `--text-heading` | Larger section headings. |
| `--text-heading--line-height` | Line spacing for heading text. |
| `--text-title` | Compact titles and component headings. |
| `--text-title--line-height` | Line spacing for title text. |
| `--text-body` | Main interface text. |
| `--text-body--line-height` | Line spacing for body text. |
| `--text-caption` | Supporting labels and metadata. |
| `--text-caption--line-height` | Line spacing for caption text. |
| `--text-micro` | Small keycaps and compact labels. |
| `--text-micro--line-height` | Line spacing for micro text. |
| `--font-weight-normal` | Regular text weight. |
| `--font-weight-medium` | Moderate emphasis. |
| `--font-weight-strong` | Strong emphasis. |

### 3. Spacing & size

Set the rhythm of gaps, padding and control sizes.

#### Spacing

One base unit scales spacing throughout the interface.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Spacing unit · `--space-base` | Base unit for padding, gaps and spacing-based dimensions. | `--space`, `--spacing`, `--control-xs`, `--control-sm`, `--control-md`, `--control-lg`, `--switch-width`, `--switch-height`, `--switch-thumb`, `--switch-width-sm`, `--switch-height-sm`, `--switch-thumb-sm` |

#### Control heights

Set standard height independently; other sizes stay one or two units apart.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Default control height · `--control-height` | Standard height before density; defaults to eight base units. | `--control-xs`, `--control-sm`, `--control-md`, `--control-lg` |

#### Density

Comfortable is 1; Compact is 0.875. Type and corners stay unchanged.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Density · `--density` | Multiplies spacing and control sizes; use the toolbar to compare. | `--space`, `--control-xs`, `--control-sm`, `--control-md`, `--control-lg`, `--switch-width`, `--switch-height`, `--switch-thumb`, `--switch-width-sm`, `--switch-height-sm`, `--switch-thumb-sm` |

#### Affected values

The layer below the inputs; theme overrides take precedence.

| Token | What it changes |
| --- | --- |
| `--space` | Spacing after density. |
| `--spacing` | Tailwind spacing unit: p-2 uses two units, gap-3 uses three. |
| `--control-xs` | Standard height minus two spacing units. |
| `--control-sm` | Standard height minus one spacing unit. |
| `--control-md` | Standard height after density. |
| `--control-lg` | Standard height plus one spacing unit. |
| `--switch-width` | Default switch track width. |
| `--switch-height` | Default switch track height. |
| `--switch-thumb` | Default switch thumb size. |
| `--switch-width-sm` | Small switch track width. |
| `--switch-height-sm` | Small switch track height. |
| `--switch-thumb-sm` | Small switch thumb size. |

### 4. Corners

Set overall roundness, then adjust each family if needed.

#### Base radius

The starting point; a family override replaces its default.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Base radius · `--radius` | Default roundness across the system. | `--shape-item`, `--shape-control`, `--shape-floating`, `--shape-container`, `--badge-radius`, `--toast-radius` |

#### Families

Change one family without changing the others.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Item corners · `--shape-item` | Corners of small items inside larger surfaces. | `--radius-item`, `--radius-item-sm`, `--button-radius-xs`, `--button-radius-sm`, `--checkbox-radius`, `--tooltip-arrow-radius`, `--chart-indicator-radius` |
| Control corners · `--shape-control` | Corners of buttons, inputs, selects and toggles. | `--radius-control`, `--textarea-radius`, `--input-group-button-radius`, `--input-group-kbd-radius` |
| Floating corners · `--shape-floating` | Corners of menus, popovers and dropdown panels. | `--radius-floating` |
| Container corners · `--shape-container` | Corners of cards and larger containers. | `--radius-container`, `--textarea-radius` |

#### Pill

A fixed system shape, independent of the base radius.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Pill · `--radius-pill` | Fully rounded ends for avatars, switches and dots. | Used directly. |

#### Affected values

The layer below the inputs; theme overrides take precedence.

| Token | What it changes |
| --- | --- |
| `--shape-item` | Defaults to 0.8 × base radius. |
| `--shape-control` | Defaults to base radius. |
| `--shape-floating` | Defaults to base radius. |
| `--shape-container` | Defaults to 1.4 × base radius. |
| `--badge-radius` | Badge corners; defaults to 2.6 × base radius. |
| `--toast-radius` | Toast corners; defaults to 1.8 × base radius. |
| `--radius-item` | Menu-item, tab and tooltip corners. |
| `--radius-item-sm` | Smaller item corners; 75% of item radius. |
| `--button-radius-xs` | Extra-small button corners, capped at 10px. |
| `--button-radius-sm` | Small button corners, capped at 12px. |
| `--checkbox-radius` | Checkbox corners; half the item radius. |
| `--tooltip-arrow-radius` | Tooltip arrow corners; quarter of item radius. |
| `--chart-indicator-radius` | Chart indicator corners; quarter of item radius. |
| `--radius-control` | Shared control corner radius. |
| `--textarea-radius` | Container radius also limits textarea corners. |
| `--input-group-button-radius` | Inset button corners. |
| `--input-group-kbd-radius` | Inset keycap corners. |
| `--radius-floating` | Shared floating-panel radius. |
| `--radius-container` | Shared container radius. |

### 5. Shadows

Three shared levels of depth for surfaces.

#### Shared levels

Each level maps to a shadow utility.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Raised · `--elevation-raised` | Small lift for tab indicators and sidebar surfaces. | `--shadow-raised` |
| Floating · `--elevation-floating` | Separation for menus, selects, popovers and hover cards. | `--shadow-floating` |
| Modal · `--elevation-modal` | Stronger separation for sheets, toasts and some menu panels. | `--shadow-modal` |

#### Component exceptions

These shadows are independent of the shared scale.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Card shadow · `--card-shadow` | Card depth; defaults to no shadow. | Used directly. |
| Chart tooltip shadow · `--chart-tooltip-shadow` | Depth of the chart tooltip. | Used directly. |

#### Affected values

The layer below the inputs; theme overrides take precedence.

| Token | What it changes |
| --- | --- |
| `--shadow-raised` | Small lift for tab indicators and sidebar surfaces. |
| `--shadow-floating` | Separation for menus, selects, popovers and hover cards. |
| `--shadow-modal` | Stronger separation for sheets, toasts and some menu panels. |

### 6. Motion

Control how quickly things change and how they move.

#### Duration

Inputs set the pace; derived timings account for reduced motion.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Fast · `--motion-fast` | Quick, small changes. | `--duration-fast`, `--duration-fade-fast`, `--duration-exit-fast` |
| Base · `--motion-base` | Everyday state transitions. | `--duration-base`, `--duration-fade-base`, `--duration-exit-base` |
| Moderate · `--motion-moderate` | Noticeable travel and resizing. | `--duration-moderate`, `--duration-fade-moderate`, `--duration-exit-moderate` |
| Slow · `--motion-slow` | Longer transitions. | `--duration-slow` |

#### Easing

The speed pattern during a transition. Play each curve to compare.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Linear · `--motion-ease-linear` | Constant speed. | `--ease-linear` |
| Standard · `--motion-ease-standard` | Smooth acceleration and deceleration. | `--ease-standard` |
| Emphasized · `--motion-ease-emphasized` | Expressive movement that can overshoot. | `--ease-emphasized` |
| Enter · `--motion-ease-enter` | Arrives quickly and settles. | `--ease-enter` |
| Exit · `--motion-ease-exit` | Accelerates away. | `--ease-exit` |
| Spring · `--motion-ease-spring` | Overshoots and settles with spring-like movement. | `--ease-spring` |

#### Exit timing

Dismissals usually finish sooner than entrances.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Exit ratio · `--motion-exit-scale` | Exit fade duration as a share of entrance; default 0.75. | `--duration-exit-fast`, `--duration-exit-base`, `--duration-exit-moderate` |

#### Reduced motion

The system stops travel while keeping popup fades.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Movement scale · `--motion-scale` | Becomes zero when reduced motion is requested. | `--duration-fast`, `--duration-base`, `--duration-moderate`, `--duration-slow`, `--toast-duration`, `--toast-stack-duration`, `--drawer-duration`, `--drawer-release-duration`, `--message-scroller-duration`, `--navigation-menu-duration` |
| Fade scale · `--fade-scale` | Separate fade multiplier; stays at one under reduced motion. | `--duration-fade-fast`, `--duration-fade-base`, `--duration-fade-moderate`, `--duration-exit-fast`, `--duration-exit-base`, `--duration-exit-moderate` |

#### Affected values

The layer below the inputs; theme overrides take precedence.

| Token | What it changes |
| --- | --- |
| `--duration-fast` | Scaled fast movement timing. |
| `--duration-fade-fast` | Entrance fade timing. |
| `--duration-exit-fast` | Exit fade timing. |
| `--duration-base` | Scaled base movement timing. |
| `--duration-fade-base` | Entrance fade timing. |
| `--duration-exit-base` | Exit fade timing. |
| `--duration-moderate` | Scaled moderate movement timing. |
| `--duration-fade-moderate` | Entrance fade timing. |
| `--duration-exit-moderate` | Exit fade timing. |
| `--duration-slow` | Scaled slow movement timing. |
| `--ease-linear` | Constant speed. |
| `--ease-standard` | Smooth acceleration and deceleration. |
| `--ease-emphasized` | Expressive movement that can overshoot. |
| `--ease-enter` | Arrives quickly and settles. |
| `--ease-exit` | Accelerates away. |
| `--ease-spring` | Overshoots and settles with spring-like movement. |
| `--toast-duration` | Scaled component transition timing. |
| `--toast-stack-duration` | Scaled component transition timing. |
| `--drawer-duration` | Scaled component transition timing. |
| `--drawer-release-duration` | Scaled component transition timing. |
| `--message-scroller-duration` | Scaled component transition timing. |
| `--navigation-menu-duration` | Scaled component transition timing. |

### 7. Component details

Adjust one component without changing its whole family.

#### Buttons

Corners of the smaller button sizes.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Extra-small corners · `--button-radius-xs` | Corners of extra-small buttons; also used by small inputs. | Default: min(--shape-item, 10px) |
| Small corners · `--button-radius-sm` | Corners of small buttons. | Default: min(--shape-item, 12px) |

#### Badge

The badge outline.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Corners · `--badge-radius` | Rounding of badge corners. | Default: --radius × 2.6 |

#### Fields

Fills and inset corners in form controls.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Checkbox corners · `--checkbox-radius` | Checkbox corner rounding. | Default: --shape-item × 0.5 |
| Textarea corners · `--textarea-radius` | Textarea corner rounding. | Default: min(--shape-control, --shape-container) |
| Field fill · `--input-fill` | Default input, textarea and input-group fill; dark styles may replace it. | Default: transparent |
| Inset button corners · `--input-group-button-radius` | Button corners inside an input group. | Default: max(0px, --shape-control − 3px) |
| Inset keycap corners · `--input-group-kbd-radius` | Keycap corners inside an input group. | Default: max(0px, --shape-control − 5px) |

#### Switch

Track and thumb sizes follow spacing and density.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Width · `--switch-width` | Default switch track width. | Default: --space × 8 |
| Height · `--switch-height` | Default switch track height. | Default: --space × 4.6 |
| Thumb · `--switch-thumb` | Default switch thumb size. | Default: --space × 4 |
| Width Sm · `--switch-width-sm` | Small switch track width. | Default: --space × 6 |
| Height Sm · `--switch-height-sm` | Small switch track height. | Default: --space × 3.5 |
| Thumb Sm · `--switch-thumb-sm` | Small switch thumb size. | Default: --space × 3 |

#### Card

Card depth is separate from the shared shadow scale.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Shadow · `--card-shadow` | Shadow beneath cards. | Default: no shadow |

#### Slider

The draggable handle.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Handle fill · `--slider-thumb-fill` | Fill of the slider handle. | Default: white |

#### Tooltip

The small pointer attached to a tooltip.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Arrow corners · `--tooltip-arrow-radius` | Rounding of the tooltip arrow. | Default: --shape-item × 0.25 |

#### Chart

Details inside chart legends and tooltips.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Indicator corners · `--chart-indicator-radius` | Corners of chart indicators. | Default: --shape-item × 0.25 |
| Tooltip shadow · `--chart-tooltip-shadow` | Shadow beneath chart tooltips. | Default: independent shadow |

#### Toast

Notification corners and transitions.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Corners · `--toast-radius` | Toast corner rounding. | Default: --radius × 1.8 |
| Content timing · `--toast-duration` | Toast content opacity transition. | Default: 250ms × --motion-scale |
| Stack timing · `--toast-stack-duration` | Movement and resizing of stacked toasts. | Default: 500ms × --motion-scale |

#### Drawer

Panel and backdrop transitions.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Transition timing · `--drawer-duration` | Drawer opening and closing timing. | Default: 450ms × --motion-scale |
| Release timing · `--drawer-release-duration` | Timing after releasing a swipe. | Default: 400ms × --motion-scale |
| Backdrop easing · `--drawer-overlay-ease` | Backdrop opacity easing. | Default: independent curve |
| Content easing · `--drawer-content-ease` | Content opacity easing in nested drawers. | Default: independent curve |

#### Message scroller

Navigation-button transitions.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Exit timing · `--message-scroller-duration` | Navigation-button exit duration. | Default: 400ms × --motion-scale |
| Exit easing · `--message-scroller-ease-exit` | Navigation-button exit curve. | Default: independent curve |

#### Navigation menu

Transitions between menu panels.

| Value | Explanation | Affects / default |
| --- | --- | --- |
| Transition timing · `--navigation-menu-duration` | Navigation-menu animation duration. | Default: 350ms × --motion-scale |

### Technical reference

These support the system rather than define its visual theme.

| Value | Short explanation |
| --- | --- |
| `--safe-top`, `--safe-bottom`, `--safe-left`, `--safe-right` | Device safe-area insets; normally zero. |
| `--safe-inline` | The larger left or right safe-area inset. |
| `--icon-size` | Text-adjacent icon size, derived from line height. |
| Runtime measurements (`--highlight-*`, drawer positions, chart colors) | Set by component layout or application data; not global theme inputs. |
| Legacy Tailwind aliases | Compatibility mappings for stock shadcn code; use semantic tokens in new components. |

Component tokens use `--{component}-{property}[-{variant}]`. Defaults can be input formulas, system tokens or independent values; they do not all inherit the shared scales. Themes may override them to change a single detail.

Motion durations multiply by `--motion-scale`; fade and exit durations use `--fade-scale`. Reduced motion sets the former to zero, retains the latter, and removes popup zoom/slide transforms. The standard exit ratio is 0.75. Explicit theme timing overrides must preserve the relevant scale.

## Switches

Exactly three, set on `<html>` or on any element to scope a subtree:

| Switch | Mechanism | Values |
| --- | --- | --- |
| Theme | `data-theme` attribute | none or `nova` (the default theme), theme name |
| Mode | `.dark` class | none (light), `dark` |
| Density | `data-density` attribute | none / `comfortable` (`--density: 1`), `compact` (`--density: 0.875`) |

```html
<html data-theme="ocean" data-density="compact" class="dark">
```

A variation of a theme (another accent, another font) is its own theme. There are no other switches.

## Files and cascade

```
src/styles/
  globals.css       1. imports, in this order:
                       tailwindcss, tw-animate-css, tokens.css, themes/nova.css, themes/*.css
                    2. @theme inline: system tokens → Tailwind utilities
                    3. @layer base
  tokens.css        tier 1 → tier 2 → tier 3 derivations, density values, motion scale
  themes/
    nova.css        the default theme: all inputs (required + optional), on
                    :where(:root) and [data-theme="nova"], plus .dark variants
    <name>.css      required inputs (+ any optional), on [data-theme="<name>"]
```

**Derivations are re-declared wherever inputs change.** A custom property that uses `var()` resolves on the element that declares it. Derived tokens declared only on `:root` would keep the default theme's values inside a themed subtree. `tokens.css` therefore declares its derivations on every element that can change their inputs:

```css
:where(:root, [data-theme], .dark)                 { /* colour, shape, motion */ }
:where(:root, [data-theme], [data-density], .dark) { /* space and control sizes */ }
```

Colour isn't re-derived on `[data-density]`, so a density switch never resets a theme's colour overrides.

**Specificity, not load order:** stylesheets can load in any order (dev servers and bundlers reorder CSS), so precedence is set by specificity alone.

- `tokens.css` and Nova's root defaults use `:where()`, zero specificity: `:where(:root)` (light), `:where(.dark)` (dark). Nova also answers to `[data-theme="nova"]`, so it can be applied explicitly or to a subtree inside another theme.
- Named theme: `[data-theme="x"]` (light); `[data-theme="x"].dark, .dark [data-theme="x"], [data-theme="x"] .dark` (dark). Any named theme beats the defaults and the derivations; its dark selectors beat its light one.
- Nova's pinned system values use `:root:not([data-theme]), [data-theme="nova"]` (and `.dark` variants), so they never leak into another theme.
- Every `[data-theme]` and `.dark` element re-applies `font-sans` and `text-foreground` (base layer). Font and text colour are inherited as values computed on `<body>`, so without this a themed subtree would keep the outer theme's typeface.

## Writing a theme

A theme file sets required color inputs for both modes, base radius and any optional inputs it changes. Document component or system overrides with a reason.

```css
/* themes/<name>.css */
[data-theme="<name>"] {
  --canvas: …;
  --surface: …;
  --ink: …;
  --ink-muted: …;
  --line: …;
  --brand: …;
  --brand-ink: …;
  --danger: …;
  --warning: …;
  --success: …;
  --info: …;
  --chart-1: …;
  --chart-2: …;
  --chart-3: …;
  --chart-4: …;
  --chart-5: …;
  --radius: …;

  /* optional inputs this theme changes */
}

[data-theme="<name>"].dark,
.dark [data-theme="<name>"],
[data-theme="<name>"] .dark {
  /* every required colour input, dark values */
}
```

A theme can change the library's feel, not just its colour, through optional inputs:

- **Square, compact** (Lyra-like): `--radius: 0`, smaller `--type-body`, `--space-base: 0.225rem`.
- **Soft, rounded** (Maia-like): larger `--radius`, `--shape-control: 9999px`.
- **Lively**: `--motion-ease-emphasized` used for standard transitions, longer `--motion-base`.

## Writing components

A component's classes may contain only:

| Allowed | Examples |
| --- | --- |
| Layout and structure | `flex` `grid` `items-center` `relative` `overflow-hidden` `truncate` |
| Spacing scale | `p-2` `gap-1.5` `px-3` (scales with `--space`) |
| System token utilities | `bg-primary` `rounded-control` `h-control-md` `text-body` `shadow-floating` `ease-standard` |
| Component token utilities | `rounded-(--button-radius)` |
| State selectors | `data-[open]:` `aria-invalid:` `dark:` (only when a token can't express it) |

| Forbidden | Use instead |
| --- | --- |
| Palette colours, hex, `white` / `black` | colour system tokens |
| `rounded-sm` … `rounded-4xl` | `rounded-item` / `-control` / `-floating` / `-container` / `-pill` |
| Fixed control heights `h-8` on controls | `h-control-md` |
| `text-xs` … `text-2xl` | `text-caption` … `text-display` |
| `font-semibold` `font-bold` | `font-strong` |
| `shadow-sm` … `shadow-2xl` | `shadow-raised` / `-floating` / `-modal` |
| `duration-150` `ease-out` | `duration-(--duration-*)` `ease-standard` |

Class merging: components import `cn` from `lib/utils`, never from the `cn` package directly. `lib/utils` registers the system utilities (`text-body`, `rounded-control`, `h-control-md`, …) with the merger; without it, `text-body` is read as a colour and silently dropped next to `text-foreground`. Every new system utility is added there.

`npm run check:tokens` (`scripts/glaze-check.mjs`) fails on any forbidden class, or a direct `cn` import, in `packages/ui/src/components`. Run it before every commit that touches components.

Deliberate exceptions, each fixed by a reason rather than a theme:

- `rounded-none`, `rounded-[inherit]`, `duration-0`, `ease-linear` (spinners, progress).
- `text-base` paired with `md:text-*` on inputs: iOS zooms into inputs below 16px, whatever the theme.
- `duration-1000` on the input-otp caret: a fixed cursor rhythm.

## Converting stock shadcn code

Code from the shadcn CLI (the initial components, later updates, third-party registries) arrives with stock Tailwind classes. It's brought onto the token contract in two steps.

### Step 1: Bridge

`globals.css` re-points Tailwind's stock scales at system tokens inside `@theme inline`. Stock classes then follow the theme with no component edits.

| Stock class | Bridged to |
| --- | --- |
| `rounded-md` | `--shape-item` |
| `rounded-lg` | `--shape-control` |
| `rounded-xl` | `--shape-container` |
| `rounded-sm` `rounded-2xl` `rounded-3xl` `rounded-4xl` | multiples of `--radius` |
| `text-xs` / `text-sm` / `text-base` | `--type-caption` / `--type-body` / `--type-title` (+ leading) |
| `shadow-sm` / `shadow-md` / `shadow-lg` | `--elevation-raised` / `-floating` / `-modal` |
| `ease-in-out` / `ease-in` | `--motion-ease-standard` / `--motion-ease-exit` |
| `transition` default duration and easing | `--duration-base` / `--motion-ease-standard` |
| spacing scale (`p-*`, `gap-*`, `h-*`) | `--space` |

Each stock class maps 1:1 to the token whose default-theme value equals it, so bridging changes nothing visually. Nova uses `rounded-lg` for both controls and popup surfaces, so popup surfaces are converted to `rounded-floating` as soon as they arrive; otherwise a pill-shaped control theme turns every menu into a pill. Stock classes with no exact token (`shadow-xs`, `shadow-xl`, `ease-out`, `duration-*` numbers) stay stock until converted. The bridge is permanent: it keeps any stock code themeable from the moment it lands.

### Step 2: Convert

`npm run convert:tokens` (`scripts/glaze-convert.mjs`) rewrites stock classes to the system utilities. It's safe to re-run, and takes file names to convert only some components:

| Stock | System |
| --- | --- |
| `rounded-sm` | `rounded-item-sm` |
| `rounded-md` | `rounded-item` |
| `rounded-lg` | `rounded-control` (popup surfaces: `rounded-floating`) |
| `rounded-xl` | `rounded-container` |
| `rounded-full` | `rounded-pill` |
| `text-xs` / `text-sm` / `text-base` | `text-caption` / `text-body` / `text-title` |
| `h-6` / `h-7` / `h-8` / `h-9` on controls | `h-control-xs` / `-sm` / `-md` / `-lg` |
| `shadow-*` | `shadow-raised` / `-floating` / `-modal` |
| `duration-100` / `-150` / `-200` / `-300` | `duration-(--duration-fast / -base / -moderate / -slow)` |
| `bg-black/10` overlays | `bg-overlay` |
| `ease-in-out` / `ease-in` | `ease-standard` / `ease-exit` |
| palette colours | colour system tokens |

- Each converted component is reviewed in Storybook across Theme, Mode and Density.
- Places where the mapping is wrong for the component's role (a `rounded-lg` that's actually a container, an `h-8` that isn't a control) are fixed by hand.
- What the codemod can't map (arbitrary radii, odd durations, literal colours) becomes a component token, found by `npm run check:tokens`.
- Unconverted components go in the check's allowlist, and the list only shrinks.
- Re-pulling a component from the CLI reintroduces stock classes. The bridge keeps it themed until the codemod runs again.

## Storybook

- Every component has a `<component>.stories.tsx`.
- The toolbar exposes the three switches, **Theme**, **Mode** and **Density**, applied to the preview's `<html>`. Stories can be linked in a given state with `&globals=theme:<name>;mode:dark;density:compact`.
- Every CSS file in `packages/ui/src/styles/themes/` (shipped themes) and `apps/storybook/src/themes/` (test themes, not shipped) is loaded and listed in the Theme switch by file name.
- A useful test theme changes every input visibly from the default, so a component that ignores a token stands out.

## Third-party components

Components adopted from other shadcn registries (e.g. Fluid Functionalism, `@fluid`, MIT) follow the same rules as our own:

- **Base UI variant only** (`@fluid/base/<name>`).
- **Installed under their own name** (`fluid-button.tsx`), never over an existing component. Compared in Storybook, then merged into the existing component or kept with a written usage rule.
- **Converted to the token contract** before they ship: forbidden classes replaced, extra tokens mapped onto system tokens or added to the contract and derived in `tokens.css`.
- **Dependencies justified.** A runtime dependency (e.g. `framer-motion`) is added to the package only when the motion tokens can't achieve the effect.
- **Licence kept.** Listed in `packages/ui/THIRD_PARTY_NOTICES.md`, and each adapted file starts with:

  ```ts
  // Adapted from <project> (<licence>): <repository url>
  ```

## Consuming the library

The step-by-step usage guide lives in the library's `README.md` ("Using Glaze in a project"). The rules:

A project installs a tagged release, imports `globals.css` (which includes Tailwind and declares Glaze's own sources) plus the theme files it uses (`<package>/themes/<name>.css`), and sets the switches on `<html>`, through `ThemeProvider` in React. Projects customise through themes and component props only. A need a theme can't express becomes a new token or variant in the library, not a local edit.
