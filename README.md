# shadcn/ui monorepo template

This is a Vite monorepo template with shadcn/ui.

**Architecture:** layers, token contract, theming and component rules are specified in `/Users/amitka/Personal/SharedContext/workflow/comp-lib-architecture.md`. Read it before changing components, tokens or themes.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Storybook

Every component in `packages/ui` has a story in `apps/storybook/src/stories`.

```bash
npm run dev -w storybook    # http://localhost:6006
npm run build -w storybook  # static build in apps/storybook/dist
```

Use the theme switcher in the toolbar to preview light and dark mode. When you add a component, add a matching `<component>.stories.tsx`.
