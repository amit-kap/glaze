# Developing Glaze

How to work in this repository. For using the library, see the
[README](../README.md); for the design and the rules components follow, see
[architecture.md](architecture.md).

## Repository structure

| Path             | Contents                                                     |
| ---------------- | ------------------------------------------------------------ |
| `packages/ui`    | The Glaze library: components, tokens and themes             |
| `apps/studio`    | Glaze Studio, the theme editor ([studio.md](studio.md))      |
| `apps/showcase`  | One tile per component, with its variants                    |
| `apps/storybook` | Storybook with a story for every component                   |
| `apps/web`       | Web app (the target for `shadcn add`)                        |
| `scripts`        | Checks, the package build, the release and the Studio deploy |

## Commands

```bash
npm install
npm run dev -w studio       # http://localhost:5186
npm run dev -w showcase     # http://localhost:5180
npm run dev -w storybook    # http://localhost:6006
npm run check:tokens        # fail on any class the token contract forbids
npm run check:catalog       # the settings catalog matches the CSS and the components
npx turbo lint typecheck build
```

CI (`.github/workflows/ci.yml`) runs the two checks, lint, typecheck and build.

## Architecture

Layers, the theme model, the settings and the component rules are in
[architecture.md](architecture.md). Read it before changing components, tokens
or themes.

The settings catalog is `packages/ui/src/theme/catalog.ts`. Storybook, Studio
and the CSS export read it, so a new or renamed setting is added there first.
`npm run check:catalog` verifies that every catalog entry exists in the CSS,
that everything Nova sets is editable, and that `theme/consumers.ts` matches
what the components use (`--write` regenerates it).

## Adding components

```bash
npx shadcn@latest add button -c apps/web
```

This places the component in `packages/ui/src/components` with stock shadcn
classes. Convert it to Glaze tokens by hand (radius, text size, shadow and
motion each have a Glaze utility, and colours come from the system tokens),
then run `npm run check:tokens`, which names every class the contract forbids.
A value no token covers becomes a component token. Every new component also
needs a `<component>.stories.tsx` and a tile in `apps/showcase/src/tiles.tsx`.

## Motion

Every duration and easing comes from a motion token; `check:tokens` rejects literal timings and `transition-all`. Pick the token by what moves:

| Motion                                              | Duration                                                                         | Easing             | Used by                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Hover, focus and colour changes                     | default (`--duration-base`)                                                      | `ease-standard`    | buttons, toggles, inputs, tab labels                                                                        |
| A highlight or indicator travelling between targets | `--duration-fast` (highlight, hover pill), `--duration-moderate` (tab indicator) | `ease-spring`      | menu highlight (`highlight-scope`), tab hover pill (`highlight-scope` following the pointer), tab indicator |
| A popup or overlay fading in                        | `--duration-fade-*`                                                              | tw-animate default | menus, select, combobox, popover, tooltip, hover card, dialogs, sheet overlay                               |
| The same popup leaving                              | `--duration-exit-*` on `data-closed`                                             | tw-animate default | as above                                                                                                    |
| A panel resizing                                    | `--duration-moderate`                                                            | `ease-standard`    | collapsible, accordion                                                                                      |
| A large surface sliding                             | component tokens (`--drawer-duration`, …)                                        | `ease-enter`       | drawer, sheet                                                                                               |

Rules:

- **The bigger the thing that moves, the slower it moves.** Small state changes use `fast`, travelling indicators `moderate`, surfaces `slow`.
- **Exits are quicker than enters** (`--motion-exit-scale`, 0.75), so a dismissal reads as final rather than the entrance replayed.
- **Reduced motion keeps fades and drops movement.** `--motion-scale` goes to 0, so `--duration-*` stops; `--fade-scale` stays 1, so `--duration-fade-*` and `--duration-exit-*` keep running, and popups lose their zoom and slide but still fade. Use a `fade` duration only for opacity and colour.
- **Move with `transform`, `opacity` and colour.** Animate layout (`width`, `height`, insets) only when the size itself is the information (progress, collapsible, the tab indicator's width).
- **Weight changes reserve their width.** A label that gets heavier with state goes through `reserveWeight()` (`lib/label.ts`), so its neighbours never shift.
- **Shared patterns are utilities:** `highlight-scope` with `useHighlightLayer()` (one highlight per list: the hook measures the current row, the utility draws and moves the layer) and `icon-swap` (two-icon crossfade). Reuse them instead of hand-rolling the effect.

## Showcase and Storybook

`apps/showcase` is one page of tiles, one per component, built from the same
demos as the Storybook stories (`apps/showcase/src/demos`). Studio's
Components tab shows the same tiles, so a new demo appears in both.

Every component in `packages/ui` has a story in `apps/storybook/src/stories`.
The toolbar has the **Mode** and **Density** switches; link to a state with
`&globals=mode:dark;density:compact`.

Showcase and Storybook are published to GitHub Pages on every push to `main`
(`.github/workflows/pages.yml`), at <https://amit-kap.github.io/glaze/> and
<https://amit-kap.github.io/glaze/storybook/>. Studio is deployed separately
(see [studio.md](studio.md)).

## Dependencies

Dependabot (`.github/dependabot.yml`) opens weekly pull requests: one for all
minor and patch updates, one per major update, and one for GitHub Actions. CI
runs on each; merge when it passes.

## Releasing

Releases run in GitHub Actions (`.github/workflows/release.yml`):

1. Bump `version` in `packages/ui/package.json` (and `glazeBaseline` in
   `packages/ui/src/lib/config.ts`, which `check:catalog` keeps in step) and
   merge it to `main`.
2. The Release workflow sees that `v<version>` doesn't exist yet. It checks,
   builds, publishes to npm with
   [trusted publishing](https://docs.npmjs.com/trusted-publishers) (no token or
   2FA code; the package gets provenance), then commits the build to the
   `release` branch and tags it `v<version>`.
3. It then waits for npm to list the version and asks Cloudflare to rebuild
   Glaze Studio on it.

It can also be started by hand from the Actions tab; a version that's already
tagged is skipped. One-time setup: on npmjs.com, add a trusted publisher to
`@amit-kap/glaze` for this repository and the workflow file `release.yml`.

To release from your machine instead: `npm run release:glaze -- --npm --push`
(prompts for your npm two-factor code). `npm run build:glaze` builds
`packages/ui/dist` without releasing.

Notes:

- The package exports only what `scripts/glaze-build.mjs` lists. A new public
  path (like `theme/catalog`) must be added there, or consumers can't import it.
- npm installs a Git repository from its root, so releases live on the
  `release` branch, which contains only the built package.
- The published package has its own README (`packages/ui/PACKAGE_README.md`),
  the full usage guide: setup by hand, runtime switching, theming. The repo
  README is a short front page that links to it. The package README and
  `THIRD_PARTY_NOTICES.md` are what npm shows.
