<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/glaze-banner-dark.png">
  <img alt="Glaze — a glossy finish for every component" src=".github/assets/glaze-banner-light.png">
</picture>

<br />
<br />

Glaze is a React component library built on [shadcn/ui](https://ui.shadcn.com) and [Base UI](https://base-ui.com), themed entirely through design tokens. A single theme applies across every component, with no per-component overrides.

This repository is a Vite monorepo containing the library, a web app, a showcase and Storybook.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Theming](#theming)
- [Development](#development)
- [License](#license)

## Features

- **Accessible primitives.** Components are built on Base UI and follow shadcn/ui conventions.
- **Token-based theming.** Every visual decision flows from one token contract, so components never need overrides.
- **Eight built-in themes.** Each theme ships with its own typography, shape and elevation.
- **Mode and density.** Light and dark modes, plus comfortable and compact density, combine freely with any theme.
- **Scoped theming.** Apply a different theme to a single section of the page.

## Requirements

- React 19
- Tailwind CSS 4

Both are peer dependencies supplied by your project.

## Installation

```bash
npm install @amit-kap/glaze
```

Each release is also tagged in this repository, so it can be installed from GitHub:

```bash
npm install github:amit-kap/glaze#v<version>
```

## Getting started

### 1. Import the styles and a theme

Add the following to your project's main CSS file:

```css
@import "@amit-kap/glaze/globals.css";
@import "@amit-kap/glaze/themes/maia.css";
```

- `globals.css` includes Tailwind, the tokens and the default theme (Nova). Use it in place of your own `@import "tailwindcss"`.
- Import only the themes you use. Each theme loads its own font.
- Tailwind detects the classes used inside Glaze components automatically. Your project's files are detected as usual.

### 2. Enable the theme

Wrap the application in `ThemeProvider`:

```tsx
import { ThemeProvider } from "@amit-kap/glaze/theme"

<ThemeProvider defaultTheme="maia" defaultMode="system">
  <App />
</ThemeProvider>
```

`defaultTheme` defaults to `"nova"`. The viewer's choice is persisted in `localStorage` under `storageKey` (default `"glaze"`); pass `false` to disable persistence.

Outside React, set the attribute directly: `<html data-theme="maia">`.

### 3. Use components

```tsx
import { Button } from "@amit-kap/glaze/components/button"
```

## Theming

### Theme attributes

Theme, mode and density are controlled by attributes on `<html>` and can be combined freely:

| Setting | Attribute | Values |
|---|---|---|
| Theme | `data-theme` | none or `nova` (default), `vega`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea`, or a custom theme |
| Mode | `class="dark"` | none (light), `dark` |
| Density | `data-density` | none or `comfortable`, `compact` |

```html
<html data-theme="maia" class="dark" data-density="compact">
```

`ThemeProvider` manages these attributes for you. The same attributes can be applied to any element to theme only that part of the page:

```html
<section data-theme="sera">…</section>
```

### Built-in themes

| Theme | Characteristics |
|---|---|
| `nova` (default) | Geist, 32px controls, 10px corners |
| `vega` | Inter, taller controls, tighter corners |
| `maia` | Figtree, pill controls, round menus, deep shadows |
| `lyra` | JetBrains Mono, square corners, small type |
| `mira` | Inter, compact controls, small type |
| `luma` | Inter, pill controls, very round cards, lifted shadows |
| `sera` | Taupe, Noto Sans with Playfair Display headings, square corners, tall controls |
| `rhea` | Inter, soft rounded controls and cards |

### Switching at runtime

```tsx
import { useTheme } from "@amit-kap/glaze/theme"

const { theme, setTheme, mode, setMode, resolvedMode, density, setDensity } = useTheme()

setTheme("lyra")
setMode("dark")        // "light" | "dark" | "system"
setDensity("compact")  // "comfortable" | "compact"
```

### Preventing a flash on load

Add the inline script to `<head>` so the saved theme is applied before the first paint. Pass the same options as the provider:

```tsx
import { themeScript } from "@amit-kap/glaze/theme"

<script dangerouslySetInnerHTML={{ __html: themeScript({ defaultTheme: "maia" }) }} />
```

### Custom themes

1. Create `<name>.css`, either in `packages/ui/src/styles/themes/` or in your project.
2. Under `[data-theme="<name>"]`, set the required inputs (`--canvas`, `--surface`, `--ink`, `--brand`, `--radius`, …) for both light and dark mode.
3. Import the file and set `data-theme="<name>"`.

The full list of inputs and a template are in the "Writing a theme" section of the architecture specification.

## Development

### Repository structure

| Path | Contents |
|---|---|
| `packages/ui` | The Glaze library: components, tokens and themes |
| `apps/web` | Web app (the target for `shadcn add`) |
| `apps/showcase` | One-page demo of the components |
| `apps/storybook` | Storybook with a story for every component |

### Architecture

Layers, the token contract, theming and component rules are defined in the architecture specification (`comp-lib-architecture.md`, maintained at `/Users/amitka/Personal/SharedContext/workflow/`). Read it before changing components, tokens or themes.

### Adding components

```bash
npx shadcn@latest add button -c apps/web
```

This places the component in `packages/ui/src/components` with stock shadcn classes. Convert it to Glaze tokens, then verify:

```bash
npm run convert:tokens -- button.tsx   # map stock classes to system utilities
npm run check:tokens                   # fail on any class the token contract forbids
```

Anything the converter cannot map becomes a component token (see "Converting stock shadcn code" in the specification). Every new component also needs a matching `<component>.stories.tsx`.

### Showcase

`apps/showcase` presents the library in the style of fluidfunctionalism.com: a centre column of live components and a floating settings panel (Theme, Mode, Density) in the top right.

```bash
npm run dev -w showcase     # http://localhost:5180
```

### Storybook

Every component in `packages/ui` has a story in `apps/storybook/src/stories`.

```bash
npm run dev -w storybook    # http://localhost:6006
npm run build -w storybook  # static build in apps/storybook/dist
```

The toolbar provides the **Theme**, **Mode** and **Density** switches. Link to a specific state with `&globals=theme:maia;mode:dark;density:compact`. Test themes that should not ship belong in `apps/storybook/src/themes`; they appear in the Theme switch but are not part of the package.

### Releasing

1. Bump `version` in `packages/ui/package.json` and commit.
2. Build, tag and publish:

   ```bash
   npm run release:glaze -- --push --npm
   ```

   This builds the package, tags `v<version>` on the `release` branch, pushes it and publishes to npm. `--npm` prompts for your npm two-factor code.

`npm run build:glaze` builds `packages/ui/dist` without releasing.

Notes:

- npm installs a Git repository from its root, so releases live on the `release` branch, which contains only the built package.
- The published package has its own README (`packages/ui/PACKAGE_README.md`) and `THIRD_PARTY_NOTICES.md`. Keep the package README in step with this one.

## License

MIT
