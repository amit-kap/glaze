---
name: glaze-component
description: Create a new Glaze component or refine an existing one. Researches references from Amit's comp-libs bookmarks, produces three interactive, animated alternatives on a Claude Design canvas using only Glaze tokens, then builds the chosen one in packages/ui. Use when asked to "make/add/design/improve/refine a <component>" for Glaze.
---

# Glaze component: create or refine

Glaze is a shadcn Nova-based library on Base UI primitives. Themes change how it looks, never the structure. Read `glaze-architecture.md` (V4) before starting. Components carry no visual decisions: every colour, radius, size, type, shadow and motion value is a token.

Two human checkpoints are mandatory: after research (step 2) and after the three alternatives (step 5). Do not run past them.

## 0. Intake and audit

- Does `packages/ui/src/components/<name>.tsx` exist? Yes → **refine**: read its code, its story, and its catalog entry (`packages/ui/src/theme/catalog.ts`, `consumers.ts`). No → **create**: find the nearest siblings (e.g. Select beside Combobox) and read them.
- Read `packages/ui/src/styles/tokens.css` and the theme in use. These are the only values the alternatives may use.
- Ask only questions that change the design (use case, required variants). Otherwise decide and state assumptions in one line.

## 1. Research

1. Read `/Users/amitka/Personal/SharedContext/Bookmarks/comp-libs.md`. Visit every site listed (Bright Data `scrape_as_markdown` / `scrape_batch`, or the built-in browser for JS-heavy sites). Do not stop at the first match; the goal is breadth, then a short list.
2. For each page, find references matching the component. Record per reference: URL, what it does, anatomy, states, motion, keyboard and ARIA behaviour, edge cases (long text, empty, loading, RTL).
3. Behaviour comes from the Base UI primitive; references inform visuals, anatomy, motion and API only.
4. If a site has nothing relevant, say so in one line. Do not invent references.

## 2. Checkpoint: reference set

Show the shortlist (5–8 references, one line each on what to borrow) and the proposed direction for the three alternatives. Wait for approval or edits.

## 3. Token budget

Before drawing, list the Glaze tokens each alternative will use (radius, control height, type scale, colours, shadow, focus ring, duration/easing). If an alternative needs a value with no token, flag it and propose a new token. Never hardcode it.

## 4. Three alternatives on the Claude Design canvas

Use the Artifact tool with the **Design** type (`quickstart` intent `design`, then publish with its `type_url`). Follow its instructions and references (`format.md` for interaction and events).

- **One canvas, three artboards**, labelled A, B and C. The alternatives must differ in structure or interaction model, not only in colour.
- **Glaze tokens only.** Upload `packages/ui/src/styles/tokens.css` and the active theme CSS as assets and link them, so artboards use `var(--…)`. No raw hex, px radius or ad-hoc font sizes. Use the same font and type scale as the existing components.
- **Show the states that apply to this component** on each artboard, in a visible matrix: default, hover, focus-visible, active, disabled, plus size/variant axes, and loading, error, selected or empty only when the component really has them (a slider has no loading or error). Say which you left out and why. Light and dark both.
- **Interactive and animated**: mark artboards `is_interactive`; real working controls (real `<button>`, `<input>`), live state changes, motion via `--duration-*` / easing tokens, and `prefers-reduced-motion` respected.
- **Consistency strip**: include, on each artboard, the component beside Button, Input and Card so radius, height, type, focus ring and density can be compared at a glance.
- **Design language is fixed.** The new component must read as part of the same library: same colours, radii, type sizes, spacing rhythm, shadows and motion as its siblings. Do not introduce a new visual idiom.
- **Flag non-Glaze pieces**: under each alternative list which parts are not Glaze kit pieces and why (Amit's standing preference).
- Per-alternative note in the reply: what it optimises for, trade-offs, tokens used, any proposed new token.

The artboards are hand-built HTML. They cannot import `packages/ui`, so they illustrate the design with real tokens; they are not the real component. Say so.

## 5. Checkpoint: choose

Give the link and a short comparison. Wait for Amit to pick (or ask for a merge/refinement; iterate on the canvas).

## 6. Implement

- Write or edit `packages/ui/src/components/<name>.tsx`: Base UI primitive for behaviour, shadcn conventions (`data-slot`, `cva` variants, semantic names), tokens only.
- Add or update its entry in `packages/ui/src/theme/catalog.ts` / `consumers.ts` so Studio and "used by" counts see it. Run `node scripts/glaze-catalog.mjs` if the repo expects regeneration (check the script header first).
- Add or update the Storybook story in `apps/storybook`, one story per state, in the right section (library, or **Custom** for Glaze-only components).
- If a new token was agreed, add it through the catalog and `tokens.css`, never inside the component.

## 7. Verify

- Start storybook and studio with `preview_start`. Check every state in light and dark, under at least two themes (Nova plus one other).
- Keyboard pass (Tab, arrows, Escape, typeahead where relevant), screen-reader labels, contrast, reduced-motion.
- Console and build clean (`npm run build`/lint as the repo defines).
- Compare against the siblings: same radius, height, type, focus ring.

## 8. Record and close

- Append a short decision record (chosen, rejected, why, references used, tokens added) to the component's story docs or `docs/`.
- Do not commit unless asked. Summarise: files changed, new tokens, anything not verified.

## Refine mode differences

Start from the existing component's states and screenshot it first. Alternative A should be the least invasive change; B and C may be bolder. Keep the public API stable unless Amit agrees to a breaking change.
