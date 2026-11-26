# Glaze Studio

Glaze Studio edits a theme against Nova, previews it on the real Glaze
components and exports it. It lives in `apps/studio` and is deployed at
<https://glaze.amitkap.com/studio>.

## What it does

- **Home.** Studio opens on a files page (`#/`). A side panel holds the logo,
  Search and the pages: Recents (the signed-in user's themes, newest first),
  Templates (Nova, Folio and Volt, each a live preview in light and dark) and
  Archive. Each page shows cards or a list; the grid/list toggle is
  remembered. "New theme" starts one from Nova. Clicking a card or row opens
  the editor (`#/edit`); a template is a copy, so its first Save makes a new
  library entry. Search is a field in the side panel: its list opens under it
  with the themes and templates and narrows while typing, and ⌘K puts the
  cursor in it. Signed out, Recents shows the sign-in poster (it counts the
  themes this browser already holds) and the templates. If the open draft
  has unsaved changes, opening another theme first asks Save, Discard or
  Cancel. The logo in the editor goes back to Home.
- **Archive.** The "more" menu on a card or row, or a right-click, archives a
  theme or a template; a toast offers Undo. The Archive page lists both, each
  with a Restore button. An archived theme can also be deleted forever, after
  a confirmation; a template is part of Studio, so it can only be restored.
- **Sign in is a mock.** It takes a name and an email, stores them in the
  browser and sends nothing anywhere; there is no password and no account.
  Recents shows the themes the library already keeps in this browser.
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

| Key (`localStorage`)                 | Holds                                   |
| ------------------------------------ | --------------------------------------- |
| `glaze-studio-draft-v1`              | The draft being edited                  |
| `glaze-studio-library-v1`            | Saved themes                            |
| `glaze-studio-session-v1`            | Which saved theme is open, and its name |
| `glaze-studio-user-v1`               | The mock sign-in: name and email        |
| `glaze-studio-view-v1`               | Grid or list on the files pages         |
| `glaze-studio-archived-templates-v1` | Archived templates, by name             |

Archiving a theme only marks it (`archivedAt` in the library entry), so it
leaves Recents and the editor's switcher and can be restored. An archived
template is only hidden from Templates and Search.

Themes belong to one browser and one address. Use the theme file to move them.

## Where the code is

| File                                              | Role                                                        |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `app.tsx`                                         | Home or editor by URL hash; draft, session, library         |
| `route.ts`                                        | The hash route (`#/`, `#/templates`, `#/archive`, `#/edit`) |
| `home.tsx`, `files-shell.tsx`, `files-search.tsx` | The files pages, their side panel and its search            |
| `sign-in-poster.tsx`, `brand-mark.tsx`            | The signed-out poster; the logo and wordmark                |
| `theme-card.tsx`, `theme-list.tsx`, `view.ts`     | The grid cards, the list view and the view choice           |
| `templates.ts`                                    | The three template themes                                   |
| `user.ts`, `user-control.tsx`                     | The mock sign-in, its dialog and the account menu           |
| `editor.tsx`, `top-bar.tsx`                       | The editor layout, Save, Reset all                          |
| `scope.ts`                                        | The CSS variables a preview frame wears                     |
| `draft.ts`, `dials.ts`                            | The draft state and the Scale, Tone and Motion dials        |
| `simple-panel.tsx`                                | The side panel                                              |
| `stage.tsx`                                       | The preview frame and its tabs                              |
| `export.ts`, `export-dialog.tsx`, `theme-file.ts` | CSS, config and theme-file output                           |
| `library.ts`                                      | The saved-theme store                                       |
| `dashboard.tsx` and the other screens             | The preview screens                                         |

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

Studio is one folder of the Glaze site, <https://glaze.amitkap.com/studio>.
The site (home page, `/showcase`, `/studio`, `/storybook`) is one Cloudflare
Workers project named `glaze-studio`, built from `main` and described by
`wrangler.jsonc`:

| Setting        | Value                 |
| -------------- | --------------------- |
| Build command  | `npm run build:site`  |
| Deploy command | `npx wrangler deploy` |
| Root directory | the repository root   |

`build:site` (`scripts/site-build.mjs`) builds every app with relative paths
into `_site/`; Studio's part is the same `build:deploy` as above. The old
address, `glaze-studio.amitkap.com`, stays attached to the project: themes are
stored per address, so the ones saved there are exported from
`glaze-studio.amitkap.com/studio` and imported at the new one.

A push to `main` rebuilds it. A package release rebuilds it too: the release
workflow waits for npm to list the new version, then calls the project's deploy
hook (the repository secret `CLOUDFLARE_DEPLOY_HOOK`).
