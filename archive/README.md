# Archived specifications

Superseded architecture proposals, kept for the reasoning rather than as
instructions. The current specification is `../glaze-architecture.md` (V4).

| File | What it proposed | Why it was dropped |
| --- | --- | --- |
| `glaze-architecture-v1.md` | The library's token contract: three tiers, themes set inputs only, named themes may pin derived values. | Named themes pinning derived values made the same setting behave differently per theme, and the tier names leaked into the editor. |
| `glaze-architecture-v2.md` | "Nova plus your changes": one derivation contract, visible and resettable exceptions. | Kept the input-to-system layer and rebuilt the whole catalog around a resolver, without the Studio the model was for. |
| `glaze-architecture-v3.md` | Drop the library contract; edit stock shadcn variables and export CSS. | Threw away the component work, the custom components and the existing themes to gain tidiness. |

V4 keeps the library, the components, Nova, Storybook and Studio, and applies
the parts of V2 that survived review: explicit changes only, reset restores the
default, optional Brand/Primary separation, and conditional components behind
one catalog.
