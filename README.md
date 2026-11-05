<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/glaze-banner-dark.png">
  <img alt="Glaze — a glossy finish for every component" src=".github/assets/glaze-banner-light.png">
</picture>

<br />
<br />

Glaze is a React component library built on [shadcn/ui](https://ui.shadcn.com) and [Base UI](https://base-ui.com), themed entirely through CSS custom properties. One set of shared settings applies across every component; a component only diverges through a named adjustment.

[Glaze Studio](https://glaze-studio.amitkap.com) edits a theme against Nova, previews it on the real components and exports CSS.

**Live:** [Glaze Studio](https://glaze-studio.amitkap.com) · [Components](https://amit-kap.github.io/glaze/) · [Storybook](https://amit-kap.github.io/glaze/storybook/)

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Theming](#theming)
- [Repository](#repository)
- [License](#license)

## Features

- **Accessible primitives.** Components are built on Base UI and follow shadcn/ui conventions.
- **Shared theming.** One set of settings changes every component; exceptions are named and visible.
- **Nova, one theme.** A shadcn-based default look; change it in [Glaze Studio](https://glaze-studio.amitkap.com) or by hand and save your own theme.
- **Mode and density.** Light and dark modes, plus comfortable and compact density, combine freely.
- **Scoped theming.** Apply a custom theme to a single section of the page.

## Requirements

- React 19
- Tailwind CSS 4

Both are peer dependencies supplied by your project.

## Installation

In your project's folder, run:

```bash
npx @amit-kap/glaze init
```

This installs the package, imports Glaze's styles into your main CSS file (the one with `@import "tailwindcss"`), and wraps your app in `ThemeProvider`. Other options: `--mode light|dark|system`, `--density comfortable|compact`, `--config glaze.config.json` (your own theme, see below), and `--css` / `--entry` to point at the files yourself. Running it again updates the wiring.

If your entry file isn't the usual `createRoot(…).render(<App />)` shape, it prints the lines to add instead.

To set it up by hand instead, install the package and follow [Getting started](#getting-started):

```bash
npm install @amit-kap/glaze
```

Each release is also tagged in this repository, so it can be installed from GitHub:

```bash
npm install github:amit-kap/glaze#v<version>
```

## Getting started

### 1. Import the styles

Add the following to your project's main CSS file:

```css
@import "@amit-kap/glaze/globals.css";
```

- `globals.css` includes Tailwind, the tokens and Nova. Use it in place of your own `@import "tailwindcss"`.
- Tailwind detects the classes used inside Glaze components automatically. Your project's files are detected as usual.
- A custom theme is a second `@import`, after this one.

### 2. Enable the theme

Wrap the application in `ThemeProvider`:

```tsx
import { ThemeProvider } from "@amit-kap/glaze/theme"

;<ThemeProvider defaultMode="system">
  <App />
</ThemeProvider>
```

The viewer's choice is persisted in `localStorage` under `storageKey` (default `"glaze"`); pass `false` to disable persistence.

Outside React, set the attribute directly: `<html data-theme="nova">`.

### 3. Use components

```tsx
import { Button } from "@amit-kap/glaze/components/button"
```

## Theming

### Theme attributes

Theme, mode and density are controlled by attributes on `<html>` and can be combined freely:

| Setting | Attribute      | Values                                                             |
| ------- | -------------- | ------------------------------------------------------------------ |
| Theme   | `data-theme`   | none or `nova` (default), or the name of a custom theme you import |
| Mode    | `class="dark"` | none (light), `dark`                                               |
| Density | `data-density` | none or `comfortable`, `compact`                                   |

```html
<html data-theme="nova" class="dark" data-density="compact"></html>
```

`ThemeProvider` manages these attributes for you. The same attributes can be applied to any element to theme only that part of the page:

```html
<section data-theme="my-theme">…</section>
```

### One theme: Nova

Nova is the only built-in theme. It is a shadcn-based appearance with Geist, 32px controls and 10px corners, in light and dark. Everything you change is a saved theme on top of it — made in Studio or written by hand.

### Switching at runtime

```tsx
import { useTheme } from "@amit-kap/glaze/theme"

const { mode, setMode, resolvedMode, density, setDensity } = useTheme()

setMode("dark") // "light" | "dark" | "system"
setDensity("compact") // "comfortable" | "compact"
```

`setTheme("my-theme")` switches to a custom theme you have imported.

### Preventing a flash on load

Add the inline script to `<head>` so the saved mode is applied before the first paint. Pass the same options as the provider:

```tsx
import { themeScript } from "@amit-kap/glaze/theme"

;<script dangerouslySetInnerHTML={{ __html: themeScript() }} />
```

### Custom themes

The quickest way is a config (`glaze.config.json`): the inputs to change, starting from Nova. Make one in [Glaze Studio](https://glaze-studio.amitkap.com) (Export, then Config), or see `packages/ui/glaze.config.example.json`. Then:

```bash
npx @amit-kap/glaze init --config glaze.config.json
```

It generates `<name>.css` and wires it in; `npx glaze theme glaze.config.json` regenerates just the CSS. In this repository, `npm run theme -- <config.json>` does the same.

To write a theme by hand, copy `packages/ui/src/styles/themes/nova.css` and change the values you need:

1. Create `<name>.css` in your project.
2. Under `[data-theme="<name>"]`, set the shared inputs (`--background`, `--card`, `--foreground`, `--muted-foreground`, `--border`, `--brand`, `--brand-ink`, `--radius`, …) for both light and dark mode.
3. Import the file and set `data-theme="<name>"`.

`--primary` follows `--brand` and `--primary-foreground` follows `--brand-ink`
until the theme sets them itself. Setting `--primary` is how a theme separates
action color from identity; resetting it means removing the declaration.

The full list of settings, with descriptions and the components that use each
one, is `packages/ui/src/theme/catalog.ts`. The specification is
[docs/architecture.md](docs/architecture.md).

## Repository

A Vite monorepo:

| Path             | Contents                                         |
| ---------------- | ------------------------------------------------ |
| `packages/ui`    | The Glaze library: components, tokens and themes |
| `apps/studio`    | Glaze Studio, the theme editor                   |
| `apps/showcase`  | One tile per component                           |
| `apps/storybook` | Storybook with a story for every component       |
| `apps/web`       | Web app (the target for `shadcn add`)            |

- [docs/architecture.md](docs/architecture.md): the design and the rules components follow
- [docs/studio.md](docs/studio.md): what Studio does and how it is deployed
- [docs/development.md](docs/development.md): commands, adding components, motion, releasing

## License

MIT
