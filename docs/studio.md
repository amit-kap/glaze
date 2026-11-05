# Glaze Studio

Glaze Studio edits a theme against Nova, previews it on the real Glaze
components and exports it. It lives in `apps/studio` and is deployed at
<https://glaze-studio.amitkap.com>.

## What it does

- **Side panel.** Brand color (a card of swatches), Primary action, Neutrals
  (greyscale or tinted by the brand), Typography (bundled or Google fonts),
  Scale (comfortable to compact), Tone (quiet to bold) and Motion (Default,
  Subtle, Edgy, with a live preview).
- **Preview.** The stage shows Dashboard, Data table, Checkout, Harness,
  Landing and Components (the showcase tiles), in light or dark and at three
  widths. Only the framed preview wears the draft theme; the toolbar and panel
  keep the studio's own look.
- **Library.** Save names a theme; the chevron beside the name switches
  between saved themes, starts a new one from Nova, or imports a theme file.
- **Reset all** counts and reverts edits since the last save (since Nova,
  before the first save).
- **Export** opens a dialog with the CSS (copy or download), a
  `glaze.config.json` for the Glaze CLI, and a theme file that reopens in
  Studio.

## State

Everything is stored in the browser; there is no server.

| Key (`localStorage`)      | Holds                                   |
| ------------------------- | --------------------------------------- |
| `glaze-studio-draft-v1`   | The draft being edited                  |
| `glaze-studio-library-v1` | Saved themes                            |
| `glaze-studio-session-v1` | Which saved theme is open, and its name |

Themes belong to one browser and one address. Use the theme file to move them.

## Where the code is

| File                                              | Role                                                 |
| ------------------------------------------------- | ---------------------------------------------------- |
| `app.tsx`                                         | Layout, Save, library wiring, Reset all              |
| `draft.ts`, `dials.ts`                            | The draft state and the Scale, Tone and Motion dials |
| `simple-panel.tsx`                                | The side panel                                       |
| `stage.tsx`                                       | The preview frame and its tabs                       |
| `export.ts`, `export-dialog.tsx`, `theme-file.ts` | CSS, config and theme-file output                    |
| `library.ts`                                      | The saved-theme store                                |
| `dashboard.tsx` and the other screens             | The preview screens                                  |

The Advanced panel (`panel.tsx`, `rail.tsx`, `colors.tsx`, `type.tsx`,
`shape-panel.tsx`, `motion-panel.tsx` and their helpers) is kept but nothing
opens it yet.

## Running and deploying

```bash
npm run dev -w studio           # http://localhost:5186, uses packages/ui from source
npm run build:deploy -w studio  # builds against the newest published @amit-kap/glaze
```

The deployed site is built against the published package, not the source, so
it shows what people get from npm; the top bar shows which version
(`Glaze 0.4.0`). `GLAZE_VERSION=0.4.0 npm run build:deploy -w studio` pins one.

Hosting is a Cloudflare Workers project named `glaze-studio`, built from
`main`:

| Setting        | Value                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------- |
| Build command  | `npm run build:deploy -w studio`                                                                    |
| Deploy command | `npx wrangler deploy --assets=apps/studio/dist --name glaze-studio --compatibility-date=2026-11-05` |
| Root directory | the repository root                                                                                 |

A push to `main` rebuilds it. A package release rebuilds it too: the release
workflow waits for npm to list the new version, then calls the project's deploy
hook (the repository secret `CLOUDFLARE_DEPLOY_HOOK`).
