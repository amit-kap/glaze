export const links = {
  showcase: import.meta.env.VITE_SHOWCASE_URL ?? "./showcase/",
  storybook: import.meta.env.VITE_STORYBOOK_URL ?? "./storybook/",
  studio: import.meta.env.VITE_STUDIO_URL ?? "./studio/",
  github: "https://github.com/amit-kap/glaze",
  npm: "https://www.npmjs.com/package/@amit-kap/glaze",
}

export const installCommand = "npx @amit-kap/glaze init"
