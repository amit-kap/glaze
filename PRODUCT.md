# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Designers and developers who build React products together. Designers shape a theme in Glaze Studio; developers install the library and ship that theme. Both work on shadcn/ui and Tailwind CSS 4 stacks.

## Product Purpose

Glaze is a React component library built on shadcn/ui and Base UI, themed entirely through CSS custom properties. Glaze Studio edits a theme against the default Nova theme, previews it on the real components and exports CSS. Success is a team that restyles every component from one place and ships the result.

## Positioning

One set of shared settings applies across every component. A component diverges only through a named adjustment, so exceptions are visible rather than buried in per-component overrides.

## Operating Context

- Installed with `npx @amit-kap/glaze init`, or `npm install @amit-kap/glaze`.
- Peer dependencies: React 19 and Tailwind CSS 4.
- Monorepo apps: `web`, `showcase`, `storybook`, `studio`; the library is in `packages/ui`.
- Live showcase and Storybook are published on GitHub Pages.

## Capabilities and Constraints

- Accessible primitives from Base UI, following shadcn/ui conventions.
- Light and dark modes; comfortable and compact density; they combine freely.
- Scoped theming: a custom theme can apply to one section of a page.
- One built-in theme, Nova; users save their own through Studio or by hand.
- Some components exist only in Glaze, outside the shadcn set (e.g. InsetSlider).

## Evidence on Hand

- Live showcase and Storybook (links in README.md).
- No user testimonials, adoption numbers or external case studies exist yet; do not invent them.

## Product Principles

1. One theme governs everything; exceptions are named and visible.
2. Build on accessible primitives rather than reinventing them.
3. Theming is CSS, so it works with any tool and any build.
4. What Studio previews is what the exported CSS produces.
