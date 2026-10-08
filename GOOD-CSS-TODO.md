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
7. Fade overflowing edges with `scroll-state` container queries (tabs list, scroll-area, carousel).
8. Press feedback via a shared `--press-scale` token (toggle, tab triggers, menu items, switch).
9. `text-box: trim-both cap alphabetic` on Button, Badge, Kbd, Toggle labels.
10. Icons sized from the text (`1cap`/`1lh`) instead of `size-4`.
11. `user-invalid:` styling on Input/Textarea as a fallback beside `aria-invalid`.

## Token and theme architecture

12. Theme `.dark` blocks override tier-2 tokens with fixed values; derive them from inputs instead (later, consider `light-dark()` + `color-scheme`).
13. Fluid `clamp()` for `--type-display` / `--type-heading` (showcase and web app only).

## Process and docs

14. Install the good-css agent skill (`npx skills@latest add vojtaholik/good-css`) and reference it in `AGENTS.md`.
15. Specimen format for stories: a "Use it when…" line and a "Try: …" instruction in each story's docs description.
16. Agent readability: `llms.txt` and per-component markdown for the showcase or the Storybook build.
