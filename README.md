# Glaze

React components built on [shadcn/ui](https://ui.shadcn.com) and [Base UI](https://base-ui.com), themed entirely through CSS tokens. Swap the theme, mode or density with one attribute; the components never change.

## Install

```bash
npm install @amit-kap/glaze
```

Requires React 19 and Tailwind CSS 4 in your project.

## Set up

### 1. Import the styles and a theme

In your main CSS file:

```css
@import "@amit-kap/glaze/globals.css";
@import "@amit-kap/glaze/themes/maia.css";
```

- `globals.css` includes Tailwind, the tokens and the default theme, Nova. Use it in place of your own `@import "tailwindcss"`.
- Import only the themes you use. Each one brings its own font.
- Tailwind finds the classes inside Glaze's components on its own.

### 2. Wrap the app

```tsx
import { ThemeProvider } from "@amit-kap/glaze/theme"

<ThemeProvider defaultTheme="maia" defaultMode="system">
  <App />
</ThemeProvider>
```

The viewer's choice is remembered in `localStorage` (`storageKey`, default `"glaze"`; `false` to turn it off). Without React, set the attributes on `<html>` yourself (see [Switches](#switches)).

### 3. Use components

```tsx
import { Button } from "@amit-kap/glaze/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@amit-kap/glaze/components/card"
```

## Switching at runtime

```tsx
import { useTheme } from "@amit-kap/glaze/theme"

const { theme, setTheme, mode, setMode, resolvedMode, density, setDensity } = useTheme()
setTheme("lyra")
setMode("dark")        // "light" | "dark" | "system"
setDensity("compact")  // "comfortable" | "compact"
```

## No flash on load

Add the inline script to `<head>` so the saved theme applies before the page paints. Pass the same options as the provider:

```tsx
import { themeScript } from "@amit-kap/glaze/theme"

<script dangerouslySetInnerHTML={{ __html: themeScript({ defaultTheme: "maia" }) }} />
```

## Switches

Three attributes on `<html>`, freely combined:

| Switch | Set with | Values |
|---|---|---|
| Theme | `data-theme` | none or `nova` (default), `vega`, `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea`, or your own |
| Mode | `class="dark"` | none (light), `dark` |
| Density | `data-density` | none / `comfortable`, `compact` |

```html
<html data-theme="maia" class="dark" data-density="compact">
```

They also work on any element, to theme just part of a page:

```html
<section data-theme="sera">…</section>
```

## Themes

Each theme expresses one of shadcn's styles as tokens.

| Theme | Character |
|---|---|
| `nova` (default) | Geist, 32px controls, 10px corners |
| `vega` | Inter, taller controls, tighter corners |
| `maia` | Figtree, pill controls, round menus, deep shadows |
| `lyra` | JetBrains Mono, square, small type |
| `mira` | Inter, compact controls, small type |
| `luma` | Inter, pill controls, very round cards, lifted shadows |
| `sera` | Taupe, Noto Sans + Playfair Display headings, square, tall controls |
| `rhea` | Inter, soft rounded controls and cards |

## Your own theme

A theme is a CSS file that sets the required inputs for light and dark. Everything else (hover states, borders, sidebar colours, focus rings) is derived from them.

```css
/* my-theme.css */
[data-theme="my-theme"] {
  --canvas: …;      /* app background */
  --surface: …;     /* cards, popovers, inputs */
  --ink: …;         /* primary text */
  --ink-muted: …;   /* secondary text */
  --line: …;        /* borders */
  --brand: …;       /* primary actions, focus */
  --brand-ink: …;   /* text on brand */
  --danger: …;
  --warning: …;
  --success: …;
  --info: …;
  --chart-1: …;
  --chart-2: …;
  --chart-3: …;
  --chart-4: …;
  --chart-5: …;
  --radius: …;      /* base corner radius */
}

[data-theme="my-theme"].dark,
.dark [data-theme="my-theme"],
[data-theme="my-theme"] .dark {
  /* the same colour inputs, dark values */
}
```

Optional inputs change the feel beyond colour: `--shape-item`, `--shape-control`, `--shape-floating`, `--shape-container` (corners per component family), `--space-base` (spacing and control height), `--typeface-sans`, `--typeface-heading`, `--type-body` (type), `--elevation-raised`, `--elevation-floating`, `--elevation-modal` (shadows) and `--motion-base`, `--motion-ease-standard` (motion). The theme files in `@amit-kap/glaze/themes/` are complete examples.

Import it after `globals.css` and use `data-theme="my-theme"`.

## Licence

MIT. Glaze includes code adapted from shadcn/ui (MIT); see `THIRD_PARTY_NOTICES.md`.
