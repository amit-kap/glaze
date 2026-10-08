# good-css suggestions for Glaze

Source: https://good-css.com/ (reviewed 2026-10-08). Strike out an item (`~~…~~`) and add the date when done.

## High value, small changes

1. ~~Route all motion through tokens: replace hardcoded `duration-[0.35s]` / `ease-[cubic-bezier(…)]` in navigation-menu, toast, message-scroller, drawer; add a `--ease-spring` input; give tooltip a `duration-(--duration-*)`; make `check:tokens` reject `ease-[` and `duration-[`.~~ Done 2026-10-08 (input named `--motion-ease-enter` → `ease-enter`).
2. ~~Logical properties: swap ~45 physical utilities (`pl-`/`pr-`/`left-`/`right-`) in menus, select, native-select, input-group, dialog, alert for `ps-`/`pe-`/`start-`/`end-`; add a `check:tokens` rule.~~ Done 2026-10-08 (155 classes across 38 components; positions use Tailwind 4.3's `inset-s-`/`inset-e-` since `start-`/`end-` are deprecated; side-tied and centring classes stay physical as listed exceptions).
3. ~~`tabular-nums` on table, calendar, input-otp, pagination, slider.~~ Done 2026-10-08 (slider skipped: it renders no text, and its children are fixed).
4. ~~`overflow-clip` over `overflow-hidden` on clipping-only wrappers (card, badge, item, attachment, bubble).~~ Done 2026-10-08 (also the slider track; bubble gains `flow-root` to keep the formatting context `overflow-hidden` gave it).
5. ~~Safe-area insets (`env(safe-area-inset-*)`) on toast, bottom sheet, drawer, sidebar.~~ Done 2026-10-08 (`--safe-top/-bottom/-left/-right/-inline` tokens; apps must opt in with `viewport-fit=cover`, which showcase and web do not set yet).

## Medium: improvements to how components behave

6. ~~Safe alignment: `justify-center-safe` on tabs list, toggle-group, button-group.~~ Done 2026-10-08 (tabs list and trigger, button, toggle, badge; toggle-group and button-group start-align, so they had nothing to change).
7. ~~Fade overflowing edges with `scroll-state` container queries (tabs list, scroll-area, carousel).~~ Done 2026-10-08 with shadcn's `scroll-fade` / `-x` / `-y` (scroll-driven, on the scroller itself, which a `scroll-state` query cannot style) on the scroll-area viewport and tabs list; scroll-area's focus ring moved to the root so the mask cannot clip it. Carousel skipped: Embla moves slides with transforms, not scrolling.
8. ~~Press feedback via a shared `--press-scale` token (toggle, tab triggers, menu items, switch).~~ Done 2026-10-08 (input `--motion-press: 0.97`; toggle, tab triggers, switch. Menu items skipped: scaling a full-width row shifts its edges and reads as jitter. Button keeps shadcn's `translate-y-px`).
9. ~~`text-box: trim-both cap alphabetic` on Button, Badge, Kbd, Toggle labels.~~ Done 2026-10-08 via `trimText()` in `lib/label.ts`, which wraps bare text children in a trimmed `data-slot="label"` span (the trim cannot reach a flex container's anonymous text). Measurable in Maia (Figtree, caps were ~0.9px high); Geist, Inter and Noto were already within 0.1px.
10. ~~Icons sized from the text (`1cap`/`1lh`) instead of `size-4`.~~ Done 2026-10-08: `--icon-size: round(1lh - 0.25rem, 1px)` on icons that sit in a line of text (30 rules in 17 components). Nova is pixel-identical (all 67 story/slot groups re-measured); Lyra icons go to 14px. Box-contained icons (avatar, checkbox, empty, attachment/item media, sidebar actions) and the explicit xs/sm button sizes keep fixed sizes.
11. ~~`user-invalid:` styling on Input/Textarea as a fallback beside `aria-invalid`.~~ Done 2026-10-08 (also native-select and input-group).

## Token and theme architecture

12. ~~Theme `.dark` blocks override tier-2 tokens with fixed values; derive them from inputs instead (later, consider `light-dark()` + `color-scheme`).~~ Done 2026-10-08: per-mode mix inputs (`--mix-fill/-muted/-sidebar/-strong/-ring`, dark values in `tokens.css`) plus `--sidebar-brand(-ink)` and `--caution` inputs replace the 14 dark pins in all 8 themes; light pins now apply only outside dark mode. Light is unchanged; dark is within ΔE 0.01 of shadcn (Sera's ring 0.02). `light-dark()` not adopted: modes are class-driven, and nested themed subtrees need per-element tokens.
13. ~~Fluid `clamp()` for `--type-display` / `--type-heading` (showcase and web app only).~~ Not applicable 2026-10-08: neither app (nor any component) uses `text-display` or `text-heading`, so a fluid clamp would change nothing. Revisit when a page uses them.

## Process and docs

14. ~~Install the good-css agent skill (`npx skills@latest add vojtaholik/good-css`) and reference it in `AGENTS.md`.~~ Skipped 2026-10-08 by choice (third-party install); can be added later.
15. ~~Specimen format for stories: a "Use it when…" line and a "Try: …" instruction in each story's docs description.~~ Deferred 2026-10-08 to `storybook/upstream-stories`, which is rewriting the same 61 story files.
16. ~~Agent readability: `llms.txt` and per-component markdown for the showcase or the Storybook build.~~ Done 2026-10-08: `scripts/glaze-llms.mjs` (TypeScript AST) writes `/llms.txt` and `/llms/<component>.md` (description, import, cva variants and defaults, data-slot parts, story links) for the Storybook dev server and build.
