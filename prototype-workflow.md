# Sketching UIs in Paper with this component library

How an AI agent sketches UI in Paper using the components in `packages/ui`. It applies to any agent with access to the Paper MCP server, such as Claude Code, Codex or OpenCode.

## Source of truth

- The code (`packages/ui/src/components/*.tsx` and `packages/ui/src/styles/globals.css`) is the source of truth.
- The Paper library copies the code and never leads. When they disagree, the code wins.
- Storybook (`apps/storybook`) holds the documentation: props, stories and states.

## The master library file

- Paper file: **shadcn-comp-lib** (`01M2SEXJVQ6AGV316HJQ9W58S4`).
- The master is never sketched in. It only holds the kit.
- It has one kit page, named `<style>-<baseColor>` from `components.json`. Currently **base-nova-neutral**. It contains:
  - a **Tokens** artboard with color and radius swatches from `globals.css`
  - one artboard per component (`Button`, `Input`, `Card`, …)
  - a sync stamp: `synced with <commit>`
- Each component artboard holds kit pieces only: one per variant and size, plus common states or combinations. No docs.
- A second page, **icons · lucide**, holds the 20 most-used Lucide icons as `Icon / name` (16px, stroke 2), copied from the installed `lucide-react`.
- **[paper-kit-index.md](paper-kit-index.md)** lists the node ID of every kit piece and icon, plus known gaps. Paper can't search by layer name, so read this file instead of walking the kit with Paper calls.

### Kit piece rules

- **Naming:** `Component / variant / size`, e.g. `Button / outline / sm` or `Badge / secondary`. Agents look pieces up by name in the kit index.
- **Tokens only:** colors, radius and fonts use file tokens. The only exceptions are values Paper can't express; see [Paper constraints](#paper-constraints).
- **Fill, don't fix:** if a part is `w-full` in the code, it fills its container in the kit too. Then one width set on a clone carries through to everything inside it.
- **Edit in place:** never delete and rebuild a piece. Node IDs must stay stable, because clones depend on them.
- **Build as needed:** start with the core primitives, and add a component the first time a sketch needs it.

### Core primitives, built first

Button · Input · Label · Field · Select · Checkbox · Switch · Card · Badge · Avatar · Tabs · Separator · Table · Dialog · Sidebar

## Keeping the library in sync

- When component code or `globals.css` changes, update the matching kit pieces and tokens in the master file.
- Update the sync stamp to the commit that was synced.
- When a piece is added or rebuilt, update [paper-kit-index.md](paper-kit-index.md) in the same change.

## Sketching a UI

1. **Copy the master:** create a new Paper file as a copy of `shadcn-comp-lib`. Tokens, kit pieces and node IDs all come with it.
2. **Add a page per sketch** in that copy. The kit page (`base-nova-neutral`) stays as a reference.
3. **Find pieces** in [paper-kit-index.md](paper-kit-index.md). The IDs are the same in the copy.
4. **Pass `fileId` on every Paper call.** Without it, a call acts on the file the Paper UI is showing, which may be the master.
5. **Place pieces with clones:** `<x-paper-clone node-id="…" />`. Write plain markup only for layout and one-off content.
6. **Adjust clones in place:** change text, set widths, swap icons. To swap an icon, replace it with a clone of an `Icon / name` piece. To recolor an icon, set `stroke` on its child paths; a style on the clone tag is ignored.
7. **Check as you go:** take screenshots, and compare against Storybook where accuracy matters.
8. **Reuse frames:** sketches of the same app share a shell. Duplicate a finished frame and change it rather than building the next one from scratch.

### Clone or write markup

- Clone when the piece is used as the kit has it, or needs only text and width changes. The clone then matches the code exactly.
- Each adjustment after a clone costs a call. If a clone needs more than about three structural changes (insert, move or delete children), check the kit index's known gaps. Then either build the missing variant in the master or write the element as markup with tokens, and say which you chose.
- App-specific parts, such as data visualizations, list rows and panels, are markup with tokens. The kit covers primitives, not screens.

### Responsive frames

- Build the frame with flex: fixed-width side panels (`flex-shrink: 0`) and a fluid center (`flex: 1; min-width: 0`).
- Check by resizing the artboard (for example 1280×800 and 1680×1050), then set it back.
- For absolutely positioned content that must scale, like a graph, give the stage `width: 100%`, a `max-width` and an `aspect-ratio`. Draw its SVG at `width/height: 100%`, and place each node with `left/top: calc(<x>% - <half its size>px)`.

### If a component isn't in the kit yet

1. Build its kit piece in the **master** file from the code.
2. The sketch file is an older copy, so add the piece there as well (write it once, then clone it within that file).

Do this before using the piece in a sketch, not afterwards. For a missing Lucide icon, run `node scripts/paper-icon-cells.mjs <name> [...]`. It prints icon cells built from the installed `lucide-react`. Paste the output into the icons Grid in the master and in the sketch copy, then add the master IDs to the kit index.

## Review loop

How the designer and the agent iterate on a sketch.

- **Agree on content first.** Before building a new part in high fidelity, the agent lists what it shows in 4–5 lines, e.g. "Row: title · reach · severity · risk type · asset". The designer approves it, then the agent builds. Most rework comes from content, not visuals.
- **Feedback goes in Paper comments.** Pin each comment on the element it's about (select it, then comment), not on a large container. A comment on a container has no element context, so the agent has to look up its position. If pinning is awkward, name the element in the text.
- **"Do the comments"** starts a round:
  1. Take one screenshot of the frame first. The designer may have edited it directly; keep those edits.
  2. Read all open threads.
  3. Do clear, mechanical comments right away. Ask once, in one batch, about anything that is a design decision.
  4. Apply all changes, then take one screenshot to check.
  5. Record design decisions in the project's decisions file.
  6. Resolve each thread that was handled. The Paper tools can't delete comments; the designer deletes or hides resolved ones in Paper.
- **Small fixes are faster by hand.** Text, nudges and color swaps the designer makes in Paper directly.
- **Before calling a frame done**, run the responsive check again (see [Responsive frames](#responsive-frames)).

## Paper constraints

- **Clones only work within a file.** Clones across pages work; clones across files produce nothing. That's why sketch files start as copies of the master.
- **Copies are snapshots.** A copied file doesn't receive later master updates. Check its sync stamp, and re-sync or start a fresh copy when it's out of date.
- **Tokens are per file.** They exist in a sketch file only because it was copied from the master.
- **No two-token color mixing.** `color-mix(var(--color-primary) 80%, transparent)` works. Mixing two tokens doesn't, so use the resolved value instead. Example: secondary hover = `oklch(92.9% 0 0)`.
- **Layout:** flex, padding and gap only. No CSS grid, no margins except negative bleed, no HTML tables.
- **No light/dark modes** for tokens. Only the light theme is modeled for now.
- **No layer-name search.** `find_nodes` matches styles and text content only. Use the kit index, or `get_tree_summary` on an artboard.
- **Negative margins don't offset absolute elements.** They are ignored there; use `calc()` in `left`/`top` instead.
- **Empty elements are dropped.** A `div` with no content and no visible style isn't created.
- **No CSS gradients as backgrounds.** A `radial-gradient` background renders as a solid fill.
- **Stale measurement after a resize.** An `aspect-ratio` element can keep its old height after its artboard is resized. Set the `aspect-ratio` style again to re-measure.
