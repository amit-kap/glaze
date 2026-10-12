// One demo per Glaze component, with the same content as that component's
// Storybook stories (apps/storybook/src/stories), so the showcase and the docs
// show one product. Each demo names the stories it mirrors. Like the stories,
// classes follow the token contract (npm run check:tokens checks both).
//
// Demos are grouped by purpose into one file per section; this barrel keeps
// importers on `from "./demos"`.
export * from "./actions"
export * from "./inputs"
export * from "./navigation"
export * from "./overlays"
export * from "./feedback"
export * from "./typography"
export * from "./conversation"
export * from "./people"
export * from "./data"
export * from "./forms"
