import { parseConfig, type GlazeConfigInput } from "@amit-kap/glaze/lib/config"

import { toneComponentVars } from "./dials"
import type { Stored } from "./draft"
import { fontCssUrl, googleFamilyOf, wantedWeights } from "./google-fonts"
import { motionChanged, motionTokens } from "./motion"
import { shapeChanged, shapeTokens } from "./shape"
import { changed, followVars, tokens, type Mode } from "./theme"
import { typeChanged, typeTokens } from "./typography"

/**
 * What a theme sets beyond Nova, as plain token → value maps. The CSS and the
 * config are both written from this, so they can't drift apart.
 */
type Model = {
  light: Record<string, string>
  dark: Record<string, string>
  /** Type, shape and motion are shared by both modes. */
  shared: Record<string, string>
  /** Component tokens the Tone slider sets. */
  components: Record<string, string>
  /** Google fonts the theme uses, as stylesheet URLs. */
  fontUrls: string[]
}

function model(stored: Stored): Model {
  // A changed colour also carries the derived colours Nova writes as
  // literals, so the exported theme follows it as the preview does.
  const colors = (mode: Mode) => {
    const edited = tokens.filter((token) =>
      changed(mode, token, stored.theme[mode][token])
    )
    return Object.fromEntries([
      ...edited.map((token) => [token, stored.theme[mode][token]]),
      ...followVars(edited).map(([token, value]) => [token.slice(2), value]),
    ])
  }

  const pick = (
    list: string[],
    values: Record<string, string>,
    isChanged: (token: string, value: string) => boolean
  ) =>
    list
      .filter((token) => isChanged(token, values[token]))
      .map((token) => [token, values[token]] as const)

  const shared = Object.fromEntries([
    ...pick(typeTokens, stored.type, typeChanged),
    ...pick(shapeTokens, stored.shape, shapeChanged),
    ...pick(motionTokens, stored.motion, motionChanged),
  ])

  const fontUrls = [
    ...new Set(
      ["typeface-sans", "typeface-heading"].flatMap((token) => {
        const family = googleFamilyOf(stored.type[token])
        return family && typeChanged(token, stored.type[token])
          ? [fontCssUrl(family, stored.dials.weights ?? wantedWeights)]
          : []
      })
    ),
  ]

  return {
    light: colors("light"),
    dark: colors("dark"),
    shared,
    components: Object.fromEntries(
      Object.entries(toneComponentVars(stored.dials.tone)).map(([k, v]) => [
        k.slice(2),
        v,
      ])
    ),
    fontUrls,
  }
}

const declarations = (values: Record<string, string>) =>
  Object.entries(values)
    .map(([token, value]) => `  --${token}: ${value};`)
    .join("\n")

/** The theme as CSS on top of Nova: `:root` and `.dark`, changed values only. */
export function themeCss(stored: Stored, name: string) {
  const m = model(stored)
  const light = [
    declarations(m.light),
    declarations(m.shared),
    declarations(m.components),
  ]
    .filter(Boolean)
    .join("\n")
  const dark = declarations(m.dark)
  return [
    `/* ${name || "Untitled theme"} — Glaze theme, based on Nova */`,
    ...m.fontUrls.map((url) => `@import url("${url}");`),
    light && `:root {\n${light}\n}`,
    dark && `.dark {\n${dark}\n}`,
  ]
    .filter(Boolean)
    .join("\n\n")
}

/** Config names are lowercase slugs that start with a letter. */
export const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^[^a-z]+/, "") || "my-theme"

const groupOf = (key: string) =>
  key === "radius" || key.startsWith("shape-")
    ? "shape"
    : key === "space-base" || key === "control-height"
      ? "space"
      : /^(typeface|type|weight)-/.test(key)
        ? "type"
        : key.startsWith("elevation-")
          ? "elevation"
          : key.startsWith("motion-")
            ? "motion"
            : "components"

/** Whether the config schema takes this as a colour input. */
const isColorInput = (key: string, value: string) => {
  try {
    parseConfig({
      version: 1,
      name: "probe",
      color: { light: { [key]: value } },
    })
    return true
  } catch {
    return false
  }
}

/** The theme as a `glaze.config.json` the Glaze CLI can generate CSS from. */
export function themeConfig(stored: Stored, name: string): GlazeConfigInput {
  const m = model(stored)
  const config: GlazeConfigInput = {
    version: 1,
    name: slug(name),
    extends: "nova",
  }
  const groups: Record<string, Record<string, string>> = {}
  const add = (group: string, key: string, value: string) =>
    ((groups[group] ??= {})[key] = value)
  for (const [key, value] of Object.entries(m.shared))
    add(groupOf(key), key, value)
  for (const [key, value] of Object.entries(m.components))
    add("components", key, value)
  Object.assign(config, groups)

  // A colour the schema has no input for is a system pin instead.
  const split = (colors: Record<string, string>) => {
    const color: Record<string, string> = {}
    const system: Record<string, string> = {}
    for (const [key, value] of Object.entries(colors))
      (isColorInput(key, value) ? color : system)[key] = value
    return { color, system }
  }
  const light = split(m.light)
  const dark = split(m.dark)
  const some = (o: object) => Object.keys(o).length > 0
  if (some(light.color) || some(dark.color))
    config.color = {
      light: some(light.color) ? light.color : undefined,
      dark: some(dark.color) ? dark.color : undefined,
    }
  if (some(light.system) || some(dark.system))
    config.system = {
      light: some(light.system) ? light.system : undefined,
      dark: some(dark.system) ? dark.system : undefined,
    }
  // The Glaze CLI @imports fonts by package; Google fonts ride in the CSS.
  return config
}
