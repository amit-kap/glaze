# Glaze

Glaze is a React component library (shadcn/ui on Base UI, themed through CSS
custom properties) and Glaze Studio, its theme editor. Read `README.md` first,
then `docs/architecture.md` before changing components, tokens or themes.

## Where things are

- `packages/ui`: the library. `src/theme/catalog.ts` is the settings catalog.
- `apps/studio`: Glaze Studio (`docs/studio.md`). `apps/showcase`: component
  tiles, shared with Studio's Components tab. `apps/storybook`: stories.
- `scripts`: checks, package build, release, Studio deploy build.

## Rules

- Components carry no visual decisions. Every colour, radius, size, type,
  shadow and motion value is a token. `npm run check:tokens` enforces this on
  the library, stories, showcase and Studio; run it before committing.
- A new or renamed setting goes in `packages/ui/src/theme/catalog.ts` first;
  `npm run check:catalog` verifies it.
- A new public import path (like `theme/catalog`) must be added to the exports
  in `scripts/glaze-build.mjs`, or the published package can't be imported.
- Studio's preview frame is the only themed area; its toolbar and panel are
  not. Studio follows the published package when deployed, so it must not use
  anything that is not in the latest release.
- Before opening a pull request: `npx turbo lint typecheck build`.
- Releases happen by bumping `version` in `packages/ui/package.json` and
  merging to `main` (`docs/development.md`). Never publish by hand.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
