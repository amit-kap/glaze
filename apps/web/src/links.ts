// On the built site the apps are folders next to the home page. In
// development each app runs on its own dev server (`npm run dev` at the repo
// root starts them all), so the links point at those servers' default ports.
const dev = import.meta.env.DEV

export const links = {
  showcase:
    import.meta.env.VITE_SHOWCASE_URL ??
    (dev ? "http://localhost:5180/" : "./showcase/"),
  storybook:
    import.meta.env.VITE_STORYBOOK_URL ??
    (dev ? "http://localhost:6006/" : "./storybook/"),
  studio:
    import.meta.env.VITE_STUDIO_URL ??
    (dev ? "http://localhost:5186/" : "./studio/"),
  github: "https://github.com/amit-kap/glaze",
  npm: "https://www.npmjs.com/package/@amit-kap/glaze",
}

export const installCommand = "npx @amit-kap/glaze init"
