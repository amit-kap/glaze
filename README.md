# Glaze

My component library: shadcn/ui on Base UI, themed entirely through tokens. A Vite monorepo with the library, a web app and Storybook.

**Architecture:** layers, token contract, theming and component rules are specified in `/Users/amitka/Personal/SharedContext/workflow/comp-lib-architecture.md`. Read it before changing components, tokens or themes.

## Using Glaze in a project

> The package will be published as `@amitka/glaze`. Until then it's `@workspace/ui` inside this monorepo; the steps are the same.

### 1. Install

```bash
npm install @amitka/glaze
```

### 2. Import the styles and a theme

In the project's main CSS file:

```css
@import "@amitka/glaze/globals.css";
@import "@amitka/glaze/themes/maia.css";
@source "../node_modules/@amitka/glaze";
```

- `globals.css` holds Tailwind, the tokens and the default theme.
- Import only the themes you use. Each one brings its own font.
- `@source` lets Tailwind see the classes used inside the components.

### 3. Turn the theme on

```html
<html data-theme="maia">
```

No `data-theme` means the default theme.

### Switches

All three go on `<html>` and combine freely:

| Switch | Set with | Values |
|---|---|---|
| Theme | `data-theme` | none (default), `vega`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea`, or your own |
| Mode | `class="dark"` | none (light), `dark` |
| Density | `data-density` | none / `comfortable`, `compact` |

```html
<html data-theme="maia" class="dark" data-density="compact">
```

Change them at runtime by updating the attribute:

```ts
document.documentElement.dataset.theme = "lyra"
document.documentElement.classList.toggle("dark")
```

The same attributes work on any element to theme just that part of the page:

```html
<section data-theme="sera">…</section>
```

### Themes

| Theme | Character |
|---|---|
| default (Nova) | Geist, 32px controls, 10px corners |
| `vega` | Inter, taller controls, tighter corners |
| `maia` | Figtree, pill controls, round menus, deep shadows |
| `lyra` | JetBrains Mono, square, small type |
| `mira` | Inter, compact controls, small type |
| `luma` | Inter, pill controls, very round cards, lifted shadows |
| `sera` | Taupe, Noto Sans + Playfair Display headings, square, tall controls |
| `rhea` | Inter, soft rounded controls and cards |

### Your own theme

Create `<name>.css` (in the library's `packages/ui/src/styles/themes/`, or in the project), set the required inputs (`--canvas`, `--surface`, `--ink`, `--brand`, `--radius`, …) for light and dark under `[data-theme="<name>"]`, import it, and use `data-theme="<name>"`. The input list and a template are in the spec's "Writing a theme" section.

### Components

```tsx
import { Button } from "@amitka/glaze/components/button"
```

## Developing Glaze

### Adding components

```bash
npx shadcn@latest add button -c apps/web
```

This places the component in `packages/ui/src/components` with stock shadcn classes. Convert it to Glaze tokens and check:

```bash
npm run convert:tokens -- button.tsx   # stock classes → system utilities
npm run check:tokens                   # fails on any class the token contract forbids
```

Anything the converter can't map becomes a component token (see the spec's "Converting stock shadcn code").

### Storybook

Every component in `packages/ui` has a story in `apps/storybook/src/stories`.

```bash
npm run dev -w storybook    # http://localhost:6006
npm run build -w storybook  # static build in apps/storybook/dist
```

The toolbar has the three switches: **Theme**, **Mode** and **Density**. Link to a state with `&globals=theme:maia;mode:dark;density:compact`. Test themes that shouldn't ship (like **Probe**, which changes every token) live in `apps/storybook/src/themes`.

When you add a component, add a matching `<component>.stories.tsx`.
