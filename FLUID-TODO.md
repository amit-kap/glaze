# Fluid Functionalism suggestions for Glaze

Source: https://www.fluidfunctionalism.com/ and https://github.com/mickadesign/fluid-functionalism (reviewed 2026-10-11; see its `motion-guidelines.md`, `lib/springs.ts`, `lib/font-weight.ts`, `registry/default/hooks/`). Strike out an item (`~~…~~`) and add the date when it is approved as ready. Status marks: 🚧 in progress, ✅ implemented and awaiting review, 🟡 partly done, ⏭ not done (reason given).

Approach: Fluid Functionalism animates with framer-motion springs driven from JavaScript. Glaze stays CSS-only and token-driven, so each idea is translated to CSS unless noted.

## High value, small changes

1. **🚧 In progress (started 2026-10-11); implementation complete, awaiting review.** Sliding tab indicator: use Base UI's `Tabs.Indicator` in `tabs.tsx`, positioned from `--active-tab-left/-top/-width/-height` (confirmed in the installed version) and moved with `--duration-moderate`. Today the active style is a shadow on each trigger, so selection jumps. Optional: the hover pill fades in from the selected pill at 0.4 opacity.
   - Done: indicator (default pill and line underline, horizontal, vertical, RTL), FF sizing (36px list, 4px padding, 28px tabs, 12px padding, 8px icon gap), 1px offset fixed, vertical tabs no longer squashed, hover pill (`hover-scope`, styled and timed like the menu highlight; it appears at the hovered tab rather than sliding out of the selected one).
2. **✅ Implemented 2026-10-11, awaiting review.** Reduced motion means "less", not "none": `--motion-scale: 0` also turns off fades. Split it into a movement scale and a fade scale, so opacity and colour still transition while transforms, position and scale are dropped.
3. **🟡 Partly done 2026-10-11, awaiting review.** Faster exits: add `--duration-*-exit` tokens (about 25% quicker than enter, no bounce) and use them for closing popups, dialogs, toasts and drawers. `ease-exit` exists, but exits reuse the enter durations.
   - Done for popups, dialogs, tooltips, hover cards, the navigation-menu indicator and the sheet overlay. Not done for toasts, drawers and sheet panels: they use their own component tokens and slide, so they need separate tuning.
4. **✅ Implemented 2026-10-11, awaiting review.** Reject `transition-all` in `check:tokens` (10 components use it) and replace it with explicit property lists. Prefer `transform`/`opacity`; flag layout transitions such as the sidebar's `transition-[width,height,padding]`.
   - The sidebar's layout transitions are left as they are: collapsing the sidebar to icons genuinely changes its size.

## Medium: improvements to how components behave

5. **🟡 Partly done 2026-10-11, awaiting review.** One shared hover highlight per list ("fluid hover"): a single highlight glides to the hovered or highlighted row instead of each row blinking its own background (dropdown-menu, context-menu, menubar, select, combobox, command, navigation-menu, table). CSS route: an `anchor-name` on `[data-highlighted]` plus one highlight element per popup, positioned with anchor positioning and moved with a token transition. Browsers without anchor positioning keep the per-item background. Gate it on `@media (hover: hover)`.
   - Done: dropdown-menu (and menubar, which reuses it), context-menu, select, combobox, via the `highlight-scope` utility. Revised 2026-10-11: the first version positioned the layer with CSS anchor positioning and missed rows during fast pointer moves; it now uses `useHighlightLayer()`, which measures the highlighted row and moves the layer with `translate`, and works in every browser. Not done: command (cmdk marks rows with `data-selected`, not `data-highlighted`), navigation-menu and table (hover-only, no highlighted row). On a fresh entry the highlight appears on its row and fades in, rather than sliding in from the selected row.
6. **🟡 Partly done 2026-10-11, awaiting review.** No dead zones between rows: a `::before` with a small negative inset on menu items covers the 2–4px gaps, so the cursor in a gap still lands on a row.
   - Done for separator gaps in the same menus. Not done for the popup's own 4px padding at its edges.
7. **🟡 Partly done 2026-10-11, awaiting review.** Spring-like easing tokens: add `--motion-ease-spring` (a critically damped spring as a CSS `linear()` curve), settable per theme. Test faster tiers for hover and highlight motion (FF: 80/160/240ms; Nova: 100/150/200/300ms). The rule: the bigger the thing that moves, the slower it moves.
   - Done: `--motion-ease-spring` / `ease-spring`, used by the tab indicator, the menu highlight and the tab hover pill. Not done: faster tiers; changing Nova's durations is a design call.
8. **🟡 Partly done 2026-10-11, awaiting review.** Weight changes without layout shift: `sidebar.tsx` switches `data-active:font-medium`, which widens the label. Reserve the heavier width with a hidden `::after { content: attr(data-label) }` at the heavier weight (works with all theme fonts, unlike FF's Inter-only `opsz` trick). This also lets selected tabs and toggles get bolder.
   - Done: `reserveWeight()` in `lib/label.ts`; selected tabs go from medium to strong with no width change. A CSS `::after` ghost was rejected because it would break the cap-height text trim. Not done: sidebar (its labels are arbitrary children, not plain text) and toggles.

## Larger pieces

9. **✅ Implemented 2026-10-11, awaiting review.** Icon swap crossfade: a shared class for a two-icon cell. The outgoing icon fades out with a 4px blur and shrinks to 0.6 scale; the incoming icon reverses that. The appear outlasts the disappear. Reduced motion swaps in place.
10. **🟡 Partly done 2026-10-11, awaiting review.** Merged selected backgrounds: neighbouring selected rows (toggle-group, checkbox lists, selected table rows) join into one rounded block. CSS: `:has(+ [data-selected])` and `[data-selected] + [data-selected]` square off the corners where two selected rows touch.
   - Done for joined toggle groups (`spacing={0}`, default variant). Not applicable to table rows (square already) or checkbox lists (no row background). No animation of the corners.
11. **✅ Implemented 2026-10-11, awaiting review.** Height-to-auto in CSS: `interpolate-size: allow-keywords` for collapsible and sidebar groups, as a progressive enhancement.
   - Done for Collapsible with Base UI's `--collapsible-panel-height`, which works in every browser, instead of Chromium-only `interpolate-size`. Sidebar groups animate wherever an app builds them from Collapsible, as the sidebar story does; the sidebar component itself has no collapsing group.
12. **⏭ Not done.** Optional JavaScript route for fluid hover: port `pickNearest` (a small, tested function) if card grids or 2D layouts need nearest-item highlighting that CSS cannot do.
   - Not needed yet: the CSS highlight covers the menus, and no card grid needs it.

## Process and docs

13. **✅ Implemented 2026-10-11, awaiting review.** Motion reference: a story or showcase page that maps each component to its motion tier (fast / moderate / slow), like FF's Motion page, and a rule that new components pick a tier rather than a raw duration.
   - Done as a Motion section in `README.md` (which token for which kind of motion, and the rules), plus the new inputs in `PACKAGE_README.md`. No Storybook page: Storybook has no foundations pages yet.
14. **⏭ Not done.** Keyboard focus gate: if menu rows get visible focus rings, show them only after keyboard use; Chrome marks script-driven focus as `:focus-visible` when a popup opens (FF's `useKeyboardNavGate`).
   - Not applicable: Glaze menu rows show focus with the highlight background, not a ring.

## Added during review

15. **✅ Implemented 2026-10-11, awaiting review.** Pointer cursor on everything clickable: a zero-specificity base rule in `globals.css` (buttons, links, tabs, menu items, options, checkboxes, radios, switches, sliders and so on), the default cursor on disabled controls, menu and option rows switched from `cursor-default` to `cursor-pointer`, and the slider control given the pointer. Select's scroll arrows keep the default cursor (they scroll on hover).
16. **✅ Implemented 2026-10-11, awaiting review.** Faster highlight: the menu highlight and tab hover pill glide on `--duration-fast` (100ms) instead of 200ms.

Not carried over: press-scale feedback, tried and reverted on 2026-10-08 (`GOOD-CSS-TODO.md` item 8).
