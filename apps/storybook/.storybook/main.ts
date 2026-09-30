import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/react-vite",
  typescript: {
    // The ui components type their props via imported types (Base UI props,
    // cva VariantProps), which only the TypeScript-based docgen can resolve.
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // Components live in the ui package, outside this workspace root.
      include: [
        resolve(import.meta.dirname, "../../../packages/ui/src/components/**/*.tsx"),
      ],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Skip the hundreds of inherited DOM attributes; keep our own props and
      // Base UI's (render, nativeButton, onOpenChange, ...).
      // Mapped types (cva's VariantProps) have no declarations, so keep those.
      propFilter: (prop) =>
        !prop.declarations?.length ||
        !prop.declarations.every((d) => d.fileName.includes("@types/react")),
    },
  },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite")
    return mergeConfig(config, { plugins: [tailwindcss()] })
  },
}

export default config
