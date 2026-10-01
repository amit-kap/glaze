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

### Kit piece rules

- **Naming:** `Component / variant / size`, e.g. `Button / outline / sm` or `Badge / secondary`. The agent finds pieces by name.
- **Tokens only:** colors, radius and fonts use file tokens. The only exceptions are values Paper can't express; see [Paper constraints](#paper-constraints).
- **Fill, don't fix:** if a part is `w-full` in the code, it fills its container in the kit too. Then one width set on a clone carries through to everything inside it.
- **Edit in place:** never delete and rebuild a piece. Node IDs must stay stable, because clones depend on them.
- **Build as needed:** start with the core primitives, and add a component the first time a sketch needs it.

### Core primitives, built first

Button · Input · Label · Field · Select · Checkbox · Switch · Card · Badge · Avatar · Tabs · Separator · Table · Dialog · Sidebar

## Keeping the library in sync

- When component code or `globals.css` changes, update the matching kit pieces and tokens in the master file.
- Update the sync stamp to the commit that was synced.

## Sketching a UI

1. **Copy the master:** create a new Paper file as a copy of `shadcn-comp-lib`. Tokens, kit pieces and node IDs all come with it.
2. **Add a page per sketch** in that copy. The kit page (`base-nova-neutral`) stays as a reference.
3. **Find pieces** by layer name on the kit page.
4. **Place pieces with clones:** `<x-paper-clone node-id="…" />`. Write plain markup only for layout and one-off content.
5. **Adjust clones in place:** change text, set widths, swap icons. To swap an icon, replace it with a clone of an `Icon / name` piece. To recolor an icon, set `stroke` on its child paths; a style on the clone tag is ignored.
6. **Check as you go:** take screenshots, and compare against Storybook where accuracy matters.

### If a component isn't in the kit yet

1. Build its kit piece in the **master** file from the code.
2. The sketch file is an older copy, so add the piece there as well (write it once, then clone it within that file).

## Paper constraints

- **Clones only work within a file.** Clones across pages work; clones across files produce nothing. That's why sketch files start as copies of the master.
- **Copies are snapshots.** A copied file doesn't receive later master updates. Check its sync stamp, and re-sync or start a fresh copy when it's out of date.
- **Tokens are per file.** They exist in a sketch file only because it was copied from the master.
- **No two-token color mixing.** `color-mix(var(--color-primary) 80%, transparent)` works. Mixing two tokens doesn't, so use the resolved value instead. Example: secondary hover = `oklch(92.9% 0 0)`.
- **Layout:** flex, padding and gap only. No CSS grid, no margins except negative bleed, no HTML tables.
- **No light/dark modes** for tokens. Only the light theme is modeled for now.
