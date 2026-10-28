# Glaze

React components built on [shadcn/ui](https://ui.shadcn.com) and [Base UI](https://base-ui.com), themed entirely through CSS tokens. Swap the theme, mode or density with one attribute; the components never change.

## Quick setup

Requires React 19 and Tailwind CSS 4 in your project.

In your project's folder, run:

```bash
npx @amit-kap/glaze init
```

This installs the package, imports Glaze's styles into your main CSS file (the one with `@import "tailwindcss"`), and wraps your app in `ThemeProvider`. Other options: `--mode light|dark|system`, `--density comfortable|compact`, `--config glaze.config.json` (your own theme, see below), and `--css` / `--entry` to point at the files yourself. Running it again updates the wiring.

If your entry file isn't the usual `createRoot(…).render(<App />)` shape, it prints the lines to add instead.

## Set up by hand

```bash
npm install @amit-kap/glaze
```

### 1. Import the styles

In your main CSS file:

```css
@import "@amit-kap/glaze/globals.css";
```

- `globals.css` includes Tailwind, the tokens and Nova. Use it in place of your own `@import "tailwindcss"`.
- Tailwind finds the classes inside Glaze's components on its own.

### 2. Wrap the app

```tsx
import { ThemeProvider } from "@amit-kap/glaze/theme"

;<ThemeProvider defaultMode="system">
  <App />
</ThemeProvider>
```

The viewer's choice is remembered in `localStorage` (`storageKey`, default `"glaze"`; `false` to turn it off). Without React, set the attributes on `<html>` yourself (see [Switches](#switches)).

### 3. Use components

```tsx
import { Button } from "@amit-kap/glaze/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@amit-kap/glaze/components/card"
```

## Switching at runtime

```tsx
import { useTheme } from "@amit-kap/glaze/theme"

const { mode, setMode, resolvedMode, density, setDensity } = useTheme()
setMode("dark") // "light" | "dark" | "system"
setDensity("compact") // "comfortable" | "compact"
```

`setTheme("my-theme")` switches to a custom theme you have imported.

## No flash on load

Add the inline script to `<head>` so the saved mode applies before the page paints. Pass the same options as the provider:

```tsx
import { themeScript } from "@amit-kap/glaze/theme"

;<script dangerouslySetInnerHTML={{ __html: themeScript() }} />
```

## Switches

Three attributes on `<html>`, freely combined:

| Switch  | Set with       | Values                                                             |
| ------- | -------------- | ------------------------------------------------------------------ |
| Theme   | `data-theme`   | none or `nova` (default), or the name of a custom theme you import |
| Mode    | `class="dark"` | none (light), `dark`                                               |
| Density | `data-density` | none / `comfortable`, `compact`                                    |

```html
<html data-theme="nova" class="dark" data-density="compact"></html>
```

They also work on any element, to theme just part of a page:

```html
<section data-theme="my-theme">…</section>
```

## Themes

Nova is the only built-in theme: a shadcn-based appearance with Geist, 32px controls and 10px corners, in light and dark. Everything else is a saved theme on top of it.

## Your own theme

The quickest way is a config: start from Nova and change only what you need. Make one in the [showcase](https://amit-kap.github.io/glaze/)'s Customize panel (Config button), or write it:

```json
{
  "version": 1,
  "name": "my-theme",
  "extends": "nova",
  "color": {
    "light": { "brand": "#0369a1", "brand-ink": "#ffffff" },
    "dark": { "brand": "#38bdf8", "brand-ink": "#082f49" }
  },
  "shape": { "radius": "0.5rem" }
}
```

Then `npx @amit-kap/glaze init --config glaze.config.json` generates `my-theme.css` beside your main CSS file and wires it in. To regenerate only the CSS: `npx glaze theme glaze.config.json`.

Beyond the input groups (`color`, `shape`, `space`, `type`, `elevation`, `motion`) a config can override derived values directly: `"system": { "light": { "secondary": "#eee" }, "dark": { … } }` overrides a system token for one mode, and `"components": { "input-fill": "#f5f5f5" }` sets a component token. An override wins over the derivation, so that token stops following the inputs that produced it.

Generated CSS starts with a comment naming the theme format and the Glaze baseline it was written against, for example `/* Glaze theme v1 · baseline @amit-kap/glaze 0.3.0 */`.

### Writing one by hand

A theme is a CSS file that sets the required inputs for light and dark. Everything else (hover states, borders, sidebar colours, focus rings) is derived from them.

```css
/* my-theme.css */
[data-theme="my-theme"] {
  --background: …; /* page background; also tints quiet fills */
  --card: …; /* cards and popovers; also tints neutral fills */
  --foreground: …; /* main text and icons */
  --muted-foreground: …; /* secondary text */
  --border: …; /* dividers and outlines */
  --brand: …; /* identity colour; Primary follows it */
  --brand-ink: …; /* text on brand */
  --destructive: …;
  --warning: …;
  --success: …;
  --info: …;
  --chart-1: …;
  --chart-2: …;
  --chart-3: …;
  --chart-4: …;
  --chart-5: …;
  --radius: …; /* base corner radius */
}

[data-theme="my-theme"].dark,
.dark [data-theme="my-theme"],
[data-theme="my-theme"] .dark {
  /* the same colour inputs, dark values */
}
```

Optional inputs change the feel beyond colour: `--shape-item`, `--shape-control`, `--shape-floating`, `--shape-container` (corners per component family), `--space-base` (spacing, and control height unless set), `--control-height` (the default control height; the other sizes are a spacing step apart), `--typeface-sans`, `--typeface-heading`, `--type-body` (type), `--elevation-raised`, `--elevation-floating`, `--elevation-modal` (shadows) and `--motion-base`, `--motion-ease-standard`, `--motion-ease-spring`, `--motion-exit-scale` (motion). `--fade-scale: 0` turns fades off as well under reduced motion. The theme files in `@amit-kap/glaze/themes/` are complete examples.

Import it after `globals.css` and use `data-theme="my-theme"`.

## Licence

MIT. Glaze includes code adapted from shadcn/ui (MIT); see `THIRD_PARTY_NOTICES.md`.
